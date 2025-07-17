"use client"
import { Session } from 'next-auth'
import React, { useEffect, useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { FaInfoCircle } from 'react-icons/fa'
import api from '@/lib/api'
import { toast } from 'sonner'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card'

const AnonimityToggle = ({session}: {session: Session | null}) => {
    const [changedAnonimityStatus, setChangedAnonimityStatus] = useState(false)
    const [anonimityStatus, setAnonimityStatus] = useState(session?.user.anonimity ? "Anonim" : "Publik")
    const [anonimityHover, setAnonimityHover] = useState(false)

    const handleChangeAnonimity = async (val: string) => {
        try {
            const response = await api.post(`/api/auth/changeAnonimity`, {
                anonimity: val === "Anonim" ? true : false
            })
            if(response.data.success){
                setAnonimityStatus(val)
                setChangedAnonimityStatus(true)
                toast.success(`Ndryshuat dukshmerine tuaj ne ${val}`)
            }
        } catch (error: any) {
            console.error(error)
            setChangedAnonimityStatus(false)
            toast.error(error.response.data.message)
        }
    }

    useEffect(() => {
      let timeout: NodeJS.Timeout;
      if(anonimityStatus){
        timeout = setTimeout(() => {
            setAnonimityHover(false)
        }, 1000);
      }
      return () => {
        clearTimeout(timeout);
      }
    }, [anonimityHover])
    

    useEffect(() => {
        let timeout: NodeJS.Timeout;
      if(changedAnonimityStatus){
        timeout = setTimeout(() => {
            setChangedAnonimityStatus(true)
        }, 1000);
      }
      return () => {
        clearTimeout(timeout)
      }
    }, [changedAnonimityStatus])
    
    if(!session) return null
  return (
    <Select value={anonimityStatus} onValueChange={(val) => handleChangeAnonimity(val)}>
            <HoverCard open={anonimityHover} onOpenChange={setAnonimityHover}>
                <HoverCardTrigger asChild>
                    <SelectTrigger className="absolute top-2 left-1 w-[100px] outline-0! shadow-none after:hidden before:hidden border-none">
                                <p className='text-indigo-600 p-4 bg-gray-100 shadow-md leading-0 absolute left-1 rounded-br-2xl z-20 rounded-tl-2xl cursor-pointer hover:bg-gray-200 font-medium top-1 text-sm'>{anonimityStatus}<FaInfoCircle color='#4f46e5' className='absolute -top-1 z-50 -right-2'/></p>
                    </SelectTrigger>
                </HoverCardTrigger>
                <HoverCardContent>
                    <span className='text-gray-600 text-sm'>Ndryshoni dukshmerine tuaj duke nderruar mes opsioneve ne klikim te kesaj rubrike</span>
                </HoverCardContent>
            </HoverCard>
        <SelectContent>
            <SelectItem value="Anonim">Anonim</SelectItem>
            <SelectItem value="Publik">Publik</SelectItem>
        </SelectContent>
    </Select>
  )
}

export default AnonimityToggle