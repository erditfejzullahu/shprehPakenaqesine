import prisma from "@/lib/prisma";
import { registerSchema } from "@/lib/schemas/authSchema";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod"
import * as bcrypt from "bcrypt"

type CreateUserDto = z.infer<typeof registerSchema>;

export const POST = async (req: NextRequest, res: NextResponse) => {
    try {
        const body = await req.json() as CreateUserDto
        console.log(body, " body")
        const validatedData = registerSchema.parse(body)
        console.log(validatedData)
        
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