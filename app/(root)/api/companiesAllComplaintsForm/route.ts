import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "../../../../auth"
import { rateLimit } from "@/lib/redis"
export const GET = async (req: NextRequest) => {
    try {
        const session = await auth()
        if(!session){
            return NextResponse.json({message: "Not authenticated"}, {status: 401})
        }
        const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
        const rateLimitKey = `rate_limit:getCompaniesFormAllCompanies:${ipAddress}`
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
        const companies = await prisma.companies.findMany({
            select: {
                id: true,
                name: true
            }
        })

        if(companies.length === 0){
            return NextResponse.json({message: "No companies found"}, {status: 404})
        }

        return NextResponse.json(companies, {status: 200, headers: ratelimiter.responseHeaders})
    } catch (error) {
        console.error(error);
        return NextResponse.json({message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
    
}