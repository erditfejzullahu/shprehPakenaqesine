import CreateComplaintForm from '@/components/CreateComplaintForm'
import Link from 'next/link'
import React from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

const page = async () => {
  const session = await getServerSession()
  if(!session){
    redirect("/kycuni")
  }
  return (
    <>
    <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-xl">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">Krijo <span className="text-indigo-600">Ankesen</span></h1>
      <p className='text-gray-600'>Sigurohuni qe para raportimit te jeni ne dijeni dhe ne perputhje me <Link className="text-indigo-600" href="/termat-e-perdorimit">Termat e Perdorimit</Link> dhe <Link className="text-indigo-600" href={'verifikimi'}>Procesin e Verifikimit</Link></p>
    </div>

    <CreateComplaintForm />
    </>
  )
}

export default page