import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/schemas/authSchema";
import { NextRequest, NextResponse } from "next/server";
import { z} from "zod"
import * as bcrypt from "bcrypt"
import DOMPurify from 'isomorphic-dompurify' // Client+server side sanitization
import validator from "validator"
import { rateLimit } from "@/lib/redis";
import { addHours, addMinutes } from "date-fns";
import { sendUserVerificationEmail } from "@/lib/emails/sendEmailVerification";
import { cookies } from "next/headers";

type CreateUserDto = z.infer<typeof registerSchema>;

const sanitizeName = (name: string): string => {
    if (!name) return '';
    
    return DOMPurify.sanitize(
      validator.escape(
        name.trim()
          .replace(/</g, '＜')  // Replace angle brackets
          .replace(/>/g, '＞')
          .replace(/\s+/g, ' ')  // Collapse multiple spaces
          // Keep apostrophes and hyphens for names like O'Connor or Jean-Luc
      )
    );
  };

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const body = await req.json() as CreateUserDto
        const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
                
        const rateLimitKey = `rate_limit:registerUser:${ipAddress}`
        const ratelimiter = await rateLimit(rateLimitKey, 5, 60)
        if(!ratelimiter.allowed){
            return NextResponse.json({
                success: false,
                message: `Provoni perseri pas ${ratelimiter.reset} sekondash.`
            }, {
                status: 429,
                headers: ratelimiter.responseHeaders
            })
        }

        const userAgent = req.headers.get('user-agent') || null
        const sanitizedBody = {
            username: DOMPurify.sanitize(validator.escape(body.username?.trim() || "")),
            email: DOMPurify.sanitize(validator.normalizeEmail(body.email?.trim() || "") || ""),
            password: body.password,
            confirmPassword: body.confirmPassword,
            fullName: sanitizeName(body.fullName || ""),
            gender: body.gender
        }

        const validatedData = registerSchema.parse(sanitizedBody)

        const existingUser = await prisma.users.findFirst({
            where: {
                OR: [
                    {email: validatedData.email},
                    {username :validatedData.username}
                ]
            }
        })

        if(existingUser){
            return NextResponse.json({
                success: false,
                message: existingUser.email === validatedData.email ? "Ky email eshte i zene" : "Ky emer perdoruesi eshte i zene"
            }, {status: 409})
        }

        const verificationToken = crypto.randomUUID().toString()
        const verificationTokenExpires = addMinutes(new Date(), 1) // 1 dit

        const hashedPassword = await bcrypt.hash(validatedData.password, 10)
        const newUser = await prisma.users.create({
            data: {
                fullName: validatedData.fullName,
                password: hashedPassword,
                acceptedUser: false,
                email_verified: false,
                email: validatedData.email,
                gender: validatedData.gender,
                username: validatedData.username,
                emailVerificationToken: verificationToken,
                emailVerificationTokenExpires: verificationTokenExpires,
                createdAt: new Date()
            }
        })

        await prisma.activityLog.create({
          data: {
            userId: newUser.id,
            ipAddress,
            userAgent,
            entityId: newUser.id,
            entityType: "Users",
            action: "REGISTER",
            metadata: JSON.stringify({
              model: "Users",
              operation: 'create',
              args: {
                data: {
                  fullName: validatedData.fullName,
                  password: hashedPassword,
                  acceptedUser: false,
                  email_verified: false,
                  email: validatedData.email,
                  gender: validatedData.gender,
                  username: validatedData.username,
                  createdAt: new Date()
                }
              }
            })
          }
        })

        const verificationUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/verifiko-emailin/${verificationToken}`;
        await sendUserVerificationEmail(newUser.id, newUser.email, verificationUrl);
        
        return NextResponse.json({
            success: true,
            message: "Perdoruesi u regjistrua me sukses",
        }, {status: 201, headers: ratelimiter.responseHeaders})

    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
              { 
                success: false,
                message: "Të dhënat janë jo valide",
              },
              { status: 400 }
            );
          }
      
          // Handle other errors
          console.error("Registration error:", error);
          return NextResponse.json(
            { 
              success: false,
              message: "Gabim i serverit",
              error: "Ndodhi një gabim gjatë regjistrimit"
            },
            { status: 500 }
          );
    }
}