import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
    try {
        const pageStr = req.nextUrl.searchParams.get("page");
        const page = pageStr ? parseInt(pageStr) : 1
        const limit = 50;
        const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"

        const rateLimitKey = `rate_limit:getComplaints:${ipAddress}`
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

        const complaints = await prisma.complaint.findMany({
            where: {status: "ACCEPTED"},
            include: {company: {
                select: {
                    name: true,
                }
            }, user: {
                select: {
                    id: true,
                    fullName: true,
                    anonimity: true
                }
            }},
            take: limit
        })

        const complaintsSafe = complaints.map((complaint) => {
            const user = complaint.user
            if(user.anonimity){
                return {
                    ...complaint,
                    user: {
                        anonimity: user.anonimity
                    }
                }
            }
            return complaint;
        })

        if(complaints.length === 0){
            return NextResponse.json({message: "No complaints found"}, {status: 404})
        }

        return NextResponse.json({complaints: complaintsSafe}, {status: 200, headers: ratelimiter.responseHeaders})
    } catch (error) {
        console.error(error)
        return NextResponse.json({message: "Error getting complaings"}, {status: 500})
    }
}