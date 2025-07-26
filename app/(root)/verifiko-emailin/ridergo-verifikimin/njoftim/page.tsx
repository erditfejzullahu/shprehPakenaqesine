import { auth } from '@/auth'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'

const page = async () => {
    const session = await auth();
    if(session) redirect('/');
    const cookieStore = await cookies()
    if(cookieStore.get('email-verification')?.value !== 'resend'){
        redirect('/')
    }
  return (
    <div className='py-10'>
        <div className="max-w-md mx-auto text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold tracking-tight leading-tight mb-4">Emaili u dërgua!</h1>
        <p className="mb-6">Ri-verifikimi i llogarisë tuaj është proceduar me sukses. Ju keni 24 orë për verifikimin e llogarisë tuaj.</p>
        <Link
            href="/kycuni"
            className="px-4 py-2 bg-indigo-700 text-white rounded hover:bg-indigo-900"
        >
            Vazhdo në identifikim
        </Link>
        </div>
    </div>
  )
}

export default page