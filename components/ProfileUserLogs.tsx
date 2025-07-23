import api from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import { Session } from 'next-auth'
import React, { useMemo, useState } from 'react'
import { LoadingSpinner } from './LoadingComponents';
import { FaChevronDown, FaChevronUp, FaInfoCircle } from 'react-icons/fa';
import CTAButton from './CTAButton';
import { UserProfileLogs } from '@/types/types';
import { ColumnResizeMode, createColumnHelper, FilterFn, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from '@tanstack/react-table';
import { rankItem } from '@tanstack/match-sorter-utils';
import { Input } from './ui/input';
import { ActivityAction } from '@/app/generated/prisma';
import { Badge } from './ui/badge';
import { ReusableHoverCard } from './ReusableHoverCard';

const columnHelper = createColumnHelper<UserProfileLogs>();
const fuzzyFilter: FilterFn<UserProfileLogs> = (row, columnId, value) => {
    return rankItem(row.getValue(columnId), value).passed
}
 
const ProfileUserLogs = ({session}: {session: Session}) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [columnResizeMode, setColumnResizeMode] = useState<ColumnResizeMode>('onChange')
    const [globalFilter, setGlobalFilter] = useState("")

    const {data, isLoading, isError, refetch, isRefetching} = useQuery({
        queryKey: ['userLogs', session.user.id],
        queryFn: async () => {
            const response = await api.get<UserProfileLogs[]>('/api/auth/userLogs')
            return response.data
        },
        refetchOnWindowFocus: true
    })    

    const columns = useMemo(() => [
        columnHelper.accessor("id", {
            header: "ID Regjistrit",
            size:40,
            enableSorting: true,
            // enableGlobalFilter: true,
            cell: info => (
                <ReusableHoverCard 
                    trigger={
                        <div className='line-clamp-1'>{info.getValue()}</div>
                    }
                    content= {
                        <div className='text-sm font-normal text-center'>{info.getValue()}</div>
                    }
                />
            )
        }),
        columnHelper.accessor("userId", {
            header: "ID Juaj",
            size: 40,
            cell: info => (
                <ReusableHoverCard 
                    trigger={
                        <div className='line-clamp-1'>{info.getValue()}</div>
                    }
                    content= {
                        <div className='text-sm font-normal text-center'>{info.getValue()}</div>
                    }
                />
            )
        }),
        columnHelper.accessor("action", {
            header: "Nderveprimi",
            size:100,
            enableSorting: true,
            enableGlobalFilter: true,
            cell: ({row}) => {
            const action = row.original.action;
            
            const actionTranslations: Record<ActivityAction, string> = {
                [ActivityAction.LOGIN]: "Hyrje në sistem",
                [ActivityAction.LOGOUT]: "Dalje nga sistemi",
                [ActivityAction.REGISTER]: "Regjistrim",
                
                [ActivityAction.CREATE_COMPANIES]: "Krijim kompanie",
                [ActivityAction.UPDATE_COMPANIES]: "Përditësim kompanie",
                [ActivityAction.DELETE_COMPANIES]: "Fshirje kompanie",
                
                [ActivityAction.CREATE_COMPLAINT]: "Krijim ankesë",
                [ActivityAction.UPDATE_COMPLAINT]: "Përditësim ankesë",
                [ActivityAction.DELETE_COMPLAINT]: "Fshirje ankesë",
                [ActivityAction.UPVOTE_COMPLAINT]: "Votim pozitiv për ankesë",
                
                [ActivityAction.CREATE_COMPLAINTUPVOTES]: "Krijim votash për ankesa",
                [ActivityAction.DELETE_COMPLAINTUPVOTES]: "Fshirje votash për ankesa",
                
                [ActivityAction.CREATE_REPORTS]: "Krijim raporte",
                [ActivityAction.UPDATE_REPORTS]: "Përditësim raporte",
                [ActivityAction.DELETE_REPORTS]: "Fshirje raporte",
                
                [ActivityAction.CREATE_SUBSCRIBERS]: "Krijim pajtimtarësh",
                [ActivityAction.DELETE_SUBSCRIBERS]: "Fshirje pajtimtarësh",
                
                [ActivityAction.CREATE_CONTRIBUTIONS]: "Krijim kontribucionesh",
                [ActivityAction.UPDATE_CONTRIBUTIONS_ADMIN_ACCEPT]: "Pranim kontribucioni nga admin",
                [ActivityAction.UPDATE_CONTRIBUTIONS_ADMIN_UPDATE]: "Përditësim kontribucioni nga admin",
                
                [ActivityAction.UPDATE_USER_DETAILS]: "Përditësim detaje përdoruesi",
                [ActivityAction.UPDATE_USER_ADMIN_DETAILS]: "Përditësim detaje admini",
                [ActivityAction.UPDATE_OTHER_USERS_DETAILS_BY_ADMIN]: "Përditësim detaje përdoruesish të tjerë nga admini",
                
                [ActivityAction.CHANGE_PASSWORD]: "Ndryshim fjalëkalimi",
                
                [ActivityAction.DOWNLOAD_FILE]: "Shkarkim skedar",
                [ActivityAction.COPIED_FILE_URL]: "Kopjim URL skedari"
            };
            
            return (
                <ReusableHoverCard
                    trigger={
                        <div className='relative w-fit cursor-pointer'>
                            <FaInfoCircle color='#fff' size={18} className='absolute bg-indigo-600 p-0.5 rounded-full -right-2 -top-1.5'/>
                            <Badge variant={"default"}>{actionTranslations[action] || action}</Badge>
                        </div>
                    }
                    content={
                        <div className='text-sm text-center'>Kerkoni ne hyrje: <span className='text-indigo-600'>{action}</span></div>
                    }
                />
            )
        }
    }),
        columnHelper.accessor("ipAddress", {
            header: "Adresa juaj",
            size:100,
            enableSorting: true
        }),
        columnHelper.accessor("userAgent", {
            header: "Agjenti shfletuesit",
            size: 300,
            enableSorting: true,
            enableGlobalFilter: true
        })
    ], [])

    const table = useReactTable({
        data: data || [],
        columns,
        state: {
            sorting,
            globalFilter
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: fuzzyFilter,
        columnResizeMode
    })

    const rows = useMemo(() => table.getRowModel().rows, [table.getRowModel()])
    if(!session) return null;
    if(isLoading || isRefetching) return <div className='h-[120px]'><LoadingSpinner /></div>
    if(!data || data.length === 0) return <div className="mx-auto flex flex-col py-6 items-center right-0 left-0 -top-6">
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
    if(isError) return <div className="mx-auto flex flex-col py-6 items-center right-0 left-0 -top-6">
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
            <span className="font-normal">{data.length} Regjistra te gjetura</span>
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
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                «
            </button>
            <button
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                ‹
            </button>
            <button
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                ›
            </button>
            <button
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
                className="px-3 py-1 border rounded disabled:opacity-50"
            >
                »
            </button>
            </div>
            <span className="flex items-center gap-1">
                Faqja{' '}
            <strong>
                {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
            </span>
            <select
                value={table.getState().pagination.pageSize}
                onChange={e => table.setPageSize(Number(e.target.value))}
                className="px-2 py-1 border rounded"
                >
                {[10, 20, 30, 50].map(pageSize => (
                    <option key={pageSize} value={pageSize}>
                    Shfaq {pageSize}
                    </option>
                ))}
            </select>
      </div>
    </div>
  )
}

export default ProfileUserLogs