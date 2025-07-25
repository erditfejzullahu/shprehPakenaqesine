"use client"
import { Complaint } from '@/app/generated/prisma'
import { Session } from 'next-auth';
import React, { useState } from 'react'
import { FaTrash } from 'react-icons/fa';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import CTAButton from './CTAButton';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const DeleteComplaintComponent = ({complaint, session}: {complaint: Complaint; session: Session | null}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [isDeletting, setIsDeletting] = useState(false)

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
        setIsDeletting(true)
        try {
            const response = await api.delete(`/api/auth/getTrashableComplaint`, {data: {complaintId: complaint.id}})
            if(response.data.success){
                toast.success(`Sapo fshitë me sukses ankesën/raportimin tuaj ${complaint.title}`)
                router.replace('/profili');
            }
        } catch (error:any) {
            console.error(error);
            toast.error(error.response.data.message || "Dicka shkoi gabim! Ju lutem provoni përsëri.")
        } finally {
            setIsDeletting(false)
            setOpen(false)
        }
    }

    if(!data || !data.success || isLoading || isError) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            <div className='bg-red-500 cursor-pointer p-1 rounded-sm z-50 absolute top-2 right-2 animate-pulse repeat-infinite hover:animate-none'>
            <FaTrash size={16} color='#fff'/>
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
            <CTAButton isLoading={isDeletting} onClick={handleDeleteComplaint} text={`${isDeletting ? "Duke kryer veprimin..." : "Kryeni veprimin"}`} classNames='flex-1' primary/>
            </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}

export default DeleteComplaintComponent