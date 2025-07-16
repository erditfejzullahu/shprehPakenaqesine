import { auth } from '@/auth'
import LoginForm from '@/components/LoginForm'
import { redirect } from 'next/navigation';
import React from 'react'

const page = async () => {
  const session = await auth();
  console.log(session);
  if(session){
    redirect('/profili')
  }
  
  return (
    <div>
        <section className="flex-1">
            <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">Kycuni</h1>
                <p className='text-gray-600'>Behuni pjese e <span className="text-indigo-600">ShfaqPakenaqesine</span> per nje ambient me te mire dhe me te sigurte per te gjithe shoqerine</p>
            </div>
            <LoginForm />
        </section>
    </div>
  )
}

export default page