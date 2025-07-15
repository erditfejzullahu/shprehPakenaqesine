import { Category, ResolvedStatus } from "@/app/generated/prisma";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";


enum SortByType {
    NEWEST = "newest",
    OLDEST = "oldest",
    LESSVOTES = "upvotes-asc",
    MOREVOTES = "upvotes-desc",
    LATESTEDITED = "latest-edit"
}

export const GET = async (req: NextRequest) => {
    try {
        const pageStr = req.nextUrl.searchParams.get("page")
        const limitStr = req.nextUrl.searchParams.get("limit")
        const searchParams = req.nextUrl.searchParams.get("search")
        const status = req.nextUrl.searchParams.get("status")
        const sortBy = req.nextUrl.searchParams.get("sortBy") as SortByType
        const category = req.nextUrl.searchParams.get("category")

        const page = pageStr ? parseInt(pageStr) : 1;
        const limit = limitStr ? parseInt(limitStr) : 10;

        const skip = (page - 1) * limit;

        let orderBy: any[] = []

        switch (sortBy) {
            case SortByType.NEWEST:
                orderBy.push({createdAt: "desc"})
                break;
            case SortByType.OLDEST:
                orderBy.push({createdAt: "asc"})
                break;
            case SortByType.LESSVOTES:
                orderBy.push({upVotes: "asc"})
                break;
            case SortByType.MOREVOTES:
                orderBy.push({upVotes: "desc"})
                break;
            case SortByType.LATESTEDITED:
                orderBy.push({updatedAt: "desc"})
            default:
                orderBy.push({createdAt: "desc"})
                break;
        }

        const and: any[] = []

        if (category && category !== "ALL") {
            and.push({ category })
        }

        if (status && status !== "ALL") {
            and.push({resolvedStatus: status})
        }

        if(searchParams){
            and.push({
                OR: [
                    { title: { contains: searchParams, mode: "insensitive" } },
                    { description: { contains: searchParams, mode: "insensitive" } },
                    { company: { is: { name: { contains: searchParams, mode: "insensitive" } } } }
                ]
            })
        }
          
        and.push({status: "ACCEPTED"})
        const where = and.length > 0 ? {AND: and} : {}

        const complaints = await prisma.complaint.findMany({
            where,
            orderBy,
            skip,
            take: limit,
            include: {
                company: {
                    select: {
                        id: true,
                        name: true
                    },
                },
                user: {
                    select: {
                        id: true,
                        anonimity: true,
                        fullName: true
                    }
                }
            }
        })

        const complaintsSafe = complaints.map((complaint) => {
            const user = complaint.user;
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

        const filteredOrNotFilteredCount = await prisma.complaint.count({where})

        const hasMore = page * limit < filteredOrNotFilteredCount;

        return NextResponse.json({complaints: complaintsSafe, hasMore, filteredOrNotFilteredCount, success: true}, {status: 200})

    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Something went wrong"}, {status: 500})
    }
}   