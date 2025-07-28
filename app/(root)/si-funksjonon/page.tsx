import { Metadata } from 'next';
import Image from 'next/image';
import React from 'react'
import { FaCheck, FaFolder } from 'react-icons/fa'
import { TbHexagonNumber1Filled, TbHexagonNumber2Filled } from "react-icons/tb";

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shfaqpakenaqesine.com';
  
  return {
    title: 'Si Funksionon ShfaqPakenaqësinë - Udhëzues i Plotë',
    description: 'Mësoni si të përdorni platformën tonë për të raportuar kompani dhe të shprehni pakenaqësitë tuaja në mënyrë të sigurt',
    keywords: [
      'si funksionon',
      'udhëzues ShfaqPakenaqësinë',
      'raportim kompanish',
      'si të bëj ankesë',
      'platformë ankesash',
      'shqipëri',
      'kosovë'
    ],
    openGraph: {
      title: 'Si Funksionon ShfaqPakenaqësinë - Udhëzues i Plotë',
      description: 'Mësoni hap pas hapi si të regjistroni kompani dhe të bëni ankesa në platformën tonë',
      type: 'article',
      locale: 'sq_AL',
      url: `${baseUrl}/si-funksionon`,
      siteName: 'ShfaqPakenaqësinë',
      images: [{
        url: `${baseUrl}/images/how-it-works-og.jpg`,
        width: 1200,
        height: 630,
        alt: 'Udhëzues për përdorimin e ShfaqPakenaqësinë',
      }],
    },
    alternates: {
      canonical: `${baseUrl}/si-funksionon`,
    },
  };
}


const page = () => {

    const structuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "Si të përdorni ShfaqPakenaqësinë",
    "description": "Udhëzues hap pas hapi për regjistrimin e kompanive dhe krijimin e ankesave",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Shtimi i Kompanive",
        "text": "Përdoruesit mund të regjistrojnë një kompani të re përmes një formulari të thjeshtë online.",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/shto-kompani`
      },
      {
        "@type": "HowToStep",
        "name": "Shtimi i Ankesave",
        "text": "Pasi një kompani është regjistruar, përdoruesit mund të shtojnë ankesa që lidhen me atë kompani.",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/krijo-ankese`
      },
      {
        "@type": "HowToStep",
        "name": "Kategoritë e Ankesave",
        "text": "Zgjidhni kategorinë që përshkruan më saktë problemin tuaj nga lista e kategorive të disponueshme.",
      },
      {
        "@type": "HowToStep",
        "name": "Privatësia dhe Siguria",
        "text": "Informacioni i raportuar është konfidencial dhe mund të mbeteni anonim nëse dëshironi.",
      }
    ]
  };

  return (
    <div>
        <script
            type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <main className="flex-1">
            <div className="w-full max-w-6xl mx-auto py-10 max-[640px]:pt-8! px-4 sm:px-6 lg:px-8 text-center shadow-lg rounded-b-2xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight hyphens-manual relative w-fit mx-auto">
                  <Image src={'/pin.png'} alt='pin' width={30} height={30} className='size-8 absolute -top-8 mx-auto -right-8 max-[955px]:-right-0'/> Si funksionon{" "}
                  <span className="text-indigo-600">
                    Shpreh&shy;Pakenaqesine
                  </span>
                </h1>
            </div>
            <div className="max-w-6xl mx-auto py-6 px-4">
                <p className='font-light'>Platforma ShfaqPakenaqësinë është ndërtuar për t’i dhënë qytetarëve një mënyrë të thjeshtë, të sigurt dhe transparente për të raportuar shkelje, abuzime apo parregullsi që lidhen me kompani apo institucione të ndryshme.</p>

                <div className="flex flex-row items-center gap-1.5 mt-2">
                    <div className="flex flex-row items-center ">
                        <FaCheck size={24} color='green'/><TbHexagonNumber1Filled size={24} color='#4f46e5'/>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Shtimi i Kompanive</h2>
                    </div>
                </div>
                <ul className="ml-8 list-disc text-black font-medium text-sm">
                <li>Përdoruesit mund të regjistrojnë një kompani të re përmes një formulari të thjeshtë online.</li>
                <li>Formulari kërkon informacione bazë për kompaninë: emrin, adresën, fushën e aktivitetit dhe çdo të dhënë tjetër të nevojshme.</li>
                <li>Çdokush mund të shtojë kompani – nuk ka rëndësi nëse jeni punonjës aktual, ish-punonjës apo një qytetar i interesuar.</li>
                </ul>

                <div className="flex flex-row items-center gap-1.5 mt-2">
                    <div className="flex flex-row items-center ">
                        <FaCheck size={24} color='green'/><TbHexagonNumber2Filled size={24} color='#4f46e5'/>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Shtimi i Ankesave</h2>
                    </div>
                </div>
                <ul className="ml-8 list-disc text-black font-medium text-sm">
                    <li>Pasi një kompani është regjistruar, përdoruesit mund të shtojnë ankesa që lidhen me atë kompani.</li>
                    <li>Ankesa mund të bëhet nga kushdo që ka një arsye të vlefshme – për shembull, një punonjës mund të raportojë ngacmim në vendin e punës, ose një qytetar mund të raportojë ndotje mjedisore apo ndonjë formë tjetër abuzimi.</li>
                    <li>Formulari i ankesës lidhet drejtpërdrejt me kompaninë e përzgjedhur. Ju mund të bëni ankesë për një kompani që e keni shtuar vetë ose për një kompani që e ka shtuar dikush tjetër.</li>
                </ul>

                <div className="flex flex-row items-center gap-1.5 mt-2">
                    <div className="flex flex-row items-center ">
                        <FaFolder size={24} color='#4f46e5'/>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold">Kategoritë e Ankesave</h2>
                    </div>
                </div>
                <p className="font-light">Përdoruesit mund të zgjedhin kategorinë që përshkruan më saktë problemin që duan të raportojnë. Disa nga kategoritë më të zakonshme janë:</p>
                <ul className='text-sm'>
                <li>Ngacmim në vendin e punës</li>
                <li>Diskriminim në vendin e punës</li>
                <li>Shkelje të sigurisë në punë</li>
                <li>Abuzim në vendin e punës</li>
                <li>Vjedhje në kompani</li>
                <li>Keqmenaxhim financiar</li>
                <li>Korrupsion apo ryshfet</li>
                <li>Favorizime apo konflikt interesi</li>
                <li>Parregullsi në prokurim</li>
                <li>Dështime në shërbimet publike</li>
                <li>Abuzim nga forcat e rendit</li>
                <li>Sjellje e pahijshme gjyqësore</li>
                <li>Probleme me administrimin e tokës</li>
                <li>Abuzim në arsim apo korrupsion akademik</li>
                <li>Mashtrim në shëndetësi, abuzim me pacientët</li>
                <li>Krime mjedisore, dëmtim të natyrës apo faunës</li>
                <li>Ndërtim i paligjshëm</li>
                <li>Mashtrim me reklama apo produkt të pasigurt</li>
                <li>Shkelje të privatësisë së të dhënave</li>
                <li>Krim kibernetik apo ngacmim online</li>
                <li>Abuzim ndaj fëmijëve, trafikim njerëzor apo punë e detyruar</li>
                <li>Abuzim në familje</li>
                <li>Dhuna ndaj kafshëve</li>
                <li>Ndotje akustike apo vandalizëm</li>
                <li>Të tjera</li>
                </ul>

                <div className="flex flex-row items-center gap-1.5 mt-2">
                    <div>
                        <h2 className="text-lg font-semibold">⚙️ Si funksionon lidhja mes kompanisë dhe ankesës?</h2>
                    </div>
                </div>
                <ul className='text-sm'>
                <li>Çdo ankesë lidhet me një kompani specifike që ekziston në sistem.</li>
                <li>Kjo e bën më të lehtë për përdoruesit dhe autoritetet që të ndjekin rastet, të verifikojnë burimin dhe të ndërmarrin masa.</li>
                <li>Të gjitha ankesat ruhen në mënyrë të sigurt në platformë dhe janë të qasshme vetëm nga persona të autorizuar, në përputhje me politikat e privatësisë.</li>
                </ul>

                <div className="flex flex-row items-center gap-1.5 mt-2">
                    <div>
                        <h2 className="text-lg font-semibold">🔒 Privatësia dhe Siguria</h2>
                    </div>
                </div>
                <ul className='text-sm'>
                <li>Informacioni i raportuar është konfidencial.</li>
                <li>Përdoruesit mund të zgjedhin të mbeten anonimë nëse dëshirojnë.</li>
                <li>Platforma siguron mbrojtje ndaj çdo përpjekjeje për të identifikuar raportuesin pa lejen e tij.</li>
                </ul>

                <div className="flex flex-row items-center gap-1.5 mt-2">
                    <div>
                        <h2 className="text-lg font-semibold">🎯 Pse të përdorni këtë platformë?</h2>
                    </div>
                </div>
                <ul className='text-sm'>
                <li>Të kontribuoni në përmirësimin e standardeve të punës dhe etikës.</li>
                <li>Të nxisni transparencën dhe llogaritjen e përgjegjësisë.</li>
                <li>Të mbroni të drejtat tuaja dhe të të tjerëve.</li>
                </ul>
            </div>
        </main>
    </div>
  )
}

export default page