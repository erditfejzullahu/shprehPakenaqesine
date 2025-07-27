import type { Metadata } from "next";
import "./globals.css";
import { Poppins } from "next/font/google";
import QueryProvider from "@/providers/QueryProvider";
import { Toaster } from "sonner";
import SessionContext from "@/providers/SessionContext";
import { auth } from "../auth";

export const poppins = Poppins({
  variable: "--font-poppins-sans",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap"
});


export const metadata: Metadata = {
  title: "ShfaqPakenaqësinë - Zëri i Qytetarëve dhe Punonjësve",
  description: "ShfaqPakënaqësinë është një platformë anonime dhe e sigurt për të raportuar problemet, shqetësimet dhe padrejtësitë në komunat e Kosovës. Bashkë kontribuojmë për një shoqëri më të drejtë dhe të përgjegjshme.",
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  creator:"Murrizi Co.",
  publisher: "Murrizi Labs",
  keywords: [
    "ankesa",
    "raportime",
    "komunat e Kosovës",
    "probleme në komunë",
    "platformë ankesash",
    "shqetësime qytetare",
    "raportim publik",
    "Kosovë",
    "shfaq pakënaqësinë"
  ],
  openGraph: {
    title: "ShfaqPakenaqësinë - Zëri i Qytetarëve dhe Punonjësve",
    description: "Platformë digjitale për të ndarë pakënaqësitë dhe për të raportuar shqetësimet në komunat e Kosovës. Qëndro anonim, vepro publikisht.",
    url: "https://shfaqpakenaqesine.com",
    siteName: "ShfaqPakënaqësinë",
    type: "website",
    locale: "sq_AL",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/shfaqpakenaqesine-cover.png`,
        width: 1200,  // Required for OG
        height: 630,  // Required for OG
        alt: "ShfaqPakenaqësinë - Zëri i Qytetarëve dhe Punonjësve"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "ShfaqPakenaqësinë - Zëri i Qytetarëve dhe Punonjësve",
    description: "Raporto shqetësimet në komunën tënde dhe kontribuo në ndryshimin e komunitetit.",
    images: {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/shfaqpakenaqesine-cover.png`,
      width: 1200,  // Required for OG
      height: 630,  // Required for OG
      alt: "ShfaqPakenaqësinë - Zëri i Qytetarëve dhe Punonjësve"
    },
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_BASE_URL,
  },
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth()
  return (
    <html lang="sq-AL">
      <body
        className={`${poppins.variable} antialiased`}
      >
        <SessionContext session={session}>
          <QueryProvider>
            {children}
            <Toaster />
          </QueryProvider>
        </SessionContext>
      </body>
    </html>
  );
}
