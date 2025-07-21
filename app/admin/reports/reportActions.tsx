import React, { useCallback, useState } from 'react'
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

const reportEditSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(ReportsCategory),
  attachments: z.array(z.string()),
  audioAttachments: z.array(z.string()),
  videoAttachments: z.array(z.string())
})

type ReportEditFormValues = z.infer<typeof reportEditSchema>

const ReportActions = ({report}: {report: ExtendedReport}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false)
  const [imagePreviews, setImagePreviews] = useState<string[]>(report.attachments)
  const [audioPreviews, setAudioPreviews] = useState<string[]>(report.audioAttachments)
  const [videoPreviews, setVideoPreviews] = useState<string[]>(report.videoAttachments)
  const [isDeletting, setIsDeletting] = useState(false)

  const [lighboxIndex, setLighboxIndex] = useState(0)
  const [openLightBox, setOpenLightBox] = useState(false)

  const { control, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<ReportEditFormValues>({
    resolver: zodResolver(reportEditSchema),
    defaultValues: {
      title: report.title,
      description: report.description,
      category: report.category,
      attachments: report.attachments,
      audioAttachments: report.audioAttachments,
      videoAttachments: report.videoAttachments
    }
  })

  const handleDeleteReport = useCallback(async () => {
    setIsDeletting(true)
    try {
      const response = await api.delete(report.id)
      if(response.data.success){
        toast.success(`Sapo fshite raportin me titull ${report.title} ne lidhje me ankesen ${report.complaint.title}`)
        router.refresh();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message || "Dicka shkoi gabim")
    } finally {
      setIsDeletting(false)
    }
  }, [report.id, router, report.complaint.title, report.title])

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'attachments' | 'audioAttachments' | 'videoAttachments',
    setPreviews: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const files = e.target.files
    if (!files) return

    const newPreviews: string[] = []
    const fileReaders: FileReader[] = []
    let filesRead = 0

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      fileReaders.push(reader)

      reader.onload = (event) => {
        filesRead++
        if (event.target?.result) {
          newPreviews.push(event.target.result as string)
        }

        if (filesRead === files.length) {
          const updatedPreviews = [...(field === 'attachments' ? imagePreviews : 
                                    field === 'audioAttachments' ? audioPreviews : 
                                    videoPreviews), ...newPreviews]
          setPreviews(updatedPreviews)
          setValue(field, updatedPreviews)
        }
      }

      reader.readAsDataURL(file)
    })
  }

  const removeAttachment = (
    index: number,
    field: 'attachments' | 'audioAttachments' | 'videoAttachments',
    setPreviews: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    const updatedPreviews = [...(field === 'attachments' ? imagePreviews : 
                              field === 'audioAttachments' ? audioPreviews : 
                              videoPreviews)]
    updatedPreviews.splice(index, 1)
    setPreviews(updatedPreviews)
    setValue(field, updatedPreviews)
  }

  const onSubmit = async (data: ReportEditFormValues) => {
    try {
      const response = await api.patch(`/api/reports/${report.id}`, data)
      if (response.data.success) {
        toast.success('Raporti u perditesua me sukses!')
        router.refresh()
        setOpen(false)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Dicka shkoi gabim!")
    } 
  }

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
            {/* Complaint Info (readonly) */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium mb-2">Informacione mbi ankesen:</h4>
              <p><span className="font-semibold">Titulli:</span> {report.complaint.title}</p>
              {report.complaint.company && (
                <p><span className="font-semibold">Kompania:</span> {report.complaint.company.name}</p>
              )}
            </div>

            {/* Title */}
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

            {/* Description */}
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

            {/* Category */}
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

            {/* Attachments */}
            <div className="space-y-4">
              {/* Images */}
              <div className="space-y-2">
                <Label>Imazhet</Label>
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <Image
                          src={preview}
                          alt={`Preview ${index}`}
                          width={200}
                          height={200}
                          className="rounded-md cursor-pointer object-cover h-32 w-full"
                          onClick={() => {setLighboxIndex(index); setOpenLightBox(true); document.body.style.pointerEvents = "all";}}
                        />
                        <button
                          type="button"
                          onClick={() => removeAttachment(index, 'attachments', setImagePreviews)}
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
                    onChange={(e) => handleFileUpload(e, 'attachments', setImagePreviews)}
                  />
                </label>
              </div>

                

              {/* Audio */}
              <div className="space-y-2">
                <Label>Audio</Label>
                {audioPreviews.length > 0 && (
                  <div className="space-y-2">
                    {audioPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <audio controls src={preview} className="w-full" />
                        <button
                          type="button"
                          onClick={() => removeAttachment(index, 'audioAttachments', setAudioPreviews)}
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
                    onChange={(e) => handleFileUpload(e, 'audioAttachments', setAudioPreviews)}
                  />
                </label>
              </div>

              {/* Videos */}
              <div className="space-y-2">
                <Label>Video</Label>
                {videoPreviews.length > 0 && (
                  <div className="space-y-2">
                    {videoPreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <video controls src={preview} className="w-full rounded-md" />
                        <button
                          type="button"
                          onClick={() => removeAttachment(index, 'videoAttachments', setVideoPreviews)}
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
                    onChange={(e) => handleFileUpload(e, 'videoAttachments', setVideoPreviews)}
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
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Duke ruajtur..." : "Ruaj ndryshimet"}
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