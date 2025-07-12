import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div className="flex-1">
        <main>
            <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">Termat e Përdorimit</h1>
            </div>
            <div className="max-w-6xl mx-auto py-6">
                <p className="font-light">Mirë se vini në <strong>ShfaqPakenaqesine</strong>. Duke përdorur këtë platformë, ju pajtoheni me kushtet e mëposhtme:</p>

                <h2 className="text-xl font-semibold mt-2">Qëllimi</h2>
                <p className="font-light">ShfaqPakenaqesine është një platformë që u mundëson qytetarëve të paraqesin ankesa ose shqetësime për shkelje ligjore, abuzime ose parregullsi. Platforma funksionon në përputhje me ligjin në Republikën e Kosovës.</p>

                <h2  className="text-xl font-semibold mt-2">Përdorimi i Lejuar</h2>
                <ul>
                    <li>Çdo përdorues mund të paraqesë vetëm përmbajtje që është krijuar nga vetë ai ose për të cilën ka të drejtë ligjore.</li>
                    <li>Ndalohet ngarkimi i materialeve të marra në kundërshtim me ligjin, duke përfshirë incizime të fshehta, të dhëna të palëve të treta pa pëlqim ose materiale që cenojnë privatësinë e të tjerëve.</li>
                </ul>

                <h2 className="text-xl font-semibold mt-2">Përgjegjësia</h2>
                <p className="font-light"><strong className='font-semibold'>ShfaqPakenaqesine nuk mban asnjë përgjegjësi ligjore</strong> për përmbajtjen që publikohet ose dërgohet nga përdoruesit. Çdo përgjegjësi ligjore, penale ose civile, bie plotësisht mbi përdoruesin që krijon, ngarkon ose paraqet materialin.</p>

                <h2 className="text-xl font-semibold mt-2">Moderimi</h2>
                <p className="font-light">ShfaqPakenaqesine ka të drejtë të verifikojë, bllokojë ose fshijë çdo përmbajtje që bie ndesh me ligjin ose me këto terma, pa detyrim njoftimi paraprak.</p>

                <h2 className="text-xl font-semibold mt-2">Zgjidhja e Mosmarrëveshjeve</h2>
                <p className="font-light">Çdo kontestim në lidhje me këta Terma do të trajtohet sipas ligjeve të Republikës së Kosovës.</p>

                <p className="font-light">Për çdo paqartësi na kontaktoni: <Link className='text-indigo-600' aria-describedby='contact-us' href="mailto:shfaqpakenaqesine@gmail.com">shfaqpakenaqesine@gmail.com</Link></p>
            </div>
        </main>
    </div>
  )
}

export default page