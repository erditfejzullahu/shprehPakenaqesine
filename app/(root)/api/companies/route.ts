import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

enum SortByType {
    NAMEASC = "name-asc",
    NAMEDESC = "name-desc",
    COMPLAINTSASC = "complaints-asc",
    COMPLAINTSDESC = "complaints-desc",
    INDUSTRYASC = "industry-asc",
    INDUSTRYDESC = "industry-desc",
    FOUNDEDASC = "founded-asc",
    FOUNDEDDESC = "founded-desc"
}

export async function GET(req: NextRequest, res: NextResponse) {
    try {
        const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
        
        const rateLimitKey = `rate_limit:getCompanies:${ipAddress}`
        const ratelimiter = await rateLimit(rateLimitKey, 120, 60)
        if(!ratelimiter.allowed){
            return NextResponse.json({
                success: false,
                message: `Provoni perseri pas ${ratelimiter.reset} sekondash.`
            }, {
                status: 429,
                headers: ratelimiter.responseHeaders
            })
        }
        const pageStr = req.nextUrl.searchParams.get('page')
        const page = pageStr ? parseInt(pageStr) : 1;
        const limitStr = req.nextUrl.searchParams.get('limit')

        const sortByStr = req.nextUrl.searchParams.get("sortBy") as SortByType | null
        const searchParams = req.nextUrl.searchParams.get("search")
        

        const limit = limitStr ? parseInt(limitStr) : 6;

        const skip = (page-1) * limit;

        let orderBy: any[] = [];

        switch (sortByStr) {
        case SortByType.NAMEASC:
            orderBy.push({ name: "asc" });
            break;
        case SortByType.NAMEDESC:
            orderBy.push({ name: "desc" });
            break;
        case SortByType.COMPLAINTSASC:
            // complaintsCount must be handled with _count
            orderBy.push({ complaints: { _count: "asc" } });
            break;
        case SortByType.COMPLAINTSDESC:
            orderBy.push({ complaints: { _count: "desc" } });
            break;
        case SortByType.INDUSTRYASC:
            orderBy.push({ industry: "asc" });
            break;
        case SortByType.INDUSTRYDESC:
            orderBy.push({ industry: "desc" });
            break;
        case SortByType.FOUNDEDASC:
            orderBy.push({ foundedYear: "asc" });
            break;
        case SortByType.FOUNDEDDESC:
            orderBy.push({ foundedYear: "desc" });
            break;
        default:
            // default sort if needed
            orderBy.push({ name: "asc" });
        }

        const where: any = {};
        if(searchParams){
            where.OR = [
                {name: {contains: searchParams!, mode: "insensitive"}},
                {industry: {contains: searchParams!, mode: "insensitive"}},
                {description: {contains: searchParams!, mode: "insensitive"}},
                {address: {contains: searchParams!, mode: "insensitive"}}
            ]
        }        


        const companies = await prisma.companies.findMany({
            where,
            orderBy,
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
        const filteredOrNotFilteredCount = await prisma.companies.count({where})

        if(!searchParams){
            if(companies.length === 0){
                return NextResponse.json({message: "No companies found"}, {status: 404})
            }
        }

        const hasMore = page * limit < filteredOrNotFilteredCount;
        return NextResponse.json({companies, hasMore, filteredOrNotFilteredCount}, {status: 200, headers: ratelimiter.responseHeaders})
        
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: "something went wrong!"}, {status: 500});
    }
}