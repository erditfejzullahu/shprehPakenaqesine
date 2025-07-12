import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
      <main className="flex-1">
        <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">Modal i Verifikimit</h1>
        </div>
        <div className="max-w-6xl mx-auto py-6">
          <h2 className="text-xl font-semibold mt-2">Procesi i Verifikimit</h2>
          <ul>
            <li>Çdo ankesë kontrollohet manualisht nga administratorët.</li>
            <li>Administratorët bëjnë të pamundurën që të identifikojnë përmbajtje të paligjshme ose materiale që cenojnë të drejtat e të tjerëve.</li>
            <li>Materialet që përmbajnë audio/video private pa pëlqim nuk publikohen.</li>
            <li>Çdo provë e dyshimtë pezullohet deri në sqarim ose verifikim ligjor.</li>
            <li>Refuzimet dokumentohen dhe justifikohen.</li>
          </ul>

          <h2 className="text-xl font-semibold mt-2">Kufizimi i Përgjegjësisë</h2>
          <p className="font-light">Megjithë kujdesin maksimal nga ana e administratorëve, <strong className="font-semibold">ShfaqPakenaqesine</strong> nuk mban përgjegjësi për asnjë përmbajtje të paraqitur nga përdoruesit, nëse ajo arrin të publikohet gabimisht ose përmes mashtrimit nga ana e përdoruesit.</p>
          <p className="font-light">Sipas Termave të Përdorimit, përgjegjësia ligjore për të gjitha materialet, përmbajtjet dhe deklaratat bie plotësisht mbi vetë përdoruesin që i ka krijuar ose ngarkuar ato.</p>

          <h2 className="text-xl font-semibold mt-2">Pagesa për Ankesat</h2>
          <p className="font-light">Ankesat për çështje të përgjithshme, si ankesa komunale, shqetësime për zhurmë apo prishje të rendit në qytet, janë falas për përdoruesit.</p>
          <p className="font-light">Nëse përdoruesi dëshiron që ankesa të trajtohet si <em>urgjente</em> ose për të paraqitur ankesa më të thella, kërkohet një shumë simbolike prej <strong className="font-semibold">3 euro</strong> per ankesë, apo <strong className="font-semibold">5 euro</strong> per muaj.</p>
          <p className="font-light">Pagesa nuk kryhet përmes platformës ShfaqPakenaqesine, por bëhet në mënyrë online përmes Bankës Kombëtare Tregtare (BKT).</p>
          <p className="font-light">Për më shumë informacion rreth pagesave, përdoruesit mund të kontaktojnë në: <a href="mailto:shfaqpakenaqesine@gmail.com">shfaqpakenaqesine@gmail.com</a>.</p>

          <h2 className="text-xl font-semibold mt-2">Kontakt</h2>
          <p className="font-light">Pyetje? <Link aria-describedby='contact us' className="text-indigo-600" href="mailto:shfaqpakenaqesine@gmail.com">shfaqpakenaqesine@gmail.com</Link></p>
        </div>
      </main>
    </div>
  )
}

export default page