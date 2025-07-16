import React from 'react'
import { redirect } from 'next/navigation';
import MyProfileData from '@/components/MyProfileData';
import { auth } from '@/auth';

const page = async () => {
    const session = await auth();
    console.log(session);
    
    if(!session){
        redirect('/kycuni?from=profili')
    }
  return (
    <div className="min-h-screen bg-gray-50">
        <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-lg">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Profili</h1>
            <p className='text-gray-600 text-center'>Ketu mund te gjeni te gjitha ankesat/raportimet, kontribimet apo te dhena tuaja personale</p>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 shadow-lg">
            <div className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="relative">
                    <img 
                        className="w-24 h-24 rounded-full border-4 border-indigo-100 object-cover" 
                        src={session.user.userProfileImage} 
                        alt={`Imazhi i ${session.user.username}`}
                    />
                    {session.user && (
                        <div className="absolute bottom-0 right-0 bg-white rounded-full p-1">
                        <svg className="w-6 h-6 text-indigo-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        </div>
                    )}
                    </div>

                    <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-2xl font-bold text-gray-900">{session.user.fullName}</h2>
                    </div>
                    <p className="text-gray-600 mb-2">{session.user.email}</p>
                    <p className="text-gray-500 text-sm">Anetar qe nga {new Date(session.user.createdAt).toLocaleDateString('sq-al', {day: "2-digit", month: "short", year: "numeric"})}</p>
                    </div>

                    <div className="flex gap-6">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-600">{session.user.reputation}</p>
                        <p className="text-gray-500 text-sm">Reputacioni</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-600">{session.user.complaints}</p>
                        <p className="text-gray-500 text-sm">Ankesat/Raportimet</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-600">{session.user.contributions}</p>
                        <p className="text-gray-500 text-sm">Kontribuimet</p>
                    </div>
                    </div>
                </div>
            </div>
            <MyProfileData session={session}/>
        </div>
    </div>
  )
}

export default page