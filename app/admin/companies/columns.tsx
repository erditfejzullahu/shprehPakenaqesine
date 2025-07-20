"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Company } from "@/types/admin"
import CompanyActions from "./companyActions"

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
        <CompanyActions company={company}/>
      )
    },
  },
]