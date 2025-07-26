import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, {params}: {params: Promise<{token: string}>}) => {
    try {
        const {token} = await params;
        
        const user = await prisma.users.findFirst({where: {emailVerificationToken: token}})
        if(!user) {
            (await cookies()).set('email-verification', 'error', {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 2,
                path: '/verifiko-emailin/verifikimi-gabim'
            })
            return NextResponse.redirect(new URL(`/verifiko-emailin/verifikimi-gabim?error=Token%20verifikimi%20invalid`, req.url));
        }

        if(user.emailVerificationTokenExpires && user.emailVerificationTokenExpires < new Date()){
            (await cookies()).set('email-verification', 'error', {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 2,
                path: '/verifiko-emailin/verifikimi-gabim'
            })
            return NextResponse.redirect(new URL(`/verifiko-emailin/verifikimi-gabim?error=Tokeni%20ka%20skaduar&email=${user.email}`, req.url));
        }

        await prisma.users.update({
            where: {id: user.id},
            data: {
                email_verified: true,
                emailVerificationToken: null,
                emailVerificationTokenExpires: null
            }
        });

        (await cookies()).set('email-verification', 'success', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 2, //2 min
            path: '/verifiko-emailin/verifikimi-sukses'
        })

        return NextResponse.redirect(new URL('/verifiko-emailin/verifikimi-sukses', req.url))
    } catch (error) {
        console.error(error);
        (await cookies()).set('email-verification', 'error', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 2,
            path: '/verifiko-emailin/verifikimi-gabim'
        })
        return NextResponse.redirect(new URL(`/verifiko-emailin/verifikimi-gabim?error=Error%20gjate%20verifikimit`, req.url));
    }
}