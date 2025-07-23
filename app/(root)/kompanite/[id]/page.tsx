import { Companies } from '@/app/generated/prisma';
import CompanyPage from '@/components/CompanyPage';
import api from '@/lib/api';
import { CompanyPerIdInterface } from '@/types/types';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

export const revalidate = 300;

export async function getStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies/ids`, {next: {revalidate: revalidate}, method: "GET"})
  if(!res.ok){
    throw new Error("Error fetching ids")
  }
  const ids: {id: string}[] = await res.json()
  return ids.map((company) => ({
    id: company.id
  }))
}

export async function generateMetadata({params}: {params: Promise<{id: string}>}): Promise<Metadata> {
  const {id} = await params;
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/company/${id}`, {next: {revalidate: 3600000}});
    if(!response.ok){
      return {
        title: 'Kompania - ShprehPakenaqësinë',
        description: 'Shqyrto dhe vlerëso kompaninë në platformën tonë në bazë të krijimit të ankesave apo raportimeve në lidhje me të. Lexo komente dhe shpreh përshtypjet të tua.',
        keywords: ['kompani', 'vlerësim', 'shqipëri', 'puna', 'shërbime', 'ankesa', 'raportime', 'kosovë', 'kosove', 'shqiperi'],
        openGraph: {
          title: 'Vlerëso Kompaninë - ShprehPakenaqësinë',
          description: 'Platforma për vlerësimin e kompanive në Kosovë në bazë të ankesave',
        },
      };
    }
    const {company}: CompanyPerIdInterface = await response.json();
    
    const seoTitle = `${company.name} - Vlerësim i Kompanisë | ShprehPakenaqësinë`
    const seoDescription = company.description
      ? `${company.description.substring(0,160)}`
      : `Vlerëso ${company.name} në platformën tone duke krijuar ankesa apo raportime. Shiko detajet, komentet dhe shprehu për përvojën tënde.`;
  
    const keywords = [
      company.name?.toLowerCase(),
      'vleresim kompanie',
      'puna në shqiperi',
      'puna në kosove',
      'kompani shqiptare',
      'kompani kosovare',
      company.industry?.toLowerCase(),
      company.address?.toLowerCase(),
    ].filter(Boolean);

    return {
      title: seoTitle,
      description: seoDescription,
      keywords: keywords,
      openGraph: {
        title: seoTitle,
        description: seoDescription,
        type: 'article',
        locale: 'sq_AL',
        siteName: 'ShprehPakenaqësinë',
        images: [
          {
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/${company.logoUrl}`,
            secureUrl: company.logoUrl,
            alt: `${company.name} - ShprehPakenaqësinë`
          }
        ],
        publishedTime: new Date(company.createdAt).toISOString(),
        modifiedTime: new Date(company.updatedAt).toISOString(),
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDescription,
        images: [`${process.env.NEXT_PUBLIC_BASE_URL}/${company.logoUrl}`]
      },
    }
  } catch (error) {
    console.error('Gabim në marrjen e të dhënave:', error);
    return {
      title: 'Kompania - ShprehPakenaqësinë',
      description: 'Shqyrto dhe vlerëso kompaninë në platformën tonë në bazë të krijimit të ankesave apo raportimeve në lidhje me të. Lexo komente dhe shpreh përshtypjet të tua.',
      keywords: ['kompani', 'vlerësim', 'shqipëri', 'puna', 'shërbime', 'ankesa', 'raportime', 'kosovë', 'kosove', 'shqiperi'],
      openGraph: {
        title: 'Vlerëso Kompaninë - ShprehPakenaqësinë',
        description: 'Platforma për vlerësimin e kompanive në Kosovë në bazë të ankesave',
      },
    };
  }

}

const page = async ({params}: {params: Promise<{id: string}>}) => {    
    const {id} = await params;
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/company/${id}`)
    if(!response.ok){
      throw new Error('Dicka shkoi gabim')
    }
    const data: CompanyPerIdInterface = await response.json();

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-lg">
            <Link 
              href={'/kompanite'}
              className="flex items-center text-indigo-600 hover:text-indigo-800 mb-2"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kthehu tek kompanite
            </Link>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img 
                src={data.company.logoUrl} 
                alt={`${data.company.name} logo`} 
                className="w-16 h-16 rounded-md object-contain border border-gray-200"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{data.company.name}</h1>
                <p className="text-gray-600 text-left">{data.company.industry}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Company Info */}
          <div className="lg:w-1/3 space-y-6">
              {/* Company Details Card */}
              <div className="bg-white shadow-md overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Detajet e kompanise</h3>
                  <div className="space-y-4">
                    {data.company.description && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Pershkrimi</h4>
                        <p className="mt-1 text-sm text-gray-900">{data.company.description}</p>
                      </div>
                    )}

                    {data.company.foundedYear && <div>
                      <h4 className="text-sm font-medium text-gray-500">Krijuar me</h4>
                      <p className="mt-1 text-sm text-gray-900">{data.company.foundedYear || 'Unknown'}</p>
                    </div>}

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Adresa</h4>
                      <p className="mt-1 text-sm text-gray-900">{data.company.address}</p>
                    </div>

                    {data.company.website && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Faqja internetit</h4>
                        <a 
                          href={data.company.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-1 text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          {data.company.website}
                        </a>
                      </div>
                    )}

                    {data.company.email && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Emaili</h4>
                        <a 
                          href={`mailto:${data.company.email}`}
                          className="mt-1 text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          {data.company.email}
                        </a>
                      </div>
                    )}

                    {data.company.phone && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Telefoni</h4>
                        <a 
                          href={`tel:${data.company.phone}`}
                          className="mt-1 text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          {data.company.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Company Images */}
              {data.company.images && data.company.images.length > 0 && (
                <div className="bg-white shadow-md overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Imazhet e kompanise</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {data.company.images.length > 0 ? data.company.images.map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-100 shadow-md overflow-hidden">
                          <Image 
                            src={image} 
                            alt={`Imazhi kompanise ${index + 1}`}
                            className="w-full h-full object-cover"
                            width={200}
                            height={200}
                          />
                        </div>
                      )) : (
                        <div>
                          Nuk ka imazhe te kompanise ende.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Complaints */}
            <CompanyPage companyData={data}/>
          </div>
        </div>
      </div>
    // <CompanyPage />
  )
}

export default page