import CompanysQuery from '@/components/CompanysQuery'
import ComplaintsQuery from '@/components/ComplaintsQuery'
import CTAButton from '@/components/CTAButton'
import FeatureCard from '@/components/FeatureCard'
import SubscriberForm from '@/components/SubscriberForm'
import Link from 'next/link'
import React from 'react'
import { FaArrowRight, FaChevronDown, FaPlusSquare } from 'react-icons/fa'

const page = () => {
  return (
    <div>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center shadow-lg relative">
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
          <Link href={"/shto-kompani"} className="bottom-0 absolute rounded-tl-lg px-4 right-0 flex flex-row items-center gap-2 shadow-xl border-t p-2 bg-gray-50 hover:bg-gray-200 transition-colors">
          Shto kompani
          <FaPlusSquare size={24} color='#4f46e5'/>
          </Link>
        </section>

        <section className="w-full max-w-6xl mx-auto py-16 pb-20 sm:px-6 lg:px-8 text-center ">
          <div className="flex flex-row items-end gap-2 mb-2 justify-between">
            <h2 className="text-3xl font-bold text-gray-800 border-b-2 w-fit border-indigo-600">Kompanite</h2>
            <Link aria-description='all companies' href={'/kompanite'} className="text-indigo-600 group hover:font-semibold transition-all font-medium flex flex-row items-end">Te gjithe kompanite <FaChevronDown className='group-hover:size-5 rotate-[40deg]' /></Link>
          </div>
            <CompanysQuery />
        </section>


        <section className="w-full max-w-6xl mx-auto py-16 pb-8 px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex flex-row items-end gap-2 mb-3 justify-between">
            <h2 className="text-3xl font-bold text-gray-800 border-b-2 w-fit border-indigo-600">Ankesat</h2>
            <Link href={'/ankesat'} aria-description='all complaints' className="text-indigo-600 group hover:font-semibold transition-all font-medium flex flex-row items-end">Te gjithe ankesat <FaChevronDown className='group-hover:size-5 rotate-[40deg]' /></Link>
          </div>
          <div>
            <ComplaintsQuery />
          </div>
        </section>


        {/* Features Section */}
        <section className="w-full max-w-6xl mx-auto py-16 px-4 sm:px-6 lg:px-8 text-center ">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Pse ne?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon="🔒" 
              title="Konfidencionalitet" 
              description={<>Ankesat tuaja te thjeshta mund te mbeten totalisht anonime. Shikoni <Link className="text-indigo-600" href={"termat-e-perdorimit"}>Termat e Perdorimit</Link></>}
            />
            <FeatureCard 
              icon="✨" 
              title="Shtrirje e larte" 
              description="Arrini tek një rrjet i gjerë për të maksimizuar ndikimin e raportimeve tuaja." 
            />
            <FeatureCard 
              icon="🚀" 
              title="Arritje qellimi" 
              description="Ndihmoni në ndërtimin e një ambienti pune më të drejtë dhe transparent." 
            />
          </div>
        </section>

        <section>
          <SubscriberForm />
        </section>
      </main>
    </div>
  )
}

export default page