import { auth } from '@/auth';
import { verifyCookieValue } from '@/lib/emails/sendEmailVerification';
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import DOMPurify from 'isomorphic-dompurify';
import validator from "validator"

import type { Metadata } from 'next'
import { Button } from '@/components/ui/button';
import Video from '@/components/Video';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Verifikimi Dështoi - ShprehPakënaqësinë',
    description: 'Verifikimi i llogarisë tuaj ka dështuar. Ju mund të ridërgoni emailin ose të na kontaktoni për ndihmë.',
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
    openGraph: {
      title: 'Verifikimi Dështoi',
      description: 'Verifikimi i emailit tuaj ka dështuar. Klikoni për të ridërguar linkun ose na kontaktoni.',
      url: 'https://shfaqpakenaqesine.com/verifiko-emailin/verifikimi-gabim', // përditëso me URL reale
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: 'Verifikimi Dështoi',
      description: 'Dështoi verifikimi i email-it. Ju mund të ridërgoni linkun ose të na kontaktoni.',
    },
  }
}


export default async function VerificationErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
    const session = await auth()
    if(session) redirect('/')
    const {error} = await searchParams;

    const sanitizedError = DOMPurify.sanitize(validator.escape(error || ""))

    const signedCookie = (await cookies()).get('email-verification')?.value
    
    const value: any = signedCookie ? verifyCookieValue(signedCookie) : null;
    const parsedValue = JSON.parse(value || "null");
    
    if(parsedValue === null || !parsedValue?.error){
        redirect('/')
    }

    const errorMessages = {
      token_invalid: "Tokeni verifikues është invalid!",
      token_expired: "Tokeni verifikues ka skaduar!",
      internal_error: "Gabime teknike në verifikim!",
      default: "Dicka shkoi gabim në verifikm!",
      update_failed: "Dicka shkoi gabim në ripërditësimin e përdoruesit!",
      activity_failed: "Dicka shkoi gabim në shtimin e regjistrave të përdoruesit!",
      too_many_requests: "Keni bërë shumë kërkesa! Ju lutem provoni më vonë"
    }

    
    const outputError = errorMessages[sanitizedError as keyof typeof errorMessages] || errorMessages.default

  return (
    <div className='mb-10'>
      <div className="w-full max-w-6xl mx-auto py-10 max-[640px]:pt-8! px-4 sm:px-6 lg:px-8 text-center shadow-lg rounded-b-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 leading-tight w-fit mx-auto relative tracking-tight">Verifikimi <span className='text-red-600'>Dështoi</span>
              <Video 
                  src='/social-page.mp4'
                  className='size-10 absolute -top-7 -right-9 rotate-[30deg] max-[350px]:-right-7 max-[350px]:-top-9 max-[350px]:rotate-[20deg] max-[320px]:-right-5 max-[313px]:-right-3 max-[295px]:right-0 max-[295px]:rotate-0'
              />
          </h1>
          <p className='text-gray-600 text-center max-[420px]:text-sm'>Arsyeja e dështimit të verifikimit tuaj është: <span className='text-red-600'>{outputError}</span></p>
          <div className="flex flex-row flex-wrap gap-2 items-center justify-center mt-6 max-w-lg mx-auto">
            {!parsedValue?.email && 
            <Button asChild className='bg-indigo-700 hover:bg-indigo-900 flex-1'>  
              <Link
              href={`/api/emailVerification/resend`}
              >
              Ridërgo verifikimin e emailit
              </Link>
            </Button>
            }
            <Button asChild variant={"outline"} className='flex-1'>
              <Link
              href="/na-kontaktoni"
              >
              Na kontaktoni
              </Link>
            </Button>
        </div>
      </div>
    </div>
  )
}