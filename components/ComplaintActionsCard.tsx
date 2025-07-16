"use client"
import api from '@/lib/api'
import { ComplantPerIdInterface } from '@/types/types'
import { Session } from 'next-auth'
import React, { useState } from 'react'
import { toast } from 'sonner'

const ComplaintActionsCard = ({complaintsData, session}: {complaintsData: ComplantPerIdInterface, session: Session | null}) => {
    
    const [isUpvoting, setIsUpvoting] = useState(false)
    const [upvoteCount, setUpvoteCount] = useState(0)
    const [hasUpvoted, setHasUpvoted] = useState(complaintsData.complaint.hasVoted)

    const handleUpvote = async () => {
        if (!session) return;
        if (hasUpvoted) return;
        
        setIsUpvoting(true);
        try {
          const response = await api.post(`/api/complaintVotes/`, {complaintId: complaintsData.complaint.id, userId: session.user.id})
          if(response.data.success){
            toast.success(response.data.message)
          }
          setUpvoteCount(prev => prev + 1);
          setHasUpvoted(true);
        } catch (error: any) {
          console.error('Failed to upvote:', error);
          toast.error(error.response.data.message)
        } finally {
          setIsUpvoting(false);
        }
      };

  return (
    <div className="bg-white shadow-lg overflow-hidden">
        <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Nderveprime</h3>
            <button
            onClick={handleUpvote}
            disabled={isUpvoting || hasUpvoted}
            className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${hasUpvoted ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-3`}
            >
            {isUpvoting ? (
                'Duke procesuar...'
            ) : hasUpvoted ? (
                <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                E votuar
                </>
            ) : (
                <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                Voto larte ({upvoteCount})
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
            Kontribuo
            </button>
            <button
            type="button"
            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
            Raporto
            </button>
        </div>
        </div>
  )
}

export default ComplaintActionsCard