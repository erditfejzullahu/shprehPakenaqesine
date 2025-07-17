import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "../../../../../auth";

export const GET = async () => {
    try {        
        const session = await auth();
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

        console.log(userDetails, ' userdetails');
        

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
        console.error(error)
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server. Ju lutem provoni perseri"}, {status: 404})
    }
}