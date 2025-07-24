import { auth } from '@/auth'
import CreateComplaintForm from '@/components/CreateComplaintForm'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import { FaPlusSquare } from 'react-icons/fa'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shprehpakenaqesine.com';
  
  return {
    title: 'Krijo Ankesë - ShprehPakenaqësinë',
    description: 'Krijo një ankesë të re për një kompani. Ndaj përvojën tënde me të tjerët në platformën tonë.',
    keywords: [
      'krijo ankesë',
      'raporto kompani',
      'shpreh pakenaqësinë',
      'ankesa në shqipëri',
      'ankesa në kosovë',
      'formular ankesash'
    ],
    openGraph: {
      title: 'Krijo Ankesë - ShprehPakenaqësinë',
      description: 'Formular për krijimin e ankesave kundër kompanive',
      type: 'website',
      locale: 'sq_AL',
      url: `${baseUrl}/krijo-ankese`,
      siteName: 'ShprehPakenaqësinë',
      images: [{
        url: `${baseUrl}/images/create-complaint-og.jpg`,
        width: 1200,
        height: 630,
        alt: 'Krijo ankesë në ShprehPakenaqësinë',
      }],
    },
    alternates: {
      canonical: `${baseUrl}/krijo-ankese`,
    },
  };
}

const page = async () => {
  const session = await auth()
  if(!session){
    redirect('/kycuni?from=krijo-raportim')
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Krijo Ankesë",
    "description": "Formular për krijimin e ankesave kundër kompanive",
    "potentialAction": {
      "@type": "CreateAction",
      "name": "Krijo Ankesë",
      "target": `${process.env.NEXT_PUBLIC_BASE_URL}/api/createComplaint`,
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
      <Link href={"/shto-kompani"} className="top-0 absolute rounded-bl-md right-0 flex flex-row items-center gap-1 shadow-lg sm:p-2 p-1 px-2 bg-gray-50 border-b hover:bg-gray-200 transition-colors">
        Shto kompani
        <FaPlusSquare size={24} color='#4f46e5'/>
      </Link>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Krijo <span className="text-indigo-600">Ankesen</span></h1>
      <p className='text-gray-600'>Sigurohuni qe para raportimit te jeni ne dijeni dhe ne perputhje me <Link className="text-indigo-600" href="/termat-e-perdorimit">Termat e Perdorimit</Link> dhe <Link className="text-indigo-600" href={'verifikimi'}>Procesin e Verifikimit</Link></p>
    </div>

    <CreateComplaintForm />
    </>
  )
}

export default page