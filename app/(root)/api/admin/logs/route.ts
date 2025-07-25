import prisma from "@/lib/prisma";
import { isAdminApi } from "@/lib/utils/isAdmin";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    try {
        const adminCheck = await isAdminApi();
        if(adminCheck instanceof NextResponse) return adminCheck;
        const pageStr = req.nextUrl.searchParams.get('page')
        const page = pageStr ? parseInt(pageStr) : 1
        const limitStr = req.nextUrl.searchParams.get('limit')
        const limit = limitStr ? parseInt(limitStr) : 20
        const skip = (page - 1) * limit;        

        const logs = await prisma.activityLog.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        fullName: true,
                        userProfileImage: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            skip,
            take: limit
        })        

        const allLogs = await prisma.activityLog.count();
        const hasMore = page * limit < allLogs;

        return NextResponse.json({logs, hasMore, allLogs}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server"}, {status: 500})
    }
}