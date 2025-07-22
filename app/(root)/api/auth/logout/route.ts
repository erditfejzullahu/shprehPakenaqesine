import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const session = await auth();
        if(!session){
            return NextResponse.json({success: false, message: "Ju nuk jeni te autorizuar per kryerjen e ketij veprimi."}, {status: 401})
        }
        const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
        const userAgent = req.headers.get('user-agent') || null
        const rateLimitKey = `rate_limit:logoutLogger:${ipAddress}`
        const ratelimiter = await rateLimit(rateLimitKey, 20, 60)
        if(!ratelimiter.allowed){
            return NextResponse.json({
                success: false,
                message: `Provoni perseri pas ${ratelimiter.reset} sekondash.`
            }, {
                status: 429,
                headers: ratelimiter.responseHeaders
            })
        }

        await prisma.activityLog.create({
            data: {
                userId: session.user.id,
                ipAddress,
                userAgent,
                action: "LOGOUT",
                entityType: "Users",
                entityId: session.user.id,
                metadata: JSON.stringify({message: `Perdoruesi "${session.user.id}" eshte shkycur me: ${new Date().toLocaleDateString('sq-AL', {dateStyle: "full"})}`})
            }
        })

        return NextResponse.json({success: true, message: "Jeni shkycur me sukses."}, {status: 200, headers: ratelimiter.responseHeaders})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}