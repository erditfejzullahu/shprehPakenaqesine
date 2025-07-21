import { auth } from "@/auth";
import { adminSchema } from "@/lib/schemas/adminSchema";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import DOMPurify from "isomorphic-dompurify";
import validator from "validator"
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt"
import { UploadRequest, UploadResult } from "@/types/types";
import { fileUploadService } from "@/services/fileUploadService";
import { isAdminApi } from "@/lib/utils/isAdmin";

type ValidationSchema = z.infer<typeof adminSchema>

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

export const PATCH = async (req: NextRequest) => {
    const adminCheck = await isAdminApi()
    if(adminCheck instanceof NextResponse) return adminCheck;
    const session = adminCheck;
    
    const body: ValidationSchema = await req.json();
    try {
        const user = await prisma.users.findUnique({where: {id: session.user.id}})
        if(!user) return NextResponse.json({success: false, message: "Nuk u gjet ndonje perdorues me kete number identifikues"}, {status: 404});

        const sanitizeObj = {
            username: DOMPurify.sanitize(validator.escape(body.username || "")),
            email: DOMPurify.sanitize(validator.normalizeEmail(body.email || "") || ""),
            fullName: sanitizeName(body.fullName),
            gender: body.gender,
            userProfileImage: body.userProfileImage,
            password: body.password,
            confirmPassword: body.confirmPassword,
            changePassword: body.changePassword
        }

        const validateObj = adminSchema.parse(sanitizeObj);
        let newPassword = user.password;
        if(validateObj.changePassword){
            if(validateObj.password !== validateObj.confirmPassword){
                return NextResponse.json({success: false, message: "Fjalekalimi nuk eshte i njejte"}, {status: 400})
            }
            if(!validateObj.password || !validateObj.confirmPassword) return NextResponse.json({success: false, message: "Paraqitni fjalekalimet e kerkuara"}, {status: 400});
            const hashPassword = await bcrypt.hash(validateObj.password, 10);
            newPassword = hashPassword
        }

        let newImage = user.userProfileImage;
        if(validateObj.userProfileImage){
            const result: UploadResult = await fileUploadService.uploadFile(validateObj.userProfileImage, "users", user.id);
            if(result.success){
                newImage = result.url
            }
        }

        await prisma.users.update({
            where: {id: session.user.id},
            data: {
                username: validateObj.username,
                email: validateObj.email,
                fullName: validateObj.fullName,
                gender: validateObj.gender,
                password: newPassword,
                userProfileImage: newImage
            }
        })

        return NextResponse.json({success: true, message: "Sapo rifreskuat me sukses llogarine tuaj.", url: newImage}, {status: 200})

    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}