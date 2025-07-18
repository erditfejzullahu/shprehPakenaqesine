import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/schemas/authSchema";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import * as bcrypt from "bcrypt"
import DOMPurify from 'isomorphic-dompurify' // Client+server side sanitization
import validator from "validator"

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

        const hashedPassword = await bcrypt.hash(validatedData.password, 10)
        await prisma.users.create({
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
        })

        return NextResponse.json({
            success: true,
            message: "Perdoruesi u regjistrua me sukses",
        }, {status: 201})

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