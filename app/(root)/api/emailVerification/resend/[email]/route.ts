import { sendUserVerificationEmail, signCookieValue } from "@/lib/emails/sendEmailVerification";
import prisma from "@/lib/prisma";
import { addHours } from "date-fns";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, {params}: {params: Promise<{email: string}>}) => {
    const {email} = await params;
    try {
        const user = await prisma.users.findUnique({where: {email}})
        if(!user){
            ((await cookies()).delete('email-verification'))
            return NextResponse.redirect(new URL('/', req.url))
        }

        const verificationToken = crypto.randomUUID().toString()
        const verificationTokenExpires = addHours(new Date(), 24).toISOString() // 1 dit

        await prisma.users.update({
            where: {id: user.id},
            data: {
                emailVerificationToken: verificationToken,
                emailVerificationTokenExpires: verificationTokenExpires
            }
        })

        const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verifiko-emailin/${verificationToken}`
        await sendUserVerificationEmail(user.id, user.email, verificationUrl);

        (await cookies()).set('email-verification', signCookieValue('resend'), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 2,
                path: '/verifiko-emailin/verifikimi-gabim'
        })

        return NextResponse.redirect(new URL(`/verifiko-emailin/ridergo-verifikimin/njoftim`))
    } catch (error) {
        ((await cookies()).delete('email-verification'))
        return NextResponse.redirect(new URL('/', req.url))
    }
}