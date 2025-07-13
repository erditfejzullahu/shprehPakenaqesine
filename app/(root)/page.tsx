import CompanysQuery from '@/components/CompanysQuery'
import ComplaintsQuery from '@/components/ComplaintsQuery'
import CTAButton from '@/components/CTAButton'
import FeatureCard from '@/components/FeatureCard'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center shadow-xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
            Shpreh pakenaqesine <span className="text-indigo-600">TENDE</span>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Platformë anonime dhe e sigurt për të raportuar padrejtësitë dhe shkeljet nga punëdhënësit, duke mbrojtur të drejtat e punonjësve.
          </p>
          <p className="text-xs text-gray-400 mx-auto mt-3 max-w-xl">Ketu do shfaqen pakenaqesite e medha apo raportimet e shumta nga indivite te ndryshem per nje punedhenes!</p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link aria-description='krijo raportimin' href={'/krijo-raportim'}>
              <CTAButton text="Raporto Tani" classNames='border-2 border-indigo-600' primary />
            </Link>
            <Link aria-description='meso me shume' href={'/si-funksjonon'}>
              <CTAButton text="Meso me shume" />
            </Link>
          </div>
        </section>

        <section className="w-full max-w-6xl mx-auto py-16 pb-20 sm:px-6 lg:px-8 text-center ">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Kompanite</h2>
            <CompanysQuery />
        </section>


        <section className="w-full max-w-6xl mx-auto py-16 pb-8 px-4 sm:px-6 lg:px-8 text-center">
          <h2 className='text-3xl font-bold text-gray-800 mb-6'>Ankesat</h2>
          <div>
            <ComplaintsQuery />
          </div>
        </section>


        {/* Features Section */}
        <section className="w-full max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center ">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Pse ne?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon="🚀" 
              title="Konfidencionalitet" 
              description="Raportimet tuaja mbeten gjithmonë të sigurta dhe plotësisht anonime." 
            />
            <FeatureCard 
              icon="✨" 
              title="Shtrirje e larte" 
              description="Arrini tek një rrjet i gjerë për të maksimizuar ndikimin e raportimeve tuaja." 
            />
            <FeatureCard 
              icon="🔒" 
              title="Arritje qellimi" 
              description="Ndihmoni në ndërtimin e një ambienti pune më të drejtë dhe transparent." 
            />
          </div>
        </section>
      </main>
    </div>
  )
}

export default page