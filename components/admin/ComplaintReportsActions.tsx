"use client"
import React, { memo, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { LoadingSpinner } from '../LoadingComponents'
import { FaChevronDown } from 'react-icons/fa'
import CTAButton from '../CTAButton'
import ReportsCard from './ReportsCard'
import { ExtendedReport } from '@/types/admin'

const ComplaintReportsActions = ({complaintTitle, complaintId, open, onClose}: {complaintTitle: string, complaintId: string, open: boolean, onClose: () => void}) => {
    const {data, isLoading, isError, refetch, isRefetching} = useQuery({
        queryKey: ["reports", complaintId],
        queryFn: async () => {
            const response = await api.get<{reports: ExtendedReport[]}>(`/api/admin/reports/getReportsByComplaintId/${complaintId}`)
            return response.data;
        },
        enabled: open,
        refetchOnWindowFocus: false
    })
    
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="!min-w-[700px] flex flex-col max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Raportimet mbi <span className='underline'>{complaintTitle}</span></DialogTitle>
          <DialogDescription className='max-[420px]:text-sm'>Ketu mund te nderveproni me te gjitha raportimet e {complaintTitle}</DialogDescription>
        </DialogHeader>
        {isLoading || isRefetching ? (
            <div className="py-8 flex justify-center">
                <LoadingSpinner />
            </div>
        ) : isError && !isLoading ? (
            <div className="mx-auto flex flex-col items-center right-0 left-0 my-8">
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
        ) : (!isLoading && !isError) && (!data || data.reports.length === 0) ? (
            <div className="flex flex-row gap-1">
                <div>
                    <h3 className="text-gray-600 font-normal mb-3">Nuk u gjet asnjë raport</h3>
                </div>
                <div className="pt-2 rotate-[50deg]">
                    <FaChevronDown size={22} color='#4f46e5'/>
                </div>
            </div>
        ) : (
            <div className='flex flex-col gap-4'>
                <div className='ml-auto text-sm font-semibold text-red-500'>{data?.reports.length} Raportime</div>
                {data?.reports.map((report) => (
                    <ReportsCard key={report.id} {...report}/>
                ))}
            </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default memo(ComplaintReportsActions)