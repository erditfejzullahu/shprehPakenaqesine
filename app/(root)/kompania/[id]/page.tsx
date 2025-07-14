import CompanyPage from '@/components/CompanyPageComponent';
import React from 'react'

const page = async ({params}: {params: Promise<{id: string}>}) => {
    const {id} = await params;
  return (
    <CompanyPage />
  )
}

export default page