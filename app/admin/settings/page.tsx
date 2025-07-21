import React from 'react'
import SettingsComponent from './settingsComponent'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

const page = async () => {
    const session = await auth()
    if(!session) redirect('/')
  return (
    <div className='flex-1 flex justify-center items-center h-[calc(100vh-48px)] border'>
        <SettingsComponent session={session}/>
    </div>
  )
}

export default page