import "next-auth";
import "next-auth/jwt";
import { AdapterUser } from "@auth/core/adapters";
import { Gender } from "@/app/generated/prisma";

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
    anonimity: boolean;
  }

  interface Session {
    user: User;
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
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
    anonimity: boolean;
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
    anonimity: boolean;
  }
}
