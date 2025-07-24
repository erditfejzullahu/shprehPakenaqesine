import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shfaqpakenaqesine.com';

return {
title: 'Termat e Përdorimit - ShfaqPakenaqësinë',
description: 'Lexoni kushtet dhe rregullat e përdorimit të platformës ShfaqPakenaqësinë për raportimin e shkeljeve dhe abuzimeve',
keywords: [
  'terma e përdorimit',
  'kushte shërbimi',
  'privatësi shfaqpakenaqësinë',
  'rregulla platformë',
  'ligjërisht kosovë',
  'ankesa online'
],
openGraph: {
  title: 'Termat e Përdorimit - ShfaqPakenaqësinë',
  description: 'Kushtet zyrtare të përdorimit të platformës sonë',
  type: 'article',
  locale: 'sq_AL', // Kosovo locale
  url: `${baseUrl}/termat-e-perdorimit`,
  siteName: 'ShfaqPakenaqësinë',
  images: [{
    url: `${baseUrl}/images/terms-og.jpg`,
    width: 1200,
    height: 630,
    alt: 'Termat e Përdorimit - ShfaqPakenaqësinë',
  }],
},
alternates: {
  canonical: `${baseUrl}/termat-e-perdorimit`,
},
};
}

const page = () => {

    const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Termat e Përdorimit",
    "description": "Kushtet zyrtare të përdorimit të platformës ShfaqPakenaqësinë",
    "publisher": {
      "@type": "Organization",
      "name": "ShfaqPakenaqësinë",
      "url": process.env.NEXT_PUBLIC_BASE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`
      }
    },
    "datePublished": "2025-07-23", // Replace with your actual publication date
    "dateModified": "2025-07-23"   // Replace with last modification date
  };

  return (
    <div className="flex-1">
        <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
        <main>
            <div className="w-full max-w-6xl mx-auto py-10 max-[640px]:pt-8! px-4 sm:px-6 lg:px-8 text-center shadow-xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight relative w-fit mx-auto">Termat e <span className='text-indigo-600'>Përdorimit</span>
                  <Image src={'/pin.png'} alt='pin' width={30} height={30} className='size-8 absolute -top-8 mx-auto -right-8 max-[380px]:right-0'/>
                </h1>
            </div>
            <div className="max-w-6xl mx-auto py-6 px-4">
                <p className="font-light">Mirë se vini në <strong>ShfaqPakenaqesine</strong>. Duke përdorur këtë platformë, ju pajtoheni me kushtet e mëposhtme:</p>

                <h2 className="text-lg font-semibold mt-2">Qëllimi</h2>
                <p className="font-light">ShfaqPakenaqesine është një platformë që u mundëson qytetarëve të paraqesin ankesa ose shqetësime për shkelje ligjore, abuzime ose parregullsi. Platforma funksionon në përputhje me ligjin në Republikën e Kosovës.</p>

                <h2  className="text-lg font-semibold mt-2">Përdorimi i Lejuar</h2>
                <ul className='text-sm'>
                    <li>Çdo përdorues mund të paraqesë vetëm përmbajtje që është krijuar nga vetë ai ose për të cilën ka të drejtë ligjore.</li>
                    <li>Ndalohet ngarkimi i materialeve të marra në kundërshtim me ligjin, duke përfshirë incizime të fshehta, të dhëna të palëve të treta pa pëlqim ose materiale që cenojnë privatësinë e të tjerëve.</li>
                </ul>

                <h2 className="text-lg font-semibold mt-2">Përgjegjësia</h2>
                <p className="font-light"><strong className='font-semibold'>ShfaqPakenaqesine nuk mban asnjë përgjegjësi ligjore</strong> për përmbajtjen që publikohet ose dërgohet nga përdoruesit. Çdo përgjegjësi ligjore, penale ose civile, bie plotësisht mbi përdoruesin që krijon, ngarkon ose paraqet materialin.</p>

                <h2 className="text-lg font-semibold mt-2">Moderimi</h2>
                <p className="font-light">ShfaqPakenaqesine ka të drejtë të verifikojë, bllokojë ose fshijë çdo përmbajtje që bie ndesh me ligjin ose me këto terma, pa detyrim njoftimi paraprak.</p>

                <h2 className="text-lg font-semibold mt-2">Zgjidhja e Mosmarrëveshjeve</h2>
                <p className="font-light">Çdo kontestim në lidhje me këta Terma do të trajtohet sipas ligjeve të Republikës së Kosovës.</p>

                <p className="font-light">Për çdo paqartësi na kontaktoni: <Link className='text-indigo-600' aria-description='contact-us' href="mailto:shfaqpakenaqesine@gmail.com">shfaqpakenaqesine@gmail.com</Link></p>
            </div>
        </main>
    </div>
  )
}

export default page