import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { runWithPrismaContext } from "@/lib/prisma-context";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    const searchParams = req.nextUrl.searchParams
    const complaintId = searchParams.get('complaintId')

    if(!complaintId){
        return NextResponse.json({success: false}, {status: 400})
    }

    const session = await auth();
    if(!session){
        return NextResponse.json({success: false}, {status: 401})
    }
    try {
        const complaint = await prisma.complaint.findUnique({where: {id: complaintId}})
        if(!complaint){
            return NextResponse.json({success: false}, {status: 404})
        }
        if(complaint.userId !== session.user.id){
            return NextResponse.json({success: false}, {status: 400})
        }
        return NextResponse.json({success: true}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false}, {status: 500})
    }
}

export const DELETE = async (req: NextRequest) => {
    const session = await auth();
    if(!session){
        return NextResponse.json({success: false, message: "Ju nuk jeni te autorizuar per te kryer kete veprim!"}, {status: 401})
    }
    const {complaintId} = await req.json();
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
    const userAgent = req.headers.get('user-agent') || null
    if(!complaintId){
        return NextResponse.json({success: false, message: "Dicka shkoi gabim! Ju lutem provoni perseri me paraqitjen e te gjitha fushave perkatese."}, {status: 400})
    }
    try {
        const complaint = await prisma.complaint.findUnique({where: {id: complaintId}})
        if(!complaint) return NextResponse.json({success: false, message: "Nuk u gjet ndonje ankese me kete numer identifikues."}, {status: 404});
    
        const ctx = {
            userId: session.user.id,
            ipAddress,
            userAgent
        }

    await runWithPrismaContext(ctx, async () => {
        await prisma.complaint.delete({where: {id: complaintId}})
    })
    
    return NextResponse.json({success: true, message: "Sapo fshite ankesen me sukses!"}, {status: 200})

    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}