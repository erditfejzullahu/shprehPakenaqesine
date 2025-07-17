"use client"
import { ComplantPerIdInterface } from '@/types/types'
import React, { memo, useState } from 'react'

type ActiveTab = "details" | "contributions" | "discussion"

const ComplaintsPageTabs = ({complaintsData}: {complaintsData: ComplantPerIdInterface}) => {
    const [activeTab, setActiveTab] = useState<ActiveTab>("details")
  return (
    <>
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
            Contributions ({complaintsData.complaint.contributions.length || 0})
            </button>
            <button
            onClick={() => setActiveTab('discussion')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'discussion' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
            Discussion
            </button>
        </nav>
        </div>

        {activeTab === 'details' && (
        <div className="bg-white shadow-lg overflow-hidden p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Detaje shtese</h3>
            <p className="text-gray-600">Nuk ka detaje shtese.</p>
        </div>
        )}

        {activeTab === 'contributions' && (
        <div className="bg-white  shadow-lg overflow-hidden">
            {complaintsData.complaint.contributions?.length > 0 ? (
            <div className="divide-y divide-gray-200">
                {complaintsData.complaint.contributions.map((contribution, index) => (
                    (contribution.user ? (
                        <div key={index} className="p-6 hover:bg-gray-50 transition-colors duration-150">
                            <div className="flex items-start gap-3">
                            <div className="flex-shrink-0">
                                <img 
                                className="h-10 w-10 rounded-full bg-gray-200" 
                                src={contribution.user.userProfileImage} 
                                alt={`${contribution.user.fullName}'s avatar`}
                                />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                <h4 className="text-sm font-medium text-gray-900">
                                    {contribution.user.fullName}
                                </h4>
                                <span className="text-xs text-gray-500">@{contribution.user.username}</span>
                                <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                                    Rep: {contribution.user.reputation}
                                </span>
                                </div>
                                <p className="mt-1 text-sm text-gray-600">Ka kontribuar ne kete ankese/raportim</p>
                            </div>
                            </div>
                        </div>
                    ) : (
                        <div>Kontribouesi eshte Anonim!</div>
                    ))
                ))}
            </div>
            ) : (
            <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Nuk ka kontribuime ende.</h3>
                <p className="mt-1 text-gray-500">Behu i pari te kontribuosh ne kete ankese/raportim.</p>
            </div>
            )}
        </div>
        )}

        {activeTab === 'discussion' && (
        <div className="bg-white shadow-lg overflow-hidden p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Diskutime</h3>
            <p className="text-gray-600">Se shpejti.</p>
        </div>
        )}
    </>
  )
}

export default memo(ComplaintsPageTabs)