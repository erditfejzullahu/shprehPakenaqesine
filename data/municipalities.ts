import { Municipality } from "@/app/generated/prisma"

const PRISHTINA = [
  {
    "name": "Zyra e Kryetarit",
    "email": null
  },
  {
    "name": "Zyra e Nënkryetarit (Florian Dushi)",
    "email": "florian.dushi@rks-gov.net"
  },
  {
    "name": "Zyra e Nënkryetarit (Shkëmb Manaj)",
    "email": "shkemb.manaj@rks-gov.net"
  },
  {
    "name": "Zyra e Kryesuesit",
    "email": "fehmi.kupina@rks-gov.net"
  },
  {
    "name": "Zyra për Marrëdhënie me Publikun",
    "email": "arlinda.kastrati@rks-gov.net"
  },
  {
    "name": "Zyra për Marrëdhënie me Publikun (Media)",
    "email": "mediapr@rks-gov.net"
  },
  {
    "name": "Drejtoria e Administratës",
    "email": "valbona.ajeti@rks-gov.net"
  },
  {
    "name": "Drejtoria e Urbanizmit, Ndërtimit dhe Mbrojtjes së Mjedisit",
    "email": "florent.maliqi@rks-gov.net"
  },
  {
    "name": "Drejtoria e Kadastrit",
    "email": "vigan.kastrati@rks-gov.net"
  },
  {
    "name": "Drejtoria e Shërbimeve Publike",
    "email": "bekim.brestovci@rks-gov.net"
  },
  {
    "name": "Drejtoria e Planifikimit Strategjik",
    "email": "arber.sadiki@rks-gov.net"
  },
  {
    "name": "Drejtoria e Investimeve Kapitale dhe Menaxhimit të Kontratave",
    "email": "sokol.havolli@rks-gov.net"
  },
  {
    "name": "Drejtoria e Inspeksionit",
    "email": "bekim.brestovci@rks-gov.net"
  },
  {
    "name": "Drejtoria për Financa",
    "email": "valbona.makolli@rks-gov.net"
  },
  {
    "name": "Drejtoria për Pronë",
    "email": "brahim.mehmetaj@rks-gov.net"
  },
  {
    "name": "Drejtoria e Arsimit",
    "email": "samir.shahini@rks-gov.net"
  },
  {
    "name": "Drejtoria e Shëndetësisë",
    "email": "izet.sadiku@rks-gov.net"
  },
  {
    "name": "Drejtoria e Kulturës",
    "email": "sibel.halimi@rks-gov.net"
  },
  {
    "name": "Drejtoria e Bujqësisë",
    "email": "donjeta.dragusha@rks-gov.net"
  },
  {
    "name": "Drejtoria e Mirëqenies Sociale",
    "email": "adelina.sahiti@rks-gov.net"
  },
  {
    "name": "Drejtoria e Parqeve",
    "email": "donika.cetta@rks-gov.net"
  },
  {
    "name": "Drejtoria e Sportit",
    "email": "kushtrim.mushica@rks-gov.net"
  },
  {
    "name": "Drejtoria e Transformimit",
    "email": "gezim.b.kastrati@rks-gov.net"
  },
  {
    "name": "Sektori i Burimeve Njerëzore",
    "email": "fadil.m.aliu@rks-gov.net"
  },
  {
    "name": "Sektori për Integrime Evropiane",
    "email": "ajshe.berveniku@rks-gov.net"
  },
  {
    "name": "Sektori Ligjor",
    "email": "fatos.dibra@rks-gov.net"
  },
  {
    "name": "Sektori i Prokurimit",
    "email": "visar.shehu@rks-gov.net"
  },
  {
    "name": "Sektori për Auditim të Brendshëm",
    "email": "osman.bllaca@rks-gov.net"
  },
  {
    "name": "Sektori për të Drejtat e Njeriut dhe Barazi Gjinore",
    "email": "premtime.preniqi@rks-gov.net"
  },
  {
    "name": "Sektori për Komunitete",
    "email": "betim.avdullahu@rks-gov.net"
  }
]


export const MUNICIPALITY_IMAGES: { municipality: Municipality; image: string; link: string }[] = [
  { municipality: Municipality.DECAN, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_1.png?o=hj", link: "https://decan.rks-gov.net/" },
  { municipality: Municipality.DRAGASH, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_5.png?o=hj", link: "https://dragash.rks-gov.net/" },
  { municipality: Municipality.FERIZAJ, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_25.png", link: "https://ferizaj.rks-gov.net/" },
  { municipality: Municipality.FUSHE_KOSOVE, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_9.png?o=hj", link: "https://fushekosove.rks-gov.net/" },
  { municipality: Municipality.GJAKOVE, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_2.png?o=hj", link: "https://gjakova.rks-gov.net/" },
  { municipality: Municipality.GJILAN, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_4.png?o=hj", link: "https://gjilan.rks-gov.net/" },
  { municipality: Municipality.GLLOGOC, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_3.png?o=hj", link: "https://drenas.rks-gov.net/" },
  { municipality: Municipality.GRACANICE, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_34.png?o=hj", link: "https://gracanice.rks-gov.net/" },
  { municipality: Municipality.HANI_I_ELEZIT, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_33.png?o=hj", link: "https://haniielezit.rks-gov.net/" },
  { municipality: Municipality.ISTOG, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_6.png?o=hj", link: "https://istog.rks-gov.net/" },
  { municipality: Municipality.JUNIK, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_31.png?o=hj", link: "https://junik.rks-gov.net/" },
  { municipality: Municipality.KACANIK, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_7.png?o=hj", link: "https://kacanik.rks-gov.net/" },
  { municipality: Municipality.KAMENICE, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_10.png?o=hj", link: "https://kamenice.rks-gov.net/" },
  { municipality: Municipality.KLINA, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_8.png?o=hj", link: "https://kline.rks-gov.net/" },
  { municipality: Municipality.KLLOKOT, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_37.png?o=hj", link: "https://kllokot.rks-gov.net/" },
  { municipality: Municipality.LEPOSAVIQ, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_12.png?o=hj", link: "https://leposaviq.rks-gov.net/" },
  { municipality: Municipality.LIPJAN, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_13.png?o=hj", link: "https://lipjan.rks-gov.net/" },
  { municipality: Municipality.MALISHEVE, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_30.png?o=hj", link: "https://malisheve.rks-gov.net/" },
  { municipality: Municipality.MITROVICE_JUG, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_11.png?o=hj", link: "https://mitroviceejugut.rks-gov.net/" },
  { municipality: Municipality.MITROVICE_VERI, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_38.png?o=hj", link: "https://mitroviceeveriut.rks-gov.net/" },
  { municipality: Municipality.NOVOBERDE, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_14.png?o=hj", link: "https://novoberde.rks-gov.net/" },
  { municipality: Municipality.OBILIQ, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_15.png?o=hj", link: "https://obiliq.rks-gov.net/" },
  { municipality: Municipality.PARTESH, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_36.png?o=hj", link: "https://partesh.rks-gov.net/" },
  { municipality: Municipality.PEJE, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_17.png?o=hj", link: "https://peja.rks-gov.net/" },
  { municipality: Municipality.PODUJEVE, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_18.png?o=hj", link: "https://podujeve.rks-gov.net/" },
  { municipality: Municipality.PRISHTINE, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_19.png?o=hj", link: "https://prishtina.rks-gov.net/" },
  { municipality: Municipality.PRIZREN, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_20.png?o=hj", link: "https://prizren.rks-gov.net/" },
  { municipality: Municipality.RAHOVEC, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_16.png?o=hj", link: "https://rahovec.rks-gov.net/" },
  { municipality: Municipality.RANILLUG, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_35.png?o=hj", link: "https://ranillug.rks-gov.net/" },
  { municipality: Municipality.SHTERPCE, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_23.png?o=hj", link: "https://shterpce.rks-gov.net/" },
  { municipality: Municipality.SKENDERAJ, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_21.png?o=hj", link: "https://skenderaj.rks-gov.net/" },
  { municipality: Municipality.SUHAREKE, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_24.png?o=hj", link: "https://suhareke.rks-gov.net/" },
  { municipality: Municipality.VITI, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_26.png?o=hj", link: "https://viti.rks-gov.net/" },
  { municipality: Municipality.VUSHTRRI, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_27.png?o=hj", link: "https://vushtrri.rks-gov.net/" },
  { municipality: Municipality.ZUBIN_POTOK, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_28.png?o=hj", link: "https://zubinpotok.rks-gov.net/" },
  { municipality: Municipality.ZVECAN, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_29.png?o=hj", link: "https://zvecan.rks-gov.net/" },
  { municipality: Municipality.SHTIME, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_22.png?o=hj", link: "https://shtime.rks-gov.net/"},
  { municipality: Municipality.MAMUSHE, image: "https://ekosova.rks-gov.net/images/municipalities/Komuna_32.png?o=hj", link: "https://mamushe.rks-gov.net/"}
];