// pages/404.tsx

import CTAButton from '@/components/CTAButton';
import Link from 'next/link';

export default function NotFound() {
    
  return (
    <main
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f5f7fa',
        color: '#333',
        padding: '1rem',
        textAlign: 'center',
      }}
    >
      <h1 className='text-indigo-600 text-8xl font-bold'>
        404
      </h1>
      <h2 className='font-normal text-black text-2xl mt-4'>
        Faqja nuk u gjet
      </h2>
      <p className='text-gray-600 font-light text-sm mb-6'>
        Na vjen keq, por faqja që po kërkoni nuk ekziston ose është zhvendosur.
      </p>
      <Link href="/">
          <CTAButton primary text='Kthehu në faqen kryesore'/>
      </Link>
    </main>
  );
}
