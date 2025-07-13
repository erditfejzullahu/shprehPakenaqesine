import Link from 'next/link'
import React from 'react'

const page = () => {
  return (
    <div>
      <main className="flex-1">
        
        <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">Politika e Privatesise</h1>
        </div>
        <div className="max-w-6xl mx-auto py-6">
          <p className="font-light"><strong className="font-semibold">ShfaqPakenaqesine</strong> angazhohet të mbrojë privatësinë dhe të dhënat e përdoruesve sipas ligjeve në fuqi në Republikën e Kosovës.</p>

          <h2 className="text-xl font-semibold mt-2">Çfarë të dhënash mblidhen</h2>
          <p>Mblidhen vetëm të dhënat që përdoruesi ofron vetë gjatë paraqitjes së një ankese: përshkrimi, dokumente, foto, audio/video ose të dhëna kontakti nëse jepen me dëshirë.</p>

          <h2 className="text-xl font-semibold mt-2">Qëllimi i përdorimit</h2>
          <p>Të dhënat përdoren vetëm për verifikim, trajtim të ankesës dhe komunikim eventual me autoritetet kompetente, në përputhje me ligjin.</p>

          <h2 className="text-xl font-semibold mt-2">Ruajtja</h2>
          <p>Të dhënat ruhen të sigurta dhe nuk publikohen pa verifikim. Çdo publikim bëhet vetëm nëse lejohet nga ligji dhe pas vlerësimit nga administratorët.</p>

          <h2 className="text-xl font-semibold mt-2">Shpërndarja</h2>
          <p>ShfaqPakenaqesine nuk i shpërndan të dhënat tek palë të treta pa pëlqim ose bazë ligjore.</p>

          <h2 className="text-xl font-semibold mt-2">Detyrimi i Përdoruesit</h2>
          <p>Përdoruesi është përgjegjës për vërtetësinë dhe ligjshmërinë e çdo të dhëne të ngarkuar. Platforma nuk mban përgjegjësi për pasoja ligjore të shkaktuara nga përdoruesi.</p>

          <h2 className="text-xl font-semibold mt-2">Kontakt</h2>
          <p>Për çdo kërkesë për qasje, përmirësim ose fshirje të të dhënave: <Link aria-description='contact us' className="text-indigo-600" href="mailto:shfaqpakenaqesine@gmail.com">shfaqpakenaqesine@gmail.com</Link></p>
        </div>
      </main>
    </div>
  )
}

export default page