import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from 'next-auth/jwt';

const authRoutes = ['/kycuni']
const protectedRoutes = ['/shto-kompani', '/krijo-raportim', '/profili']

export default async function middleware(request: NextRequest){
    const {pathname} = request.nextUrl;
    const session = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    if(authRoutes.some(route => pathname.startsWith(route)) && session){
        return NextResponse.redirect(new URL('/', request.url))
    }

    if(protectedRoutes.some(route => pathname.startsWith(route)) && !session){
        const redirectUrl = new URL('/kycuni', request.url)
        redirectUrl.searchParams.set('from', pathname)
        return NextResponse.redirect(redirectUrl)
    }
    return NextResponse.next()
}

// export const config = {
//     matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
// }

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
  }

