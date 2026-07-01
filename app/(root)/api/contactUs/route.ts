import { contactFormSchema } from "@/lib/schemas/contactFormSchema";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import DOMPurify from "isomorphic-dompurify";
import validator from "validator"
import prisma from "@/lib/prisma";

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

        await prisma.contactedUs.create({
            data: {
                email: validatedObj.email,
                fullName: validatedObj.fullName,
                subject: validatedObj.subject,
                description: validatedObj.description,
                reason: validatedObj.reason,
                attachments: validatedObj.attachments ?? [],
            }
        })

        return NextResponse.json({success: true, message: "Forma u dergua me sukses!"}, {status: 200})
        
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}
