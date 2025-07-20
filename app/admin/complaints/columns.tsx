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
        <DropdownMenu>
          <DropdownMenuTrigger className="cursor-pointer" asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Nderveprime</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col gap-1">
            <DropdownMenuLabel>Nderveprime</DropdownMenuLabel>
            <DropdownMenuItem className="flex bg-gray-100 hover:bg-gray-300! cursor-pointer justify-center" asChild>
              <Link href={`/ankesat/${complaint.id}`}>Shiko</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button variant={"destructive"} className="w-full cursor-pointer">Fshije</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]