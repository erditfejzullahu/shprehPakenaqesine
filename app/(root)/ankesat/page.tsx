import AllComplaintsCard from '@/components/AllComplaintsCard'
import React from 'react'

const page = () => {
  return (
    <div>
      <main className="flex-1">
          <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-lg">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Te gjithe <span className="text-indigo-600">Ankesat</span></h1>
            <p className="text-gray-600 text-sm text-center">Ketu mund te gjeni dhe te nderveproni me te gjithe ankesat e krijuara deri me tani.</p>
          </div>
          <AllComplaintsCard />
      </main>
    </div>
  )
}

export default page