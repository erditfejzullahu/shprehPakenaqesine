import { contactFormSchema } from "@/lib/schemas/contactFormSchema";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import DOMPurify from "isomorphic-dompurify";
import validator from "validator"
import prisma from "@/lib/prisma";
import { UploadResult } from "@/types/types";
import { fileUploadService } from "@/services/fileUploadService";

type ContactFormType = z.infer<typeof contactFormSchema> 

export const POST = async (req: NextRequest) => {
    const body: ContactFormType = await req.json();
    try {
    const serializedObject = {
            email: DOMPurify.sanitize(validator.normalizeEmail(body.email.trim() || "") || ""),
            fullName: DOMPurify.sanitize(validator.escape(body.fullName.trim()) || ""),
            subject: DOMPurify.sanitize(validator.escape(body.subject.trim() || "")),
            description: DOMPurify.sanitize(validator.escape(body.description) || ""),
            reason: body.reason,
            attachments: body.attachments
        }

        const validatedObj = contactFormSchema.parse(serializedObject);

        await prisma.$transaction(async (prisma) => {
            const contactObj = await prisma.contactedUs.create({
                data: {
                    email: validatedObj.email,
                    fullName: validatedObj.fullName,
                    subject: validatedObj.subject,
                    description: validatedObj.description,
                    reason: validatedObj.reason,
                    
                }
            })
    
            let attachments: string[] = []
    
            if(validatedObj.attachments && validatedObj.attachments.length > 0){
                for(const element of validatedObj.attachments){
                    const result: UploadResult = await fileUploadService.uploadFile(element, "contactUs", contactObj.id)
                    if(!result.success){
                        throw new Error("Dicka shkoi gabim ne ngarkimin e imazheve/dokumenteve!")
                    }
                    attachments.push(element);
                }
            }

            await prisma.contactedUs.update({
                where: {id: contactObj.id},
                data: {
                    attachments
                }
            })
        })

        return NextResponse.json({success: true, message: "Forma u dergua me sukses!"}, {status: 200})
        
    } catch (error: any) {
        console.error(error);
        if(error.response.data.message === "Dicka shkoi gabim ne ngarkimin e imazheve/dokumenteve!"){
            return NextResponse.json({success: false, message: error.response.data.message}, {status: 500})
        }
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}