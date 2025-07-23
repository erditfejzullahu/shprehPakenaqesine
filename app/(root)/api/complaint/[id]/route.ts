import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { rateLimit } from "@/lib/redis";
export const GET = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    const {id} = await params;
    
    try {
        const session = await auth();
        const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"

        // if(!session){            
        //     return NextResponse.json({message: "Not authorized"}, {status: 500})
        // }
        const rateLimitKey = `rate_limit:getSingleComplaint:${ipAddress}`
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
        let hasVoted = false;
        if(!session){
            hasVoted = false;
        }else{
            const vote = await prisma.complaintUpVotes.findUnique({
                where: {
                    userId_complaintId: {
                        userId: session.user.id,
                        complaintId: id
                    }
                }
            })
            hasVoted = !!vote;
        }
        
        const complaintQuery = await prisma.complaint.findUnique({
            where: {id},
            select: {
                id: true,
                title: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                attachments: true,
                audiosAttached: true,
                videosAttached: true,
                municipality: true,
                upVotes: true,
                resolvedStatus: true,
                category: true,
                company: {
                    select: {
                        name: true,
                        logoUrl: true,
                        industry: true,
                        website: true
                    }
                },
                user: {
                    select: {
                        userProfileImage: true,
                        username: true,
                        fullName: true,
                        reputation: true,
                        _count: {
                            select: {
                                complaints: true
                            }
                        },
                        anonimity: true
                    }
                },
                contributions: {
                    select: {
                        id: true,
                        user: {
                            select: {
                                userProfileImage: true,
                                username: true,
                                fullName: true,
                                reputation: true,
                                anonimity: true,
                            }
                        },
                        attachments: true,
                        audiosAttached: true,
                        videosAttached: true
                    }
                },
            }
        })

        if(!complaintQuery){
            return NextResponse.json({success: false, message: "Nuk u gjet asnje ankese/raportim"}, {status: 404})
        }

        

        const complaint = {
            id: complaintQuery.id,
            title: complaintQuery.title,
            description: complaintQuery.description,
            createdAt: complaintQuery.createdAt,
            updatedAt: complaintQuery.updatedAt,
            attachments: complaintQuery.attachments,
            audiosAttached: complaintQuery.audiosAttached,
            videosAttached: complaintQuery.videosAttached,
            upVotes: complaintQuery.upVotes,
            municipality: complaintQuery.municipality,
            resolvedStatus: complaintQuery.resolvedStatus,
            category: complaintQuery.category,
            company: complaintQuery.company ? {
                name: complaintQuery.company.name,
                logoUrl: complaintQuery.company.logoUrl,
                industry: complaintQuery.company.industry,
                website: complaintQuery.company.website
            } : null,
            user: complaintQuery.user.anonimity ? null : {
                userProfileImage: complaintQuery.user.userProfileImage,
                username: complaintQuery.user.username,
                fullName: complaintQuery.user.fullName,
                reputation: complaintQuery.user.reputation,
                complaints: complaintQuery.user._count.complaints,
            },
            contributions: complaintQuery.contributions.map((contribution) => ({
                user: contribution.user.anonimity ? null : {
                    id: contribution.id,
                    userProfileImage: contribution.user.userProfileImage,
                    username: contribution.user.username,
                    fullName: contribution.user.fullName,
                    reputation: contribution.user.reputation,
                },
                evidencesGiven: {
                    attachments: contribution.attachments.length,
                    audioAttachments: contribution.audiosAttached.length,
                    videoAttachments: contribution.videosAttached.length
                }
            })),
            hasVoted
        }

        console.log(complaint.contributions);
        

        return NextResponse.json({success: true, complaint}, {status: 200, headers: ratelimiter.responseHeaders})
    } catch (error) {
        console.error(error)
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server. Ju lutem provoni perseri!"}, {status: 500})
    }
}