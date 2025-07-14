import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
export const GET = async () => {
    const session = await getServerSession()
    if(!session){
        return NextResponse.json({message: "Not authenticated"}, {status: 401})
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

    return NextResponse.json(companies, {status: 200})
}