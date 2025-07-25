"use client"
import api from '@/lib/api'
import { ActivityLogExtended, AdminActivityLog } from '@/types/admin'
import { useQuery } from '@tanstack/react-query'
import React, { memo, useEffect, useMemo, useState } from 'react'
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
import { SlSizeFullscreen } from "react-icons/sl";

const columnHelper = createColumnHelper<ActivityLogExtended>();
const fuzzyFilter: FilterFn<ActivityLogExtended> = (row, columnId, value) => {
    return rankItem(row.getValue(columnId), value).passed
}

const AdminUserLogs = () => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnResizeMode] = useState<ColumnResizeMode>('onChange')
    const [globalFilter, setGlobalFilter] = useState("")
    const [goFullscreen, setGoFullscreen] = useState(false)

    const [pagination, setPagination] = useState({
        page: 1,
        limit: "20"
    })


    
    const {data, isLoading, isError, refetch, isRefetching} = useQuery({
        queryKey: ['adminLogs', pagination],
        queryFn: async () => {
            const response = await api.get<AdminActivityLog>(`/api/admin/logs?page=${pagination.page}&limit=${pagination.limit}`)
            return response.data;
        },
        refetchOnWindowFocus: false,
        retry:false
    })    
    
    const totalPages = Math.ceil((data?.allLogs || 0) / parseInt(pagination.limit));
    

    const goToPage = (page: number) => {
        setPagination(prev => ({
            ...prev,
            page: Math.max(1, Math.min(page, Math.ceil((data?.allLogs || 0) / parseInt(pagination.limit))))
        }));
    }

    const onLimitChange = (val: string) => {
        setPagination(prev => ({
            page: 1, // Reset to first page
            limit: val
        }));
    }


    const baseColumns = [
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
            (info.row.original.user ? (
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
            ) : (
                <div>Veprim tjeter</div>
            ))
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
            <div>{new Date(info.getValue()).toLocaleString('sq-AL', {dateStyle: "full", timeStyle: "medium"})}</div>
        )
    })
];

    const fullscreenColumns = [
        ...baseColumns,
        columnHelper.accessor("entityId", {
            header: "ID Entitetit",
            size:40,
            enableSorting: true,
            enableGlobalFilter: true,
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
        columnHelper.accessor("ipAddress", {
            header: "IP e perforuesit",
            size:40,
            enableSorting: true,
            enableGlobalFilter: true
        }),
        columnHelper.accessor("userAgent", {
            header: "Agjenti shfletuesit",
            size:40,
            enableSorting: true,
            enableGlobalFilter: true,
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
        })
    ];

    const columns = goFullscreen ? fullscreenColumns : baseColumns;

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
        <button type='button' className='absolute right-4 top-4 cursor-pointer' onClick={() => setGoFullscreen(true)}><SlSizeFullscreen size={24}/></button>

    <div onClick={() => setGoFullscreen(false)} className={`${goFullscreen && "fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center m-auto bg-black/15"}`}>
        <div className={`${goFullscreen ? "w-[90%] p-4 h-[90vh] z-50 overflow-y-auto m-auto rounded-md" : "w-full"} overflow-x-auto bg-white`}>
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
            <table className={`w-full border-collapse ${goFullscreen && "shadow-md rounded-sm overflow-hidden"}`}>
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

            <div className={`flex items-center justify-between mt-4`}>
            <div className="flex space-x-2">
                <button
                onClick={() => goToPage(1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
                >
                «
                </button>
                <button
                onClick={() => goToPage(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
                >
                ‹
                </button>
                <button
                onClick={() => goToPage(pagination.page + 1)}
                disabled={pagination.page >= totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
                >
                ›
                </button>
                <button
                onClick={() => goToPage(totalPages)}
                disabled={pagination.page >= totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
                >
                »
                </button>
            </div>
            <span className="flex items-center gap-1">
                Faqja{' '}
                <strong>
                    {pagination.page} / {totalPages} {/* Show current page from state */}
                </strong>
            </span>
            <span>
                <Select 
                    onValueChange={onLimitChange}
                    value={pagination.limit}
                    disabled={isLoading || isRefetching}
                >
                <SelectTrigger>
                    <SelectValue placeholder={pagination.limit} />
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

    </div>
    </div>
  )
}

export default memo(AdminUserLogs)