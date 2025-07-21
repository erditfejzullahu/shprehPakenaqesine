import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export const DELETE = async (req: NextRequest, {params}: {params: Promise<{id: string}>}) => {
    const session = await auth();
    const {id} = await params;
    try {
        const subscriber = await prisma.subscribers.findUnique({where: {id}})
        if(!subscriber) return NextResponse.json({success: false, message: "Nuk u gjet ndonje abonues me kete number identifikues"}, {status: 404});
        await prisma.subscribers.delete({where: {id}})
        return NextResponse.json({success: true, message: "Sapo fshite abonuesin nga lista e abonenteve"}, {status: 200})
    } catch (error) {
        console.error(error);
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem proni perseri."}, {status: 500})
    }
}