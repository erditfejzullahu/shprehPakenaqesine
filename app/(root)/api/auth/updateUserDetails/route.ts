import { auth } from "@/auth";
import { updateProfileSchema } from "@/lib/schemas/updateProfileDetails";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import DOMPurify from "isomorphic-dompurify";
import validator from "validator"
import prisma from "@/lib/prisma";
import * as bcrypt from "bcrypt"
import { UploadResult } from "@/types/types";
import { fileUploadService } from "@/services/fileUploadService";

type ValidatedSchema = z.infer<typeof updateProfileSchema>

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
    const session = await auth();
    if(!session){
        return NextResponse.json({success: false, message: "Ju nuk jeni te autorizuar per kete veprim!"}, {status: 401})
    }
    try {

        const user = await prisma.users.findUnique({where: {id: session.user.id}});
        if(!user){
            return NextResponse.json({success: false, message: "Nuk u gjet asnje user!"}, {status: 400})
        }

        const body: ValidatedSchema = await req.json();
        const sanitizedBody = {
            fullName: sanitizeName(body.fullName),
            email: DOMPurify.sanitize(validator.normalizeEmail(body.email.trim() || "") || ""),
            username: DOMPurify.sanitize(validator.escape(body.username)),
            password: body.password,
            userProfileImage: body.userProfileImage,
            confirmPassword: body.confirmPassword,
        }

        let newPassword = user.password

        const validatedObj = updateProfileSchema.parse(sanitizedBody);

        if(validatedObj.password && validatedObj.confirmPassword){
            if(validatedObj.password !== validatedObj.confirmPassword){
                return NextResponse.json({success: false, message: "Fjalekalimet nuk perputhen!"}, {status: 400})
            }
            newPassword = await bcrypt.hash(validatedObj.password, 10)
        }

        let newProfilePicture = user.userProfileImage;
        if(validatedObj.userProfileImage){
            const result: UploadResult = await fileUploadService.uploadFile(validatedObj.userProfileImage, "users", "profile")
            if(result.success){
                newProfilePicture = result.url
            }
        }

        await prisma.users.update({
            where: {id: session.user.id},
            data: {
                fullName: validatedObj.fullName,
                email: validatedObj.email,
                username: validatedObj.username,
                gender: validatedObj.gender,
                password: newPassword,
                userProfileImage: newProfilePicture,
                email_verified: false
            }
        })

        return NextResponse.json({success: true, message: "Te dhenat u perditesuan me sukses"}, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}