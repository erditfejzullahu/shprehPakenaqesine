"use client"
import React, { memo } from 'react'
import ComplaintCard from './ComplaintCard'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { LoadingSpinner } from './LoadingComponents'
import { FaChevronDown } from 'react-icons/fa'
import CTAButton from './CTAButton'
import { ComplaintCardProps } from '@/types/types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'

const ComplaintsQuery = () => {

    const {data, isLoading, isError, refetch} = useQuery({
        queryKey: ['complaints'],
        queryFn: async () => {
            const res = await api.get<{complaints: ComplaintCardProps[]}>(`/api/complaints`)
            return res.data;
        },
        retry: 2,
        refetchOnWindowFocus: false
    })

    if(isLoading) return <LoadingSpinner />
    if(!data) return <div className="mx-auto flex flex-col items-center -top-6">
        <div className="flex flex-row gap-1">
          <div>
            <h3 className="text-gray-600 font-normal mb-3 text-center flex flex-row items-center">Nuk ka te dhëna. Nëse mendoni qe është gabim <FaChevronDown className='rotate-[50deg] mt-2' size={22} color='#4f46e5'/></h3>
          </div>
        </div>
        <CTAButton onClick={() => refetch()} text='Provo përsëri'/>
      </div> 
    if(isError) return <div className="mx-auto flex flex-col items-center right-0 left-0 -top-6">
        <div className="flex flex-row gap-1">
          <div>
            <h3 className="text-gray-600 font-normal mb-3 flex text-center flex-row items-center">Dicka shkoi gabim. Provoni përsëri! <FaChevronDown className='rotate-[50deg] mt-2' size={22} color='#4f46e5'/></h3>
          </div>
        </div>
        <CTAButton onClick={() => refetch()} text='Provo përsëri'/>
      </div> 

  return (
    <Swiper
        slidesPerView={'auto'}
        spaceBetween={16}
        grabCursor={true}
        modules={[Autoplay]}
        autoplay={{
            delay: 3500,
            disableOnInteraction: true,
        }}
        direction="horizontal"
    >
        {data.complaints.map((complaint) => (
            <SwiperSlide key={complaint.id} className="!w-auto py-2 pb-4 pl-2">
                <ComplaintCard {...complaint}/>
            </SwiperSlide>
        ))}
    </Swiper>
  )
}

export default memo(ComplaintsQuery)