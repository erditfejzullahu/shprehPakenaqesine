import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { userEditSchema } from "@/lib/schemas/userEditSchema";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import DOMPurify from "isomorphic-dompurify";
import validator from "validator"
import { UploadResult } from "@/types/types";
import { fileUploadService } from "@/services/fileUploadService";

type UserType = z.infer<typeof userEditSchema>

const sanitizeName = (name: string): string => {
    if (!name) return '';

    return DOMPurify.sanitize(
        validator.escape(
        name.trim()
            .replace(/</g, '＜')  // Replace angle brackets
            .replace(/>/g, '＞')
            .replace(/\s+/g, ' ')  // Collapse multiple spaces
            // Keep apostrophes and hyphens for names like O'Connor or Jean-Luc
        )
    );
};

export const PATCH = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    const {id} = await params;
    const session = await auth();
    const body: UserType = await req.json();
    try {
        const user = await prisma.users.findUnique({where: {id}})
        if(!user) return NextResponse.json({success: false, message: "Nuk u gjet ndonje perdorues me kete numer identifikues"}, {status: 404});

        const serializedObj = {
            username: DOMPurify.sanitize(validator.escape(body.username.trim() || "")),
            email: DOMPurify.sanitize(validator.normalizeEmail(body.email.trim() || "") || ""),
            fullName: sanitizeName(body.fullName),
            gender: body.gender,
            anonimity: body.anonimity,
            userProfileImage: body.userProfileImage,
            acceptedUser: body.acceptedUser,
            email_verified: body.email_verified
        }

        const validatedSchema = userEditSchema.parse(serializedObj)

        let userImage = user.userProfileImage;

        if(validatedSchema.userProfileImage){
            const result: UploadResult = await fileUploadService.uploadFile(validatedSchema.userProfileImage, "users", user.id)
            if(result.success){
                userImage = result.url
            }
        }

        await prisma.users.update({
            where: {id},
            data: {
                username: validatedSchema.username,
                email: validatedSchema.email,
                fullName: validatedSchema.fullName,
                gender: validatedSchema.gender,
                anonimity: validatedSchema.anonimity,
                userProfileImage: userImage,
                acceptedUser: validatedSchema.acceptedUser,
                email_verified: validatedSchema.email_verified
            }
        })
        return NextResponse.json({success: true, message: "Sapo perditesuat me sukses perdoruesin"}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."},{status: 500})
    }
}

export const DELETE = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    const {id} = await params;
    const session = await auth()
    try {
        const user = await prisma.users.findUnique({where: {id}})
        if(!user) return NextResponse.json({success: false, message: "Nuk u gjet ndonje perdorues me kete numer identifikues"}, {status: 404});
        await prisma.users.delete({where: {id}})
        return NextResponse.json({success: true, message: "Sapo fshite me sukses perdoruesin"}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."},{status: 500})
    }
}