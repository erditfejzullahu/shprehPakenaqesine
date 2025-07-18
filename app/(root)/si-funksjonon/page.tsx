import React from 'react'
import { FaCheck, FaFolder } from 'react-icons/fa'
import { TbHexagonNumber1Filled, TbHexagonNumber2Filled } from "react-icons/tb";

const page = () => {
  return (
    <div>
        <main className="flex-1">
            <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">📌 Si funksionon <span className="text-indigo-600">ShprehPakenaqesine?</span></h1>
            </div>
            <div className="max-w-6xl mx-auto py-6">
                <p className='font-light'>Aplikacioni ynë web është ndërtuar për t’i dhënë qytetarëve një mënyrë të thjeshtë, të sigurt dhe transparente për të raportuar shkelje, abuzime apo parregullsi që lidhen me kompani apo institucione të ndryshme.</p>

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