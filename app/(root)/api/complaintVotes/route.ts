import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";
import { runWithPrismaContext } from "@/lib/prisma-context";
import { rateLimit } from "@/lib/redis";

export const POST = async (req: NextRequest) => {
    const session = await auth()
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
    const userAgent = req.headers.get('user-agent') || null
    if(!session){
        return NextResponse.json({success: false, message: "Nuk jeni te autorizuar"}, {status: 401})
    }
    const rateLimitKey = `rate_limit:complaintVotes:${session.user.id}:${ipAddress}`
    const ratelimiter = await rateLimit(rateLimitKey, 30, 60)
    if(!ratelimiter.allowed){
        return NextResponse.json({
            success: false,
            message: `Ju keni tejkaluar limitin e votimit te ankesave. Ju mund te dergoni 5 ndryshime votash te ankesave ne 60 sekonda. Provoni perseri pas ${ratelimiter.reset} sekondash.`
        }, {
            status: 429,
            headers: ratelimiter.responseHeaders
        })
    }
    try {
        const body = await req.json();
        const checkExisting = await prisma.complaintUpVotes.findUnique({
            where: {
                userId_complaintId: {
                    userId: session.user.id,
                    complaintId: body.complaintId
                }
            }
        })

        const ctx = {
            userId: session.user.id,
            ipAddress,
            userAgent
        }

        if(checkExisting){
            await prisma.$transaction(async (prisma) => {
                await runWithPrismaContext(ctx, async () => {
                    await prisma.complaintUpVotes.delete({
                        where: {userId_complaintId: {
                            userId: session.user.id,
                            complaintId: body.complaintId
                        }}
                    })
                    await prisma.complaint.update({
                        where: {id: body.complaintId},
                        data: {
                            upVotes: {
                                decrement: 1
                            }
                        }
                    })
                })
            })
            return NextResponse.json({success: true, message: "Sapo keni larguar votën me sukses!", hasUpVoted: false}, {status: 200})
        }

        await prisma.$transaction(async (prisma) => {
            await runWithPrismaContext(ctx, async () => {
                await prisma.complaintUpVotes.create({
                data: {
                    complaintId: body.complaintId,
                    userId: session.user.id
                    }
                })
                await prisma.complaint.update({
                    where: {id: body.complaintId},
                    data: {
                        upVotes: {
                            increment: 1
                        }
                    }
                })
            })

        })

        return NextResponse.json({success: true, message: "Sapo keni votuar me sukses!", hasUpVoted: true}, {status: 201, headers: ratelimiter.responseHeaders})
    } catch (error) {
        console.error(error)
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri"}, {status: 500})
    }
}