import { auth } from '@/auth'
import CreateComplaintForm from '@/components/CreateComplaintForm'
import Video from '@/components/Video'
import { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import { FaPlusSquare } from 'react-icons/fa'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shfaqpakenaqesine.com';
  
  return {
    title: 'Krijo Ankesë - ShfaqPakenaqësinë',
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
      title: 'Krijo Ankesë - ShfaqPakenaqësinë',
      description: 'Formular për krijimin e ankesave kundër kompanive',
      type: 'website',
      locale: 'sq_AL',
      url: `${baseUrl}/krijo-ankese`,
      siteName: 'ShfaqPakenaqësinë',
      images: [{
        url: `${baseUrl}/shfaqpakenaqesine-cover.png`,
        width: 1200,
        height: 630,
        alt: 'Krijo ankesë në ShfaqPakenaqësinë',
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Krijo Ankesë - ShfaqPakenaqësinë",
      description: "Formular për krijimin e ankesave kundër kompanive.",
      images: {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/shfaqpakenaqesine-cover.png`,
        width: 1200,  // Required for OG
        height: 630,  // Required for OG
        alt: "ShfaqPakenaqësinë - Zëri i Qytetarëve dhe Punonjësve"
      },
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
    <div className="w-full rounded-b-2xl max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-lg relative">
      <Link href={"/shto-kompani"} className="top-0 absolute rounded-bl-md right-0 flex flex-row items-center gap-1 shadow-lg sm:p-2 p-1 px-2 bg-gray-50 border-b hover:bg-gray-200 transition-colors">
        Shto kompani
        <FaPlusSquare size={24} color='#4f46e5'/>
      </Link>
      <h1 className="text-3xl mb-2 sm:text-4xl md:text-5xl font-bold leading-tight w-fit mx-auto relative tracking-tight">Krijo <span className="text-indigo-600">Ankesën</span>
      <Video
            src='/rumor.mp4'
            className='size-10 absolute -top-8 -left-7 -rotate-[30deg] max-[330px]:-top-10'
        />
      </h1>
      <p className='text-gray-600 max-[420px]:text-sm!'>Sigurohuni që para raportimit të jeni në dijeni dhe në përputhje me <Link className="text-indigo-600" href="/termat-e-perdorimit">Termat e Përdorimit</Link> dhe <Link className="text-indigo-600" href={'verifikimi'}>Procesin e Verifikimit</Link></p>
    </div>

    <CreateComplaintForm />
    </>
  )
}

export default page