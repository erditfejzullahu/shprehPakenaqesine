import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../../auth";
import { rateLimit } from "@/lib/redis";

export const GET = async (req: NextRequest) => {
    try {        
        const session = await auth();
        if(!session){
            return NextResponse.json({success: false, message: "Nuk jeni te autorizuar per kete veprim!"}, {status: 401})
        }
        const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
        
        const rateLimitKey = `rate_limit:userAuthedProfileDetails:${session.user.id}:${ipAddress}`
        const ratelimiter = await rateLimit(rateLimitKey, 100, 60)
        if(!ratelimiter.allowed){
            return NextResponse.json({
                success: false,
                message: `Provoni perseri pas ${ratelimiter.reset} sekondash.`
            }, {
                status: 429,
                headers: ratelimiter.responseHeaders
            })
        }
        
        const userDetails = await prisma.users.findUnique({
            where: {id: session.user.id},
            select: {
                complaints: {
                    where: {
                        AND: [
                            {status: "ACCEPTED"},
                            {deleted: false}
                        ]
                    },
                    select: {
                        title: true,
                        createdAt: true,
                        upVotes: true,
                        resolvedStatus: true,
                        id: true,
                        municipality: true,
                        company: {
                            select: {
                                name: true,
                                id: true,
                            }
                        }
                    }
                },
                contributions: {
                    where: {
                        AND: [
                            {complaint: {
                                status: "ACCEPTED",
                                deleted: false
                            }},
                        ]
                    },
                    select: {
                        complaint: {
                            select: {
                                id: true,
                                title: true,
                                upVotes: true,
                                municipality: true
                            }
                        },
                        createdAt: true
                    },
                }
            }
        })        

        if(!userDetails){
            return NextResponse.json({success: false, message: "Nuk u gjet ndonje detaj!"}, {status: 404})
        }

        

        const details = {
                complaints: userDetails.complaints.map((complaint) => ({
                    companyId: complaint.company?.id,
                    companyName: complaint.company?.name,
                    title: complaint.title,
                    municipality: complaint.municipality,
                    createdAt: complaint.createdAt,
                    upVotes: complaint.upVotes,
                    resolvedStatus: complaint.resolvedStatus,
                    id: complaint.id
                })),
                contributions: userDetails.contributions.map((contribution) => ({
                    complaintTitle: contribution.complaint.title,
                    complaintUpVotes: contribution.complaint.upVotes,
                    createdAt: contribution.createdAt,
                    complaintId: contribution.complaint.id,
                    municipality: contribution.complaint.municipality
                }))
        }

        return NextResponse.json({success: true, details}, {status: 200, headers: ratelimiter.responseHeaders})

    } catch (error) {
        console.error(error)
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server. Ju lutem provoni perseri"}, {status: 404})
    }
}