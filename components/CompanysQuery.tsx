"use client"
import { useInfiniteQuery } from '@tanstack/react-query'
import React from 'react'
import { LoadingSpinner } from './LoadingComponents'
import api from '@/lib/api'
import CompanyCard from './CompanyCard'
import { Companies } from '@/app/generated/prisma'
import CTAButton from './CTAButton'

interface CompaniesWithHasMore{
  companies: Companies[],
  hasMore: boolean
}

const CompanysQuery = () => {
  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError, refetch} = useInfiniteQuery({
    queryKey: ['companies'],
    queryFn: async ({ pageParam }) => {
      const res = await api.get<CompaniesWithHasMore>(`/api/companies?page=${pageParam}`);
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => 
      lastPage.hasMore ? allPages.length + 1 : undefined
  })

  if(isLoading) return <LoadingSpinner />
  if(isError) return <div className="mx-auto absolute right-0 left-0 -top-6">
    <h3 className="text-gray-600 font-normal mb-3">Dicka shkoi gabim! Ju lutem provoni perseri.</h3>
    <CTAButton onClick={() => refetch()} text='Provo perseri'/>
  </div>

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-4 relative">
      {data?.pages.map((page) => 
        page.companies.map((company: Companies) => (
          <CompanyCard key={company.id} {...company}/>
        ))
      )}
    </div>
  )
}

export default CompanysQuery