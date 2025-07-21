import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { isAdminApi } from "@/lib/utils/isAdmin";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    const adminCheck = await isAdminApi()
    if(adminCheck instanceof NextResponse) return adminCheck;

    const {id} = await params;
    
    try {
        var body: "APPROVE" | "UNAPPROVE" = await req.json();
        await prisma.contributions.update({where: {id}, data: {contributionValidated: body === "APPROVE" ? true : false}})
        return NextResponse.json({success: true, message: "Sapo ndryshuat statusin e kontribuimit me sukses"}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri"}, {status: 500})
    }
}

export const DELETE = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    const session = await auth();
    const {id} = await params;
    try {
        await prisma.contributions.delete({where: {id}})
        return NextResponse.json({success: true, message: "Sapo fshite me sukses kontribuimin"}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri"}, {status: 500})
    }
} 