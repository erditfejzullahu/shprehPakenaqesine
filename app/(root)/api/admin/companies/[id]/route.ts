import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { createCompanySchema } from "@/lib/schemas/createCompanySchema";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import DOMPurify from "isomorphic-dompurify";
import validator from "validator"
import { UploadResult } from "@/types/types";
import { fileUploadService } from "@/services/fileUploadService";
import { isAdminApi } from "@/lib/utils/isAdmin";
import { runWithPrismaContext } from "@/lib/prisma-context";

type ValidatedBodyType = z.infer<typeof createCompanySchema>

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

export const PATCH = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    const {id} = await params;
    const adminApi = await isAdminApi();
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
    const userAgent = req.headers.get('user-agent') || null
    if(adminApi instanceof NextResponse) return adminApi;

    const body: ValidatedBodyType = await req.json();
    try {
        const company = await prisma.companies.findUnique({where: {id}})
        if(!company){
            return NextResponse.json({success: false, message: "Nuk u gjet ndonje kompani me kete numer identifikues"}, {status: 404})
        }
        
        const sanitizedObj = {
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

        const validatedData = createCompanySchema.parse(sanitizedObj);

        let logo: string = company.logoUrl

        if(validatedData.logoAttachment){
            try {
                const result: UploadResult = await fileUploadService.uploadFile(validatedData.logoAttachment, "companys/logo", company.id)
                if(result.success){
                    logo = result.url
                }
            } catch (error) {
                throw new Error("Ngarkimi i logos deshtoi. Ju lutem provoni perseri!")
            }
        }

        let images: string[] = company.images; 
        let newImages: string[] = []

        if(validatedData.imageAttachments && validatedData.imageAttachments.length > 0){
            for(const image of validatedData.imageAttachments){
                try {
                    const result: UploadResult = await fileUploadService.uploadFile(image, "companys/images", company.id)
                    if(result.success){
                        newImages.push(result.url)
                    }
                } catch (error) {
                    throw new Error("Ngarkimi i imazheve deshtoi. Ju lutem provoni perseri!")
                }
            }
        }

        const ctx = {
            userId: adminApi.user.id,
            ipAddress,
            userAgent
        }

        await runWithPrismaContext(ctx, async () => {
            await prisma.companies.update({
                where: {id},
                data: {
                    name: validatedData.name,
                    description: validatedData.description,
                    logoUrl: logo,
                    address: validatedData.address,
                    website: validatedData.website,
                    email: validatedData.email,
                    phone: validatedData.phone,
                    industry: validatedData.industry,
                    foundedYear: validatedData.foundedYear,
                    images: newImages.length > 0 ? newImages : images
                }
            })
        })
        
        return NextResponse.json({success: true, message: "Sapo rifreskuat me sukses kompanine"}, {status: 200})
    } catch (error: any) {
        console.error(error)
        if(error.message === "Ngarkimi i logos deshtoi. Ju lutem provoni perseri!"){
            return NextResponse.json({succes: false, message: error.message}, {status: 500})
        }else if(error.message === "Ngarkimi i imazheve deshtoi. Ju lutem provoni perseri!"){
            return NextResponse.json({succes: false, message: error.message}, {status: 500})
        }else{
            return NextResponse.json({succes: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri"}, {status: 500})
        }
    }
}

export const DELETE = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    const {id} = await params
    const isAdmin = await isAdminApi();
    if(isAdmin instanceof NextResponse) return isAdmin;

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
    const userAgent = req.headers.get('user-agent') || null
    try {
        if(!id) return NextResponse.json({success: false, message: "Nuk eshte ardhur nje numer identifikues"}, {status:400});
        const company = await prisma.companies.findUnique({where: {id}})
        if(!company) return NextResponse.json({success: false, message: "Nuk u gjet ndonje kompani me ate number identifikues"}, {status:404});
        
        const ctx = {
            userId: isAdmin.user.id,
            ipAddress,
            userAgent
        }

        await runWithPrismaContext(ctx, async () => {
            await prisma.companies.delete({where: {id}})
        })

        return NextResponse.json({success: true, message: "Kompania u fshi me sukses"}, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}