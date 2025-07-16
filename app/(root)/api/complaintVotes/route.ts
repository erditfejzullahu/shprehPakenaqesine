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
        await prisma.complaintUpVotes.create({
            data: {
                complaintId: body.complaintId,
                userId: session.user.id
            }
        })
        return NextResponse.json({success: true, message: "Sapo keni votuar me sukses"}, {status: 201})
    } catch (error) {
        console.error(error)
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri"}, {status: 500})
    }
}