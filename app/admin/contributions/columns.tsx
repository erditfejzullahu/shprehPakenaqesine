"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ExtendedContribution } from "@/types/admin"
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
import { format } from "date-fns"

export const columns: ColumnDef<ExtendedContribution>[] = [
  {
    accessorKey: "complaint.title",
    header: "Complaint",
    cell: ({ row }) => {
      const complaint = row.original.complaint
      return (
        <Link 
          href={`/admin/complaints/${complaint.id}`} 
          className="text-indigo-600 hover:underline line-clamp-1"
        >
          {complaint.title}
        </Link>
      )
    }
  },
  {
    accessorKey: "user.username",
    header: "Contributor",
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <Link 
          href={`/admin/users/${user.id}`} 
          className="text-indigo-600 hover:underline"
        >
          {user.username}
        </Link>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: "Contributed On",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return format(date, "PPpp")
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Last Updated",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"))
      return format(date, "PPpp")
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const contribution = row.original

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
              <Link href={`/ankesat/${contribution.complaint.id}`}>
                View Complaint
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/profili/${contribution.user.id}`}>
                View Contributor Profile
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]