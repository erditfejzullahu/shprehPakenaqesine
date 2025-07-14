"use client"
import { useState } from 'react';
import Head from 'next/head';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import CTAButton from '@/components/CTAButton';

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState('myComplaints');
  const [user, setUser] = useState({
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    avatar: '/default-avatar.png',
    joinDate: 'January 2023',
    reputation: 245,
    complaintsCount: 17,
    contributionsCount: 42,
    verified: true
  });

  const complaints = [
    { id: 1, title: 'Unpaid overtime at TechCorp', company: 'TechCorp', date: '2023-05-15', upvotes: 24, status: 'resolved' },
    { id: 2, title: 'Discrimination at RetailPlus', company: 'RetailPlus', date: '2023-07-22', upvotes: 56, status: 'investigating' },
    { id: 3, title: 'Safety hazards at BuildRight', company: 'BuildRight', date: '2023-09-10', upvotes: 12, status: 'pending' },
  ];

  const contributions = [
    { id: 1, title: 'Added evidence to TechCorp case', date: '2023-06-01', upvotes: 8 },
    { id: 2, title: 'Organized community action', date: '2023-08-15', upvotes: 34 },
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-lg">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">Profili</h1>
            <p className='text-gray-600 text-center'>Ketu mund te gjeni te gjitha ankesat/raportimet, kontribimet apo te dhena tuaja personale</p>
        </div>

        {/* Profile Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 shadow-lg">
          {/* Profile Card */}
          <div className="bg-white shadow-md overflow-hidden mb-8">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative">
                  <img 
                    className="w-24 h-24 rounded-full border-4 border-indigo-100 object-cover" 
                    src={user.avatar} 
                    alt={`${user.name}'s avatar`}
                  />
                  {user.verified && (
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1">
                      <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  </div>
                  <p className="text-gray-600 mb-2">{user.email}</p>
                  <p className="text-gray-500 text-sm">Member since {user.joinDate}</p>
                </div>

                <div className="flex gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">{user.reputation}</p>
                    <p className="text-gray-500 text-sm">Reputation</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">{user.complaintsCount}</p>
                    <p className="text-gray-500 text-sm">Complaints</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-indigo-600">{user.contributionsCount}</p>
                    <p className="text-gray-500 text-sm">Contributions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('myComplaints')}
                className={`whitespace-nowrap cursor-pointer py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'myComplaints' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                My Complaints
              </button>
              <button
                onClick={() => setActiveTab('contributions')}
                className={`whitespace-nowrap py-4 cursor-pointer px-1 border-b-2 font-medium text-sm ${activeTab === 'contributions' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Community Contributions
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`whitespace-nowrap py-4 cursor-pointer px-1 border-b-2 font-medium text-sm ${activeTab === 'settings' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
              >
                Settings
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white shadow-md overflow-hidden">
            {activeTab === 'myComplaints' && (
              <div className="divide-y divide-gray-200">
                {complaints.length > 0 ? (
                  complaints.map((complaint) => (
                    <div key={complaint.id} className="p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{complaint.title}</h3>
                          <p className="text-gray-600 mt-1">
                            Against <span className="font-medium">{complaint.company}</span> • {new Date(complaint.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            complaint.status === 'resolved' ? 'bg-green-100 text-green-800' :
                            complaint.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {complaint.status}
                          </span>
                          <span className="flex items-center text-gray-500">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            {complaint.upvotes}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center cursor-pointer">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No complaints yet</h3>
                    <p className="mt-1 text-gray-500">Get started by filing your first complaint against a company.</p>
                    <div className="mt-6">
                      <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        File a Complaint
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'contributions' && (
              <div className="divide-y divide-gray-200 cursor-pointer">
                {contributions.length > 0 ? (
                  contributions.map((contribution) => (
                    <div key={contribution.id} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{contribution.title}</h3>
                          <p className="text-gray-600 mt-1">
                            {new Date(contribution.date).toLocaleDateString()}
                          </p>
                        </div>
                        <span className="flex items-center text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          {contribution.upvotes}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No contributions yet</h3>
                    <p className="mt-1 text-gray-500">Help the community by contributing to existing complaints.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">Account Settings</h3>
                <div className="mt-6 space-y-6">
                  <div>
                    <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Emri
                    </Label>
                    <Input
                      type="text"
                      id="name"
                      defaultValue={user.name}
                      className="shadow-md"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      defaultValue={user.email}
                      className="shadow-md"
                    />
                  </div>

                  <div className="pt-2">
                    <CTAButton
                      type="button"
                      primary
                      text='Ruaj ndryshimet'
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;