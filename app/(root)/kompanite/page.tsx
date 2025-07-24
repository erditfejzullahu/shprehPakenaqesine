import AllCompaniesCard from '@/components/AllCompaniesCard';
import { getCompaniesList } from '@/lib/actions/seoActions';
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shprehpakenaqesine.com';
  const defaultImage = `${baseUrl}/images/companies-cover.jpg`;

  return {
    title: 'Të Gjitha Kompanitë - ShprehPakenaqësinë',
    description: 'Eksploro listën e plotë të kompanive në platformën tonë. Shiko detajet, vlerësimet dhe shprehu për përvojën tënde.',
    keywords: [
      'kompani shqiptare',
      'kompani kosovare',
      'lista kompanish',
      'vlerësim kompanie',
      'shërbime në shqipëri',
      'puna në kosovë',
      'biznese shqiptare'
    ],
    openGraph: {
      title: 'Të Gjitha Kompanitë - ShprehPakenaqësinë',
      description: 'Lista e plotë e kompanive për të cilat mund të shprehni përshtypjet tuaja',
      type: 'website',
      locale: 'sq_AL',
      url: `${baseUrl}/kompanite`,
      siteName: 'ShprehPakenaqësinë',
      images: [{
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: 'Lista e kompanive në ShprehPakenaqësinë',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Eksploro të Gjitha Kompanitë',
      description: 'Shiko dhe vlerëso kompanitë në platformën tonë',
      images: [defaultImage],
    },
    alternates: {
      canonical: `${baseUrl}/kompanite`,
    },
  };
}

const page = async () => {

  const companies = await getCompaniesList();
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": companies.map((company, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Organization",
        "name": company.name,
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/kompania/${company.id}`,
        "description": company.description?.substring(0, 160),
        "address": {
          "@type": "PostalAddress",
          "addressLocality": company.address,
        },
        "image": company.logoUrl
      }
    }))
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <main className="flex-1">
          <div className="w-full max-w-6xl mx-auto py-10 max-[640px]:pt-8! px-4 sm:px-6 lg:px-8 text-center shadow-lg">
            <h1 className="text-3xl mb-2 sm:text-4xl md:text-5xl font-bold leading-tight w-fit mx-auto relative tracking-tight max-[328px]:text-[29px]! max-[318px]:text-[28px]! max-[309px]:text-[27px]!">Te gjithë <span className="text-indigo-600">Kompanitë</span>
              <Image 
                src={'/enterprise-architecture.gif'}
                alt='companies'
                className='size-10 absolute -top-8 -right-7 rotate-[30deg] max-[380px]:-right-4 max-[380px]:-top-9 max-[350px]:right-0 max-[350px]:rotate-0'
                height={40}
                width={40}
                quality={50}
              />
            </h1>
            <p className="text-gray-600 max-[420px]:text-sm text-center">Këtu mund të gjeni dhe të nderveproni me të gjithe kompanitë e shtuara deri më tani.</p>
          </div>
          <AllCompaniesCard/>
      </main>
    </div>
  )
}

export default page