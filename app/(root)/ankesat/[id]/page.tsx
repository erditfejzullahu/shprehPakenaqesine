import ComplaintDetails from '@/components/ComplaintPageComponent';
import React from 'react'

const page = async ({params}: {params: Promise<{id: string}>}) => {
    const {id} = await params;
    console.log(id);
    
  return (
    <ComplaintDetails />
  )
}

export default page