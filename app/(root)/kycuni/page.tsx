import { auth } from '@/auth'
import LoginForm from '@/components/LoginForm'
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import React from 'react'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://shfaqpakenaqesine.com';

  return {
    title: 'Kyçuni - ShfaqPakenaqësinë',
    description: 'Hyni në llogarinë tuaj për të përmirësuar shoqërinë përmes platformës ShfaqPakenaqësinë',
    keywords: [
      'kyçuni shqip',
      'login shfaq pakenaqësinë',
      'llogaria përdoruesi',
      'autentikim online',
      'siguri platformë',
      'ankesa online kosovë'
    ],
    openGraph: {
      title: 'Kyçuni - ShfaqPakenaqësinë',
      description: 'Faqja e kyçjes për platformën ShfaqPakenaqësinë',
      type: 'website',
      locale: 'sq_AL',
      url: `${baseUrl}/kycu`,
      siteName: 'ShfaqPakenaqësinë',
      images: [{
        url: `${baseUrl}/images/login-og.jpg`,
        width: 1200,
        height: 630,
        alt: 'Faqja e Kyçjes - ShfaqPakenaqësinë',
      }],
    },
    alternates: {
      canonical: `${baseUrl}/kycu`,
    },
    robots: {
      index: false,
      follow: true,
      nocache: true,
      googleBot: {
        index: false,
        follow: false,
        noimageindex: true,
      }
    }
  };
}

const page = async () => {
  const session = await auth();
  if(session){
    redirect('/profili')
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Faqja e Kyçjes",
    "description": "Faqja për kyçje në platformën ShfaqPakenaqësinë",
    "url": `${process.env.NEXT_PUBLIC_BASE_URL}/kycu`,
    "publisher": {
      "@type": "Organization",
      "name": "ShfaqPakenaqësinë",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png`
      }
    },
    "potentialAction": {
      "@type": "LoginAction",
      "name": "Kyçje",
      "url": `${process.env.NEXT_PUBLIC_BASE_URL}/kycu`,
      "expectsAcceptanceOf": {
        "@type": "Offer",
        "name": "Termat e Përdorimit"
      }
    },
    "inLanguage": "sq"
  };

  
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
        <section className="flex-1">
            <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-center shadow-xl">
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">Kycuni</h1>
                <p className='text-gray-600'>Behuni pjese e <span className="text-indigo-600">ShfaqPakenaqesine</span> per nje ambient me te mire dhe me te sigurte per te gjithe shoqerine</p>
            </div>
            <LoginForm />
        </section>
    </div>
  )
}

export default page