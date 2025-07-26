import { auth } from '@/auth'
import { Button } from '@/components/ui/button'
import { verifyCookieValue } from '@/lib/emails/sendEmailVerification'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import { GrMail } from 'react-icons/gr'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Emaili u Dërgua për Verifikim - ShprehPakënaqësinë',
    description: 'U dërgua një email për të verifikuar llogarinë tuaj. Kontrolloni inbox-in brenda 24 orëve.',
    robots: {
      index: false,
      follow: false, // prevent link following as well
      nocache: true,
    },
    openGraph: {
      title: 'Emaili për Verifikim u Dërgua',
      description: 'Ju lutemi kontrolloni inbox-in tuaj për të verifikuar llogarinë.',
      url: 'https://shprehpakenaqesine.com/verifiko-emailin/ridergo-verifikimin/njofrim', // update accordingly
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: 'Emaili për Verifikim u Dërgua',
      description: 'Ju lutemi kontrolloni inbox-in tuaj për të përfunduar verifikimin.',
    },
  }
}


const page = async () => {
    const session = await auth();
    if(session) redirect('/');
    const signedCookie = (await cookies()).get('email-verification')?.value
    
    const value = signedCookie ? verifyCookieValue(signedCookie) : null;
    const parsedValue = JSON.parse(value || "null")
    // if(parsedValue === null || !parsedValue?.resend) redirect('/');

  return (
    // <div className='py-10'>
    //     <div className="max-w-md mx-auto text-center p-6 bg-white rounded-lg shadow-lg">
    //     <h1 className="text-2xl font-bold tracking-tight leading-tight mb-4">Emaili u dërgua!</h1>
    //     <p className="mb-6">Ri-verifikimi i llogarisë tuaj është proceduar me sukses. Ju keni 24 orë për verifikimin e llogarisë tuaj.</p>
    //     <div className='flex flex-row gap-2'>
    //         <Link target='_blank' className='px-4 py-2 bg-red-700 text-white rounded hover:bg-red-900' href={'https://gmail.com'}>Vazhdoni në gmail</Link>
    //         <Link
    //             href="/kycuni"
    //             className="px-4 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-900"
    //         >
    //             Vazhdo në identifikim
    //         </Link>
    //     </div>
    //     </div>
    // </div>
    <div className='mb-10'>
      <div className="w-full max-w-6xl mx-auto py-10 max-[640px]:pt-8! px-4 sm:px-6 lg:px-8 text-center shadow-lg rounded-b-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 leading-tight w-fit mx-auto relative tracking-tight">Emaili <span className='text-indigo-600'>u dërgua!</span>
              <Image
                  src={'/social-page.gif'}
                  width={40}
                  height={40}
                  alt='complaint'
                  quality={50}
                  className='size-10 absolute -top-7 -right-9 rotate-[30deg] max-[350px]:-right-7 max-[350px]:-top-9 max-[350px]:rotate-[20deg] max-[336px]:-right-5 max-[313px]:-right-3 max-[295px]:right-0 max-[295px]:rotate-0'
              />
          </h1>
          <p className='text-gray-600 text-center max-[420px]:text-sm'>Ri-verifikimi i llogarisë tuaj është proceduar me sukses. Ju keni <span className='text-indigo-600'>24 orë</span> për verifikimin e llogarisë tuaj.</p>
          <div className="mt-6 max-w-md gap-2 mx-auto flex-1 flex flex-wrap">
            <div className='flex-1'>
              <Button asChild variant={"destructive"}>
                <Link
                className='w-full'
                href="https://gmail.com"
                target='_blank'
                >
                Vazhdoni në gmail <GrMail />
                </Link>
              </Button>
            </div>
            <div className='flex-1'>
              <Button asChild className='bg-indigo-700 hover:bg-indigo-900 w-full'>
                <Link
                href="/kycuni"
                className='w-full'
                >
                Vazhdo në identifikim
                </Link>
              </Button>
            </div>
        </div>
      </div>
    </div>
  )
}

export default page