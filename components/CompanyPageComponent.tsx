"use client"
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { useState } from 'react';
import { CompanyPerIdInterface } from '@/types/types';

const CompanyPage = ({companyData}: {companyData: CompanyPerIdInterface}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [sortOption, setSortOption] = useState('newest');

  // // Mock data - replace with real data from your API
  // const mockCompany = {
  //   id: '1',
  //   name: 'TechCorp',
  //   description: 'A leading technology company specializing in software development and cloud solutions.',
  //   logoUrl: '/techcorp-logo.png',
  //   address: '123 Tech Street, San Francisco, CA 94107',
  //   website: 'https://techcorp.example.com',
  //   email: 'info@techcorp.example.com',
  //   phone: '+1 (555) 123-4567',
  //   images: ['office1.jpg', 'office2.jpg', 'team.jpg'],
  //   industry: 'Technology',
  //   foundedYear: '2010',
  //   createdAt: '2020-05-15T14:32:00Z',
  //   updatedAt: '2023-05-20T09:15:00Z',
  //   complaints: [
  //     {
  //       id: '1',
  //       title: 'Unpaid overtime',
  //       description: 'Employees required to work unpaid overtime regularly.',
  //       status: 'ACCEPTED',
  //       category: 'ABUZIMI_NE_VENDIN_E_PUNES',
  //       upVotes: 24,
  //       createdAt: '2023-05-15T14:32:00Z'
  //     },
  //     {
  //       id: '2',
  //       title: 'Gender discrimination',
  //       description: 'Unequal pay and promotion opportunities for female employees.',
  //       status: 'PENDING',
  //       category: 'DISKRIMIMI_NE_VENDIN_E_PUNES',
  //       upVotes: 56,
  //       createdAt: '2023-07-22T09:15:00Z'
  //     }
  //   ]
  // };

  // // Use this in production instead of mock data
  // const companyData = mockCompany;

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

  const sortedComplaints = [...companyData.company.complaints].sort((a, b) => {
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
      <div className="lg:w-2/3">
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Vështrim i përgjithshëm
                  </button>
                  <button
                    onClick={() => setActiveTab('complaints')}
                    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'complaints' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                  >
                    Ankesat/Raportimet ({companyData.company.complaints.length})
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              {activeTab === 'overview' && (
                <div className="bg-white shadow-md overflow-hidden p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">About {companyData.company.name}</h3>
                  {companyData.company.description ? (
                    <p className="text-gray-700">{companyData.company.description}</p>
                  ) : (
                    <p className="text-gray-500">Nuk ka informacion shtesë në dispozicion.</p>
                  )}

                  <div className="mt-8">
                    <h4 className="text-md font-medium text-gray-900 mb-3">Statistika te shpejta</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-gray-50 shadow-md p-4 text-center">
                        <p className="text-2xl font-bold text-indigo-600">{companyData.company.complaints.length}</p>
                        <p className="text-sm text-gray-500">Te gjitha ankesat</p>
                      </div>
                      <div className="bg-gray-50 shadow-md p-4 text-center">
                        <p className="text-2xl font-bold text-indigo-600">
                          {companyData.company.complaints.filter(c => c.status === 'ACCEPTED').length}
                        </p>
                        <p className="text-sm text-gray-500">Ankesat e verifikuara</p>
                      </div>
                      <div className="bg-gray-50 shadow-md p-4 text-center">
                        <p className="text-2xl font-bold text-indigo-600">
                          {companyData.complaintsPerMonth}
                        </p>
                        <p className="text-sm text-gray-500">Ankesa per muaj</p>
                      </div>
                      <div className="bg-gray-50 shadow-md p-4 text-center">
                        <p className="text-2xl font-bold text-indigo-600">
                          {companyData.company.complaints.reduce((sum, c) => sum + c.upVotes, 0)}
                        </p>
                        <p className="text-sm text-gray-500">Te gjitha votat</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'complaints' && (
                <div className="bg-white shadow-md overflow-hidden">
                  {/* Sort Options */}
                  <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Ankesat/Raportimet</h3>
                    <div className="flex items-center">
                      <label htmlFor="sort" className="mr-2 text-sm text-gray-500">Rendit sipas:</label>
                      <select
                        id="sort"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="border-gray-300 shadow-sm px-2 focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                      >
                        <option value="newest">Me te rejat</option>
                        <option value="oldest">Me te vjetrat</option>
                        <option value="popular">Me se shumti vota</option>
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
                          Paraqitur më {new Date(complaint.createdAt).toLocaleDateString('sq-AL', {day: "2-digit", month: "short", year: "numeric"})}
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
            </div>
    </>
  );
};


export default CompanyPage;