import CompanysQuery from '@/components/CompanysQuery'
import ComplaintsQuery from '@/components/ComplaintsQuery'
import CTAButton from '@/components/CTAButton'
import FeatureCard from '@/components/FeatureCard'
import SubscriberForm from '@/components/SubscriberForm'
import { MUNICIPALITY_IMAGES } from '@/data/municipalities'
import { Metadata } from 'next'
import Image from 'next/image'
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

const getDiamondPosition = (index: number, spacing = 96) => { // Increased from 80 to 96 to account for rotation
  if (index === 0) return { top: 0, right: 0 }; // Center

  let ring = 1;
  while (index > ring * 4) {
    index -= ring * 4;
    ring++;
  }

  const side = Math.floor((index - 1) / ring); // 0: top, 1: right, 2: bottom, 3: left
  const offset = (index - 1) % ring;

  switch (side) {
    case 0: return { top: -ring * spacing + offset * spacing, right: offset * spacing };
    case 1: return { top: offset * spacing, right: ring * spacing - offset * spacing };
    case 2: return { top: ring * spacing - offset * spacing, right: -offset * spacing };
    case 3: return { top: -offset * spacing, right: -ring * spacing + offset * spacing };
    default: return { top: 0, right: 0 };
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
        <section className="w-full max-w-6xl mx-auto max-[640px]:pt-10! py-16 px-4 sm:px-6 lg:px-8 text-center shadow-lg relative overflow-hidden">
          <Image 
            src={"/output-1.webp"}
            alt='lines'
            width={800}
            height={800}
            className='w-full object-cover -z-50 opacity-5 h-full top-0 left-0 absolute'
          />
          {MUNICIPALITY_IMAGES.map((item, index) => {
            const { top, right } = getDiamondPosition(index, 96);
            return (
                <div 
                    key={item.municipality} 
                    style={{
                        top: top, 
                        right: right,
                        transformOrigin: "center"
                    }} 
                    className={`absolute flex items-center justify-center size-20 -z-50 shadow-xl  bg-gradient-to-br from-red-400 via-black rounded-md opacity-[4%] to-indigo-600 `}
                >
                    <Image 
                        src={item.image}
                        className='size-14 rounded-sm'
                        alt={item.municipality}
                        width={56}
                        height={56}
                    />
                </div>
            )
          }
          )}

          <h1 className="text-[32px] uppercase sm:text-5xl md:text-6xl max-[376px]:text-[30px]! max-[355px]:text-[28px]! max-[333px]:text-[26px]! font-bold leading-tight tracking-tighter">
            Bashkë për të drejtat <br className="hidden sm:block"/> e <span className="text-indigo-600">komunitetit</span>
          </h1>
          <p className="mt-6 sm:text-xl text-base max-[420px]:text-sm!  text-gray-600 max-w-3xl mx-auto">
            Platformë <span className='text-indigo-600'>anonime</span> dhe e <span className='text-indigo-600'>sigurt</span> për të raportuar padrejtësi nga punëdhënësit dhe për të paraqitur ankesa ndaj komunës për shërbime publike.
          </p>
          <p className="text-xs text-gray-400 mx-auto mt-3 max-w-xl">Ketu do shfaqen pakenaqesite e medha apo raportimet e shumta nga indivite te ndryshem per nje punedhenes ose komune!</p>
          <div className="mt-8 flex sm:flex-row flex-wrap gap-4 justify-center">
            <Link aria-description='krijo raportimin' href={'/krijo-raportim'} className='max-[390px]:w-full!'>
              <CTAButton text="Raporto Tani" classNames='border-2 border-indigo-600 max-[390px]:w-full!' primary />
            </Link>
            <Link aria-description='meso me shume' href={'/si-funksjonon'} className='max-[390px]:w-full!'>
              <CTAButton classNames='max-[390px]:w-full!' text="Meso me shume" />
            </Link>
          </div>
          <Link href={"/shto-kompani"} className="bottom-0 absolute rounded-tl-lg px-4 right-0 flex flex-row items-center gap-2 shadow-xl border-t p-2 bg-gray-50 hover:bg-gray-200 transition-colors">
          Shto kompani
          <FaPlusSquare size={24} color='#4f46e5'/>
          </Link>
        </section>

        <section className="w-full max-w-6xl mx-auto py-16 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="flex  max-[685px]:flex-col max-[685px]:items-start flex-row items-end justify-between gap-4 mb-8">
            <div className="space-y-2 relative">
              <h2 className="md:text-3xl text-2xl font-bold text-gray-900 tracking-tight">
                Kompanitë
              </h2>
              <Image 
                src={'/underline-1.webp'}
                alt='underline'
                width={700}
                height={700}
                className='w-full -z-50 opacity-5 absolute -top-4 indigo-mask'
              />
              <p className="text-gray-600 max-w-md text-base max-[420px]:text-sm">
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


        <section className="w-full max-w-6xl text-indigo-900 mx-auto py-16 pb-12 sm:pb-16 md:pb-20 px-4 sm:px-6 lg:px-8">
          <div className="flex relative max-[685px]:flex-col max-[685px]:items-start flex-row items-end justify-between gap-4 mb-8">
              <Image 
                src={'/underline-1.webp'}
                alt='underline'
                width={700}
                height={700}
                className='w-fit -z-50 rotate-[175deg] opacity-5 absolute -top-2 right-0 indigo-mask'
              />
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                Ankesat/Raportimet
              </h2>
              <p className="text-gray-600 max-w-md text-base max-[420px]:text-sm">
                  Raportoni padrejtësi në punë ose paraqisni ankesa praktike ndaj komunës, thjesht dhe sigurt.
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
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Pse ne?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon="lock.png" 
              title="Konfidencionalitet" 
              description={<>Ankesat tuaja te thjeshta mund te mbeten totalisht anonime. Shikoni <Link className="text-indigo-600" href={"termat-e-perdorimit"}>Termat e Perdorimit</Link></>}
            />
            <FeatureCard 
              icon="star.png" 
              title="Shtrirje e larte" 
              description="Arrini tek një rrjet i gjerë për të maksimizuar ndikimin e raportimeve tuaja." 
            />
            <FeatureCard 
              icon="success.png" 
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