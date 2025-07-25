import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { runWithPrismaContext } from "@/lib/prisma-context";
import { isAdminApi } from "@/lib/utils/isAdmin";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    try {
        const body = await req.json();
        const {id} = await params;
        const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
        const userAgent = req.headers.get('user-agent') || null

        const adminCheck = await isAdminApi();
        if(adminCheck instanceof NextResponse) return adminCheck;

        const complaint = await prisma.complaint.findUnique({where: {id}})
        if(!complaint){
            return NextResponse.json({success: false, message: "Nuk u gjet ndonje ankese me ate numer identifikues"}, {status: 404})
        }

        const updatedComplaint = await prisma.complaint.update({
            where: {id},
            data: {
                status: body.status
            }
        })

        await prisma.activityLog.create({
            data: {
                userId: adminCheck.user.id,
                ipAddress,
                userAgent,
                entityId: id,
                entityType: "Complaint",
                action: "UPDATE_COMPLAINT",
                metadata: JSON.stringify({
                    model: "Complaint",
                    operation: "update",
                    args: {
                        where: {id},
                        data: {
                            status: body.status
                        }
                    }
                })
            }
        })

        return NextResponse.json({success: true, message: `Sapo ndryshuar statusin e ${updatedComplaint.title} ne ${updatedComplaint.status}`}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}

export const DELETE = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    try {
        const {id} = await params;
        const adminCheck = await isAdminApi()
        const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
        const userAgent = req.headers.get('user-agent') || null
        if(adminCheck instanceof NextResponse) return adminCheck;

        const ctx = {
            userId: adminCheck.user.id,
            ipAddress,
            userAgent
        }

        await runWithPrismaContext(ctx, async () => {
            await prisma.complaint.delete({where: {id}})
        })

        return NextResponse.json({success: true, message: "Sapo fshite me sukses"}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}