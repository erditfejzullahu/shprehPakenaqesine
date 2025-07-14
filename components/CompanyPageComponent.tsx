"use client"
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { useState } from 'react';

const CompanyPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [sortOption, setSortOption] = useState('newest');

  // Mock data - replace with real data from your API
  const mockCompany = {
    id: '1',
    name: 'TechCorp',
    description: 'A leading technology company specializing in software development and cloud solutions.',
    logoUrl: '/techcorp-logo.png',
    address: '123 Tech Street, San Francisco, CA 94107',
    website: 'https://techcorp.example.com',
    email: 'info@techcorp.example.com',
    phone: '+1 (555) 123-4567',
    images: ['office1.jpg', 'office2.jpg', 'team.jpg'],
    industry: 'Technology',
    foundedYear: '2010',
    createdAt: '2020-05-15T14:32:00Z',
    updatedAt: '2023-05-20T09:15:00Z',
    complaints: [
      {
        id: '1',
        title: 'Unpaid overtime',
        description: 'Employees required to work unpaid overtime regularly.',
        status: 'ACCEPTED',
        category: 'ABUZIMI_NE_VENDIN_E_PUNES',
        upVotes: 24,
        createdAt: '2023-05-15T14:32:00Z'
      },
      {
        id: '2',
        title: 'Gender discrimination',
        description: 'Unequal pay and promotion opportunities for female employees.',
        status: 'PENDING',
        category: 'DISKRIMIMI_NE_VENDIN_E_PUNES',
        upVotes: 56,
        createdAt: '2023-07-22T09:15:00Z'
      }
    ]
  };

  // Use this in production instead of mock data
  const companyData = mockCompany;

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

  const sortedComplaints = [...companyData.complaints].sort((a, b) => {
    if (sortOption === 'newest') {
      return new Date(b.createdAt).getMilliseconds() - new Date(a.createdAt).getMilliseconds();
    } else if (sortOption === 'oldest') {
      return new Date(a.createdAt).getMilliseconds() - new Date(b.createdAt).getMilliseconds();
    } else {
      return b.upVotes - a.upVotes;
    }
  });

  return (
    <>
      <Head>
        <title>{companyData.name} | Community Complaints</title>
        <meta name="description" content={`Company profile: ${companyData.name}`} />
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
              Back
            </button>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img 
                src={companyData.logoUrl} 
                alt={`${companyData.name} logo`} 
                className="w-16 h-16 rounded-md object-contain border border-gray-200"
              />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{companyData.name}</h1>
                <p className="text-gray-600">{companyData.industry}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Company Info */}
            <div className="lg:w-1/3 space-y-6">
              {/* Company Details Card */}
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Company Details</h3>
                  <div className="space-y-4">
                    {companyData.description && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Description</h4>
                        <p className="mt-1 text-sm text-gray-900">{companyData.description}</p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Founded</h4>
                      <p className="mt-1 text-sm text-gray-900">{companyData.foundedYear || 'Unknown'}</p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Address</h4>
                      <p className="mt-1 text-sm text-gray-900">{companyData.address}</p>
                    </div>

                    {companyData.website && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Website</h4>
                        <a 
                          href={companyData.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="mt-1 text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          {companyData.website}
                        </a>
                      </div>
                    )}

                    {companyData.email && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Email</h4>
                        <a 
                          href={`mailto:${companyData.email}`}
                          className="mt-1 text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          {companyData.email}
                        </a>
                      </div>
                    )}

                    {companyData.phone && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Phone</h4>
                        <a 
                          href={`tel:${companyData.phone}`}
                          className="mt-1 text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          {companyData.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Company Images */}
              {companyData.images?.length > 0 && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Images</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {companyData.images.map((image, index) => (
                        <div key={index} className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                          <img 
                            src={image} 
                            alt={`Company image ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Complaints */}
            <div className="lg:w-2/3">
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('complaints')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'complaints' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Complaints ({companyData.complaints.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('statistics')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'statistics' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Statistics
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">About {companyData.name}</h3>
                  {companyData.description ? (
                    <p className="text-gray-700">{companyData.description}</p>
                  ) : (
                    <p className="text-gray-500">No additional information available.</p>
                  )}

                  <div className="mt-8">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Quick Stats</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-indigo-600">{companyData.complaints.length}</p>
                        <p className="text-sm text-gray-500">Total Complaints</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-indigo-600">
                          {companyData.complaints.filter(c => c.status === 'ACCEPTED').length}
                        </p>
                        <p className="text-sm text-gray-500">Verified Complaints</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-indigo-600">
                          {Math.round(companyData.complaints.length / 12 * 10) / 10}
                        </p>
                        <p className="text-sm text-gray-500">Complaints per Month</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-indigo-600">
                          {companyData.complaints.reduce((sum, c) => sum + c.upVotes, 0)}
                        </p>
                        <p className="text-sm text-gray-500">Total Upvotes</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'complaints' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Sort Options */}
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Complaints</h3>
                    <div className="flex items-center">
                      <label htmlFor="sort" className="mr-2 text-sm text-gray-500">Sort by:</label>
                      <select
                        id="sort"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                      >
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                        <option value="popular">Most Upvotes</option>
                      </select>
                    </div>
                  </div>

                  {sortedComplaints.length > 0 ? (
                    <div className="divide-y divide-gray-200">
                      {sortedComplaints.map((complaint) => (
                        <div 
                          key={complaint.id} 
                          className="p-6 hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                          onClick={() => router.push(`/complaints/${complaint.id}`)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">{complaint.title}</h3>
                              <p className="text-gray-600 mt-1 line-clamp-2">{complaint.description}</p>
                              <div className="mt-2 flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  complaint.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {complaint.status}
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  {getCategoryLabel(complaint.category)}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center text-gray-500">
                                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                                </svg>
                                {complaint.upVotes}
                              </span>
                            </div>
                          </div>
                          <p className="mt-3 text-sm text-gray-500">
                            Filed on {formatDate(complaint.createdAt)}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="mt-2 text-lg font-medium text-gray-900">No complaints yet</h3>
                      <p className="mt-1 text-gray-500">Be the first to file a complaint against this company.</p>
                      <div className="mt-6">
                        <button 
                          onClick={() => router.push('/complaints/new')}
                          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          File a Complaint
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'statistics' && (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Complaint Statistics</h3>
                  <p className="text-gray-600">Statistics feature coming soon.</p>
                  {/* Placeholder for charts/graphs */}
                  <div className="mt-6 h-64 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                    Complaint trends and analytics will be displayed here
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


export default CompanyPage;