import AllCompaniesCard from '@/components/AllCompaniesCard';
import React from 'react'

const page = async () => {
  return (
    <div>
      <main className="flex-1">
          <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-lg">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Te gjithe <span className="text-indigo-600">Kompanite</span></h1>
            <p className="text-gray-600 text-sm text-center">Ketu mund te gjeni dhe te nderveproni me te gjithe kompanite e shtuara deri me tani.</p>
          </div>
          <AllCompaniesCard/>
      </main>
    </div>
  )
}

export default page