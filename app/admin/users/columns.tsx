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
import UsersActions from "./usersActions"

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
    header: "Emri",
  },
  {
    accessorKey: "_count.complaints",
    header: "Ankesat",
    size:40
  },
  {
    accessorKey: "_count.contributions",
    header: "Kontribimet",
    size: 40
  },
  {
    accessorKey: "reputation",
    size:40,
    header: "Reputacioni",
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
    header: "Anetar qe",
    size:40,
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString()
    },
  },
  {
    accessorKey: "acceptedUser",
    header: "I pranuar",
    size:40,
    cell: info => (
      <Badge variant={!info.getValue() ? "destructive" : "default"}>{info.getValue() ? "Pranuar" : "Ne pritje"}</Badge>
    )
  },
  {
    accessorKey: "email_verified",
    header: "Verifikuar",
    size: 40,
    cell: info => (
      <Badge variant={info.getValue() ? "default" : "destructive"}>{info.getValue() ? "Verifikuar" : "I Paverifikuar"}</Badge>
    )
  },
  {
    size:60,
    id: "actions",
    cell: ({ row }) => {
      const user = row.original

      return (
        <UsersActions users={user}/>
      )
    },
  },
]