import { Metadata } from 'next';
import Link from 'next/link'
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shfaqpakenaqesine.com';

  return {
    title: 'Politika e Privatësisë - ShfaqPakenaqësinë',
    description: 'Politika jonë e privatësisë për mbrojtjen e të dhënave të përdoruesve sipas ligjeve të Republikës së Kosovës',
    keywords: [
      'privatësi shqip',
      'politika e privatësisë',
      'mbrojtja e të dhënave',
      'shfaq pakenaqësinë',
      'ligjet e privatësisë kosovë',
      'siguria e të dhënave'
    ],
    openGraph: {
      title: 'Politika e Privatësisë - ShfaqPakenaqësinë',
      description: 'Si mbrojmë të dhënat tuaja sipas ligjeve të Republikës së Kosovës',
      type: 'article',
      locale: 'sq_AL',
      url: `${baseUrl}/privatësia`,
      siteName: 'ShfaqPakenaqësinë',
      images: [{
        url: `${baseUrl}/images/privacy-og.jpg`,
        width: 1200,
        height: 630,
        alt: 'Politika e Privatësisë - ShfaqPakenaqësinë',
      }],
    },
    alternates: {
      canonical: `${baseUrl}/privatësia`,
    },
  };
}

const page = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "PrivacyPolicy",
    "name": "Politika e Privatësisë",
    "description": "Politika e privatësisë për platformën ShfaqPakenaqësinë sipas ligjeve të Republikës së Kosovës",
    "datePublished": "2025-07-23",
    "dateModified": "2025-07-23",
    "publisher": {
      "@type": "Organization",
      "name": "ShfaqPakenaqësinë",
      "url": process.env.NEXT_PUBLIC_BASE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`
      }
    },
    "jurisdiction": {
      "@type": "AdministrativeArea",
      "name": "Republic of Kosovo",
      "identifier": "XK"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_BASE_URL}/privatësia`
    },
    "about": {
      "@type": "Thing",
      "name": "Data Protection"
    }
  };
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="flex-1">
        <div className="w-full max-w-6xl mx-auto py-10 max-[640px]:pt-8! px-4 sm:px-6 lg:px-8 text-center shadow-xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">Politika e Privatesise</h1>
        </div>
        <div className="max-w-6xl mx-auto py-6 px-4">
          <p className="font-light"><strong className="font-semibold">ShfaqPakenaqesine</strong> angazhohet të mbrojë privatësinë dhe të dhënat e përdoruesve sipas ligjeve në fuqi në Republikën e Kosovës.</p>

          <h2 className="text-lg font-semibold mt-2">Çfarë të dhënash mblidhen</h2>
          <p className="font-light">Mblidhen vetëm të dhënat që përdoruesi ofron vetë gjatë paraqitjes së një ankese, nderveprimi apo krijimi te llogarise: përshkrimi, dokumente, foto, audio/video, adresa e protokollit të internetit, agjenti shfletuesit ose të dhëna kontakti nëse jepen me dëshirë.</p>

          <h2 className="text-lg font-semibold mt-2">Qëllimi i përdorimit</h2>
          <p className="font-light">Të dhënat përdoren vetëm për verifikim, trajtim të ankesës dhe komunikim eventual me autoritetet kompetente, në përputhje me ligjin.</p>

          <h2 className="text-lg font-semibold mt-2">Ruajtja</h2>
          <p className="font-light">Të dhënat ruhen të sigurta dhe nuk publikohen pa verifikim. Çdo publikim bëhet vetëm nëse lejohet nga ligji dhe pas vlerësimit nga administratorët.</p>

          <h2 className="text-lg font-semibold mt-2">Shpërndarja</h2>
          <p className="font-light">ShfaqPakenaqesine nuk i shpërndan të dhënat tek palë të treta pa pëlqim ose bazë ligjore.</p>

          <h2 className="text-lg font-semibold mt-2">Detyrimi i Përdoruesit</h2>
          <p className="font-light">Përdoruesi është përgjegjës për vërtetësinë dhe ligjshmërinë e çdo të dhëne të ngarkuar. Platforma nuk mban përgjegjësi për pasoja ligjore të shkaktuara nga përdoruesi.</p>

          <h2 className="text-lg font-semibold mt-2">Kontakt</h2>
          <p className="font-light">Për çdo kërkesë për qasje, përmirësim ose fshirje të të dhënave: <Link aria-description='contact us' className="text-indigo-600" href="mailto:shfaqpakenaqesine@gmail.com">shfaqpakenaqesine@gmail.com</Link></p>
        </div>
      </main>
    </div>
  )
}

export default page