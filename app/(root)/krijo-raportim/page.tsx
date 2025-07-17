import CreateComplaintForm from '@/components/CreateComplaintForm'
import Link from 'next/link'
import React from 'react'
import { FaPlusSquare } from 'react-icons/fa'

const page = async () => {
  return (
    <>
    <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-lg relative">
      <Link href={"/shto-kompani"} className="top-0 absolute right-0 flex flex-row items-center gap-1 shadow-lg p-2 bg-gray-50 border-t hover:bg-gray-200 transition-colors">
        Shto kompani
        <FaPlusSquare size={24} color='#4f46e5'/>
      </Link>
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Krijo <span className="text-indigo-600">Ankesen</span></h1>
      <p className='text-gray-600'>Sigurohuni qe para raportimit te jeni ne dijeni dhe ne perputhje me <Link className="text-indigo-600" href="/termat-e-perdorimit">Termat e Perdorimit</Link> dhe <Link className="text-indigo-600" href={'verifikimi'}>Procesin e Verifikimit</Link></p>
    </div>

    <CreateComplaintForm />
    </>
  )
}

export default page