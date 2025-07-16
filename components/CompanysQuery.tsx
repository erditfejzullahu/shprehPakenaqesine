"use client"
import { useInfiniteQuery } from '@tanstack/react-query'
import React, { memo } from 'react'
import { LoadingSpinner } from './LoadingComponents'
import api from '@/lib/api'
import CompanyCard from './CompanyCard'
import CTAButton from './CTAButton'
import { FaChevronDown } from 'react-icons/fa'
import { CompaniesWithHasMore, CompanyInterface } from '@/types/types'



const CompanysQuery = () => {
  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch, error} = useInfiniteQuery({
    queryKey: ['companies'],
    queryFn: async ({ pageParam }) => {
      const res = await api.get<CompaniesWithHasMore>(`/api/companies?page=${pageParam}`);
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => 
      lastPage.hasMore ? allPages.length + 1 : undefined,
    retry: 2,
    refetchOnWindowFocus: false
  })      
  
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
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4 relative ${!hasNextPage && "-mb-14"}`}>
      {data?.pages.map((page) => 
        page.companies.map((company: CompanyInterface) => (
          <CompanyCard key={company.id} {...company}/>
        ))
      )}
      {hasNextPage && (
        <div className="mt-1 w-full mx-auto absolute right-0 -bottom-16 left-0">
          <CTAButton onClick={() => fetchNextPage()} isLoading={isFetchingNextPage} text='Me shume' primary/>
        </div>
      )}
    </div>
  )
}

export default memo(CompanysQuery)