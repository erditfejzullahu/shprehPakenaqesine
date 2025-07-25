import { reportsSchema } from "@/lib/schemas/reportsSchema";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import DOMPurify from "isomorphic-dompurify";
import validator from "validator"
import { UploadResult } from "@/types/types";
import { fileUploadService } from "@/services/fileUploadService";
import prisma from "@/lib/prisma";
import { runWithPrismaContext } from "@/lib/prisma-context";
import { rateLimit } from "@/lib/redis";

type ValidatedReportType = z.infer<typeof reportsSchema>
type ExtendValidatedReportType = ValidatedReportType & {
    complaintId: string;
}

export const POST = async (req: NextRequest) => {
    try {
        const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
        const userAgent = req.headers.get('user-agent') || null

        const body: ExtendValidatedReportType = await req.json();
        const sanitizedObj = {
            title: DOMPurify.sanitize(validator.escape(body.title.trim() || "")),
            description: DOMPurify.sanitize(validator.escape(body.description.trim() || "")),
            audiosAttached: body.audiosAttached,
            attachments: body.attachments,
            videosAttached: body.videosAttached,
            category: body.category,
            email: DOMPurify.sanitize(validator.normalizeEmail(body.email.trim() || "") || "")
        }
        
        const validateObj = reportsSchema.parse(sanitizedObj);

        const rateLimitKey = `rate_limit:reports:${ipAddress}`
        const {allowed, remaining, reset, responseHeaders} = await rateLimit(rateLimitKey, 1, 120)
        if(!allowed){
            return NextResponse.json({
                success: false,
                message: `Ju keni tejkaluar limitin e raporteve. Ju mund te dergoni 1 raport ne 120 sekonda. Provoni perseri pas ${reset} sekondash.`
            }, {
                status: 429,
                headers: responseHeaders
            })
        }
        const ctx = {
            ipAddress,
            userAgent
        }

        await runWithPrismaContext(ctx, async () => {
            await prisma.$transaction(async (prisma) => {
                const report = await prisma.reports.create({
                    data: {
                        title: validateObj.title,
                        description: validateObj.description,
                        complaintId: body.complaintId,
                        category: validateObj.category,
                        email: validateObj.email
                    }
                })
                
                let attachments: string[] = []
                let audioAttachments: string[] = []
                let videoAttachments: string[] = []
        
                if(validateObj.attachments && validateObj.attachments.length > 0){
                    for(const element of validateObj.attachments){
                        const result: UploadResult = await fileUploadService.uploadFile(element, "reports/attachments", report.id)
                        console.log(result, '  result');
                        if(!result.success){
                            throw new Error("Dicka shkoi gabim ne ngarkim te dokumenteve/imazheve")
                        }
                        attachments.push(result.url)
                    }
                }                
        
                if(validateObj.audiosAttached && validateObj.audiosAttached.length > 0){
                    for(const element of validateObj.audiosAttached){
                        const result: UploadResult = await fileUploadService.uploadFile(element, "reports/audiosAttached", report.id)
                        
                        
                        if(!result.success){
                            throw new Error("Dicka shkoi gabim ne ngarkim te audiove/inqizimeve")
                        }
                        audioAttachments.push(result.url)
                    }
                }
        
                if(validateObj.videosAttached && validateObj.videosAttached.length > 0){
                    for(const element of validateObj.videosAttached){
                        const result: UploadResult = await fileUploadService.uploadFile(element, "reports/videosAttached", report.id)
                        if(!result.success){
                            throw new Error("Dicka shkoi gabim ne ngarkim te videove/inqizimeve")
                        }
                        videoAttachments.push(result.url)
                    }
                }
    
                await prisma.reports.update({
                    where: {id: report.id},
                    data: {
                        attachments,
                        audioAttachments,
                        videoAttachments
                    }
                })
            })
        })

        return NextResponse.json({success: true, message: `Sapo keni raportuar me sukses ankesen/raportimin. Do te njoftoheni vazhdimisht ne rast te ndryshimeve!`}, {status: 201, headers: responseHeaders})

    } catch (error: any) {
        console.error(error)
        if(error.message === "Dicka shkoi gabim ne ngarkim te dokumenteve/imazheve"){
            return NextResponse.json({success: false, message: error.message}, {status: 500})
        }else if(error.message === "Dicka shkoi gabim ne ngarkim te audiove/inqizimeve"){
            return NextResponse.json({success: false, message: error.message}, {status: 500})
        }else if(error.message === "Dicka shkoi gabim ne ngarkim te videove/inqizimeve"){
            return NextResponse.json({success: false, message: error.message}, {status: 500})
        }
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri!"}, {status: 500})
    }
}