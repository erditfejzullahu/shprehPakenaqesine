import { Gender, Users } from "@/app/generated/prisma";
import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        fullName: string;
        email: string;
        gender: Gender;
        username: string;
        createdAt: Date;
        complaints: number;
        contributions: number;
        reputation: number;
        userProfileImage: string;
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
        username: string;
        createdAt: Date;
        complaints: number;
        contributions: number;
        reputation: number;
        userProfileImage: string;
    }
}