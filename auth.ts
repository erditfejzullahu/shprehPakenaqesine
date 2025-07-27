import NextAuth, { CredentialsSignin } from 'next-auth';
import prisma from '@/lib/prisma';
import {PrismaAdapter} from "@auth/prisma-adapter"
import CredentialsProvider from 'next-auth/providers/credentials'
import * as bcrypt from "bcrypt"
import { cookies } from 'next/headers';
import { signCookieValue } from './lib/emails/sendEmailVerification';
import { rateLimit } from './lib/redis';

class EmailVerifiedError extends CredentialsSignin {
 constructor(messageCode: string) {
    super();
    this.code = messageCode;
 }
}

class UsernamePasswordError extends CredentialsSignin {
    code = "USERNAME_PASSWORD_WRONG"
}

class TooManyRequests extends CredentialsSignin {
    constructor(messageCode: string) {
        super();
        this.code = messageCode
    }
}

class AccountBlocked extends CredentialsSignin {
    code = "ACCOUNT_BLOCKED"
}

class FiveRemainingTryes extends CredentialsSignin {
    constructor(messageCode: string){
        super();
        this.code = messageCode
    }
    // code = "5_REMAINING"
}

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

        const rateLimitKey = `rate_limit:login:${username}`
        const ratelimiter = await rateLimit(rateLimitKey, 3, 30)
        if(!ratelimiter.allowed){
            throw new TooManyRequests(`TOO_MANY_REQUESTS#${ratelimiter.reset}`)
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
                attempts: true,
                createdAt: true,
                email_verified: true,
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
            throw new UsernamePasswordError();
        }

        if(user.attempts > 8){
            await prisma.users.update({
                where: {username},
                data: {
                    blocked: true
                }
            })
            throw new AccountBlocked();
        }

        if(!user.email_verified){
            (await cookies()).set('email-verification', signCookieValue(JSON.stringify({
                error: true,
                email: user.email
            })), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 3,
                path: '/',
                sameSite: "strict"
            })
            const message = `EMAIL_NOT_VERIFIED`
            throw new EmailVerifiedError(message)
        }

        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            await prisma.users.update({
                where: {username},
                data: {
                    attempts: {
                        increment: 1
                    }
                }
            })
            if(user.attempts > 3){
                const attemptLogic = 9 - user.attempts
                throw new FiveRemainingTryes(`5_REMAINING#${attemptLogic}`)
            }
            throw new UsernamePasswordError();
        }

        await prisma.users.update({
            where: {username},
            data: {
                attempts: 0
            }
        })

        const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get("x-real-ip") || "unknown"
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
