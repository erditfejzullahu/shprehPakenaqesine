"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ExtendedComplaint } from "@/types/admin"
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
import ComplaintActions from "./complaintActions"

export const columns: ColumnDef<ExtendedComplaint>[] = [
  {
    accessorKey: "title",
    header: "Titulli",
    enableGlobalFilter: true
  },
  {
    accessorKey: "company.name",
    header: "Kompania",
    cell: ({ row }) => {
      const company = row.original.company
      return (
        company ? (
          <Link href={`/admin/companies/${company.id}`} className="text-indigo-600 hover:underline">
            {company.name}
          </Link>
        ) : (
          <div className="text-indigo-600">
            Ankese komunale
          </div>
        ) 
      )
    }
  },
  {
    accessorKey: "user.username",
    header: "Perdoruesi",
    cell: ({ row }) => {
      const user = row.original.user
      return (
        // TODO: INTERACTIONS
        <Link href={`/admin/users/${user.id}`} className="text-indigo-600 hover:underline">
          {user.username}
        </Link>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Statusi",
    cell: ({ row }) => {
      const status = row.getValue("status")
      
      
      return (
        <Badge 
          variant={
            status === 'PENDING' ? 'outline' : 'default'
          }
        >
          {status === 'PENDING' ? 'Ne pritje' : "E pranuar" }
        </Badge>
      )
    }
  },
  {
    accessorKey: "resolvedStatus",
    header: "Statusi i zgjidhur",
    cell: ({ row }) => {
      const resolvedStatus = row.getValue("resolvedStatus")
      return (
        <Badge 
          variant={
            resolvedStatus === 'PENDING' ? 'outline' : 'default'
          }
        >
          {resolvedStatus === 'PENDING' ? 'Ne pritje' : "I Zgjidhur" }
        </Badge>
      )
    }
  },
  {
    accessorKey: "category",
    header: "Kategoria",
    cell: ({ row }) => {
      const category = row.getValue("category") as string
      const formatted = category.toLowerCase().replace(/_/g, ' ')
      return <span className="capitalize">{formatted}</span>
    }
  },
  {
    accessorKey: "createdAt",
    header: "Krijuar me",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString()
    },
  },
  {
    id: "actions",
    size: 60,
    cell: ({ row }) => {
      const complaint = row.original

      return (
        <ComplaintActions complaint={complaint}/>
      )
    },
  },
]