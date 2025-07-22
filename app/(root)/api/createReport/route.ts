import { reportsSchema } from "@/lib/schemas/reportsSchema";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import DOMPurify from "isomorphic-dompurify";
import validator from "validator"
import { UploadResult } from "@/types/types";
import { fileUploadService } from "@/services/fileUploadService";
import prisma from "@/lib/prisma";
import { runWithPrismaContext } from "@/lib/prisma-context";

type ValidatedReportType = z.infer<typeof reportsSchema>
type ExtendValidatedReportType = ValidatedReportType & {
    complaintId: string;
}

export const POST = async (req: NextRequest) => {
    try {
        const ipAddress = req.headers.get('x-forwarded-for') || null
        const userAgent = req.headers.get('user-agent') || null
        const body: ExtendValidatedReportType = await req.json();
        const sanitizedObj = {
            title: DOMPurify.sanitize(validator.escape(body.title.trim() || "")),
            description: DOMPurify.sanitize(validator.escape(body.description.trim() || "")),
            audiosAttached: body.audiosAttached,
            attachments: body.attachments,
            videosAttached: body.videosAttached,
            category: body.category
        }
        
        const validateObj = reportsSchema.parse(sanitizedObj);

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
                        category: validateObj.category
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
                            return NextResponse.json({success: false, message: "Dicka shkoi gabim ne ngarkim te dokumenteve/imazheve"}, {status: 400})
                        }
                        attachments.push(result.url)
                    }
                }
    
                console.log(attachments, '  asdasdasdasdasdasdasd');
                
        
                if(validateObj.audiosAttached && validateObj.audiosAttached.length > 0){
                    for(const element of validateObj.audiosAttached){
                        const result: UploadResult = await fileUploadService.uploadFile(element, "reports/audiosAttached", report.id)
                        
                        
                        if(!result.success){
                            return NextResponse.json({success: false, message: "Dicka shkoi gabim ne ngarkim te audiove/inqizimeve"}, {status: 400})
                        }
                        audioAttachments.push(result.url)
                    }
                }
        
                if(validateObj.videosAttached && validateObj.videosAttached.length > 0){
                    for(const element of validateObj.videosAttached){
                        const result: UploadResult = await fileUploadService.uploadFile(element, "reports/videosAttached", report.id)
                        if(!result.success){
                            return NextResponse.json({success: false, message: "Dicka shkoi gabim ne ngarkim te videove/inqizimeve"}, {status: 400})
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

        return NextResponse.json({success: true, message: `Sapo keni raportuar me sukses ankesen/raportimin. Do te njoftoheni vazhdimisht ne rast te ndryshimeve!`}, {status: 201})

    } catch (error) {
        console.error(error)
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri!"}, {status: 500})
    }
}