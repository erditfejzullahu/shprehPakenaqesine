import { auth } from '@/auth'
import CreateCompanyForm from '@/components/CreateCompanyForm'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import { FaPlusSquare } from 'react-icons/fa'


export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shprehpakenaqesine.com';
  
  return {
    title: 'Shto Kompani të Re - ShprehPakenaqësinë',
    description: 'Shtoni një kompani të re në platformën tonë për të lejuar krijimin e ankesave dhe vlerësimeve',
    keywords: [
      'shto kompani',
      'regjistro biznes',
      'krijo kompani',
      'shpreh pakenaqësinë',
      'kompani shqiptare',
      'kompani kosovare',
      'formular kompanish'
    ],
    openGraph: {
      title: 'Shto Kompani të Re - ShprehPakenaqësinë',
      description: 'Formular për regjistrimin e kompanive të reja në platformë',
      type: 'website',
      locale: 'sq_AL',
      url: `${baseUrl}/shto-kompani`,
      siteName: 'ShprehPakenaqësinë',
      images: [{
        url: `${baseUrl}/images/add-company-og.jpg`,
        width: 1200,
        height: 630,
        alt: 'Shto kompani të re në ShprehPakenaqësinë',
      }],
    },
    alternates: {
      canonical: `${baseUrl}/shto-kompani`,
    },
  };
}

const page = async () => {
  const session = await auth()
  if(!session){
    redirect('/kycuni?from=shto-kompani')
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Shto Kompani të Re",
    "description": "Formular për regjistrimin e kompanive të reja",
    "potentialAction": {
      "@type": "CreateAction",
      "name": "Shto Kompani",
      "target": `${process.env.NEXT_PUBLIC_BASE_URL}/api/companies`,
      "expectsAcceptanceOf": {
        "@type": "CreativeWork",
        "name": "Termat e Përdorimit",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/termat-e-perdorimit`
      }
    }
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
    <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-lg relative">
      <Link href={"/krijo-raportim"} className="top-0 absolute rounded-bl-md right-0 flex flex-row items-center gap-1 shadow-lg sm:p-2 p-1 px-2 bg-gray-50 border-b hover:bg-gray-200 transition-colors">
        Krijo Ankese
        <FaPlusSquare size={24} color='#4f46e5'/>
      </Link>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Krijo <span className="text-indigo-600">Kompani</span></h1>
      <p className='text-gray-600'>Ketu mund te shtoni kompanine per te cilen mund te krijoni ankese ju apo perdoruesit e tjere te platformes <span className="text-indigo-600">ShprehPakenaqesine</span></p>
    </div>
    <CreateCompanyForm />
    </>
  )
}

export default page