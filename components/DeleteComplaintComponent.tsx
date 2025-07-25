import { Complaint } from '@/app/generated/prisma'
import { Session } from 'next-auth';
import React from 'react'
import { FaTrash } from 'react-icons/fa';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import CTAButton from './CTAButton';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const DeleteComplaintComponent = ({complaint, session}: {complaint: Complaint; session: Session | null}) => {
    if(!session){
        return null
    }

    const {data, isLoading, isError} = useQuery({
        queryKey: ['trashComplaint', session.user.id],
        queryFn: async () => {
            const response = await api.get<{success: boolean}>(`/api/auth/getTrashableComplaint?complaintId=${complaint.id}`)
            return response.data
        },
        refetchOnWindowFocus: false
    })

    const handleDeleteComplaint = async () => {
        try {
            const response = await api.delete(`/api/auth/getTrashableComplaint`)
            if(response.data.success){

            }
        } catch (error) {
            
        }
    }

    if(!data || !data.success || isLoading || isError) return null;

  return (
    <Dialog>
        <DialogTrigger asChild>
            <div className='bg-red-500 p-1 rounded-sm z-50 absolute bottom-1.5 right-2 animate-pulse repeat-infinite hover:animate-none'>
            <FaTrash size={10} color='#fff'/>
            </div>
        </DialogTrigger>
        <DialogContent className='[&>button:first-of-type]:hidden'>
            <DialogHeader>
            <DialogTitle>A jeni të sigurt për këtë veprim?</DialogTitle>
            <DialogDescription className='text-sm'>Duhet t'a keni parasysh qe ky veprim është i pakthyeshëm. Të gjithë kontribimet, votat, diskutimet do jenë te pacasshme.</DialogDescription>
            </DialogHeader>
            <DialogFooter className='w-full flex gap-2'>
            <DialogClose asChild>
                <CTAButton text='Largo dritaren' classNames='flex-1'/>
            </DialogClose>
            <CTAButton text='Kryeni veprimin' classNames='flex-1' primary/>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteComplaintComponent