import ContactForm from '@/components/ContactForm'
import React from 'react'

const page = () => {
  return (
    <div>
      <main className="flex-1">
        <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">Na Kontaktoni</h1>
          <p className='text-gray-600'>Ketu mund te na kontaktoni per udhezime perdorimi, heqje/ngarkimi te ankesave ose kompanive etj.</p>
        </div>
        <ContactForm />
      </main>
    </div>
  )
}

export default page