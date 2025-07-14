import CompaniesPage from '@/components/AllCompaniesCard'
import { CompanyInterface } from '@/types/types';
import React from 'react'

const page = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/companies`)
  if(!response.ok){
    throw new Error("Dicka shkoi gabim ne paraqitjen e kompanive")
  }
  const data: CompanyInterface[] = await response.json();
  return (
    <div>
      <main className="flex-1">
          <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-lg">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">Te gjithe <span className="text-indigo-600">Kompanite</span></h1>
            <p className="text-gray-600 text-sm text-center">Ketu mund te gjeni dhe te nderveproni me te gjithe kompanite e shtuara deri me tani.</p>
          </div>
          <CompaniesPage companies={data}/>
      </main>
    </div>
  )
}

export default page