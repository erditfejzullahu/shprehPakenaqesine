import Link from 'next/link'
import React from 'react'
import { Metadata } from 'next'
import Image from 'next/image';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shfaqpakenaqesine.com';

  return {
    title: 'Modal i Verifikimit - ShfaqPakenaqësinë',
    description: 'Informacion i detajuar për procesin e verifikimit të ankesave në platformën ShfaqPakenaqësinë, kufizimet e përgjegjësisë dhe opsionet e pagesës',
    keywords: [
      'verifikim ankesash',
      'shfaq pakenaqësinë',
      'proces ankesash',
      'rregulla platformë',
      'ankesa online kosovë',
      'siguria e të dhënave'
    ],
    openGraph: {
      title: 'Modal i Verifikimit - ShfaqPakenaqësinë',
      description: 'Procesi i verifikimit të ankesave dhe kufizimet e përgjegjësisë në platformën tonë',
      type: 'article',
      locale: 'sq_AL',
      url: `${baseUrl}/verifikimi`,
      siteName: 'ShfaqPakenaqësinë',
      images: [{
        url: `${baseUrl}/images/verification-og.jpg`,
        width: 1200,
        height: 630,
        alt: 'Procesi i Verifikimit - ShfaqPakenaqësinë',
      }],
    },
    alternates: {
      canonical: `${baseUrl}/verifikimi`,
    },
  };
}

  
const page = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Modal i Verifikimit",
    "description": "Procesi i verifikimit të ankesave dhe kufizimet e përgjegjësisë në platformën ShfaqPakenaqësinë",
    "publisher": {
      "@type": "Organization",
      "name": "ShfaqPakenaqësinë",
      "url": process.env.NEXT_PUBLIC_BASE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`
      }
    },
    "datePublished": "2025-07-23",
    "dateModified": "2025-07-23",
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Si funksionon procesi i verifikimit?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Çdo ankesë kontrollohet manualisht nga administratorët. Ata identifikojnë përmbajtje të paligjshme ose materiale që cenojnë të drejtat e të tjerëve."
          }
        },
        {
          "@type": "Question",
          "name": "Çfarë lloj ankesash janë të paguara?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Ankesat për çështje të përgjithshme janë falas. Për trajtim të urgjencës ose ankesa më të thella, kërkohet pagesë prej 3€ për ankesë ose 5€ në muaj."
          }
        },
        {
          "@type": "Question",
          "name": "Ku mund të kontaktoni për pyetje?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Për çdo pyetje mund të dërgoni email në shfaqpakenaqesine@gmail.com"
          }
        }
      ]
    }
  };
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="flex-1">
        <div className="w-full rounded-b-2xl max-w-6xl mx-auto py-10 max-[640px]:pt-8! px-4 sm:px-6 lg:px-8 text-center shadow-lg">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight relative  tracking-tight w-fit mx-auto">Modal i <span className='text-indigo-600'>Verifikimit</span>
            <Image src={'/pin.png'} alt='pin' width={30} height={30} className='size-8 absolute -top-8 mx-auto -right-8 max-[355px]:right-0'/>
          </h1>
        </div>
        <div className="max-w-6xl mx-auto py-6 px-4">
          <h2 className="text-lg font-semibold mt-2">Procesi i Verifikimit</h2>
          <ul className='text-sm'>
            <li>Çdo ankesë kontrollohet manualisht nga administratorët.</li>
            <li>Administratorët bëjnë të pamundurën që të identifikojnë përmbajtje të paligjshme ose materiale që cenojnë të drejtat e të tjerëve.</li>
            <li>Materialet që përmbajnë audio/video private pa pëlqim nuk publikohen.</li>
            <li>Çdo provë e dyshimtë pezullohet deri në sqarim ose verifikim ligjor.</li>
            <li>Refuzimet dokumentohen dhe justifikohen.</li>
          </ul>

          <h2 className="text-lg font-semibold mt-2">Kufizimi i Përgjegjësisë</h2>
          <p className="font-light">Megjithë kujdesin maksimal nga ana e administratorëve, <strong className="font-semibold">ShfaqPakenaqesine</strong> nuk mban përgjegjësi për asnjë përmbajtje të paraqitur nga përdoruesit, nëse ajo arrin të publikohet gabimisht ose përmes mashtrimit nga ana e përdoruesit.</p>
          <p className="font-light">Sipas Termave të Përdorimit, përgjegjësia ligjore për të gjitha materialet, përmbajtjet dhe deklaratat bie plotësisht mbi vetë përdoruesin që i ka krijuar ose ngarkuar ato.</p>

          <h2 className="text-lg font-semibold mt-2">Pagesa për Ankesat</h2>
          <p className="font-light">Ankesat për çështje të përgjithshme, si ankesa komunale, shqetësime për zhurmë apo prishje të rendit në qytet, janë falas për përdoruesit.</p>
          <p className="font-light">Nëse përdoruesi dëshiron që ankesa të trajtohet si <em>urgjente</em> ose për të paraqitur ankesa më të thella, kërkohet një shumë simbolike prej <strong className="font-semibold">3 euro</strong> per ankesë, apo <strong className="font-semibold">5 euro</strong> per muaj.</p>
          <p className="font-light">Pagesa nuk kryhet përmes platformës ShfaqPakenaqesine, por bëhet në mënyrë online përmes Bankës Kombëtare Tregtare (BKT).</p>
          <p className="font-light">Për më shumë informacion rreth pagesave, përdoruesit mund të kontaktojnë në: <a href="mailto:shfaqpakenaqesine@gmail.com">shfaqpakenaqesine@gmail.com</a>.</p>

          <h2 className="text-lg font-semibold mt-2">Kontakt</h2>
          <p className="font-light">Pyetje? <Link aria-description='contact us' className="text-indigo-600" href="mailto:shfaqpakenaqesine@gmail.com">shfaqpakenaqesine@gmail.com</Link></p>
        </div>
      </main>
    </div>
  )
}

export default page