"use client"
import { createComplaintFormSchema } from '@/lib/schemas/createComplaintsSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {z} from "zod"
import { Label } from './ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Category, Companies, Municipality } from '@/app/generated/prisma'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Input } from './ui/input'
import { Upload, Check, ChevronsUpDown } from 'lucide-react'
import { Textarea } from './ui/textarea'
import CTAButton from './CTAButton'
import { X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Checkbox } from './ui/checkbox'
import { Button } from './ui/button'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'
import { cn } from '@/lib/utils'
import { useSession } from 'next-auth/react'
import { GrDocument } from 'react-icons/gr'
import { uploadEvidenceFiles } from '@/lib/blobUpload'

type ComplaintFormType = z.infer<typeof createComplaintFormSchema>

type FilePreview = { name: string; file: File; previewUrl: string }

const CreateComplaintForm = () => {
  const {update, data: session} = useSession();
  if(!session) return null;
  const router = useRouter();
  const [attachmentFiles, setAttachmentFiles] = useState<FilePreview[]>([])
  const [audioFiles, setAudioFiles] = useState<FilePreview[]>([]);
  const [videoFiles, setVideoFiles] = useState<FilePreview[]>([]);

  const [openCompaniesCombobox, setOpenCompaniesCombobox] = useState(false)
  const [openCategories, setOpenCategories] = useState(false)
  const [openMunicipality, setOpenMunicipality] = useState(false)

  const [comunalComplaint, setComunalComplaint] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const {data, isLoading, isError, refetch} = useQuery({
    queryKey: ['companiesForm'],
    queryFn: async () => {
      const res = await api.get<Companies[]>(`/api/companiesAllComplaintsForm`);
      return res.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  })

  const {control, handleSubmit, setValue, formState: {errors, isSubmitting}} = useForm<ComplaintFormType>({
    resolver: zodResolver(createComplaintFormSchema),
    defaultValues: useMemo(() => ({
      companyId: null,
      title: "",
      description: "",
      category: "FAVORIZIMI",
      municipality: "PRISHTINE"
    }), []),
    mode: "onChange"
  })

  const formatCategoryDisplay = useCallback((value: string): string => {
    let displayText = value.replace(/_/g, ' ');
    displayText = displayText.toLowerCase();
    return displayText.replace(/\b\w/g, char => char.toUpperCase());
  }, [])

  useEffect(() => {
    if(comunalComplaint){
      setValue("companyId", null)
    }
  }, [comunalComplaint, setValue])

  useEffect(() => {
    return () => {
      [...attachmentFiles, ...audioFiles, ...videoFiles].forEach((p) =>
        URL.revokeObjectURL(p.previewUrl)
      );
    };
  }, [])

  const addFiles = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
    setFiles: React.Dispatch<React.SetStateAction<FilePreview[]>>,
    acceptType?: string
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newPreviews = Array.from(files)
      .filter((file) => !acceptType || file.type.includes(acceptType))
      .map((file) => ({
        name: file.name,
        file,
        previewUrl: URL.createObjectURL(file),
      }));

    setFiles((prev) => [...prev, ...newPreviews]);
    event.target.value = "";
  }, []);

  const removeFile = useCallback((
    index: number,
    setFiles: React.Dispatch<React.SetStateAction<FilePreview[]>>
  ) => {
    setFiles((prev) => {
      const removed = prev[index];
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const clearAllPreviews = useCallback(() => {
    [...attachmentFiles, ...audioFiles, ...videoFiles].forEach((p) =>
      URL.revokeObjectURL(p.previewUrl)
    );
    setAttachmentFiles([]);
    setAudioFiles([]);
    setVideoFiles([]);
  }, [attachmentFiles, audioFiles, videoFiles]);

  const onSubmit = useCallback(async (data: ComplaintFormType) => {
    try {
      setIsUploading(true)
      const entityId = crypto.randomUUID()
      const { attachments, audiosAttached, videosAttached } = await uploadEvidenceFiles(
        entityId,
        attachmentFiles.map((p) => p.file),
        audioFiles.map((p) => p.file),
        videoFiles.map((p) => p.file)
      )

      const response = await api.post(`/api/createComplaint`, {
        ...data,
        attachments,
        audiosAttached,
        videosAttached,
      })
      if(response.data.success){
        toast.success('Ju sapo keni krijuar ankese/raportim me sukses!')
        clearAllPreviews()
        await update({
          complaints: session?.user.complaints + 1
        })
      }
      if(response.data.url){
        router.push(`/ankesat/${response.data.url}`)
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Dicka shkoi gabim! Ju lutem provoni perseri.")
    } finally {
      setIsUploading(false)
    }
  }, [attachmentFiles, audioFiles, videoFiles, clearAllPreviews, router, session, update])

  const isBusy = isSubmitting || isUploading

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto flex flex-col gap-4 my-4 shadow-lg p-4">
      <div className='flex flex-row max-[575]:flex-col gap-2 max-[575]:gap-4 justify-between'>
        <div className='flex-1'>
          <Label htmlFor='title' className="mb-1">Titulli i ankesës/raportimit</Label>
          <Controller
            control={control}
            name="title"
            render={({field}) => (
              <Input id='title' {...field} placeholder='Një titull terheqës per krijimin e ankesës/raportimit...'/>
            )}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
          )}
        </div>
        <div className='flex-1'>
          <Label htmlFor='komuna' className="mb-1">
            Zgjidhni komunën
          </Label>

          <Controller
            control={control}
            name="municipality"
            render={({field}) => (
              <Popover open={openMunicipality} onOpenChange={setOpenMunicipality}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                    aria-expanded={openMunicipality}
                    id="komuna"
                  >
                    {field.value.replace("_", " ") || "Zgjidhni komunën..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 max-h-[300px] overflow-y-auto">
                  <Command>
                    <CommandInput placeholder="Kërko komunën..." className="h-9" />
                    <CommandEmpty>Nuk u gjet asnjë komunë.</CommandEmpty>
                    <CommandGroup>
                      {Object.values(Municipality).map((municipality) => (
                        <CommandItem
                          key={municipality}
                          value={municipality}
                          onSelect={() => {
                            field.onChange(municipality)
                            setOpenMunicipality(false)
                          }}
                        >
                          {municipality.replace("_", " ")}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              field.value === municipality ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          />

          {errors.municipality && (
            <p className="text-red-500 text-sm mt-1">
              Ju lutem zgjidhni një komunë.
            </p>
          )}
        </div>
      </div>
      <div className='flex flex-row items-center max-[575px]:flex-col justify-between gap-2 max-[575px]:gap-4'>
        <div className="flex-1 w-full">
          <div className='flex mb-1 flex-row items-center justify-between gap-2'>
            <div className='flex flex-row items-center gap-1'>
              <Label htmlFor='companyId'>Kompania</Label>
              {comunalComplaint ? (
                <X size={16} color='red'/>
              ) : (
                <Check size={16} color='green'/>
              )}
            </div>
            <div className="flex items-center gap-1.5">
              <Checkbox id="changecomplaintType" onCheckedChange={(checked) => setComunalComplaint(checked as boolean)} checked={comunalComplaint}/>
              <Label htmlFor="changecomplaintType">Ankesë Komunale?</Label>
            </div>
          </div>
          <Controller
            control={control}
            name='companyId'
            render={({field}) => (
              <Popover open={openCompaniesCombobox} onOpenChange={setOpenCompaniesCombobox}>
                <PopoverTrigger disabled={comunalComplaint} asChild className='cursor-pointer w-full '>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCompaniesCombobox}
                    className="w-full justify-between font-normal"
                  >
                    {field.value
                      ? data?.find((company) => company.id === field.value)?.name
                      : "Zgjidh një kompani"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-h-[300px] overflow-y-auto p-0">
                  <Command>
                    <CommandInput placeholder="Kerkoni kompanitë..." />
                    <CommandEmpty>Nuk u gjet asnjë kompani.</CommandEmpty>
                    <CommandGroup>
                      {isLoading ? (
                        <CommandItem value="loading">Ju lutem prisni...</CommandItem>
                      ) : isError ? (
                        <CommandItem value="error" onSelect={() => refetch()}>
                          Dicka shkoi gabim, klikoni për rifreskim.
                        </CommandItem>
                      ) : !data || data.length === 0 ? (
                        <CommandItem value="empty">Nuk u gjet ndonjë kompani</CommandItem>
                      ) : (
                        data.map((company) => (
                          <CommandItem
                            key={company.id}
                            value={company.id}
                            onSelect={() => {
                              field.onChange(company.id)
                              setOpenCompaniesCombobox(false)
                            }}
                          >
                            {company.name}
                            <Check
                              className={cn(
                                "ml-auto h-4 w-4",
                                field.value === company.id ? "opacity-100" : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))
                      )}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.companyId && (
            <p className="text-red-500 text-sm mt-1">{errors.companyId.message}</p>
          )}
        </div>
        <div className="flex-1 w-full">
          <Label className='mb-1' htmlFor='category'>Kategoria e ankesës</Label>
          <Controller
            control={control}
            name="category"
            render={({ field }) => (
              <Popover open={openCategories} onOpenChange={setOpenCategories}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCategories}
                    className="w-full justify-between font-normal"
                  >
                    {field.value
                      ? formatCategoryDisplay(field.value)
                      : "Zgjidh një arsyje të ankesës"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-h-[300px] overflow-y-auto p-0">
                  <Command>
                    <CommandInput placeholder="Kerkoni arsyet..." />
                    <CommandEmpty>Nuk u gjet asnjë arsye.</CommandEmpty>
                    <CommandGroup>
                      {Object.keys(Category).map((item) => (
                        <CommandItem
                          key={item}
                          value={item}
                          onSelect={() => {
                            field.onChange(item)
                            setOpenCategories(false)
                          }}
                        >
                          {formatCategoryDisplay(item)}
                          <Check
                            className={cn(
                              "ml-auto h-4 w-4",
                              field.value === item ? "opacity-100" : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">Zgjidhni një opsion</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor='description' className="mb-1">Pershkrimi i ankesës</Label>
        <Controller
          control={control}
          name="description"
          render={({field}) => (
            <Textarea id='description' {...field} placeholder='Pershkruani ankesën ne menyrat dhe në detajet më të mira të mundshme...' rows={10}/>
          )}
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>


      <div className='mx-auto w-full'>
        <Label htmlFor='attachments' className="mb-1 flex items-center justify-center max-[800px]:justify-start">Bashkëngjitjet e Imazheve</Label>
        <div className="space-y-2">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-center px-1 text-muted-foreground">
                Klikoni për të ngarkuar Imazhe/Dokumente <span className='text-indigo-600'>(Maksimum: 50MB)</span>
              </p>
            </div>
            <Input
              id='attachments'
              type="file"
              multiple
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              onChange={(e) => addFiles(e, setAttachmentFiles)}
            />
          </label>
          {attachmentFiles.length > 0 && <div className='shadow-lg p-4 mt-2 flex gap-3 overflow-x-auto w-full'>
            {attachmentFiles.map((preview, index) => (
              <div key={index} className='flex-shrink-0' style={{ position: 'relative' }}>
                {preview.file.type.startsWith('image/') ? (
                  <div className='flex flex-col items-center'>
                    <Image
                      src={preview.previewUrl}
                      alt={`preview ${index}`}
                      width={100}
                      height={100}
                      unoptimized
                      className='h-44 w-fit object-contain mx-auto'
                    />
                    <p className='text-sm text-gray-600 max-w-[120px] line-clamp-1'>{preview.name}</p>
                  </div>
                ) : (
                  <div className='flex flex-col items-center'>
                    <GrDocument className='w-fit h-44 p-1 border'/>
                    <p className='text-sm text-gray-600 max-w-[100px] line-clamp-1'>{preview.name}</p>
                  </div>
                )}
                <button
                  type="button"
                  className='flex items-center justify-center'
                  onClick={() => removeFile(index, setAttachmentFiles)}
                  style={{
                    position: 'absolute',
                    top: -6,
                    right: -6,
                    background: 'red',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    cursor: 'pointer'
                  }}
                >
                  <X size={14}/>
                </button>
              </div>
            ))}
          </div>}
        </div>
      </div>
      <div className="flex flex-row items-center justify-between gap-4 max-[800px]:flex-col">
        <div className='flex-1 w-full'>
          <Label htmlFor='audioInput' className='mb-1'>Ngarkoni Audio/Inqizime</Label>
          <div className="space-y-2">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-center px-1 text-muted-foreground">
                  Klikoni për të ngarkuar Audio/Inqizime <span className='text-indigo-600'>(Maksimum: 50MB)</span>
                </p>
              </div>
              <Input
                id='audioInput'
                type="file"
                multiple
                className="hidden"
                accept="audio/*"
                onChange={(e) => addFiles(e, setAudioFiles, 'audio')}
              />
            </label>
            {audioFiles.length > 0 && <div className='shadow-lg p-4 mt-2 overflow-x-auto w-full flex flex-row gap-3'>
              {audioFiles.map((preview, index) => (
                <div key={index} style={{ position: 'relative' }} className='flex-shrink-0'>
                  <div className='flex flex-col items-center'>
                    <audio
                      src={preview.previewUrl}
                      controls
                      className='w-full h-44'
                    />
                    <p className='text-sm text-gray-600 max-w-[140px] line-clamp-1'>{preview.name}</p>
                  </div>
                  <button
                    type="button"
                    className='flex items-center justify-center'
                    onClick={() => removeFile(index, setAudioFiles)}
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={14}/>
                  </button>
                </div>
              ))}
            </div>}
          </div>
        </div>
        <div className="flex-1 w-full">
          <Label htmlFor='videoInput' className='mb-1'>Ngarkoni Video/Inqizime</Label>
          <div className="space-y-2">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-center px-1 text-muted-foreground">
                  Klikoni për të ngarkuar Video/Inqizime <span className='text-indigo-600'>(Maksimum: 50MB)</span>
                </p>
              </div>
              <Input
                id='videoInput'
                type="file"
                multiple
                className="hidden"
                accept="video/*"
                onChange={(e) => addFiles(e, setVideoFiles, 'video')}
              />
            </label>
            {videoFiles.length > 0 && <div className='shadow-lg p-4 mt-2 flex flex-row gap-3 w-full overflow-x-auto'>
              {videoFiles.map((preview, index) => (
                <div key={index} style={{ position: 'relative' }} className='flex-shrink-0'>
                  <div className='flex flex-col items-center'>
                    <video
                      src={preview.previewUrl}
                      controls
                      className='w-full h-44'
                    />
                    <p className='text-sm text-gray-600 max-w-[140px] line-clamp-1'>{preview.name}</p>
                  </div>
                  <button
                    type="button"
                    className='flex items-center justify-center'
                    onClick={() => removeFile(index, setVideoFiles)}
                    style={{
                      position: 'absolute',
                      top: -6,
                      right: -6,
                      background: 'red',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      cursor: 'pointer'
                    }}
                  >
                    <X size={14}/>
                  </button>
                </div>
              ))}
            </div>}
          </div>
        </div>
      </div>
      <div className="flex-1">
          <CTAButton type='submit' isLoading={isBusy} text={isBusy ? "Duke aplikuar..." : "Apliko per ankesen/raportimin"} classNames="flex-1 w-full mt-2" primary/>
      </div>
    </form>
  )
}

export default memo(CreateComplaintForm)
