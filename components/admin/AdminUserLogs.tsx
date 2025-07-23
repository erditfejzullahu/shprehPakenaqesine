"use client"
import api from '@/lib/api'
import { AdminActivityLog } from '@/types/admin'
import { useQuery } from '@tanstack/react-query'
import React, { useState } from 'react'
import { LoadingSpinner } from '../LoadingComponents'
import { FaChevronDown } from 'react-icons/fa'
import CTAButton from '../CTAButton'

const AdminUserLogs = () => {
    const [page, setPage] = useState(1)
    const {data, isLoading, isError, refetch, isRefetching} = useQuery({
        queryKey: ['adminLogs', page],
        queryFn: async () => {
            const response = await api.get<AdminActivityLog>(`/api/admin/logs?page=${page}`)
            return response.data;
        },
        refetchOnWindowFocus: true
    })    

    const goNext = () => {
        if(!data?.hasMore) return;
        setPage(prev => prev + 1)
    }

    const goBack = () => {
        if(page === 1) return;
        setPage(prev => prev - 1)
    }

    if(isLoading) return <LoadingSpinner />
    if(!data) return <div className="mx-auto flex flex-col items-center right-0 left-0 -top-6">
    <div className="flex flex-row gap-1">
        <div>
        <h3 className="text-gray-600 font-normal mb-3">Nuk ka te dhena. Nese mendoni qe eshte gabim</h3>
        </div>
        <div className="pt-2 rotate-[50deg]">
        <FaChevronDown size={22} color='#4f46e5'/>
        </div>
    </div>
    <CTAButton onClick={() => refetch()} text='Provo perseri'/>
    </div> 
    if(isError) return <div className="mx-auto flex flex-col items-center right-0 left-0 -top-6">
    <div className="flex flex-row gap-1">
        <div>
        <h3 className="text-gray-600 font-normal mb-3">Dicka shkoi gabim. Provoni perseri!</h3>
        </div>
        <div className="pt-2 rotate-[50deg]">
        <FaChevronDown size={22} color='#4f46e5'/>
        </div>
    </div>
    <CTAButton onClick={() => refetch()} text='Provo perseri'/>
    </div> 

  return (
    <div>AdminUserLogs</div>
  )
}

export default AdminUserLogs