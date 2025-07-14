"use client"
import Head from 'next/head';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const ComplaintDetails = () => {
  const router = useRouter();
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  // Mock data - replace with real data from your API
  const mockComplaint = {
    id: '1',
    title: 'Unpaid overtime at TechCorp',
    description: 'For the past 6 months, management has required all employees to work at least 10 hours of unpaid overtime each week. When confronted, they threatened termination.',
    status: 'PENDING',
    resolvedStatus: 'PENDING',
    category: 'ABUZIMI_NE_VENDIN_E_PUNES',
    upVotes: 24,
    createdAt: '2023-05-15T14:32:00Z',
    updatedAt: '2023-05-20T09:15:00Z',
    attachments: ['document1.pdf', 'screenshot1.png'],
    audiosAttached: [],
    videosAttached: ['evidence.mp4'],
    company: {
      id: '1',
      name: 'TechCorp',
      logoUrl: '/techcorp-logo.png',
      industry: 'Technology',
      website: 'https://techcorp.example.com'
    },
    user: {
      id: '1',
      fullName: 'Anonymous',
      username: 'anon123',
      reputation: 145,
      anonimity: true
    },
    contributions: [
      {
        userId: '2',
        user: {
          fullName: 'Jane Doe',
          username: 'janedoe',
          reputation: 89,
          anonimity: false
        }
      }
    ]
  };

  // Use this in production instead of mock data
  const complaintData = mockComplaint;

  const handleUpvote = async () => {
    if (hasUpvoted) return;
    
    setIsUpvoting(true);
    try {
      // In a real app, you'd call your API endpoint here
      // await fetch(`/api/complaints/${complaintData.id}/upvote`, {
      //   method: 'POST'
      // });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUpvoteCount(prev => prev + 1);
      setHasUpvoted(true);
    } catch (error) {
      console.error('Failed to upvote:', error);
    } finally {
      setIsUpvoting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: any = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getCategoryLabel = (category: string) => {
    // Convert enum value to readable label
    const words = category.split('_').map(word => {
      if (word === 'NE') return 'në';
      return word.charAt(0) + word.slice(1).toLowerCase();
    });
    return words.join(' ');
  };

  return (
    <>
      <Head>
        <title>{complaintData.title} | Community Complaints</title>
        <meta name="description" content={`Complaint details: ${complaintData.title}`} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <button 
              onClick={() => router.back()}
              className="flex items-center text-indigo-600 hover:text-indigo-800 mb-2"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to complaints
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{complaintData.title}</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Complaint Content */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <div className="p-6 sm:p-8">
                  {/* Status Badges */}
                  <div className="flex gap-3 mb-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      complaintData.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      complaintData.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {complaintData.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      complaintData.resolvedStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      complaintData.resolvedStatus === 'RESOLVED' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {complaintData.resolvedStatus}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getCategoryLabel(complaintData.category)}
                    </span>
                  </div>

                  {/* Complaint Description */}
                  <div className="prose max-w-none text-gray-700 mb-8">
                    <p className="whitespace-pre-line">{complaintData.description}</p>
                  </div>

                  {/* Attachments */}
                  {(complaintData.attachments?.length > 0 || 
                    complaintData.audiosAttached?.length > 0 || 
                    complaintData.videosAttached?.length > 0) && (
                    <div className="mb-8">
                      <h3 className="text-lg font-medium text-gray-900 mb-3">Attachments</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {/* Documents */}
                        {complaintData.attachments?.map((file, index) => (
                          <div key={`doc-${index}`} className="border rounded-lg p-3 flex items-center">
                            <svg className="w-8 h-8 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                            </svg>
                            <div className="truncate">
                              <p className="text-sm font-medium text-gray-900 truncate">{file}</p>
                              <p className="text-xs text-gray-500">Document</p>
                            </div>
                          </div>
                        ))}

                        {/* Videos */}
                        {complaintData.videosAttached?.map((file, index) => (
                          <div key={`video-${index}`} className="border rounded-lg p-3 flex items-center">
                            <svg className="w-8 h-8 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                            <div className="truncate">
                              <p className="text-sm font-medium text-gray-900 truncate">{file}</p>
                              <p className="text-xs text-gray-500">Video</p>
                            </div>
                          </div>
                        ))}

                        {/* Audios */}
                        {complaintData.audiosAttached?.map((file, index) => (
                          <div key={`audio-${index}`} className="border rounded-lg p-3 flex items-center">
                            <svg className="w-8 h-8 text-gray-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                            </svg>
                            <div className="truncate">
                              <p className="text-sm font-medium text-gray-900 truncate">{file}</p>
                              <p className="text-xs text-gray-500">Audio</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dates */}
                  <div className="text-sm text-gray-500">
                    <p>Posted on: {formatDate(complaintData.createdAt)}</p>
                    {complaintData.updatedAt !== complaintData.createdAt && (
                      <p>Last updated: {formatDate(complaintData.updatedAt)}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Details
                  </button>
                  <button
                    onClick={() => setActiveTab('contributions')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'contributions' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Contributions ({complaintData.contributions?.length || 0})
                  </button>
                  <button
                    onClick={() => setActiveTab('discussion')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'discussion' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Discussion
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'details' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>
                  <p className="text-gray-600">No additional details provided.</p>
                </div>
              )}

              {activeTab === 'contributions' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {complaintData.contributions?.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {complaintData.contributions.map((contribution, index) => (
                        <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                              <img 
                                className="h-10 w-10 rounded-full bg-gray-200" 
                                src={contribution.user.anonimity ? '/default-avatar.png' : "asdasd"} 
                                alt={`${contribution.user.fullName}'s avatar`}
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {contribution.user.anonimity ? 'Anonymous' : contribution.user.fullName}
                                </h4>
                                <span className="text-xs text-gray-500">@{contribution.user.username}</span>
                                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                                  Rep: {contribution.user.reputation}
                                </span>
                              </div>
                              <p className="mt-1 text-sm text-gray-600">Contributed to this complaint</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No contributions yet</h3>
                      <p className="mt-1 text-gray-500">Be the first to contribute to this complaint.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'discussion' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Discussion</h3>
                  <p className="text-gray-600">Discussion feature coming soon.</p>
                </div>
              )}
            </div>

            {/* Right Column - Sidebar */}
            <div className="lg:w-1/3 space-y-6">
              {/* Company Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <img 
                      src={complaintData.company.logoUrl} 
                      alt={`${complaintData.company.name} logo`} 
                      className="h-12 w-12 rounded-md object-contain"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">{complaintData.company.name}</h4>
                      <p className="text-sm text-gray-500">{complaintData.company.industry}</p>
                    </div>
                  </div>
                  {complaintData.company.website && (
                    <a 
                      href={complaintData.company.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
                    >
                      Visit website
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Author Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Complaint Author</h3>
                  <div className="flex items-center gap-4">
                    <img 
                      src="/default-avatar.png" 
                      alt={`${complaintData.user.fullName}'s avatar`} 
                      className="h-12 w-12 rounded-full"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {complaintData.user.anonimity ? 'Anonymous' : complaintData.user.fullName}
                      </h4>
                      <p className="text-sm text-gray-500">@{complaintData.user.username}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm">
                      <p className="text-gray-500">Reputation</p>
                      <p className="font-medium text-gray-900">{complaintData.user.reputation}</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-500">Complaints</p>
                      <p className="font-medium text-gray-900">5</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Actions</h3>
                  <button
                    onClick={handleUpvote}
                    disabled={isUpvoting || hasUpvoted}
                    className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${hasUpvoted ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-3`}
                  >
                    {isUpvoting ? (
                      'Processing...'
                    ) : hasUpvoted ? (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Upvoted
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        Upvote ({upvoteCount})
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-3"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Contribute
                  </button>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                    Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default ComplaintDetails;