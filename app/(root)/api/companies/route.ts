import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const pageStr = req.nextUrl.searchParams.get('page')
        const page = pageStr ? parseInt(pageStr) : 1;

        const limit = 6;
        const skip = (page-1) * limit;

        const companies = await prisma.companies.findMany({
            skip,
            take: limit,
            include: {
                _count: {
                    select: {
                        complaints: true
                    }
                }
            }
        }).then(results => results.map(company => ({
            ...company,
            complaintsCount: company._count.complaints
        })));        
        
        if(companies.length === 0){
            return NextResponse.json({message: "No companies found"}, {status: 404})
        }

        const totalCount = await prisma.companies.count();

        const hasMore = page * limit < totalCount;

        console.log({ companiesCount: companies.length, hasMore });

        return NextResponse.json({ companies, hasMore });
        
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: "something went wrong!"}, {status: 500});
    }
}