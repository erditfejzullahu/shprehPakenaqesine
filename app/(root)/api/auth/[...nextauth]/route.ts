import NextAuth from "next-auth"
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from "@/lib/prisma";
import CredentialsProvider from "next-auth/providers/credentials"
import * as bcrypt from "bcrypt"

const handler = NextAuth({
    adapter: PrismaAdapter(prisma),
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {label: "Username", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials) {
                
                if(!credentials?.username || !credentials?.password){
                    return null;
                }
                console.log(credentials);

                const users = await prisma.users.findMany()
                console.log(users, ' users');
                
                
                const user = await prisma.users.findFirst({
                    where: {username: credentials.username}
                });
                console.log(' useri');
                

                if(!user || !user.password){
                    return null
                }

                const isValid = await bcrypt.compare(credentials.password.toString(), user.password)
                console.log(isValid, ' valid');
                
                if(!isValid){
                    return null
                }


                console.log("erdh qitu");
                

                return {
                    id: user.id,
                    username: user.username,
                    fullName: user.fullName,
                    gender: user.gender,
                    email: user.email
                }
            }
        })
    ],
    session: {
        strategy: "jwt"
    },
    pages: {
        error: undefined
    },
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async jwt({token, user}) {
            if(user){
                token.id = user.id;
                token.email = user.email;
                token.gender = user.gender;
                token.fullName = user.fullName;
            }
            return token;
        },
        async session({session, token}) {
            session.user = {
                ...session.user,
                id: token.id,
                fullName: token.fullName,
                email: token.email,
                gender: token.gender,
            }
            return session;
        },
        async signIn({user}) {
            console.log(user, ' useri');
            
            return true
        }
    }
})

export {handler as GET, handler as POST}