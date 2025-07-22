import { auth } from "@/auth";
import { createComplaintsSchema } from "@/lib/schemas/createComplaintsSchema";
import { NextRequest, NextResponse } from "next/server";
import DOMPurify from 'isomorphic-dompurify' // Client+server side sanitization
import validator from "validator"
import {z} from "zod"
import {fileUploadService} from "@/services/fileUploadService";
import prisma from "@/lib/prisma";
import { UploadResult } from "@/types/types";
import { runWithPrismaContext } from "@/lib/prisma-context";

type ComplaintsSchema = z.infer<typeof createComplaintsSchema>

export const POST = async (req: NextRequest) => {
    const ipAddress = req.headers.get('x-forwarded-for') || null
    const userAgent = req.headers.get('user-agent') || null
    const session = await auth();
    if(!session){
        return NextResponse.json({success: false, message: "Ju nuk jeni te autorizuar per kete veprim!"}, {status: 401})
    }
    try {
        const body: ComplaintsSchema = await req.json();
        const sanitizedBody = {
            companyId: body.companyId,
            title: body.title ? DOMPurify.sanitize(validator.escape(body.title.trim())) : null,
            description: DOMPurify.sanitize(validator.escape(body.description.trim() || "")),
            category: body.category,
        }

        const validatedComplaint = createComplaintsSchema.parse(sanitizedBody)

        const ctx = {
            userId: session.user.id,
            ipAddress,
            userAgent
        }

        const result: any = await runWithPrismaContext(ctx, async () => {
            return await prisma.$transaction(async (prisma) => {
                const complaint = await prisma.complaint.create({
                    data: {
                        companyId: validatedComplaint.companyId,
                        title: validatedComplaint.title,
                        description: validatedComplaint.description,
                        status: "PENDING",
                        category: validatedComplaint.category,
                        resolvedStatus: "PENDING",
                        userId: session.user.id,
                        createdAt: new Date()
                    }
                })
        
                let attachments: string[] = []
                let audiosAttached: string[] = []
                let videosAttached: string[] = []
        
                if(body.attachments && body.attachments.length > 0){
                    for(const element of body.attachments){
                        try {
                            const result: UploadResult = await fileUploadService.uploadFile(element, "complaints/attachments", complaint.id)
                            if(result.success){
                                attachments.push(result.url)
                            }
                        } catch (error) {
                            return NextResponse.json({success: false, message: "Ngarkimi i imazheve/dokumenteve te ankeses nuk u realizuan! Provoni perseri."}, {status: 400})
                        }
                    }
                }
                if(body.audiosAttached && body.audiosAttached.length > 0){
                    for(const element of body.audiosAttached){
                        try {
                            const result: UploadResult = await fileUploadService.uploadFile(element, "complaints/audiosAttached", complaint.id)
                            if(result.success){
                                audiosAttached.push(result.url)
                            }
                        } catch (error) {
                            return NextResponse.json({success: false, message: "Ngarkimi i evidencave zerore te ankeses nuk u realizuan! Provoni perseri."}, {status: 400})
                        }
                    }
                }
        
                if(body.videosAttached && body.videosAttached.length > 0){
                    for(const element of body.videosAttached){
                        try {
                            const result: UploadResult = await fileUploadService.uploadFile(element, "complaints/videosAttached", complaint.id)
                            if(result.success){
                                videosAttached.push(result.url)
                            }
                        } catch (error) {
                            return NextResponse.json({success: false, message: "Ngarkimi i evidencave te pamjeve te ankeses nuk u realizuan! Provoni perseri."}, {status: 400})
                        }
                    }
                }
        
                const updatedComplaint = await prisma.complaint.update({
                    where: {id: complaint.id},
                    data: {
                        attachments,
                        audiosAttached,
                        videosAttached
                    }
                })
                return {
                    complaint: updatedComplaint
                }
            })
        })
        
        return NextResponse.json({success: true, message: "Sapo krijuat me sukses nje ankese/raport", url: result.complaint.id}, {status: 201})
    } catch (error) {
        console.error(error)
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."})
    }
}