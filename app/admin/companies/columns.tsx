"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Company } from "@/types/admin"
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

export const columns: ColumnDef<Company>[] = [
  {
    accessorKey: "name",
    header: "Emri",
  },
  {
    accessorKey: "industry",
    header: "Industria",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "_count.complaints",
    header: "Ankesat",
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
      const company = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="flex flex-col gap-1">
            <DropdownMenuLabel>Nderveprime</DropdownMenuLabel>
            <DropdownMenuItem asChild className="flex justify-center">
              <Button variant={"default"} className="cursor-pointer w-full">Ndrysho</Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="flex justify-center">
              <Link className="cursor-pointer bg-gray-100 hover:bg-gray-300" href={`/admin/companies/${company.id}`}>Shiko</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Button className="cursor-pointer w-full" variant={"destructive"}>Fshije</Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]