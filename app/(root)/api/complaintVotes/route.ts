import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "../../../../auth";

export const POST = async (req: NextRequest) => {
    const session = await auth()
    
    if(!session){
        return NextResponse.json({success: false, message: "Nuk jeni te autorizuar"}, {status: 401})
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
        if(checkExisting){
            return NextResponse.json({success: false, message: "Ju vecse keni votuar per kete ankese/raportim"}, {status: 400})
        }
        await prisma.$transaction(async (prisma) => {
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
        return NextResponse.json({success: true, message: "Sapo keni votuar me sukses"}, {status: 201})
    } catch (error) {
        console.error(error)
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri"}, {status: 500})
    }
}