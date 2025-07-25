import { sendPasswordResetEmail } from "@/lib/emails/forgotPassword";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const {email} = await req.json()
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
    const userAgent = req.headers.get('user-agent') || null
    try {
        const user = await prisma.users.findUnique({where: {email}})
        if(!user) return NextResponse.json({success: true, message: "Nëse ky email ekziston, është dërguar një lidhje për rivendosjeje fjalëkalimi."}, {status: 200});

        const token = crypto.randomUUID().toString();
        const expires = new Date(Date.now() + 3600000) //1 ore

        await prisma.users.update({
            where: {email},
            data: {
                passwordResetToken: token,
                passwordResetExpires: expires
            }
        })

        await prisma.activityLog.create({
            data: {
                userId: user.id,
                entityType: "Users",
                entityId: user.id,
                action: "FORGOT_PASSWORD",
                ipAddress,
                userAgent,
            }
        })

        const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/rivendos-fjalekalimin?token=${token}`;
        await sendPasswordResetEmail(user.id, email, resetUrl)

        return NextResponse.json({success: true, message: "Nëse ky email ekziston, është dërguar një lidhje për rivendosjeje fjalëkalimi."}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}