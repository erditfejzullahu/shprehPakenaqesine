import { auth } from "@/auth";
import { createComplaintsSchema } from "@/lib/schemas/createComplaintsSchema";
import { NextRequest, NextResponse } from "next/server";
import DOMPurify from 'isomorphic-dompurify' // Client+server side sanitization
import validator from "validator"
import {z} from "zod"
import fileUploadService from "@/services/fileUploadService";
import prisma from "@/lib/prisma";
import { UploadResult } from "@/types/types";

type ComplaintsSchema = z.infer<typeof createComplaintsSchema>
const complaintsSchema = z.object({
    title: z.string().min(8, {
        message: "Titulli duhet të përmbajë të paktën 8 karaktere"
    }),
    description: z.string().min(26, {
        message: "Përshkrimi duhet të përmbajë të paktën 26 karaktere"
    }),
    companyId: z.uuid()
})


export const POST = async (req: NextRequest) => {
    const session = await auth();
    if(!session){
        return NextResponse.json({success: false, message: "Ju nuk jeni te autorizuar per kete veprim!"}, {status: 401})
    }
    try {
        const body: ComplaintsSchema = await req.json();
        const sanitizedBody = {
            companyId: body.companyId,
            title: DOMPurify.sanitize(validator.escape(body.title.trim())),
            description: DOMPurify.sanitize(validator.escape(body.description.trim())),
            category: body.category,
        }

        const validatedComplaint = createComplaintsSchema.parse(sanitizedBody)

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
            body.attachments.forEach(async element => {
                const result: UploadResult = await fileUploadService.uploadFile(element, "complaints/attachments", complaint.id)
                if(result.success){
                    attachments.push(result.url)
                }
            });
        }
        if(body.audiosAttached && body.audiosAttached.length > 0){
            body.audiosAttached.forEach(async element => {
                const result: UploadResult = await fileUploadService.uploadFile(element, "complaints/audiosAttached", complaint.id)
                if(result.success){
                    audiosAttached.push(result.url)
                }
            })
        }
        if(body.videosAttached && body.videosAttached.length > 0){
            body.videosAttached.forEach(async element => {
                const result: UploadResult = await fileUploadService.uploadFile(element, "complaints/videosAttached", complaint.id)
                if(result.success){
                    videosAttached.push(result.url)
                }
            })
        }

        await prisma.complaint.update({
            where: {id: complaint.id},
            data: {
                attachments,
                audiosAttached,
                videosAttached
            }
        })
        
        return NextResponse.json({success: true, message: "Sapo krijuat me sukses nje ankese/raport"}, {status: 201})
    } catch (error) {
        console.error(error)
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."})
    }
}