import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import * as bcrypt from "bcrypt"
import { rateLimit } from "@/lib/redis";

export const POST = async (req: NextRequest) => {
    const {token, password} = await req.json();

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
    const userAgent = req.headers.get('user-agent') || null
    try {
        const rateLimitKey = `rate_limit:resetPassword:${ipAddress}`
        const rateLimiter = await rateLimit(rateLimitKey, 120, 24 * 60 * 60 * 1000)
        if(!rateLimiter.allowed){
            return NextResponse.json({
            success: false,
            message: `Provoni perseri me vone!`
        }, {
            status: 429,
            headers: rateLimiter.responseHeaders
        })
        }
        
        const user = await prisma.users.findUnique({
            where: {
                passwordResetToken: token,
                passwordResetExpires: {
                    gt: new Date()
                }
            }
        })
        
        if(!user) return NextResponse.json({success: false, message: "Token i pavlefshëm ose i skaduar"}, {status: 400});
        

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.users.update({
            where: {id: user.id},
            data: {
                password: hashedPassword,
                passwordResetExpires: null,
                passwordResetToken: null
            }
        })

        await prisma.activityLog.create({
            data: {
                userId: user.id,
                action: "CHANGE_PASSWORD",
                entityType: "Users",
                entityId: user.id,
                ipAddress,
                userAgent,
                metadata: "From RESET PASSWORD SERVICE"
            }
        })

        return NextResponse.json({success: true, message: "Fjalekalimi u rivendos me sukses!"}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}