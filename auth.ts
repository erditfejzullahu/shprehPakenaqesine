import NextAuth from 'next-auth';
import prisma from '@/lib/prisma';
import {PrismaAdapter} from "@auth/prisma-adapter"
import CredentialsProvider from 'next-auth/providers/credentials'
import * as bcrypt from "bcrypt"

export const {handlers: {GET, POST}, auth, signIn, signOut} = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
    CredentialsProvider({
        credentials: {
        username: { label: "Username" },
        password: { label: "Password", type: "password" },
        },
        async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
            return null;
        }
        
        const { username, password } = credentials as {
            username: string;
            password: string
        }

        const user = await prisma.users.findUnique({
            where: { username },
            select: {
                id: true,
                username: true,
                fullName: true,
                email: true,
                password: true,
                role: true,
                createdAt: true,
                gender: true,
                _count: {
                    select: {
                    complaints: true,
                    contributions: true,
                    },
                },
                reputation: true,
                userProfileImage: true,
                anonimity: true
            },
        });

        if (!user || !user.password) {
            return null;
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return null;
        }

        const ipAddress = req.headers.get('x-forwarded-for') || null
        const userAgent = req.headers.get('user-agent') || null

        await prisma.activityLog.create({
            data: {
                userId: user.id,
                entityId: user.id,
                entityType: "Users",
                ipAddress,
                userAgent,
                action: "LOGIN",
                metadata: JSON.stringify({
                    model: "Users",
                    operation: "get",
                    args: {
                        where: {username},
                    }
                })
            }
        })

        return {
            id: user.id,
            username: user.username,
            fullName: user.fullName,
            gender: user.gender,
            role: user.role,
            email: user.email,
            createdAt: user.createdAt,
            complaints: user._count.complaints,
            contributions: user._count.contributions,
            reputation: user.reputation,
            userProfileImage: user.userProfileImage,
            anonimity: user.anonimity
        };
        },
    }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if(trigger === "update"){
                console.log(session, ' session')
                return { 
                    ...token,
                    ...(session.email && { email: session.email }),
                    ...(session.gender && { gender: session.gender }),
                    ...(session.fullName && { fullName: session.fullName }),
                    ...(session.username && { username: session.username }),
                    ...(session.userProfileImage && { userProfileImage: session.userProfileImage }),
                    ...(typeof session.anonimity === "boolean" && { anonimity: session.anonimity })
                  };
            }
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.gender = user.gender;
                token.fullName = user.fullName;
                token.username = user.username;
                token.role = user.role;
                token.createdAt = user.createdAt;
                token.complaints = user.complaints;
                token.contributions = user.contributions;
                token.reputation = user.reputation;
                token.userProfileImage = user.userProfileImage;
                token.anonimity = user.anonimity;
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
                role: token.role,
                username: token.username,
                createdAt: token.createdAt,
                complaints: token.complaints,
                contributions: token.contributions,
                reputation: token.reputation,
                userProfileImage: token.userProfileImage,
                anonimity: token.anonimity
            };
            return session;
        },
    }
});
