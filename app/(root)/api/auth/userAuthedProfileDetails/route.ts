import { authOptions } from "@/lib/auth"
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        // console.log("sosht?");
        const session = await getServerSession(authOptions);
        
        if(!session){
            
            return NextResponse.json({success: false, message: "Nuk jeni te autorizuar per kete veprim!"}, {status: 401})
        }
        const userDetails = await prisma.users.findUnique({
            where: {id: session.user.id},
            select: {
                complaints: {
                    select: {
                        title: true,
                        createdAt: true,
                        upVotes: true,
                        resolvedStatus: true,
                        id: true,
                        company: {
                            select: {
                                name: true,
                                id: true
                            }
                        }
                    }
                },
                contributions: {
                    select: {
                        complaint: {
                            select: {
                                id: true,
                                title: true,
                                upVotes: true,
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
                    companyId: complaint.company.id,
                    companyName: complaint.company.name,
                    title: complaint.title,
                    createdAt: complaint.createdAt,
                    upVotes: complaint.upVotes,
                    resolvedStatus: complaint.resolvedStatus,
                    id: complaint.id
                })),
                contributions: userDetails.contributions.map((contribution) => ({
                    complaintTitle: contribution.complaint.title,
                    complaintUpVotes: contribution.complaint.upVotes,
                    createdAt: contribution.createdAt,
                    complaintId: contribution.complaint.id
                }))
        }

        return NextResponse.json({success: true, details}, {status: 200})

    } catch (error) {
        
    }
}