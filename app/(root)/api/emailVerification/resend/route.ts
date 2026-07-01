import { sendUserVerificationEmail, signCookieValue, verifyCookieValue } from "@/lib/emails/sendEmailVerification";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/redis";
import { addHours } from "date-fns";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const cookieStore = (await cookies()).get('email-verification')?.value;
    const cookieValue: any = cookieStore ? verifyCookieValue(cookieStore) : null;
    const cookieParsed = JSON.parse(cookieValue || "null");
    
    if(cookieParsed === null || !cookieParsed?.email){
        return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL))
    }

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
    const userAgent = req.headers.get('user-agent') || null
    
    const rateLimitKey = `rate_limit:resend:${cookieParsed.email}:${ipAddress}`;
    const ratelimiter = await rateLimit(rateLimitKey, 10, 24 * 60 * 60);
    if(!ratelimiter.allowed){
        (await cookies()).set('email-verification', signCookieValue(JSON.stringify({
            error: true,
        })), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 3,
            path: '/',
            sameSite: "strict"
        })
        return NextResponse.redirect(new URL(`/verifiko-emailin/verifikimi-gabim?error=too_many_requests`, process.env.NEXT_PUBLIC_BASE_URL));
    }
    
    try {
        const user = await prisma.users.findUnique({where: {email: cookieParsed.email}})
        if(!user){            
            return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL))
        }
        ((await cookies()).delete('email-verification'))

        const verificationToken = crypto.randomUUID().toString()
        const verificationTokenExpires = addHours(new Date(), 24)

        await prisma.users.update({
            where: {id: user.id},
            data: {
                emailVerificationToken: verificationToken,
                emailVerificationTokenExpires: verificationTokenExpires
            }
        })

        const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verifiko-emailin/${verificationToken}`
        await sendUserVerificationEmail(user.id, user.email, verificationUrl, ipAddress, userAgent);

        (await cookies()).set('email-verification', signCookieValue(JSON.stringify({
            resend: true,
            email: user.email
        })), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 10,
                path: '/',
                sameSite: "strict"
        })

        return NextResponse.redirect(new URL(`/verifiko-emailin/ridergo-verifikimin/njoftim`, process.env.NEXT_PUBLIC_BASE_URL))
    } catch (error) {
        
        ((await cookies()).delete('email-verification'))
        return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL))
    }
}
