// lib/auth.ts (or lib/authOptions.ts)

import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const user = await prisma.users.findUnique({
          where: { username: credentials.username },
          select: {
            id: true,
            username: true,
            fullName: true,
            email: true,
            password: true,
            createdAt: true,
            gender: true,
            _count: {
              select: {
                complaints: true,
                contributions: true
              }
            },
            reputation: true,
            userProfileImage: true
          }
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          username: user.username,
          fullName: user.fullName,
          gender: user.gender,
          email: user.email,
          createdAt: user.createdAt,
          complaints: user._count.complaints,
          contributions: user._count.contributions,
          reputation: user.reputation,
          userProfileImage: user.userProfileImage
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.gender = user.gender;
        token.fullName = user.fullName;
        token.username = user.username;
        token.createdAt = user.createdAt;
        token.complaints = user.complaints;
        token.contributions = user.contributions;
        token.reputation = user.reputation;
        token.userProfileImage = user.userProfileImage;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id,
        fullName: token.fullName,
        email: token.email,
        gender: token.gender,
        username: token.username,
        createdAt: token.createdAt,
        complaints: token.complaints,
        contributions: token.contributions,
        reputation: token.reputation,
        userProfileImage: token.userProfileImage
      };
      return session;
    },
  },
};
