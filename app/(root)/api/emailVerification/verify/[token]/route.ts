import { signCookieValue } from "@/lib/emails/sendEmailVerification";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/redis";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, {params}: {params: Promise<{token: string}>}) => {
    try {
        const {token} = await params;
        const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
        const userAgent = req.headers.get('user-agent') || null

        const user = await prisma.users.findFirst({where: {emailVerificationToken: token}})

        //ratelimiter
        const rateLimitKey = `rate_limit:verify:${user?.id}:${ipAddress}`;
        const ratelimiter = await rateLimit(rateLimitKey, 10, 24 * 60 * 60 * 1000)
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

        if(!user) {
            (await cookies()).set('email-verification', signCookieValue(JSON.stringify({
                error: true,
            })), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 3,
                path: '/',
                sameSite: "strict"
            })
            return NextResponse.redirect(new URL(`/verifiko-emailin/verifikimi-gabim?error=token_invalid`, process.env.NEXT_PUBLIC_BASE_URL));
        }

        if(user.email_verified){
            return NextResponse.redirect(new URL(`/`, req.url));
        }

        if(user.emailVerificationTokenExpires && user.emailVerificationTokenExpires < new Date()){
            (await cookies()).set('email-verification', signCookieValue(JSON.stringify({
                error: true,
                email: user.email
            })), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 3,
                path: '/',
                sameSite: "strict"
            })
            return NextResponse.redirect(new URL(`/verifiko-emailin/verifikimi-gabim?error=token_expired`, process.env.NEXT_PUBLIC_BASE_URL));
        }

        try {
            await prisma.$transaction(async (tx) => {
                try {
                await tx.users.update({
                    where: { id: user.id },
                    data: {
                    email_verified: true,
                    emailVerificationToken: null,
                    emailVerificationTokenExpires: null,
                    },
                });
                } catch (error) {
                    console.error("User update failed:", error);
                    throw new Error("UserUpdateFailed");
                }

                try {
                    await tx.activityLog.create({
                        data: {
                        userId: user.id,
                        entityId: user.id,
                        entityType: "Other",
                        action: "ACCOUNT_VERIFIED",
                        ipAddress,
                        userAgent,
                        },
                    });
                } catch (error) {
                    console.error("Activity log creation failed:", error);
                    throw new Error("ActivityLogFailed");
                }
                });
                } catch (err: any) {
                    if (err.message === "UserUpdateFailed") {
                        (await cookies()).set('email-verification', signCookieValue(JSON.stringify({
                            error: true,
                            email: user.email
                        })), {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                            maxAge: 60 * 3,
                            path: '/',
                            sameSite: "strict"
                        })
                        return NextResponse.redirect(new URL('/verifiko-emailin/verifikimi-gabim?error=update_failed', process.env.NEXT_PUBLIC_BASE_URL))
                    } else if (err.message === "ActivityLogFailed") {
                        (await cookies()).set('email-verification', signCookieValue(JSON.stringify({
                            error: true,
                            email: user.email
                        })), {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                            maxAge: 60 * 3,
                            path: '/',
                            sameSite: "strict"
                        })
                        return NextResponse.redirect(new URL('/verifiko-emailin/verifikimi-gabim?error=activity_failed', process.env.NEXT_PUBLIC_BASE_URL))
                    } else {
                        (await cookies()).set('email-verification', signCookieValue(JSON.stringify({
                            error: true,
                            email: user.email
                        })), {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === "production",
                            maxAge: 60 * 3,
                            path: '/',
                            sameSite: "strict"
                        })
                        return NextResponse.redirect(new URL('/verifiko-emailin/verifikimi-gabim?error=internal_error', process.env.NEXT_PUBLIC_BASE_URL))
                    }
            }

            (await cookies()).set('email-verification', signCookieValue(JSON.stringify({
                error: false,
            })), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 3, //3 min
                path: '/',
                sameSite: "strict"
            })
            return NextResponse.redirect(new URL('/verifiko-emailin/verifikimi-sukses', process.env.NEXT_PUBLIC_BASE_URL))

        
    } catch (error) {
        console.error(error);
        (await cookies()).set('email-verification', signCookieValue(JSON.stringify({
            error: true,
        })), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 3,
            path: '/',
            sameSite: "strict"
        })
        return NextResponse.redirect(new URL(`/verifiko-emailin/verifikimi-gabim?error=internal_error`, process.env.NEXT_PUBLIC_BASE_URL));
    }
}