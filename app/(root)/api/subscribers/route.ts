import prisma from "@/lib/prisma";
import { subscriberSchema } from "@/lib/schemas/createSubscriptionSchema";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"

type CreateSubscriberType = z.infer<typeof subscriberSchema> 

export const GET = async (req: NextRequest) => {
    const session = await getServerSession()
    //TODO: add role
} 

export const POST = async (req: NextRequest) => {
    try {
        const body: CreateSubscriberType = await req.json();
        const validationSchema = subscriberSchema.parse(body)
        
        const existingEmail = await prisma.subscribers.findUnique({where: {email: validationSchema.email}})
        if(existingEmail){
            return NextResponse.json({success: false, message: "Ju vecse jeni abonuar tashme!"}, {status: 400})
        }
        await prisma.subscribers.create({
            data: {email: validationSchema.email, createdAt: new Date()},
        })
        return NextResponse.json({success: true, message: "Ju u abonuar me sukses. Ne te ardhmen do njoftoheni per ankesat e reja permes emailit te paraqitur me larte."}, {status: 201})
    } catch (error) {
        console.error(error)
        return NextResponse.json({success: false, message: "Dicka shkoi gabim. Ju lutem provoni perseri"}, {status: 500})
    }
}