import prisma from "@/lib/prisma";
import { subscriberSchema } from "@/lib/schemas/createSubscriptionSchema";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import DOMPurify from 'isomorphic-dompurify' // Client+server side sanitization
import validator from "validator"
import { runWithPrismaContext } from "@/lib/prisma-context";
import { rateLimit } from "@/lib/redis";

type CreateSubscriberType = z.infer<typeof subscriberSchema> 

export const GET = async (req: NextRequest) => {
    const session = await auth()
} 

export const POST = async (req: NextRequest) => {
    try {
        const body: CreateSubscriberType = await req.json();        
        const sanitizedEmail = {email: DOMPurify.sanitize(validator.normalizeEmail(body.email?.trim() || "") || "")}
        const validationSchema = subscriberSchema.parse(sanitizedEmail)
        const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
        const userAgent = req.headers.get('user-agent') || null
        
        const rateLimitKey = `rate_limi:subscribers:${ipAddress}`
        const ratelimiter = await rateLimit(rateLimitKey, 1, 120)
        if(!ratelimiter.allowed){
            return NextResponse.json({
                success: false,
                message: `Ju keni tejkaluar limitin e abonimeve. Ju mund te dergoni 1 kerkese per abonim ne 120 sekonda. Provoni perseri pas ${ratelimiter.reset} sekondash.`
            }, {
                status: 429,
                headers: ratelimiter.responseHeaders
            })
        }

        const existingEmail = await prisma.subscribers.findFirst({where: {email: validationSchema.email}})
        if(existingEmail){
            return NextResponse.json({success: false, message: "Ju vecse jeni abonuar tashme!"}, {status: 400})
        }

        const ctx = {
            ipAddress,
            userAgent
        }

        await runWithPrismaContext(ctx, async () => {
            await prisma.subscribers.create({
                data: {email: validationSchema.email, createdAt: new Date()},
            })
        })
        return NextResponse.json({success: true, message: "Ju u abonuar me sukses. Ne te ardhmen do njoftoheni per ankesat e reja permes emailit te paraqitur me larte."}, {status: 201, headers: ratelimiter.responseHeaders})
    } catch (error) {
        console.error(error)
        return NextResponse.json({success: false, message: "Dicka shkoi gabim. Ju lutem provoni perseri!"}, {status: 500})
    }
}