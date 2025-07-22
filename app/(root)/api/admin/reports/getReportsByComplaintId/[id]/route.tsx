import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { runWithPrismaContext } from "@/lib/prisma-context";
import { isAdminApi } from "@/lib/utils/isAdmin";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    const checkAdmin = await isAdminApi()
    if(checkAdmin instanceof NextResponse) return checkAdmin;
    const {id} = await params;
    try {
        const reports = await prisma.reports.findMany({
            where: {complaintId: id},
            include: {
                complaint: {
                    select: {
                        title: true,
                        id: true,
                        company: {
                            select: {
                                id: true,
                                name: true
                            }
                        },
                        municipality: true,
                        category: true
                    }
                }
            }
        })        

        return NextResponse.json({success: true, reports}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}

export const DELETE = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    const adminCheck = await isAdminApi();
    if(adminCheck instanceof NextResponse) return adminCheck;
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
    const userAgent = req.headers.get('user-agent') || null
    const {id} = await params;
    try {
        const report = await prisma.reports.findUnique({where: {id}})
        if(!report){
            return NextResponse.json({success: false, message: "Nuk u gjend ndonje raport me kete ID"}, {status: 404})
        }
        
        const ctx = {
            userId: adminCheck.user.id,
            ipAddress,
            userAgent
        }

        await runWithPrismaContext(ctx, async () => {
            await prisma.reports.delete({where: {id}})
        })

        return NextResponse.json({success: true, message: "Raporti eshte fshire me sukses"}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}