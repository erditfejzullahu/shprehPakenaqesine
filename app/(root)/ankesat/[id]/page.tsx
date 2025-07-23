import ComplaintActionsCard from '@/components/ComplaintActionsCard';
import ComplaintsPageTabs from '@/components/ComplaintsPageTabs';
import { ComplaintPerIdWithCompany, ComplantPerIdInterface } from '@/types/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'
import { auth } from '../../../../auth';
import { cookies } from 'next/headers';
import { ImageIcon } from 'lucide-react';
import { FaFileAudio, FaFileVideo, FaImage } from 'react-icons/fa';
import { Metadata } from 'next';

export const revalidate = 300;

export async function getStaticParams() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/complaints/ids`, {next: {revalidate: revalidate}, method: "GET"})
  if(!res.ok){
    throw new Error("Error fetching ids")
  }
  const ids: {id: string}[] = await res.json()
  return ids.map((complaint) => ({
    id: complaint.id
  }))
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shprehpakenaqesine.com';

  try {
    const response = await fetch(
      `${baseUrl}/api/complaint/${params.id}`,
      { next: { revalidate: 3600 } }
    );

    // Fallback metadata if API fails
    if (!response.ok) {
      return {
        title: 'Ankesa - ShprehPakenaqësinë',
        description: 'Lexo dhe ndaj ankesa rreth kompanive në platformën tonë. Shprehu për përvojën tënde.',
        keywords: ['ankesa', 'kompani', 'shqipëri', 'kosovë', 'raportim', 'shërbime', 'puna'],
        openGraph: {
          title: 'Ankesa - ShprehPakenaqësinë',
          description: 'Platforma për shprehjen e ankesave ndaj kompanive në Shqipëri dhe Kosovë',
        },
        twitter: {
          card: 'summary_large_image',
        },
      };
    }

    const {complaint}: ComplantPerIdInterface = await response.json();
    
    // Generate SEO metadata
    const seoTitle = `${complaint.title} - Ankesë ndaj ${complaint.company.name} | ShprehPakenaqësinë`;
    const seoDescription = complaint.description
      ? `${complaint.description.substring(0, 160)}...`
      : `Lexo ankesën rreth ${complaint.company.name}. Shprehu dhe ndaj përvojën tënde.`;
    
    // Get first available image (from evidence, company, or user)
    const complaintImage = complaint.company.logoUrl

    const keywords = [
      complaint.title?.toLowerCase(),
      'ankesa',
      complaint.company.name?.toLowerCase(),
      complaint.municipality?.toLowerCase(),
      complaint.category?.toLowerCase(),
      'shqipëri',
      'kosovë',
      'raportim kompanie',
      'shërbime',
      'puna',
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
        images: [{
          url: complaintImage,
          alt: `${complaint.title} - Ankesë ndaj ${complaint.company.name}`,
        }],
        publishedTime: new Date(complaint.createdAt).toISOString(),
        modifiedTime: new Date(complaint.updatedAt).toISOString(),
      },
      twitter: {
        card: 'summary_large_image',
        title: seoTitle,
        description: seoDescription,
        images: [complaintImage],
      },
      other: {
        'complaint:status': complaint.resolvedStatus,
        'complaint:category': complaint.category,
        'complaint:votes': complaint.upVotes?.toString(),
      },
    };
  } catch (error) {
    console.error('Gabim në marrjen e të dhënave të ankesës:', error);
    return {
      title: 'Ankesa - ShprehPakenaqësinë',
      description: 'Lexo dhe ndaj ankesa rreth kompanive në platformën tonë',
      openGraph: {
        title: 'Ankesa - ShprehPakenaqësinë',
        description: 'Platforma për shprehjen e ankesave ndaj kompanive',
      },
    };
  }
}

const page = async ({params}: {params: Promise<{id: string}>}) => {
    const session = await auth()  
    const {id} = await params;
    const cookieStore = (await cookies()).toString();
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/complaint/${id}`, {
      method: "GET",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieStore
      }
    })
    if(!response.ok){
      throw new Error("Dicka shkoi gabim. Ju lutem provoni perseri!")
    }
    
    const data: ComplantPerIdInterface = await response.json();

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
              className="flex items-center text-indigo-600 hover:text-indigo-800 mb-2 shadow-lg p-2 w-fit"
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
                  {(data.complaint.attachments.length > 0 || 
                    data.complaint.audiosAttached?.length > 0 || 
                    data.complaint.videosAttached?.length > 0) && (
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Bashkngjitjet/provat</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {/* Documents */}
                        {data.complaint.attachments.map((file, index) => (
                          <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/${file}`} aria-description='attachment' target='_blank' key={`attch-${index}`} className="shadow-md p-3 flex items-center cursor-pointer hover:bg-gray-100">
                            {file.includes('application/pdf') || 
                            file.includes('application/msword') || 
                            file.includes('vnd.openxmlformats-officedocument.wordprocessingml.document') || 
                            file.includes('vnd.ms-excel') || 
                            file.includes('vnd.openxmlformats-officedocument.spreadsheetml.sheet') || 
                            file.includes('vnd.ms-powerpoint') || 
                            file.includes('vnd.openxmlformats-officedocument.presentationml.presentation') ? (
                              <svg className="w-8 h-8 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                              </svg>
                            ) : (
                              <FaImage className='text-gray-400 w-8 h-8 mr-2'/>
                            )}
                            <div className="truncate">
                              <p className="text-sm font-medium text-gray-900 truncate">Imazhe/Dokumente</p>
                              <p className="text-xs text-gray-500">Klikoni per hapje</p>
                            </div>
                          </Link>
                        ))}

                        {/* Videos */}
                        {data.complaint.videosAttached?.map((file, index) => (
                          <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/${file}`} aria-description='attachment' target='_blank' key={`video-${index}`} className="shadow-md p-3 flex items-center">
                            <FaFileVideo className='text-gray-400 w-8 h-8 mr-2' />
                            <div className="truncate">
                              <p className="text-sm font-medium text-gray-900 truncate">Video/Inqizime</p>
                              <p className="text-xs text-gray-500">Klikoni per hapje</p>
                            </div>
                          </Link>
                        ))}

                        {/* Audios */}
                        {data.complaint.audiosAttached?.map((file, index) => (
                          <Link href={`${process.env.NEXT_PUBLIC_BASE_URL}/${file}`} aria-description='attachment' target='_blank' key={`audio-${index}`} className="shadow-md p-3 flex items-center">
                            <FaFileAudio className='text-gray-400 w-8 h-8 mr-2' />
                            <div className="truncate">
                              <p className="text-sm font-medium text-gray-900 truncate">Audio/Inqizime</p>
                              <p className="text-xs text-gray-500">Klikoni per hapje</p>
                            </div>
                          </Link>
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