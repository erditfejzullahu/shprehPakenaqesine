import CompanyPage from '@/components/CompanyPageComponent';
import api from '@/lib/api';
import { CompanyPerIdInterface } from '@/types/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const page = async ({params}: {params: Promise<{id: string}>}) => {  
  console.log((await params).id, ' aeieiei');
  
    const {id} = await params;
    const response = await api.get<CompanyPerIdInterface>(`/api/company/${id}`)
    const data = response.data;
    const images: string[] | [] = data.company.images ? JSON.parse(data.company.images) : [];
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
                      {images.length > 0 ? images.map((image, index) => (
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