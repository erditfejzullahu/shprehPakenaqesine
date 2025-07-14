import CreateCompanyForm from '@/components/CreateCompanyForm'
import Link from 'next/link'
import React from 'react'
import { FaPlusSquare } from 'react-icons/fa'

const page = async () => {
  return (
    <>
    <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-lg relative">
      <Link href={"/krijo-raportim"} className="top-0 absolute right-0 flex flex-row items-center gap-1 shadow-lg p-2 bg-gray-50 border-b hover:bg-gray-200 transition-colors">
        Krijo Ankese
        <FaPlusSquare size={24} color='#4f46e5'/>
      </Link>
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">Krijo <span className="text-indigo-600">Kompani</span></h1>
      <p className='text-gray-600'>Ketu mund te shtoni kompanine per te cilen mund te krijoni ankese ju apo perdoruesit e tjere te platformes <span className="text-indigo-600">ShprehPakenaqesine</span></p>
    </div>
    <CreateCompanyForm />
    </>
  )
}

export default page