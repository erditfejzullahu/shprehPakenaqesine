"use client"
import api from '@/lib/api'
import { ActivityLogExtended, AdminActivityLog } from '@/types/admin'
import { useQuery } from '@tanstack/react-query'
import React, { useEffect, useMemo, useState } from 'react'
import { LoadingSpinner } from '../LoadingComponents'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'
import CTAButton from '../CTAButton'
import { ColumnResizeMode, createColumnHelper, FilterFn, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import { ReusableHoverCard } from '../ReusableHoverCard'
import Image from 'next/image'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

const columnHelper = createColumnHelper<ActivityLogExtended>();
const fuzzyFilter: FilterFn<ActivityLogExtended> = (row, columnId, value) => {
    return rankItem(row.getValue(columnId), value).passed
}

const AdminUserLogs = () => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnResizeMode, setColumnResizeMode] = useState<ColumnResizeMode>('onChange')
    const [globalFilter, setGlobalFilter] = useState("")
    const [goFullscreen, setGoFullscreen] = useState(false)

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 20
    })

    

    const {data, isLoading, isError, refetch, isRefetching} = useQuery({
        queryKey: ['adminLogs', pagination.page, pagination.limit],
        queryFn: async () => {
            const response = await api.get<AdminActivityLog>(`/api/admin/logs?page=${pagination.page}&limit=${pagination.limit}`)
            return response.data;
        },
        refetchOnWindowFocus: true
    })    

    const goNext = () => {
        if(!data?.hasMore) return;
        setPagination((prev) => ({
            ...prev,
            page: prev.page + 1
        }))
    }

    const goBack = () => {
        if(pagination.page === 1) return;
        setPagination((prev) => ({
            ...prev,
            page: prev.page -1
        }))
    }

    const columns = useMemo(() => [
        columnHelper.accessor("id", {
            header: "ID",
            size:40,
            enableSorting: true,
            cell: info => (
                <ReusableHoverCard 
                    trigger={
                        <div className='line-clamp-1 max-w-[50px]'>{info.getValue()}</div>
                    }
                    content= {
                        <div className='text-sm font-normal text-center'>{info.getValue()}</div>
                    }
                />
            )
        }),
        columnHelper.display({
            id:"user",
            header: "Perdoruesi",
            size:100,
            enableSorting: true,
            enableGlobalFilter: true,
            cell: info => (
                <div className='flex flex-col items-center gap-2'>
                    <div>
                        <Image 
                            src={info.row.original.user.userProfileImage}
                            className='size-12 rounded-full'
                            alt={info.row.original.user.fullName}
                            width={42}
                            height={42}
                        />
                    </div>
                    <div className='text-center'>
                        {info.row.original.user.fullName}
                    </div>
                </div>
            )
        }),
        columnHelper.accessor("action", {
            header: "Veprimi",
            size:70,
            enableSorting: true,
            enableGlobalFilter: true,
            cell: info => (
                <Badge variant={"default"}>{info.getValue()}</Badge>
            )
        }),
        columnHelper.accessor("entityType", {
            header: "Entiteti",
            size:70,
            enableSorting: true,
            enableGlobalFilter: true,
            cell: info => (
                <Badge variant={"destructive"}>{info.getValue()}</Badge>
            )
        }),
        columnHelper.accessor("createdAt", {
            header: "Krijuar me",
            size:70,
            enableSorting: true,
            enableGlobalFilter: true,
            cell: info => (
                <div>{new Date(info.getValue()).toLocaleDateString('sq-AL', {dateStyle: "full"})}</div>
            )
        })
    ], [])

    const table = useReactTable({
        data: data?.logs || [],
        columns,
        state: {
            sorting,
            globalFilter
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        // getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: fuzzyFilter,
        columnResizeMode
    })

    const rows = useMemo(() => table.getRowModel().rows, [table.getRowModel()])

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
    <div className='p-4'>
        <div className="flex flex-row items-center justify-between">
            <div className="mb-4 flex-1">
            <Input
                type="text"
                value={globalFilter}
                onChange={e => setGlobalFilter(e.target.value)}
                placeholder="Kerkoni regjistrat..."
                className="max-w-md"
            />
            </div>
            <div>
                {data.allLogs} Regjistra total 
            </div>
        </div>

        <div className="overflow-x-auto w-full">
            <table className="w-full border-collapse">
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                    <th
                        key={header.id}
                        className="relative px-4 py-2 bg-gray-100 text-left border-b"
                        style={{ width: header.getSize() }}
                    >
                        <div
                        className={`flex items-center font-normal text-sm ${
                            header.column.getCanSort() ? 'cursor-pointer select-none' : ''
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                        >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {{
                            asc: <FaChevronUp className="ml-2" size={14} />,
                            desc: <FaChevronDown className="ml-2" size={14}/>,
                        }[header.column.getIsSorted() as string] ?? null}
                        </div>
                        {/* Resize handle */}
                        <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`absolute right-0 top-0 h-full w-1 bg-gray-300 cursor-col-resize select-none touch-none ${
                            header.column.getIsResizing() ? 'bg-blue-500' : ''
                        }`}
                        />
                    </th>
                    ))}
                </tr>
                ))}
            </thead>
            <tbody>
                {rows.map(row => (
                <tr key={row.id} className="transition-colors font-medium text-sm">
                    {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="px-4 py-2 border-b">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        <div className="flex items-center justify-between mt-4">
        <div className="flex space-x-2">
            <button
                onClick={() => setPagination((prev) => ({...prev, page: 1}))}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                «
            </button>
            <button
                onClick={goBack}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                ‹
            </button>
            <button
                onClick={goNext}
                disabled={!data?.hasMore}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                ›
            </button>
            {/* Note: You might want to implement a "go to last page" function if you know the total pages */}
            <button
                onClick={() => {/* Implement if you know total pages */}}
                disabled={true} // or !data?.hasMore if you're on last page
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                »
            </button>
        </div>
        <span className="flex items-center gap-1">
            Faqja{' '}
            <strong>
                {pagination.page} {/* Show current page from state */}
            </strong>
        </span>
        <span>
            <Select disabled={isLoading || isRefetching} onValueChange={(val) => {setPagination((prev) => ({...prev, limit: Number(val)}))}} value={pagination.limit.toString()}>
                <SelectTrigger>
                    <SelectValue placeholder={pagination.limit.toString()} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value='20'>20</SelectItem>
                    <SelectItem value='50'>50</SelectItem>
                    <SelectItem value='100'>100</SelectItem>
                </SelectContent>
            </Select>
        </span>
        {/* Remove the page size selector since your API handles this */}
    </div>
    </div>
  )
}

export default AdminUserLogs