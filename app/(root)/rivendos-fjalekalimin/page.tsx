import { auth } from '@/auth';
import PasswordResetComponent from '@/components/PasswordResetComponent';
import { Metadata } from 'next';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react'

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: "Rivendos Fjalëkalimin | Shfaqpakënaqësinë",
    description:
      "Rivendosni fjalëkalimin tuaj për llogarinë Shfaqpakënaqësinë në mënyrë të sigurt dhe të shpejtë.",
    robots: {
      index: false, // nuk ka nevojë të indeksohet
      follow: false,
    },
    openGraph: {
      title: "Rivendos Fjalëkalimin",
      description:
        "Klikoni linkun e dërguar për të rivendosur fjalëkalimin tuaj.",
      url: "https://www.shfaqpakenaqesine.com/rivendos-fjalekalimin",
      siteName: "Shfaqpakënaqësinë",
      locale: "sq_AL",
      type: "website",
    },
  };
};

const page = async ({searchParams}: {searchParams: Promise<{token: string}>}) => {
    const session = await auth()
    if(session){
        redirect('/profili?redirected=reset-password')
    }
    const {token} = await searchParams;
    if(!token){
        throw new Error("Token i pavlefshëm")
    }
  return (
    <section className="flex-1">
        <div className="w-full max-w-6xl mx-auto  py-10 max-[640px]:pt-6! px-4 sm:px-6 lg:px-8 text-center shadow-lg rounded-b-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 leading-tight w-fit mx-auto relative tracking-tight max-[356px]:text-[28px]! max-[334px]:text-[26px]! max-[312px]:text-[24px]!">Rivendos <span className='text-indigo-600'>Fjalëkalimin</span>
                <Image
                    src={'/user-security.gif'}
                    width={40}
                    height={40}
                    alt='password'
                    quality={50}
                    className='size-10 absolute -z-50 -top-7 max-[640px]:-top-6 -right-9 max-[410px]:-right-6 max-[380px]:-right-0 rotate-[30deg]'
                />
            </h1>
            <p className='text-gray-600 text-center max-[420px]:text-sm'>
            Rivendosni fjalëkalimin tuaj në mënyrë të sigurt për të vazhduar përdorimin e <span className="text-indigo-600">ShfaqPakënaqësinë</span>.
            </p>
        </div>
        <PasswordResetComponent token={token}/>
    </section>
  )
}

export default page