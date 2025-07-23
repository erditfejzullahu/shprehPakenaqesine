import CompanysQuery from '@/components/CompanysQuery'
import ComplaintsQuery from '@/components/ComplaintsQuery'
import CTAButton from '@/components/CTAButton'
import FeatureCard from '@/components/FeatureCard'
import SubscriberForm from '@/components/SubscriberForm'
import { Metadata } from 'next'
import Link from 'next/link'
import React from 'react'
import { FaArrowRight, FaChevronDown, FaPlusSquare } from 'react-icons/fa'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shfaqpakenaqesine.com';

  return {
    title: 'ShfaqPakenaqësinë - Platformë për Ankesa të Punës dhe Komunale',
    description: 'Platformë anonime për raportimin e padrejtësive në vendin e punës dhe problemeve komunale. Mbrojtje e të drejtave të qytetarëve dhe punonjësve në Kosovë.',
    keywords: [
      'raportim pune',
      'ankesa komunale',
      'probleme qyteti',
      'të drejta punonjësish',
      'platformë anonime',
      'shqipëri kosovë',
      'shkelje në punë',
      'ankesa publike'
    ],
    openGraph: {
      title: 'ShfaqPakenaqësinë - Zëri i Qytetarëve dhe Punonjësve',
      description: 'Platformë për raportimin e padrejtësive në punë dhe problemeve komunale në mënyrë të sigurt dhe anonime',
      type: 'website',
      locale: 'sq_AL',
      url: baseUrl,
      siteName: 'ShfaqPakenaqësinë',
      images: [{
        url: `${baseUrl}/images/home-og.jpg`,
        width: 1200,
        height: 630,
        alt: 'ShfaqPakenaqësinë - Platformë për Ankesa Publike',
      }],
    },
    alternates: {
      canonical: baseUrl,
    },
  };
}

const page = () => {
  const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "ShfaqPakenaqësinë",
  "url": process.env.NEXT_PUBLIC_BASE_URL,
  "description": "Platformë për raportimin e padrejtësive në punë dhe problemeve komunale",
  "publisher": {
    "@type": "Organization",
    "name": "ShfaqPakenaqësinë",
    "logo": {
      "@type": "ImageObject",
      "url": `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`
    }
  },
  "inLanguage": "sq"
};

const organizationStructuredData = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "ShfaqPakenaqësinë",
  "url": process.env.NEXT_PUBLIC_BASE_URL,
  "logo": `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`,
  "description": "Platformë për mbrojtjen e të drejtave të punonjësve dhe zgjidhjen e problemeve komunale",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "XK"
  },
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "shfaqpakenaqesine@gmail.com",
    "contactType": "customer service",
    "areaServed": "XK",
    "availableLanguage": "Albanian"
  }
};

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
      />
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

        <section className="w-full max-w-6xl mx-auto py-16 pb-20 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Kompanitë
              </h2>
              <p className="text-gray-600 max-w-2xl text-base">
                Eksploroni kompanitë e regjistruara në platformën tonë dhe shikoni vlerësimet e tyre
              </p>
            </div>
            <Link 
              href="/kompanite" 
              aria-description="all companies"
              className="group flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
            >
              <span className="text-indigo-700 font-medium">Shiko të gjitha</span>
              <FaChevronDown className="h-3.5 w-3.5 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          
          <CompanysQuery />
        </section>


        <section className="w-full max-w-6xl mx-auto py-16 pb-20 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-8">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Ankesat/Raportimet
              </h2>
              <p className="text-gray-600 max-w-2xl text-base">
                Eksploroni kompanitë e regjistruara në platformën tonë dhe shikoni vlerësimet e tyre
              </p>
            </div>
            <Link 
              href="/ankesat" 
              aria-description="all companies"
              className="group flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors duration-200"
            >
              <span className="text-indigo-700 font-medium">Shiko të gjitha</span>
              <FaChevronDown className="h-3.5 w-3.5 text-indigo-600 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          
          <ComplaintsQuery />
        </section>


        {/* Features Section */}
        <section className="w-full max-w-6xl mx-auto py-16 pt-6 px-4 sm:px-6 lg:px-8 text-center ">
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