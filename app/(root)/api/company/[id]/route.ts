import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    const {id} = await params;
    console.log(id, ' tek api');
    
    try {
        const company = await prisma.companies.findUnique({
            where: {id},
            include: {
                complaints: true,
            }
        })

        console.log(company, ' kompajnia');
        
        if(!company){
            return NextResponse.json({success: false, message: "Nuk u gjet asnje kompani!"}, {status: 404})
        }
        
        const complanitsCount = company.complaints.length;

        const now = new Date();
        const createdAt = company.createdAt;

        const diffInMonths = 
            (now.getFullYear() - createdAt.getFullYear()) * 12 +
            (now.getMonth() - createdAt.getMonth()) + 1;
        const complaintsPerMonth = complanitsCount / diffInMonths;

        return NextResponse.json({success: true, company, complaintsPerMonth})
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server. Ju lutem provoni perseri!"}, {status: 500})
    }
}