import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const pageStr = req.nextUrl.searchParams.get('page')
        const page = pageStr ? parseInt(pageStr) : 1;

        const limit = 10;
        const skip = (page-1) * limit;

        const companies = await prisma.companies.findMany({
            where: {acceptedRequest: true},
            skip,
            take: limit
        });
        
        if(companies.length === 0){
            return NextResponse.json({message: "Nuk u gjet asnje Kompani"}, {status: 404})
        }

        const total = await prisma.companies.count();

        return NextResponse.json({
            companies: companies,
            hasMore: page * limit < total,
        })
        
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: "Dicka shkoi gabim!"}, {status: 500});
    }
}