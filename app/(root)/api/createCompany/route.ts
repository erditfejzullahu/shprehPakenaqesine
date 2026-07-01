import { auth } from "@/auth";
import { createCompanySchema } from "@/lib/schemas/createCompanySchema";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import DOMPurify from 'isomorphic-dompurify'
import validator from "validator"
import prisma from "@/lib/prisma";
import { runWithPrismaContext } from "@/lib/prisma-context";
import { rateLimit } from "@/lib/redis";

type CreateCompanyType = z.infer<typeof createCompanySchema>

const sanitizeUrl = (url: string): string | null => {
    if (!url) return null;
    
    if (!validator.isURL(url, {
      require_protocol: true,
      protocols: ['http', 'https'],
      require_valid_protocol: true
    })) {
      return null;
    }
  
    let sanitized = DOMPurify.sanitize(url);    
    sanitized = validator.trim(sanitized);
    
    if (!sanitized.startsWith('http://') && !sanitized.startsWith('https://')) {
      return null;
    }
  
    return sanitized;
  };

export const POST = async (req: NextRequest) => {
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
    const userAgent = req.headers.get('user-agent') || null
    const session = await auth();
    if(!session){
        return NextResponse.json({success: false, message: "Ju nuk jeni te autorizuar per kete veprim!"}, {status: 401})
    }

    const rateLimitKey = `rate_limit:companies:${session.user.id}:${ipAddress}`
    const ratelimiter = await rateLimit(rateLimitKey, 1, 120)
    if(!ratelimiter.allowed){
        return NextResponse.json({
            success: false,
            message: `Ju keni tejkaluar limitin e krijimit te kompanive. Ju mund te dergoni 1 kerkese per krijim te kompanive ne 120 sekonda. Provoni perseri pas ${ratelimiter.reset} sekondash.`
        }, {
            status: 429,
            headers: ratelimiter.responseHeaders
        })
    }

    try {
        const body: CreateCompanyType = await req.json();            
            
        const sanitizedBody = {
            name: DOMPurify.sanitize(validator.escape(body.name.trim())),
            description: DOMPurify.sanitize(validator.escape(body.description?.trim() || "")),
            logoUrl: body.logoUrl,
            address: DOMPurify.sanitize(validator.escape(body.address.trim())),
            website: sanitizeUrl(body.website || ""),
            email: body.email ? DOMPurify.sanitize(validator.normalizeEmail(body.email?.trim() || "") || "") : null,
            phone: DOMPurify.sanitize(validator.escape(body.phone?.trim() || "")),
            industry: DOMPurify.sanitize(validator.escape(body.industry.trim())),
            imageUrls: body.imageUrls,
            foundedYear: body.foundedYear
        }

        const ctx = {
            userId: session.user.id,
            ipAddress,
            userAgent
        }

        const validatedCompany = createCompanySchema.parse(sanitizedBody);

        const resultCtx: any = await runWithPrismaContext(ctx, async () => {
            return await prisma.$transaction(async (prisma) => {
                const company = await prisma.companies.create({
                    data: {
                        name: validatedCompany.name,
                        description: validatedCompany.description,
                        logoUrl: validatedCompany.logoUrl,
                        address: validatedCompany.address,
                        website: validatedCompany.website,
                        email: validatedCompany.email,
                        phone: validatedCompany.phone,
                        industry: validatedCompany.industry,
                        foundedYear: validatedCompany.foundedYear,
                        images: validatedCompany.imageUrls ?? [],
                    }
                })
    
                return { company }
            })
        })

        return NextResponse.json({success: true, message: "Ju sapo keni shtuar nje kompani. Ju faleminderit per interesimin!", url: resultCtx.company.id}, {status: 201, headers: ratelimiter.responseHeaders})
    } catch (error: any) {
        console.error(error)
        return NextResponse.json({success: false, message: "Dicka shkoi gabim ne server! Ju lutem provoni perseri."}, {status: 500})
    }
}
