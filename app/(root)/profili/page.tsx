import React from 'react'
import { redirect } from 'next/navigation';
import MyProfileData from '@/components/MyProfileData';
import { auth } from '@/auth';
import AnonimityToggle from '@/components/AnonimityToggle';
import { Metadata } from 'next';
import Image from 'next/image';
import { toast } from 'sonner';
import ShowToasterInCaseFromPasswordReset from '@/components/ShotToasterInCaseFromPasswordReset';


export async function generateMetadata(): Promise<Metadata>{
    const session = await auth();
    if(!session){
        return {
            title: 'Profili - ShprehPakenaqësinë',
            description: 'Kyçuni për të parë profilin tuaj',
            robots: {
                index: false,
                follow: true
            }
        };
    }else{
        return {
          title: `${session?.user.fullName} | ShprehPakenaqësinë`,
          robots: {
            index: false,
            follow: true
          }
        }
    }
}

const page = async ({searchParams}: {searchParams: Promise<{redirected?: string}>}) => {
    const session = await auth();
    const {redirected} = await searchParams;
    if(!session){
        redirect('/kycuni?from=profili')
    }
    
  return (
    <>
    <div className="min-h-screen bg-white">
        <div className="w-full max-w-6xl mx-auto py-10 max-[640px]:pt-8! px-4 sm:px-6 lg:px-8 text-center shadow-lg rounded-b-2xl">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 leading-tight w-fit mx-auto relative tracking-tight">Profili <span className='text-indigo-600'>Juaj</span>
                <Image
                    src={'/social-page.gif'}
                    width={40}
                    height={40}
                    alt='complaint'
                    quality={50}
                    className='size-10 absolute -top-7 -right-9 rotate-[30deg]'
                />
            </h1>
            <p className='text-gray-600 text-center max-[420px]:text-sm'>Këtu mund të gjeni të gjitha ankesat/raportimet, kontribimet apo të dhëna tuaja personale</p>
        </div>
        <div className="max-w-6xl relative mx-auto px-4 sm:px-6 lg:px-8 py-8 ">
            <AnonimityToggle session={session}/>
            <div className="p-6 sm:p-8">
                <div className="flex flex-row max-[900px]:flex-col items-center gap-6">
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
                    <div className="flex items-center max-[900px]:justify-center gap-2">
                        <h2 className="text-2xl max-[500px]:text-xl font-bold text-gray-900 max-[900px]:text-center">{session.user.fullName}</h2>
                    </div>
                    <p className="text-gray-600 mb-2 max-[900px]:text-center">{session.user.email}</p>
                    <p className="text-gray-500 text-sm max-[900px]:text-center">Anëtar që nga {new Date(session.user.createdAt).toLocaleDateString('sq-al', {day: "2-digit", month: "short", year: "numeric"})}</p>
                    </div>

                    <div className="flex gap-6 max-[450px]:gap-3 max-[420px]:flex-wrap justify-center">
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
                        <p className="text-gray-500 text-sm">Kontribimet</p>
                    </div>
                    </div>
                </div>
            </div>
            <MyProfileData session={session}/>
        </div>
    </div>
    <ShowToasterInCaseFromPasswordReset fromResetPassword={redirected ? true : false}/>
    </>
  )
}

export default page