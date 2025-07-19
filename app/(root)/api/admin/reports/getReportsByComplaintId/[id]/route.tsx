import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    const session = await auth()
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
    const session = await auth()
    const {id} = await params;
    try {
        const report = await prisma.reports.findUnique({where: {id}})
        if(!report){
            return NextResponse.json({success: false, message: "Nuk u gjend ndonje raport me kete ID"}, {status: 404})
        }
        await prisma.reports.delete({where: {id}})
        return NextResponse.json({success: true, message: "Raporti eshte fshire me sukses"}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}