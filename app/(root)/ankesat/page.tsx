import AllComplaintsCard from '@/components/AllComplaintsCard'
import { getComplaintList } from '@/lib/actions/seoActions';
import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shprehpakenaqesine.com';
  const defaultImage = `${baseUrl}/images/complaints-cover.jpg`;

  return {
    title: 'Të Gjitha Ankesat - ShprehPakenaqësinë',
    description: 'Eksploro listën e plotë të ankesave në platformën tonë. Lexoni dhe ndani përvojat tuaja me kompanitë shqiptare.',
    keywords: [
      'ankesa shqiptare',
      'raportime kompanish',
      'probleme me shërbime',
      'ankesa në kosovë',
      'ankesa në shqipëri',
      'shpreh pakenaqësinë',
      'komente kompanish'
    ],
    openGraph: {
      title: 'Të Gjitha Ankesat - ShprehPakenaqësinë',
      description: 'Lista e plotë e ankesave kundër kompanive shqiptare dhe kosovare',
      type: 'website',
      locale: 'sq_AL',
      url: `${baseUrl}/ankesat`,
      siteName: 'ShprehPakenaqësinë',
      images: [{
        url: defaultImage,
        width: 1200,
        height: 630,
        alt: 'Lista e ankesave në ShprehPakenaqësinë',
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Eksploro të Gjitha Ankesat',
      description: 'Lexoni dhe ndani ankesa kundër kompanive',
      images: [defaultImage],
    },
    alternates: {
      canonical: `${baseUrl}/ankesat`,
    },
  };
}


const page = async () => {

  const complaints = await getComplaintList();
  
  // Prepare structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": complaints.map((complaint, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Complaint",
        "name": complaint.title,
        "description": complaint.description?.substring(0, 160),
        "datePublished": complaint.createdAt,
        "author": {
          "@type": "Person",
          "name": complaint.user?.fullName || "Anonim"
        },
        "about": {
          "@type": "Organization",
          "name": complaint.company?.name
        },
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/ankesa/${complaint.id}`
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
            <h1 className="text-3xl sm:text-4xl mb-2 md:text-5xl font-bold leading-tight w-fit mx-auto relative tracking-tight">Te gjithë <span className="text-indigo-600">Ankesat</span>
            <Image 
              src={'/speech-bubble.gif'}
              width={40}
              height={40}
              alt='complaint'
              quality={50}
              className='size-10 absolute -top-7 -right-7 rotate-[30deg] max-[330px]:-right-5 max-[330px]:-top-9 max-[310px]:right-0'
            />
            </h1>
            <p className="text-gray-600 max-[420px]:text-sm text-center ">Këtu mund të shihni dhe të ndërveproni me të gjitha ankesat që janë krijuar deri tani.</p>
          </div>
          <AllComplaintsCard />
      </main>
    </div>
  )
}

export default page