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
  if(!data) return <div className="mx-auto flex flex-col items-center -mb-12 -top-6">
    <div className="flex flex-row gap-1">
      <div>
        <h3 className="text-gray-600 font-normal mb-3 text-center flex flex-row items-center">Nuk ka të dhëna. Nëse mendoni qe është gabim <FaChevronDown className='rotate-[50deg] mt-2' size={22} color='#4f46e5'/></h3>
      </div>
    </div>
    <CTAButton onClick={() => refetch()} text='Provo përsëri'/>
  </div> 
  if(isError) return <div className="mx-auto flex flex-col items-center -mb-12 right-0 left-0 -top-6">
    <div className="flex flex-row gap-1">
      <div>
        <h3 className="text-gray-600 font-normal mb-3 flex text-center flex-row items-center">Dicka shkoi gabim. Provoni përsëri! <FaChevronDown className='rotate-[50deg] mt-2' size={22} color='#4f46e5'/></h3>
      </div>
    </div>
    <CTAButton onClick={() => refetch()} text='Provo përsëri'/>
  </div> 

  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4 relative ${!hasNextPage && "-mb-14"}`}>
      {data?.pages.map((page) => 
        page.companies.map((company: CompanyInterface) => (
          <CompanyCard key={company.id} {...company}/>
        ))
      )}
      {hasNextPage && (
        <div className="mt-1 w-full flex justify-between items-center mx-auto absolute right-0 -bottom-16 left-0">
          <CTAButton onClick={() => fetchNextPage()} isLoading={isFetchingNextPage} text={`${isFetchingNextPage ? "Ju lutem prisni..." : "Më shumë"}`} primary classNames='mx-auto'/>
        </div>
      )}
    </div>
  )
}

export default memo(CompanysQuery)