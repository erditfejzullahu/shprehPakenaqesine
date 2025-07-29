"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ExtendedContribution } from "@/types/admin"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import ContributionActions from "./contributionActions"

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
      return date.toLocaleDateString("sq-AL", {dateStyle: "full"})
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
      return date.toLocaleDateString("sq-AL", {dateStyle: "full"})
    },
  },
  {
    id: "actions",
    size: 40,
    cell: ({ row }) => {
      const contribution = row.original
      
      return (
        <ContributionActions contribution={contribution}/>  
      )
    },
  },
]