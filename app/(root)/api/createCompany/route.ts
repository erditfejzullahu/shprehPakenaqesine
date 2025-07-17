import { auth } from "@/auth";
import { createCompanySchema } from "@/lib/schemas/createCompanySchema";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import DOMPurify from 'isomorphic-dompurify' // Client+server side sanitization
import validator from "validator"
import prisma from "@/lib/prisma";
import fileUploadService from "@/services/fileUploadService";
import { UploadResult } from "@/types/types";

type CreateCompanyType = z.infer<typeof createCompanySchema>

const sanitizeUrl = (url: string): string | null => {
    if (!url) return null;
    
    // Basic validation
    if (!validator.isURL(url, {
      require_protocol: true,
      protocols: ['http', 'https'],
      require_valid_protocol: true
    })) {
      return null;
    }
  
    // Sanitize URL
    let sanitized = DOMPurify.sanitize(url);
    
    // Remove unwanted characters
    sanitized = validator.escape(sanitized);
    sanitized = validator.trim(sanitized);
    
    // Additional checks
    if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
      return null;
    }
  
    return sanitized;
  };

export const POST = async (req: NextRequest) => {
    const session = await auth();
    if(!session){
        return NextResponse.json({success: false, message: "Ju nuk jeni te autorizuar per kete veprim!"}, {status: 401})
    }
    try {
        const body: CreateCompanyType = await req.json();
        const sanitizedBody = {
            name: DOMPurify.sanitize(validator.escape(body.name.trim())),
            description: DOMPurify.sanitize(validator.escape(body.description?.trim() || "")),
            logoAttachment: body.logoAttachment,
            address: DOMPurify.sanitize(validator.escape(body.address.trim())),
            website: sanitizeUrl(body.website || ""),
            email: DOMPurify.sanitize(validator.normalizeEmail(body.email?.trim() || "") || ""),
            phone: DOMPurify.sanitize(validator.escape(body.phone?.trim() || "")),
            industry: DOMPurify.sanitize(validator.escape(body.industry.trim())),
            imageAttachments: body.imageAttachments,
            foundedYear: body.foundedYear
        }

        const validatedCompany = createCompanySchema.parse(sanitizedBody);

        const logoUrlResult: UploadResult = await fileUploadService.uploadFile(validatedCompany.logoAttachment, "companys/logo", "logo")
        if(!logoUrlResult.success){
            return NextResponse.json({success: false, message: "Ngarkimi i imazhit nuk u realizua! Provoni perseri."}, {status: 400})
        }
        const company = await prisma.companies.create({
            data: {
                name: validatedCompany.name,
                description: validatedCompany.description,
                logoUrl: logoUrlResult.url,
                address: validatedCompany.address,
                website: validatedCompany.website,
                email: validatedCompany.email,
                phone: validatedCompany.phone,
                industry: validatedCompany.industry,
                foundedYear: validatedCompany.foundedYear
            }
        })

        let imageAttachments: string[] = []

        if(validatedCompany.imageAttachments && validatedCompany.imageAttachments.length > 0){
            validatedCompany.imageAttachments.forEach(async element => {
                const result: UploadResult = await fileUploadService.uploadFile(element, "companys/images", company.id)
                if(result.success){
                    imageAttachments.push(result.url)
                }
            });
        }

        await prisma.companies.update({
            where: {id: company.id},
            data: {
                images: imageAttachments
            }
        })

        return NextResponse.json({success: true, message: "Ju sapo keni shtuar nje kompani. Ju faleminderit per interesimin!"}, {status: 201})
    } catch (error) {
        console.error(error)
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}