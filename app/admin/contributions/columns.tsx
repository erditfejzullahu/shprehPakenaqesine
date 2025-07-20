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
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import ContributionsTableComponent from "@/components/admin/ContributionsTableComponent"

export const columns: ColumnDef<ExtendedContribution>[] = [
  {
    accessorKey: "complaint.title",
    header: "Ankesa",
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
    header: "Kontribuesi",
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <Link 
          href={`mailto:${user.email}`} 
          className="text-indigo-600 hover:underline"
        >
          {user.username}
        </Link>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: "Kontribuar me",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return format(date, "PPpp")
    },
  },
  {
    accessorKey: "contributionValidated",
    header: "Statusi",
    cell: ({row}) => (
      <Badge variant={row.getValue("contributionValidated") === false ? "outline" : "default"}>{row.getValue("contributionValidated") === false ? "I Pamiratuar" : "I Miratuar"}</Badge>
    )
  },
  {
    accessorKey: "updatedAt",
    header: "Rifreskuar me",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updatedAt"))
      return format(date, "PPpp")
    },
  },
  {
    id: "actions",
    size: 60,
    cell: ({ row }) => {
      const contribution = row.original
      
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="cursor-pointer">
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="flex flex-col gap-1" align="end">
            <DropdownMenuLabel>Nderveprimet</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full cursor-pointer" variant={"default"}>Shiko Kontribimin</Button>
                </DialogTrigger>
                <DialogContent className="!min-w-[700px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Dialogu i kontribimit</DialogTitle>
                    <DialogDescription>Nderveproni ne statusin e kontribimit mbi <span className="text-indigo-600">{contribution.complaint.title}</span></DialogDescription>
                  </DialogHeader>
                  <ContributionsTableComponent {...contribution}/>
                </DialogContent>
              </Dialog>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="flex justify-between bg-gray-100 hover:bg-gray-300! cursor-pointer">
              <Link href={`mailto:${contribution.user.email}`}>Kontakto kontribuesin</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]