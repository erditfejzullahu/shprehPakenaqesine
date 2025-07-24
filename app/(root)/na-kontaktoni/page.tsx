import ContactForm from '@/components/ContactForm'
import { Metadata } from 'next';
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
        <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Na Kontaktoni</h1>
          <p className='text-gray-600 max-[420px]:text-sm'>Ketu mund te na kontaktoni per udhezime perdorimi, heqje/ngarkimi te ankesave ose kompanive etj.</p>
        </div>
        <ContactForm />
      </main>
    </div>
  )
}

export default page