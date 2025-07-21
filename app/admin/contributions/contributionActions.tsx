import { ExtendedContribution } from '@/types/admin'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
const ContributionActions = ({contribution}: {contribution: ExtendedContribution}) => {
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
            <Button className="w-full cursor-pointer" variant={"default"}>Shiko Kontribimin</Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="flex justify-between bg-gray-100 hover:bg-gray-300! cursor-pointer">
            <Link href={`mailto:${contribution.user.email}`}>Kontakto kontribuesin</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
            <Button className="w-full cursor-pointer" variant={"destructive"}>Fshije</Button>
        </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ContributionActions