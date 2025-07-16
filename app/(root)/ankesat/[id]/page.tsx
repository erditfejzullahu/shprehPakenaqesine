import ComplaintActionsCard from '@/components/ComplaintActionsCard';
import ComplaintsPageTabs from '@/components/ComplaintsPageTabs';
import api from '@/lib/api';
import { authOptions } from '@/lib/auth';
import { ComplantPerIdInterface } from '@/types/types';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const page = async ({params}: {params: Promise<{id: string}>}) => {
  const session = await getServerSession(authOptions)
    const {id} = await params;
    const response = await api.get<ComplantPerIdInterface>(`/api/complaint/${id}`)
    const data = response.data;

    const attachments: string[] = data.complaint.attachments ? JSON.parse(data.complaint.attachments) : []

    const getCategoryLabel = (category: string) => {
      // Convert enum value to readable label
      const words = category.split('_').map(word => {
        if (word === 'NE') return 'në';
        return word.charAt(0) + word.slice(1).toLowerCase();
      });
      return words.join(' ');
    };
    
    
  return (
    <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-lg">
            <Link
              href={'/ankesat'}
              className="flex items-center text-indigo-600 hover:text-indigo-800 mb-2 shadow-lg p-2"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Kthehu tek ankesat/raportimet
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{data.complaint.title}</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 shadow-lg">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Complaint Content */}
            <div className="lg:w-2/3">
              <div className="bg-white shadow-lg overflow-hidden mb-6">
                <div className="p-6 sm:p-8">
                  {/* Status Badges */}
                  <div className="flex gap-3 mb-6">
                    <span className={`px-3 py-1  shadow-sm text-xs font-medium ${
                      data.complaint.resolvedStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      data.complaint.resolvedStatus === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {data.complaint.resolvedStatus === "PENDING" ? "E pa zgjidhur" : "E zgjidhur"}
                    </span>
                    <span className="px-3 py-1  text-xs shadow-sm font-medium bg-blue-100 text-blue-800">
                      {getCategoryLabel(data.complaint.category)}
                    </span>
                  </div>

                  {/* Complaint Description */}
                  <div className="prose max-w-none text-gray-700 mb-8">
                    <p className="whitespace-pre-line">{data.complaint.description}</p>
                  </div>

                  {/* Attachments */}
                  {(attachments.length > 0 || 
                    data.complaint.audiosAttached?.length > 0 || 
                    data.complaint.videosAttached?.length > 0) && (
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Bashkngjitjet/provat</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {/* Documents */}
                        {attachments.map((file, index) => (
                          <div key={`doc-${index}`} className="shadow-md p-3 flex items-center">
                            <svg className="w-8 h-8 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            <div className="truncate">
                              <p className="text-sm font-medium text-gray-900 truncate">Imazhe/Dokumente</p>
                              <p className="text-xs text-gray-500">Klikoni per hapje</p>
                            </div>
                          </div>
                        ))}

                        {/* Videos */}
                        {data.complaint.videosAttached?.map((file, index) => (
                          <div key={`video-${index}`} className="shadow-md p-3 flex items-center">
                            <svg className="w-8 h-8 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                            <div className="truncate">
                              <p className="text-sm font-medium text-gray-900 truncate">Video/Inqizime</p>
                              <p className="text-xs text-gray-500">Klikoni per hapje</p>
                            </div>
                          </div>
                        ))}

                        {/* Audios */}
                        {data.complaint.audiosAttached?.map((file, index) => (
                          <div key={`audio-${index}`} className="shadow-md p-3 flex items-center">
                            <svg className="w-8 h-8 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                            </svg>
                            <div className="truncate">
                              <p className="text-sm font-medium text-gray-900 truncate">Audio/Inqizime</p>
                              <p className="text-xs text-gray-500">Klikoni per hapje</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="text-sm text-gray-500">
                    <p>Postuar me: {new Date(data.complaint.createdAt).toLocaleDateString('sq-AL', {day: "2-digit", month: "short", year: "numeric"})}</p>
                    {data.complaint.updatedAt !== data.complaint.createdAt && (
                      <p>Rifreskuar me: {new Date(data.complaint.updatedAt).toLocaleDateString('sq-AL', {day: "2-digit", month: "short", year: "numeric"})}</p>
                    )}
                  </div>
                </div>
              </div>

              <ComplaintsPageTabs complaintsData={data}/>
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:w-1/3 space-y-6">
              {/* Company Card */}
              <div className="bg-white shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informacione te kompanise</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={data.complaint.company.logoUrl} 
                      alt={`${data.complaint.company.name} logo`} 
                      className="h-12 w-12 rounded-md object-contain"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{data.complaint.company.name}</h4>
                      <p className="text-sm text-gray-500">{data.complaint.company.industry}</p>
                    </div>
                  </div>
                  {data.complaint.company.website && (
                    <a 
                      href={data.complaint.company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      Vizito faqen
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Author Card */}
              <div className="bg-white shadow-lg overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Ankuesi/Raportuesi</h3>
                  {!data.complaint.user ? (
                    <div>Ankuesi eshte anonim!</div>
                  ) : (
                    <>
                  <div className="flex items-center gap-4">
                    <Image
                      width={100}
                      height={100}
                      src={`${data.complaint.user.userProfileImage}`} 
                      alt={`${data.complaint.user.fullName}'s avatar`} 
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {data.complaint.user.fullName}
                      </h4>
                      <p className="text-sm text-gray-500">@{data.complaint.user.username}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm">
                      <p className="text-gray-500">Reputacioni</p>
                      <p className="font-medium text-gray-900">{data.complaint.user.reputation}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-500">Ankesa/Raportime</p>
                      <p className="font-medium text-gray-900 text-right">{data.complaint.user.complaints}</p>
                    </div>
                  </div>
                    </>
                  )}
                </div>
              </div>

              {/* Actions Card */}
              <ComplaintActionsCard complaintsData={data} session={session}/>


            </div>
          </div>
        </div>
      </div>
  )
}

export default page