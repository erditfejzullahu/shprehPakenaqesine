import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    try {
        var body = await req.json();
        const {id} = await params;

        const session = await auth();
        // admin check

        const complaint = await prisma.complaint.update({
            where: {id},
            data: {
                status: body.status
            }
        })

        return NextResponse.json({success: true, message: `Sapo ndryshuar statusin e ${complaint.title} ne ${complaint.status}`}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}