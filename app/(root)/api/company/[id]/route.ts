import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    const {id} = await params;
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
    const rateLimitKey = `rate_limit:getSingleCompany:${ipAddress}`
    const ratelimiter = await rateLimit(rateLimitKey, 20, 60)
    if(!ratelimiter.allowed){
        return NextResponse.json({
            success: false,
            message: `Provoni perseri pas ${ratelimiter.reset} sekondash.`
        }, {
            status: 429,
            headers: ratelimiter.responseHeaders
        })
    }
    try {
        const company = await prisma.companies.findUnique({
            where: {id},
            include: {
                complaints: true,
            }
        })
        
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

        return NextResponse.json({success: true, company, complaintsPerMonth}, {status: 200, headers: ratelimiter.responseHeaders})
    } catch (error) {
        console.log(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server. Ju lutem provoni perseri!"}, {status: 500})
    }
}