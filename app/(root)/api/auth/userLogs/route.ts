import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const session = await auth()
        if(!session){
            return NextResponse.json({success: false, message: "Ju nuk jeni te autorizuar per te kryer kete veprim."}, {status: 401})
        }
        const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
                
        const rateLimitKey = `rate_limit:getUserLogs:${session.user.id}:${ipAddress}`
        const ratelimiter = await rateLimit(rateLimitKey, 60, 60)
        if(!ratelimiter.allowed){
            return NextResponse.json({
                success: false,
                message: `Provoni perseri pas ${ratelimiter.reset} sekondash.`
            }, {
                status: 429,
                headers: ratelimiter.responseHeaders
            })
        }

        const userLogs = await prisma.activityLog.findMany({
            where: {userId: session.user.id},
            select: {
                id: true,
                userId: true,
                action: true,
                ipAddress: true,
                userAgent: true,
                createdAt: true
            }
        })

        return NextResponse.json(userLogs, {status: 200, headers: ratelimiter.responseHeaders})

    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ju lutem provoni perseri."}, {status: 500})
    }
}