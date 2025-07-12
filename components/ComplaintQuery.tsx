import React from 'react'
import ComplaintCard from './ComplaintCard'
import { useQuery } from '@tanstack/react-query'

const ComplaintQuery = () => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['complaints'],
        queryFn: async () => {
            
        }
    })
  return (
    <div>ComplaintQuery</div>
  )
}

export default ComplaintQuery