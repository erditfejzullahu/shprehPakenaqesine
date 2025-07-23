import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export const GET = async () => {
    try {
        const companyIds = await prisma.companies.findMany({
            select: {
                id: true
            }
        })
        return NextResponse.json(companyIds, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server."}, {status: 500})
    }
} 