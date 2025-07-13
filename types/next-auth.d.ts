import { Gender, Users } from "@/app/generated/prisma";
import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        fullName: string;
        email: string;
        gender: Gender;
    }

    interface Session {
        user: User
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        fullName: string;
        email: string;
        gender: Gender;
    }
}