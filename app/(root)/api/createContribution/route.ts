import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { contributionsSchema } from "@/lib/schemas/contributionsSchema";
import { fileUploadService } from "@/services/fileUploadService";
import { UploadResult } from "@/types/types";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"

type ValidatedContribution = z.infer<typeof contributionsSchema>;
type ExtendedContributionType = ValidatedContribution & {
    complaintId: string;
}

export const POST = async (req: NextRequest) => {
    const session = await auth()
    if(!session){
        return NextResponse.json({success: false, message: "Ju nuk jeni te autorizuar te kryeni kete veprim!"}, {status: 401})
    }
    try {
        const body: ExtendedContributionType = await req.json()
        if (
            (!body.attachments || body.attachments.length === 0) && 
            (!body.audiosAttached || body.audiosAttached.length === 0) && 
            (!body.videosAttached || body.videosAttached.length === 0)
        ) {
            return NextResponse.json(
                { success: false, message: "Duhet të paktën një evidence nga rubrikat e paraqitura!" },
                { status: 400 }
            );
        }
        const validatedSchema = contributionsSchema.parse(body);

        await prisma.$transaction(async(prisma) => {
            

            let attachments: string[] = []
            let audioAttachments: string[] = []
            let videoAttachments: string[] = []
    
            if(validatedSchema.attachments && validatedSchema.attachments.length > 0){
                for(const element of validatedSchema.attachments){
                    const result: UploadResult = await fileUploadService.uploadFile(element, "complaints/attachments", body.complaintId)
                    if(!result.success){
                        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne ngarkim te dokumenteve/imazheve"}, {status: 400})
                    }
                    attachments.push(result.url)
                }
            }
    
            if(validatedSchema.audiosAttached && validatedSchema.audiosAttached.length > 0){
                for(const element of validatedSchema.audiosAttached){
                    const result: UploadResult = await fileUploadService.uploadFile(element, "complaints/audiosAttached", body.complaintId)
                    if(!result.success){
                        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne ngarkim te audiove/inqizimeve"}, {status: 400})
                    }
                    audioAttachments.push(result.url)
                }
            }
    
            if(validatedSchema.videosAttached && validatedSchema.videosAttached.length > 0){
                for(const element of validatedSchema.videosAttached){
                    const result: UploadResult = await fileUploadService.uploadFile(element, "complaints/videosAttached", body.complaintId)
                    if(!result.success){
                        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne ngarkim te videove/inqizimeve"}, {status: 400})
                    }
                    videoAttachments.push(result.url)
                }
            }

            await prisma.contributions.create({
                data: {
                    complaintId: body.complaintId,
                    userId: session.user.id,
                    attachments,
                    audiosAttached: audioAttachments,
                    videosAttached: videoAttachments,
                    contributionValidated: false
                }
            })

            return NextResponse.json({success: true}, {status: 201})
        })

    } catch (error) {
        console.error(error)
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}