"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ExtendedUser } from "@/types/admin"
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
import Image from "next/image"

export const columns: ColumnDef<ExtendedUser>[] = [
  {
    accessorKey: "",
    header: "Username",
    cell: ({ row }) => {
      const user = row.original
      return (
        <div className="flex items-center gap-3">
          <Image
            src={user.userProfileImage}
            alt={user.username}
            width={32}
            height={32}
            className="rounded-full"
          />
          <Link href={`/admin/users/${user.id}`} className="hover:underline">
            {user.username}
          </Link>
        </div>
      )
    }
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "fullName",
    header: "Name",
  },
  {
    accessorKey: "_count.complaints",
    header: "Complaints",
  },
  {
    accessorKey: "_count.contributions",
    header: "Contributions"
  },
  {
    accessorKey: "reputation",
    header: "Reputation",
    cell: ({ row }) => {
      const reputation = row.getValue("reputation") as number
      return (
        <Badge variant={reputation >= 0 ? "default" : "destructive"}>
          {reputation}
        </Badge>
      )
    }
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString()
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original

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
              <Link href={`/admin/users/${user.id}`}>View</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/profili/${user.id}`}>View Public</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]