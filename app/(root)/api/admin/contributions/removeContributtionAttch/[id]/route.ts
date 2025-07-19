import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { existsSync, unlinkSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export const PATCH = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    const {id} = await params;
    const session = await auth();
    try {
        const {searchParams} = req.nextUrl
        const fileName = searchParams.get('fileName')
        const fileType = searchParams.get('fileType') as "attachments" | "audioAttachments" | "videoAttachments"

        if(!fileName || typeof fileName !== "string"){
            return NextResponse.json({success: false, message: "Nevojitet emer fajlli me tipin varg"}, {status: 400})
        }

        const allowedTypes = ["attachments", 'audioAttachments', 'videoAttachments']
        if(!fileType || !allowedTypes.includes(fileType)){
            return NextResponse.json({success: false, message: "Tip invalid i fajllit"}, {status: 400})
        }

        const contribution = await prisma.contributions.findUnique({where: {id}})
        if(!contribution){
            return NextResponse.json({success: false, message: "Nuk u gjet ndonje kontribuim me kete ID"}, {status: 404})
        }

        let attachments = contribution.attachments || []
        let videoAttachments = contribution.videosAttached || []
        let audioAttachments = contribution.audiosAttached || []

        switch (fileType) {
            case "attachments":
                attachments = attachments.filter(itm => itm !== fileName)
                break;
            case "audioAttachments":
                audioAttachments = audioAttachments.filter(itm => itm !== fileName)
                break;
            case "videoAttachments":
                videoAttachments = videoAttachments.filter(itm => itm !== fileName)
                break;
            default:
                return NextResponse.json({success: false, message: "Tip invalid i fajllit"}, {status: 400})
        }

        const filePath = join(process.cwd(), "public", fileName);
        if(existsSync(filePath)){
            unlinkSync(filePath);
        }

        await prisma.contributions.update({
            where: {id},
            data: {
                attachments,
                audiosAttached: audioAttachments,
                videosAttached: videoAttachments
            }
        })
        return NextResponse.json({success: true, message: "Larguat fajll nga kontribuimi me sukses"}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri"}, {status: 500})
    }
}