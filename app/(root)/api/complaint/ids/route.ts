import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
    try {
        const complaintIds = await prisma.complaint.findMany({
            select: {
                id: true
            }
        })
        return NextResponse.json(complaintIds, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server."}, {status: 500})
    }
}