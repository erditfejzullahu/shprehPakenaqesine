import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import api from '@/lib/api'
import { ExtendedUser } from '@/types/admin'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

const UsersActions = ({users}: {users: ExtendedUser}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false)

    const handleDeleteUser = useCallback(async () => {
        try {
            const response = await api.delete(`/api/admin/users/${users.id}`)
            if(response.data.success){
                toast.success('Perdoruesi u fshi me sukses!')
                router.refresh();
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response.data.message || "Dicka shkoi gabim!")
        }
    }, [users.id, router])

    
  return (
    <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
            <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="flex flex-col gap-1">
            <DropdownMenuLabel>Nderveprime</DropdownMenuLabel>
            <DropdownMenuItem asChild className="flex justify-center">
                <Button variant={"default"} className="cursor-pointer w-full" onClick={() => setOpen(true)}>Ndrysho</Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="flex justify-center">
                <Link className="cursor-pointer bg-gray-100 hover:bg-gray-300" target="_blank" href={`/ankesat/${users.id}`}>Vizito profilin</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Button onClick={handleDeleteUser} className="cursor-pointer w-full" variant={"destructive"}>Fshije</Button>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </>
  )
}

export default UsersActions