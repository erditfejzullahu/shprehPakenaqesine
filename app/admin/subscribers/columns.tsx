"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ExtendedSubscriber } from "@/types/admin"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { copyToClipboard } from "@/lib/utils"
import api from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"


export const columns: ColumnDef<ExtendedSubscriber>[] = [
  {
    accessorKey: "email",
    enableGlobalFilter: true,
    header: "Email"
  },
  {
    accessorKey: "createdAt",
    header: "I/e abonuar me",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"))
      return date.toLocaleDateString('sq-AL', {dateStyle:"full"})
    },
  },
  {
    id: "actions",
    size:40,
    cell: ({ row }) => {
      const subscriber = row.original
      const router = useRouter();

      const deleteAbonation = async (id: string, email: string) => {
        try {
          const response = await api.delete(`/api/admin/subscribers/${id}`)
          if(response.data.success){
            toast.success(`Sapo larguat abonuesin ${email} me sukses`)
            router.refresh();
          }
        } catch (error: any) {
          console.error(error);
          toast.error(error.response.data.message || "Dicka shkoi gabim")
        }
      }
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
            <DropdownMenuItem
              onClick={() => copyToClipboard(subscriber.email)}
            >
              Kopjoni email-in
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => deleteAbonation(subscriber.id, subscriber.email)} className="text-red-600">
              Largo abonimin
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]