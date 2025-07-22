import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { runWithPrismaContext } from "@/lib/prisma-context";
import { isAdminApi } from "@/lib/utils/isAdmin";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    const adminCheck = await isAdminApi()
    if(adminCheck instanceof NextResponse) return adminCheck;
    const ipAddress = req.headers.get('x-forwarded-for') || null
    const userAgent = req.headers.get('user-agent') || null
    const {id} = await params;
    
    try {
        var body: "APPROVE" | "UNAPPROVE" = await req.json();
        const ctx = {
            userId: adminCheck.user.id,
            ipAddress,
            userAgent
        }
        await runWithPrismaContext(ctx, async () => {
            await prisma.contributions.update({where: {id}, data: {contributionValidated: body === "APPROVE" ? true : false}})
        })

        return NextResponse.json({success: true, message: "Sapo ndryshuat statusin e kontribuimit me sukses"}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri"}, {status: 500})
    }
}

export const DELETE = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    const adminCheck = await isAdminApi();
    if(adminCheck instanceof NextResponse) return adminCheck;
    const ipAddress = req.headers.get('x-forwarded-for') || null
    const userAgent = req.headers.get('user-agent') || null
    const {id} = await params;
    try {
        const ctx = {
            userId: adminCheck.user.id,
            ipAddress,
            userAgent
        }
        await runWithPrismaContext(ctx, async () => {
            await prisma.contributions.delete({where: {id}})
        })
        
        return NextResponse.json({success: true, message: "Sapo fshite me sukses kontribuimin"}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri"}, {status: 500})
    }
} 