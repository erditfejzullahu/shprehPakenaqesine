import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    const session = await auth()
    if(!session){
        return NextResponse.json({success: false, message: "Nuk jeni te autorizuar per kete veprim!"}, {status: 401})
    }
    try {
        const body = await req.json();
        await prisma.users.update({
            where: {id: session.user.id},
            data: {
                anonimity: body.anonimity
            }
        })
        return NextResponse.json({success: true, message: "Sapo ndryshuar dukshmerine tuaj"}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."})
    }
}