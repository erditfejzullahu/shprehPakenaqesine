import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
      <main className="flex-1">
          <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-lg">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">Udhëzime për Pagesë</h1>
          </div>
          <div className="max-w-6xl mx-auto py-6">
            <p className="font-light"><strong className='font-semibold'>ShfaqPakenaqesine</strong> ofron mundësi pagesash për trajtim më të shpejtë dhe më të thellë të ankesave tuaja.</p>
            <h2 className="text-xl font-semibold mt-2">Opsionet e Pagesës</h2>
            <ul>
              <li><strong className='font-semibold'>3 euro për ankesë:</strong> Për ankesa që dëshironi të trajtohen si <em>urgjente</em> ose më të thella, ku kërkohet vëmendje shtesë.</li>
              <li><strong className='font-semibold'>5 euro për muaj:</strong> Abonim mujor që ju lejon të paraqisni ankesa të pakufizuara gjatë periudhës së abonimit.</li>
            </ul>

            <h2 className="text-xl font-semibold mt-2">Si Bëhet Pagesa</h2>
            <p className="font-light">Pagesa kryhet online përmes Bankës Kombëtare Tregtare (BKT) dhe <strong>nuk bëhet përmes platformës ShfaqPakenaqesine</strong>.</p>
            <p className="font-light">Për detaje mbi mënyrën e pagesës dhe informacionin bankar, ju lutemi kontaktoni në adresën tonë të emailit: <Link aria-description='contact us' href="mailto:shfaqpakenaqesine@gmail.com">shfaqpakenaqesine@gmail.com</Link>.</p>

            <h2 className="text-xl font-semibold mt-2">Angazhimi për Trajtim dhe Promovim</h2>
            <p className="font-light">Kur bëni një ankesë me pagesë, <strong>ShfaqPakenaqesine</strong> angazhohet të trajtojë ankesen tuaj më shpejt dhe ta paraqesë disa herë në javë në vende të ndryshme të rrjeteve sociale për t’i dhënë zë shqetësimit tuaj.</p>

            <h2 className="text-xl font-semibold mt-2">Fshirja e Ankesave</h2>
            <p className="font-light">Edhe nëse keni bërë pagesën për trajtim të ankesa, <strong className='font-semibold'>ankesa mund të fshihet ose refuzohet</strong> nga ShfaqPakenaqesine nëse përmban përmbajtje joligjore, materiale që cenojnë privatësinë, apo ndonjë shkelje tjetër ligjore.</p>
            <p className="font-light">Kjo është në përputhje me rregullat tona dhe ligjet në fuqi, dhe është pjesë e procesit të verifikimit dhe moderimit.</p>

            <h2 className="text-xl font-semibold mt-2">Kontakt</h2>
            <p className="font-light">Për pyetje ose ndihmë në lidhje me pagesat, ju lutemi na kontaktoni në: <Link aria-description='contact us' className='text-indigo-600' href="mailto:shfaqpakenaqesine@gmail.com">shfaqpakenaqesine@gmail.com</Link></p>
          </div>
      </main>
    </div>
  )
}

export default page