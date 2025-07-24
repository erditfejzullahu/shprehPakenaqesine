import Header from '@/components/Header'
import React, { ReactNode } from 'react'
import { auth } from '@/auth'
import Footer from '@/components/Footer';

const layout = async ({children}: {children: ReactNode}) => {
  const session = await auth();
  return ( 
    <> 
    <Header session={session}/>
    <div className='max-[900px]:mt-[64px] mt-[68px]'>
    {children}
    </div>
    <Footer />
    </>
  )
}

export default layout