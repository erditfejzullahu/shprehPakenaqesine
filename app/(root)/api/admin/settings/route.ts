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
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
    const userAgent = req.headers.get('user-agent') || null
    
    const body: ValidationSchema = await req.json();
    try {
        const user = await prisma.users.findUnique({where: {id: adminCheck.user.id}})
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
            try {
                const result: UploadResult = await fileUploadService.uploadFile(validateObj.userProfileImage, "users", user.id);
                if(result.success){
                    newImage = result.url
                }
            } catch (error) {
                throw new Error("Ngarkimi i fotos se profilit deshtoi! Ju lutem provoni perseri.")
            }
        }

        
        await prisma.users.update({
            where: {id: adminCheck.user.id},
            data: {
                username: validateObj.username,
                email: validateObj.email,
                fullName: validateObj.fullName,
                gender: validateObj.gender,
                password: newPassword,
                userProfileImage: newImage
            }
        })

        await prisma.activityLog.create({
            data: {
                userId: adminCheck.user.id,
                ipAddress,
                userAgent,
                entityId: adminCheck.user.id,
                entityType :"Users",
                action: "UPDATE_USER_ADMIN_DETAILS",
                metadata: JSON.stringify({
                    model: "Users",
                    operation: "update",
                    args: {
                        where: {id: adminCheck.user.id},
                        data: {
                            username: validateObj.username,
                            email: validateObj.email,
                            fullName: validateObj.fullName,
                            gender: validateObj.gender,
                            password: newPassword,
                            userProfileImage: newImage
                        }
                    }
                })
            }
        })

        return NextResponse.json({success: true, message: "Sapo rifreskuat me sukses llogarine tuaj.", url: newImage}, {status: 200})

    } catch (error: any) {
        console.error(error);
        if(error.message === "Ngarkimi i fotos se profilit deshtoi! Ju lutem provoni perseri."){
            return NextResponse.json({success: false, message: error.message}, {status: 500})
        }else{
            return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
        }
    }
}