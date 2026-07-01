import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { runWithPrismaContext } from "@/lib/prisma-context";
import { rateLimit } from "@/lib/redis";
import { contributionsSchema } from "@/lib/schemas/contributionsSchema";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"

type ValidatedContribution = z.infer<typeof contributionsSchema>;
type ExtendedContributionType = ValidatedContribution & {
    complaintId: string;
}

export const POST = async (req: NextRequest) => {
    const session = await auth()
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
    const userAgent = req.headers.get('user-agent') || null

    if(!session){
        return NextResponse.json({success: false, message: "Ju nuk jeni te autorizuar te kryeni kete veprim!"}, {status: 401})
    }
    const rateLimitKey = `rate_limit:contributions:${session.user.id}:${ipAddress}`
    const ratelimiter = await rateLimit(rateLimitKey, 1, 120)
    if(!ratelimiter.allowed){
        return NextResponse.json({
            success: false,
            message: `Ju keni tejkaluar limitin e krijimit te kerkesave per kontribim. Ju mund te dergoni 1 kerkese per kontribime ne 120 sekonda. Provoni perseri pas ${ratelimiter.reset} sekondash.`
        }, {
            status: 429,
            headers: ratelimiter.responseHeaders
        })
    }
    try {
        const body: ExtendedContributionType = await req.json()
        if (
            (!body.attachments || body.attachments.length === 0) && 
            (!body.audiosAttached || body.audiosAttached.length === 0) && 
            (!body.videosAttached || body.videosAttached.length === 0)
        ) {
            return NextResponse.json(
                { success: false, message: "Duhet të paktën një evidence nga rubrikat e paraqitura!" },
                { status: 400 }
            );
        }
        const validatedSchema = contributionsSchema.parse(body);

        const complaintExists = await prisma.complaint.findUnique({where: {id: body.complaintId}})
        if(!complaintExists || complaintExists.deleted){
            return NextResponse.json({success: false, message: "Nuk u gjet ndonje ankese/raportim me kete numer identifikues"}, {status: 404})
        } 

        const ctx = {
            userId: session.user.id,
            ipAddress,
            userAgent
        }

        await runWithPrismaContext(ctx, async () => {
            await prisma.$transaction(async(prisma) => {
                await prisma.contributions.create({
                    data: {
                        complaintId: body.complaintId,
                        userId: session.user.id,
                        attachments: validatedSchema.attachments ?? [],
                        audiosAttached: validatedSchema.audiosAttached ?? [],
                        videosAttached: validatedSchema.videosAttached ?? [],
                        contributionValidated: false
                    }
                })
            })
        }) 
        
        return NextResponse.json({success: true}, {status: 201, headers: ratelimiter.responseHeaders})

    } catch (error: any) {
        console.error(error)
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}
