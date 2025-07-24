import ContactForm from '@/components/ContactForm'
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shfaqpakenaqesine.com';

  return {
    title: 'Na Kontaktoni - ShfaqPakenaqësinë',
    description: 'Kontaktoni ekipin tonë për udhëzime përdorimi, heqje/ngarkim të ankesave, ose çdo pyetje tjetër',
    keywords: [
      'kontakt shqip',
      'shfaq pakenaqësinë',
      'ndihmë platformë',
      'ankesa online',
      'pyetje shërbimi',
      'mbështetje përdoruesish'
    ],
    openGraph: {
      title: 'Na Kontaktoni - ShfaqPakenaqësinë',
      description: 'Forma për të dërguar mesazhe drejt ekipit të ShfaqPakenaqësinë',
      type: 'website',
      locale: 'sq_AL',
      url: `${baseUrl}/kontakt`,
      siteName: 'ShfaqPakenaqësinë',
      images: [{
        url: `${baseUrl}/images/contact-og.jpg`,
        width: 1200,
        height: 630,
        alt: 'Forma e Kontaktit - ShfaqPakenaqësinë',
      }],
    },
    alternates: {
      canonical: `${baseUrl}/kontakt`,
    },
  };
}

const page = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Forma e Kontaktit",
    "description": "Forma për të dërguar mesazhe drejt ekipit të ShfaqPakenaqësinë",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/kontakt`,
    "publisher": {
      "@type": "Organization",
      "name": "ShfaqPakenaqësinë",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`
      }
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "shfaqpakenaqesine@gmail.com",
      "contactType": "customer service",
      "availableLanguage": {
        "@type": "Language",
        "name": "Albanian",
        "alternateName": "sq"
      }
    },
    "inLanguage": "sq"
  };
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="flex-1">
        <div className="w-full max-w-6xl mx-auto py-10 max-[640px]:pt-8! px-4 sm:px-6 lg:px-8 text-center shadow-lg rounded-b-2xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight w-fit mx-auto relative tracking-tight mb-2">Na <span className='text-indigo-600'>Kontaktoni</span>
            <Image 
              src={'/agenda.gif'}
              width={40}
              height={40}
              alt='contact us'
              quality={50}
              className='size-10 absolute -top-8 -right-7 rotate-[30deg] max-[330px]:-top-9 max-[310px]:-right-5'
            />
          </h1>
          <p className='text-gray-600 max-[420px]:text-sm'>Këtu mund të na kontaktoni për udhezime përdorimi, heqje/ngarkimi të ankesave ose kompanive etj.</p>
        </div>
        <ContactForm />
      </main>
    </div>
  )
}

export default page