"use client"

import { ExtendedContribution } from '@/types/admin'
import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, MoreVerticalIcon } from 'lucide-react'
import { useState, useMemo, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from 'next/image'
import Link from 'next/link'
import { MoreVertical, Download, Trash2, Copy } from 'lucide-react'
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/thumbnails.css"
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { toast } from 'sonner'
import { copyToClipboard } from '@/lib/utils'

const ContributionActions = ({ contribution }: {contribution: ExtendedContribution}) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [openLightBox, setOpenLightBox] = useState(false)
  const [showImageMoreOptions, setShowImageMoreOptions] = useState(false)

  // Categorize attachments into images and documents
  const { images, documents } = useMemo(() => {
    const images: string[] = []
    const documents: string[] = []
    
    contribution.attachments.forEach(attachment => {
      const extension = attachment.split('.').pop()?.toLowerCase()
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
        images.push(attachment)
      } else {
        documents.push(attachment)
      }
    })
    
    return { images, documents }
  }, [contribution.attachments])

  const handleRemovePhoto = useCallback(async () => {
    try {
      const response = await api.patch(`/api/admin/contributions/removeContributtionAttch/${contribution.id}?fileName=${images[currentImageIndex]}&fileType=attachments`)
      if(response.data.success){
        toast.success('Sapo larguat me sukses imazhin')
        router.refresh()
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.response.data.message || "Dicka shkoi gabim!")
    } finally {
      setShowImageMoreOptions(false)
    }
  }, [contribution.id, images, currentImageIndex, router])

  const handleDownloadPhoto = useCallback(async () => {
    try {
      const response = await api.get(`/api/admin/download?file=${images[currentImageIndex]}`, {
        responseType: "blob"
      })

      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a")
      a.href = url
      a.download = images[currentImageIndex]
      document.body.appendChild(a)
      a.click()

      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      if(response.status === 200){
        toast.success('Tani do filloje shkarkimi i imazhit')
      }
    } catch (error) {
      console.error(error)
      toast.error('Dicka shkoi gabim! Ju lutem provoni perseri.')
    } finally {
      setShowImageMoreOptions(false)
    }
  }, [images, currentImageIndex])

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length)
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)

  const nextAudio = () => setCurrentAudioIndex((prev) => (prev + 1) % contribution.audiosAttached.length)
  const prevAudio = () => setCurrentAudioIndex((prev) => (prev - 1 + contribution.audiosAttached.length) % contribution.audiosAttached.length)

  const nextVideo = () => setCurrentVideoIndex((prev) => (prev + 1) % contribution.videosAttached.length)
  const prevVideo = () => setCurrentVideoIndex((prev) => (prev - 1 + contribution.videosAttached.length) % contribution.videosAttached.length)

  const getCategoryLabel = (category: string) => {
    const words = category.split('_').map(word => {
      if (word === 'NE') return 'në'
      return word.charAt(0) + word.slice(1).toLowerCase()
    })
    return words.join(' ')
  }

  const deleteContribution = useCallback(async () => {
    try {
      const response = await api.delete(`/api/admin/contributions/${contribution.id}`)
      if(response.data.success){
        toast.success(`Sapo fshite me sukses kontribuimin per ankesen ${contribution.complaint.title}`)
        router.refresh()
        setOpen(false)
      }
    } catch (error: any) {
      console.error()
      toast.error(error.response.data.message || "Dicka shkoi gabim! Ju lutem provoni perseri.")
    }
  }, [contribution.id, contribution.complaint.title, router])

  const acceptContribution = useCallback(async () => {
    try {
      const response = await api.patch(`/api/admin/contributions/${contribution.id}`, { contributionValidated: true })
      if(response.data.success){
        toast.success(`Sapo pranuat kontribuimin per ankesen ${contribution.complaint.title}`)
        router.refresh()
        setOpen(false)
      }
    } catch (error:any) {
      console.error(error)
      toast.error(error.response.data.message || "Dicka shkoi gabim! Ju lutem provoni perseri.")
    }
  }, [contribution.id, contribution.complaint.title, router])

  return (

    <>
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
                <Button className="w-full cursor-pointer" variant={"default"} onClick={() => setOpen(true)}>Shiko Kontribimin</Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="flex justify-between bg-gray-100 hover:bg-gray-300! cursor-pointer">
                <Link href={`mailto:${contribution.user.email}`}>Kontakto kontribuesin</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Button className="w-full cursor-pointer" variant={"destructive"}>Fshije</Button>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl! max-h-[90vh] overflow-y-auto">
            <DialogHeader>
            <DialogTitle>Detajet e Kontributit</DialogTitle>
            <DialogDescription>
                Shiko dhe menaxho kontributin për ankesën: {contribution.complaint.title}
            </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
            {/* Complaint Info */}
            <div className="flex justify-between items-start">
                <div>
                <Link 
                    href={`/ankesat/${contribution.complaint.id}`} 
                    className="text-lg font-semibold text-gray-900 hover:underline"
                    target="_blank"
                >
                    {contribution.complaint.title}
                </Link>
                <p className="text-sm text-gray-600 mt-1">Kontribut për ankesë</p>
                </div>
                <div className='flex flex-col gap-1'>
                <Badge variant="outline">{getCategoryLabel(contribution.complaint.category)}</Badge>
                <Badge className='ml-auto'>{contribution.complaint.municipality}</Badge>
                </div>
            </div>

            {/* User info */}
            <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden">
                <Image
                    src={contribution.user.userProfileImage}
                    alt={contribution.user.fullName}
                    fill
                    className="object-cover"
                />
                </div>
                <div className='flex flex-row justify-between flex-1'>
                <div>
                    <p className="text-sm font-medium text-gray-900">{contribution.user.fullName}</p>
                    <p className="text-xs text-gray-500">Kontribues</p>
                </div>
                <div className='flex flex-col'>
                    <p className="text-sm font-medium text-gray-900">Username</p>
                    <p className="text-xs text-gray-500">{contribution.user.username}</p>
                </div>
                </div>
            </div>

            {/* Image Carousel */}
            {images.length > 0 && (
                <div className="relative">
                <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                    src={images[currentImageIndex]}
                    alt={`Attachment ${currentImageIndex + 1}`}
                    fill
                    className="object-contain cursor-pointer"
                    onClick={() => {setOpenLightBox(true); document.body.style.pointerEvents = "all"}}
                    />
                </div>
                {images.length > 1 && (
                    <>
                    <button
                        onClick={(e) => { e.stopPropagation(); prevImage(); }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); nextImage(); }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                        {images.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                        />
                        ))}
                    </div>
                    </>
                )}
                </div>
            )}

            <Lightbox 
                open={openLightBox} 
                close={() => setOpenLightBox(false)} 
                index={currentImageIndex} 
                slides={images.map((img) => ({src: img}))} 
                plugins={[Thumbnails]}
                render={{
                controls: () => (
                    <>
                    <Button 
                        onClick={() => setShowImageMoreOptions(!showImageMoreOptions)} 
                        variant={"outline"} 
                        className='fixed cursor-pointer top-2 left-2'
                    >
                        <MoreVerticalIcon />
                    </Button>
                    {showImageMoreOptions && (
                        <div className='fixed top-12 left-2 flex flex-col gap-1 bg-white rounded-lg p-1'>
                        <Button 
                            onClick={handleRemovePhoto} 
                            variant={"destructive"} 
                            className='cursor-pointer text-white'
                        >
                            Fshij <Trash2 className="ml-2 h-4 w-4" />
                        </Button>
                        <Button 
                            onClick={handleDownloadPhoto} 
                            variant={"default"} 
                            className='cursor-pointer'
                        >
                            Shkarko <Download className="ml-2 h-4 w-4" />
                        </Button>
                        <Button 
                            onClick={() => {
                            copyToClipboard(images[currentImageIndex]); 
                            setShowImageMoreOptions(false)
                            }} 
                            variant={"outline"} 
                            className='cursor-pointer'
                        >
                            Kopjo Linkun <Copy className="ml-2 h-4 w-4" />
                        </Button>
                        </div>
                    )}
                    </>
                ),
                }}
            />

            {/* Video Carousel */}
            {contribution.videosAttached.length > 0 && (
                <div className="relative">
                <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
                    <video
                    src={contribution.videosAttached[currentVideoIndex]}
                    controls
                    className="w-full max-h-48"
                    />
                </div>
                {contribution.videosAttached.length > 1 && (
                    <div className="flex justify-between mt-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); prevVideo(); }}
                        className="text-sm flex items-center gap-1 text-gray-600"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Previous
                    </button>
                    <span className="text-sm text-gray-500">
                        {currentVideoIndex + 1} / {contribution.videosAttached.length}
                    </span>
                    <button
                        onClick={(e) => { e.stopPropagation(); nextVideo(); }}
                        className="text-sm flex items-center gap-1 text-gray-600"
                    >
                        Next
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    </div>
                )}
                </div>
            )}

            {/* Audio Carousel */}
            {contribution.audiosAttached.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-full">
                    <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                    </svg>
                    </div>
                    <audio
                    src={contribution.audiosAttached[currentAudioIndex]}
                    controls
                    className="flex-1"
                    />
                </div>
                {contribution.audiosAttached.length > 1 && (
                    <div className="flex justify-between mt-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); prevAudio(); }}
                        className="text-sm flex items-center gap-1 text-gray-600"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Previous
                    </button>
                    <span className="text-sm text-gray-500">
                        {currentAudioIndex + 1} / {contribution.audiosAttached.length}
                    </span>
                    <button
                        onClick={(e) => { e.stopPropagation(); nextAudio(); }}
                        className="text-sm flex items-center gap-1 text-gray-600"
                    >
                        Next
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                    </div>
                )}
                </div>
            )}

            {/* Document list */}
            {documents.length > 0 && (
                <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Dokumenta:</p>
                <div className="space-y-1">
                    {documents.map((doc, index) => (
                    <a
                        key={index}
                        href={doc}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        {doc.split('/').pop()}
                    </a>
                    ))}
                </div>
                </div>
            )}

            <div className='flex flex-row justify-between gap-2 items-center'>
                <Badge variant={contribution.complaint.company ? "default" : "destructive"}>
                {contribution.complaint.company ? `Kunder ${contribution.complaint.company.name}` : "Ankese komunale"}
                </Badge>
                <div className="flex gap-2">
                <Button
                    onClick={deleteContribution}
                    variant="destructive"
                >
                    Refuzoni
                </Button>
                <Button
                    onClick={acceptContribution}
                    variant="default"
                >
                    Pranoni
                </Button>
                </div>
            </div>
            </div>
        </DialogContent>
        </Dialog>
    </>

  )
}

export default ContributionActions