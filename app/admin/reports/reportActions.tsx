import React, { useCallback, useEffect, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Image as ImageIcon, Video, AudioLines, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import api from '@/lib/api'
import { ExtendedReport } from '@/types/admin'
import { ReportsCategory } from '@/app/generated/prisma'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from 'next/image'
import Lightbox from 'yet-another-react-lightbox'
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails'
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { reportFormSchema } from '@/lib/schemas/reportsSchema'
import { uploadEvidenceFiles } from '@/lib/blobUpload'

const reportEditFormSchema = reportFormSchema.omit({ email: true })

type ReportEditFormValues = z.infer<typeof reportEditFormSchema>

type FilePreview = { file: File; previewUrl: string }

type AttachmentItem =
  | { kind: 'url'; url: string }
  | { kind: 'file'; file: File; previewUrl: string }

const ReportActions = ({report}: {report: ExtendedReport}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false)
  const [imageItems, setImageItems] = useState<AttachmentItem[]>(
    report.attachments.map((url) => ({ kind: 'url', url }))
  )
  const [audioItems, setAudioItems] = useState<AttachmentItem[]>(
    report.audioAttachments.map((url) => ({ kind: 'url', url }))
  )
  const [videoItems, setVideoItems] = useState<AttachmentItem[]>(
    report.videoAttachments.map((url) => ({ kind: 'url', url }))
  )
  const [isDeletting, setIsDeletting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const [lighboxIndex, setLighboxIndex] = useState(0)
  const [openLightBox, setOpenLightBox] = useState(false)

  const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ReportEditFormValues>({
    resolver: zodResolver(reportEditFormSchema),
    defaultValues: {
      title: report.title,
      description: report.description,
      category: report.category,
    }
  })

  useEffect(() => {
    if (open) {
      reset({
        title: report.title,
        description: report.description,
        category: report.category,
      })
      setImageItems(report.attachments.map((url) => ({ kind: 'url', url })))
      setAudioItems(report.audioAttachments.map((url) => ({ kind: 'url', url })))
      setVideoItems(report.videoAttachments.map((url) => ({ kind: 'url', url })))
    }
  }, [open, report, reset])

  useEffect(() => {
    return () => {
      [...imageItems, ...audioItems, ...videoItems].forEach((item) => {
        if (item.kind === 'file') URL.revokeObjectURL(item.previewUrl)
      })
    }
  }, [])

  const handleDeleteReport = useCallback(async () => {
    setIsDeletting(true)
    try {
      const response = await api.delete(`/api/admin/reports/getReportsByComplaintId/${report.id}`)
      if(response.data.success){
        toast.success(`Sapo fshite raportin me titull ${report.title} ne lidhje me ankesen ${report.complaint.title}`)
        router.refresh();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Dicka shkoi gabim")
    } finally {
      setIsDeletting(false)
    }
  }, [report.id, router, report.complaint.title, report.title])

  const addFiles = (
    e: React.ChangeEvent<HTMLInputElement>,
    setItems: React.Dispatch<React.SetStateAction<AttachmentItem[]>>,
    acceptType?: string
  ) => {
    const files = e.target.files
    if (!files) return

    const newItems: AttachmentItem[] = Array.from(files)
      .filter((file) => !acceptType || file.type.includes(acceptType))
      .map((file) => ({
        kind: 'file' as const,
        file,
        previewUrl: URL.createObjectURL(file),
      }))

    setItems((prev) => [...prev, ...newItems])
    e.target.value = ""
  }

  const removeItem = (
    index: number,
    setItems: React.Dispatch<React.SetStateAction<AttachmentItem[]>>
  ) => {
    setItems((prev) => {
      const removed = prev[index]
      if (removed?.kind === 'file') URL.revokeObjectURL(removed.previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  const getPreviewSrc = (item: AttachmentItem) =>
    item.kind === 'url' ? item.url : item.previewUrl

  const imagePreviews = imageItems.map(getPreviewSrc)

  const onSubmit = async (data: ReportEditFormValues) => {
    try {
      setIsUploading(true)

      const newAttachmentFiles = imageItems.filter((i): i is FilePreview & { kind: 'file' } => i.kind === 'file').map((i) => i.file)
      const newAudioFiles = audioItems.filter((i): i is FilePreview & { kind: 'file' } => i.kind === 'file').map((i) => i.file)
      const newVideoFiles = videoItems.filter((i): i is FilePreview & { kind: 'file' } => i.kind === 'file').map((i) => i.file)

      const uploaded = await uploadEvidenceFiles(
        report.id,
        newAttachmentFiles,
        newAudioFiles,
        newVideoFiles,
        "reports"
      )

      const existingAttachments = imageItems.filter((i): i is { kind: 'url'; url: string } => i.kind === 'url').map((i) => i.url)
      const existingAudios = audioItems.filter((i): i is { kind: 'url'; url: string } => i.kind === 'url').map((i) => i.url)
      const existingVideos = videoItems.filter((i): i is { kind: 'url'; url: string } => i.kind === 'url').map((i) => i.url)

      const response = await api.patch(`/api/reports/${report.id}`, {
        ...data,
        attachments: [...existingAttachments, ...uploaded.attachments],
        audioAttachments: [...existingAudios, ...uploaded.audiosAttached],
        videoAttachments: [...existingVideos, ...uploaded.videosAttached],
      })
      if (response.data.success) {
        toast.success('Raporti u perditesua me sukses!')
        router.refresh()
        setOpen(false)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Dicka shkoi gabim!")
    } finally {
      setIsUploading(false)
    }
  }

  const isBusy = isSubmitting || isUploading

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
            <Link className="cursor-pointer bg-gray-100 hover:bg-gray-300" target="_blank" href={`/ankesat/${report.complaint.id}`}>Vizito ankesen</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Button onClick={handleDeleteReport} disabled={isDeletting} className="cursor-pointer w-full" variant={"destructive"}>{isDeletting ? "Duke fshire..." : "Fshije"}</Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl! max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edito Raportin</DialogTitle>
            <DialogDescription>
              Bej ndryshimet e nevojshme per raportin ne lidhje me ankesen: {report.complaint.title}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Informacione mbi ankesen:</h4>
              <p><span className="font-semibold">Titulli:</span> {report.complaint.title}</p>
              {report.complaint.company && (
                <p><span className="font-semibold">Kompania:</span> {report.complaint.company.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Titulli i Raportit</Label>
              <Controller
                name="title"
                control={control}
                render={({ field }) => (
                  <Input id="title" {...field} placeholder="Titulli i raportit..." />
                )}
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Pershkrimi</Label>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    id="description"
                    {...field}
                    placeholder="Pershkruani ne detaje arsyen e raportimit..."
                    rows={5}
                  />
                )}
              />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Kategoria</Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Zgjidhni kategorine" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ReportsCategory).map((category) => (
                        <SelectItem key={category} value={category}>
                          {category.split('_').map(word =>
                            word.charAt(0) + word.slice(1).toLowerCase()
                          ).join(' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Imazhet</Label>
                {imageItems.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {imageItems.map((item, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={getPreviewSrc(item)}
                          alt={`Preview ${index}`}
                          width={200}
                          height={200}
                          unoptimized={item.kind === 'file'}
                          className="rounded-md cursor-pointer object-cover h-32 w-full"
                          onClick={() => {setLighboxIndex(index); setOpenLightBox(true); document.body.style.pointerEvents = "all";}}
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(index, setImageItems)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50">
                  <div className="flex flex-col items-center justify-center p-4">
                    <ImageIcon className="h-6 w-6 mb-2" />
                    <p className="text-sm">Shto imazhe</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => addFiles(e, setImageItems)}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <Label>Audio</Label>
                {audioItems.length > 0 && (
                  <div className="space-y-2">
                    {audioItems.map((item, index) => (
                      <div key={index} className="relative group">
                        <audio controls src={getPreviewSrc(item)} className="w-full" />
                        <button
                          type="button"
                          onClick={() => removeItem(index, setAudioItems)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50">
                  <div className="flex flex-col items-center justify-center p-4">
                    <AudioLines className="h-6 w-6 mb-2" />
                    <p className="text-sm">Shto audio</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="audio/*"
                    className="hidden"
                    onChange={(e) => addFiles(e, setAudioItems, "audio")}
                  />
                </label>
              </div>

              <div className="space-y-2">
                <Label>Video</Label>
                {videoItems.length > 0 && (
                  <div className="space-y-2">
                    {videoItems.map((item, index) => (
                      <div key={index} className="relative group">
                        <video controls src={getPreviewSrc(item)} className="w-full rounded-md" />
                        <button
                          type="button"
                          onClick={() => removeItem(index, setVideoItems)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50">
                  <div className="flex flex-col items-center justify-center p-4">
                    <Video className="h-6 w-6 mb-2" />
                    <p className="text-sm">Shto video</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => addFiles(e, setVideoItems, "video")}
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Anulo
              </Button>
              <Button type="submit" disabled={isBusy}>
                {isBusy ? "Duke ruajtur..." : "Ruaj ndryshimet"}
              </Button>
              <Button disabled={isDeletting} variant={"destructive"}>{isDeletting ? "Duke fshire..." : "Fshij"}</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Lightbox
        open={openLightBox}
        close={() => setOpenLightBox(false)}
        slides={imagePreviews.map((img) => ({src: img}))}
        index={lighboxIndex}
        plugins={[Thumbnails]}
      />
    </>
  )
}

export default ReportActions
