"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ExtendedReport } from "@/types/admin"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import ReportActions from "./reportActions"

export const columns: ColumnDef<ExtendedReport>[] = [
  {
    accessorKey: "title",
    header: "Title",
    size:100,
    enableGlobalFilter: true,
  },
  {
    accessorKey: "complaint.title",
    header: "Ankesa/Raportimi",
    enableGlobalFilter: true,
    size:100,
    cell: ({ row }) => {
      const complaint = row.original.complaint
      return (
        <Link href={`/ankesat/${complaint.id}`} target="_blank" className="text-indigo-600 hover:underline">
          {complaint.title}
        </Link>
      )
    }
  },
  {
    accessorKey: "category",
    size:100,
    header: "Kategoria",
    cell: ({ row }) => {
      const category = row.getValue("category") as string
      const formatted = category.toLowerCase().replace(/_/g, ' ')
      return <span className="capitalize">{formatted}</span>
    }
  },
  {
    accessorKey: "complaint.company.name",
    header: "Kompania",
    cell: ({row}) => {
      return <div>
        {row.original.complaint.company ? (
          <Link href={`/kompanite/${row.original.complaint.company?.id}`}>{row.original.complaint.company?.name}</Link>
        ) : (
          <div>Ankese komunale</div>
        )}
      </div>
    }
  },
  {
    accessorKey: "complaint.municipality",
    header: "Komuna",
    size:100
  },
  {
    accessorKey: "complaint.upVotes",
    header: "Votat",
    size: 40,
  },
  {
    accessorKey: "createdAt",
    header: "Krjuar me",
    size:100,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString('sq-AL', {day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"})
    },
  },
  {
    id: "actions",
    size:40,
    cell: ({ row }) => {
      const report = row.original

      return (
        <ReportActions report={report}/>
      )
    },
  },
]