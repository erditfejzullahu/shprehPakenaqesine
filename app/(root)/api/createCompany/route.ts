import { auth } from "@/auth";
import { createCompanySchema } from "@/lib/schemas/createCompanySchema";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import DOMPurify from 'isomorphic-dompurify' // Client+server side sanitization
import validator from "validator"
import prisma from "@/lib/prisma";
import {fileUploadService} from "@/services/fileUploadService";
import { UploadResult } from "@/types/types";
import { Companies } from "@/app/generated/prisma";

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
    // sanitized = validator.escape(sanitized); //REMEBER DONT DO THIS FO R URLS 
    
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
            console.log(body.email);
            
            
        const sanitizedBody = {
            name: DOMPurify.sanitize(validator.escape(body.name.trim())),
            description: DOMPurify.sanitize(validator.escape(body.description?.trim() || "")),
            logoAttachment: body.logoAttachment,
            address: DOMPurify.sanitize(validator.escape(body.address.trim())),
            website: sanitizeUrl(body.website || ""),
            email: body.email ? DOMPurify.sanitize(validator.normalizeEmail(body.email?.trim() || "") || "") : null,
            phone: DOMPurify.sanitize(validator.escape(body.phone?.trim() || "")),
            industry: DOMPurify.sanitize(validator.escape(body.industry.trim())),
            imageAttachments: body.imageAttachments,
            foundedYear: body.foundedYear
        }
        console.log(sanitizedBody.email);


        const validatedCompany = createCompanySchema.parse(sanitizedBody);

        const result: any = await prisma.$transaction(async (prisma) => {
            const company = await prisma.companies.create({
                data: {
                    name: validatedCompany.name,
                    description: validatedCompany.description,
                    logoUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGh5WFH8TOIfRKxUrIgJZoDCs1yvQ4hIcppw&s",
                    address: validatedCompany.address,
                    website: validatedCompany.website,
                    email: validatedCompany.email,
                    phone: validatedCompany.phone,
                    industry: validatedCompany.industry,
                    foundedYear: validatedCompany.foundedYear
                }
            })
            
            const logoUrlResult: UploadResult = await fileUploadService.uploadFile(validatedCompany.logoAttachment, "companys/logo", company.id)
            if(!logoUrlResult.success){
                return NextResponse.json({success: false, message: "Ngarkimi i imazhit nuk u realizua! Provoni perseri."}, {status: 400})
            }
    
            let imageAttachments: string[] = []
    
            if (validatedCompany.imageAttachments && validatedCompany.imageAttachments.length > 0) {
                for (const element of validatedCompany.imageAttachments) {
                    try {
                        const result = await fileUploadService.uploadFile(element, "companys/images", company.id);
                        if (result.success) {
                            imageAttachments.push(result.url);
                        }
                    } catch (error) {
                        return NextResponse.json({success: false, message: "Ngarkimi i galerise se imazheve te kompanise nuk u realizuan! Provoni perseri."}, {status: 400})
                    }
                }
            }
    
            const updatedCompany = await prisma.companies.update({
                where: {id: company.id},
                data: {
                    logoUrl: logoUrlResult.url,
                    images: imageAttachments
                }
            })

            return {
                company: updatedCompany
            }
        })

        return NextResponse.json({success: true, message: "Ju sapo keni shtuar nje kompani. Ju faleminderit per interesimin!", url: result.company.id}, {status: 201})
    } catch (error) {
        console.error(error)
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}