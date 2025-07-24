import Link from 'next/link'
import { Metadata } from 'next'
import Image from 'next/image';

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shfaqpakenaqesine.com';

  return {
    title: 'Udhëzime për Pagesë - ShfaqPakenaqësinë',
    description: 'Informacion për opsionet e pagesës për trajtim të shpejtë të ankesave në platformën ShfaqPakenaqësinë',
    keywords: [
      'pagesa ankesash',
      'udhëzime pagese',
      'trajtim i shpejtë ankesash',
      'abonim platformë',
      'shfaq pakenaqësinë',
      'ankesa urgjente'
    ],
    openGraph: {
      title: 'Udhëzime për Pagesë - ShfaqPakenaqësinë',
      description: 'Si të bëni pagesën për trajtim të shpejtë të ankesave tuaja',
      type: 'article',
      locale: 'sq_AL',
      url: `${baseUrl}/cmimore`,
      siteName: 'ShfaqPakenaqësinë',
      images: [{
        url: `${baseUrl}/images/payment-og.jpg`,
        width: 1200,
        height: 630,
        alt: 'Udhëzime për Pagesë - ShfaqPakenaqësinë',
      }],
    },
    alternates: {
      canonical: `${baseUrl}/cmimore`,
    },
  };
}

const PaymentInstructionsPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Udhëzime për Pagesë",
    "description": "Informacion për opsionet e pagesës në platformën ShfaqPakenaqësinë",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/cmimore`,
    "publisher": {
      "@type": "Organization",
      "name": "ShfaqPakenaqësinë",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`
      }
    },
    "mainEntity": {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Cilat janë opsionet e pagesës?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "3 euro për ankesë të vetme urgjente ose 5 euro për abonim mujor me ankesa të pakufizuara."
          }
        },
        {
          "@type": "Question",
          "name": "Si mund të bëj pagesën?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Pagesa bëhet online përmes Bankës Kombëtare Tregtare (BKT). Kontaktoni në shfaqpakenaqesine@gmail.com për detaje."
          }
        },
        {
          "@type": "Question",
          "name": "A mund të fshihet një ankesë e paguar?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Po, nëse ankesa shkel rregullat e platformës ose ligjet në fuqi, ajo mund të fshihet edhe pas pagesës."
          }
        }
      ]
    },
    "inLanguage": "sq"
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <main className="flex-1">
        <div className="w-full rounded-b-2xl max-w-6xl mx-auto py-10 max-[640px]:pt-8! px-4 sm:px-6 lg:px-8 text-center shadow-lg">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight relative w-fit mx-auto">Udhëzime për <span className='text-indigo-600'>Pagesë</span> <Image src={'/pin.png'} alt='pin' width={30} height={30} className='size-8 absolute -top-8 mx-auto -right-8 max-[425px]:right-0'/></h1>
        </div>
        <div className="max-w-6xl mx-auto py-6 px-4">
          <p className="font-light"><strong className='font-semibold'>ShfaqPakenaqesine</strong> ofron mundësi pagesash për trajtim më të shpejtë dhe më të thellë të ankesave tuaja.</p>
          
          <h2 className="text-lg font-semibold mt-2">Opsionet e Pagesës</h2>
          <ul className='text-sm'>
            <li><strong className='font-semibold'>3 euro për ankesë:</strong> Për ankesa që dëshironi të trajtohen si <em>urgjente</em> ose më të thella, ku kërkohet vëmendje shtesë.</li>
            <li><strong className='font-semibold'>5 euro për muaj:</strong> Abonim mujor që ju lejon të paraqisni ankesa të pakufizuara gjatë periudhës së abonimit.</li>
          </ul>

          <h2 className="text-lg font-semibold mt-2">Si Bëhet Pagesa</h2>
          <p className="font-light">Pagesa kryhet online përmes Bankës Kombëtare Tregtare (BKT) dhe <strong>nuk bëhet përmes platformës ShfaqPakenaqesine</strong>.</p>
          <p className="font-light">Për detaje mbi mënyrën e pagesës dhe informacionin bankar, ju lutemi kontaktoni në adresën tonë të emailit: <Link aria-description='contact us' href="mailto:shfaqpakenaqesine@gmail.com">shfaqpakenaqesine@gmail.com</Link>.</p>

          <h2 className="text-lg font-semibold mt-2">Angazhimi për Trajtim dhe Promovim</h2>
          <p className="font-light">Kur bëni një ankesë me pagesë, <strong>ShfaqPakenaqesine</strong> angazhohet të trajtojë ankesen tuaj më shpejt dhe ta paraqesë disa herë në javë në vende të ndryshme të rrjeteve sociale për t'i dhënë zë shqetësimit tuaj.</p>

          <h2 className="text-lg font-semibold mt-2">Fshirja e Ankesave</h2>
          <p className="font-light">Edhe nëse keni bërë pagesën për trajtim të ankesa, <strong className='font-semibold'>ankesa mund të fshihet ose refuzohet</strong> nga ShfaqPakenaqesine nëse përmban përmbajtje joligjore, materiale që cenojnë privatësinë, apo ndonjë shkelje tjetër ligjore.</p>
          <p className="font-light">Kjo është në përputhje me rregullat tona dhe ligjet në fuqi, dhe është pjesë e procesit të verifikimit dhe moderimit.</p>

          <h2 className="text-lg font-semibold mt-2">Kontakt</h2>
          <p className="font-light">Për pyetje ose ndihmë në lidhje me pagesat, ju lutemi na kontaktoni në: <Link aria-description='contact us' className='text-indigo-600' href="mailto:shfaqpakenaqesine@gmail.com">shfaqpakenaqesine@gmail.com</Link></p>
        </div>
      </main>
    </div>
  )
}

export default PaymentInstructionsPage