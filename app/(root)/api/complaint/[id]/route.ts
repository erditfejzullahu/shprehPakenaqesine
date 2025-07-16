import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
export const GET = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    const {id} = await params;
    
    try {
        const session = await auth();
        if(!session){
            console.log("no session");
            
            return NextResponse.json({message: "Not authorized"}, {status: 500})
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
            console.log(vote, ' votaaaaa');
            hasVoted = !!vote;
            console.log(hasVoted, ' hasVoted');
            
        }
        console.log(session, ' aoskdaoskdoaskdoasdk');
        
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
                        user: {
                            select: {
                                userProfileImage: true,
                                username: true,
                                fullName: true,
                                reputation: true,
                                anonimity: true,

                            }
                        }
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
            resolvedStatus: complaintQuery.resolvedStatus,
            category: complaintQuery.category,
            company: {
                name: complaintQuery.company.name,
                logoUrl: complaintQuery.company.logoUrl,
                industry: complaintQuery.company.industry,
                website: complaintQuery.company.website
            },
            user: complaintQuery.user.anonimity ? null : {
                userProfileImage: complaintQuery.user.userProfileImage,
                username: complaintQuery.user.username,
                fullName: complaintQuery.user.fullName,
                reputation: complaintQuery.user.reputation,
                complaints: complaintQuery.user._count.complaints,
            },
            contributions: complaintQuery.contributions.map((contribution) => ({
                user: contribution.user.anonimity ? null : {
                    userProfileImage: contribution.user.userProfileImage,
                    username: contribution.user.username,
                    fullName: contribution.user.fullName,
                    reputation: contribution.user.reputation,
                }
            })),
            hasVoted
        }

        return NextResponse.json({success: true, complaint}, {status: 200})
    } catch (error) {
        console.error(error)
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server. Ju lutem provoni perseri!"}, {status: 500})
    }
}