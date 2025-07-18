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

export const columns: ColumnDef<ExtendedComplaint>[] = [
  {
    accessorKey: "title",
    header: "Title",
    enableGlobalFilter: true
  },
  {
    accessorKey: "company.name",
    header: "Company",
    cell: ({ row }) => {
      const company = row.original.company
      return (
        <Link href={`/admin/companies/${company.id}`} className="text-indigo-600 hover:underline">
          {company.name}
        </Link>
      )
    }
  },
  {
    accessorKey: "user.username",
    header: "User",
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <Link href={`/admin/users/${user.id}`} className="text-indigo-600 hover:underline">
          {user.username}
        </Link>
      )
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status")
      
      
      return (
        <Badge 
          variant={
            status === 'PENDING' ? 'outline' : 'default'
          }
        >
          {status === 'PENDING' ? 'Pending' : "Accepted" }
        </Badge>
      )
    }
  },
  {
    accessorKey: "resolvedStatus",
    header: "Resolved Status",
    cell: ({ row }) => {
      const resolvedStatus = row.getValue("resolvedStatus")
      return (
        <Badge 
          variant={
            resolvedStatus === 'PENDING' ? 'outline' : 'default'
          }
        >
          {resolvedStatus === 'PENDING' ? 'Pending' : "Resolved" }
        </Badge>
      )
    }
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as string
      const formatted = category.toLowerCase().replace(/_/g, ' ')
      return <span className="capitalize">{formatted}</span>
    }
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString()
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const complaint = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/admin/complaints/${complaint.id}`}>View</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/ankesat/${complaint.id}`}>View Public</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]