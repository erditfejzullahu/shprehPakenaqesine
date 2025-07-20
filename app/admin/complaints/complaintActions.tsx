"use client"
import { createComplaintsSchema } from '@/lib/schemas/createComplaintsSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {z} from "zod"
import { Label } from '@/components/ui/label'
import { Category, Companies, Municipality } from '@/app/generated/prisma'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Input } from '@/components/ui/input'
import { FileUp, Image as ImageLucide, AudioLines, Video, Check, Upload, ChevronsUpDown, MoreHorizontal } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import CTAButton from '@/components/CTAButton'
import { ImagePlus, X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { cn, imageUrlToBase64 } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ExtendedComplaint } from '@/types/admin'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'

type ComplaintsType = z.infer<typeof createComplaintsSchema> 

const CreateComplaintDialog = ({complaint}: {complaint: ExtendedComplaint}) => {
    if(!complaint) return null;
    
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([])
  const [audioPreviews, setAudioPreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

  const [openCompaniesCombobox, setOpenCompaniesCombobox] = useState(false)
  const [openCategories, setOpenCategories] = useState(false)
  const [openMunicipality, setOpenMunicipality] = useState(false)

  const [comunalComplaint, setComunalComplaint] = useState(false)
  const [videoProgress, setVideoProgress] = useState<number | null>(null)
  const [attachmentProgress, setAttachmentProgress] = useState<number | null>(null)
  const [audioProgress, setAudioProgress] = useState<number | null>(null)

  const {data, isLoading, isError, refetch} = useQuery({
    queryKey: ['companiesForm'],
    queryFn: async () => {
      const res = await api.get<Companies[]>(`/api/companiesAllComplaintsForm`);
      return res.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  })  

  const {control, handleSubmit, setValue, reset, formState: {errors, isSubmitting}} = useForm<ComplaintsType>({
    resolver: zodResolver(createComplaintsSchema),
    defaultValues: useMemo(() => ({
      companyId: complaint.companyId,
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      attachments: complaint.attachments,
      audiosAttached: complaint.audiosAttached,
      videosAttached: complaint.videosAttached,
      municipality: complaint.municipality
    }), [complaint]),
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
    }else{
        setValue("companyId", complaint.companyId)
    }
  }, [comunalComplaint])

  useEffect(() => {
    if(complaint.companyId){        
        setValue("companyId", complaint.companyId)
    }
      if(complaint.attachments && complaint.attachments.length > 0){
        let attachments: string[] = []
        for(const attach of complaint.attachments){
            imageUrlToBase64(attach)
                .then(base64 => attachments.push(base64))
                .catch(console.error)
        }
        setValue("attachments", attachments)
        setAttachmentPreviews(attachments)
      }
    
      if(complaint.audiosAttached && complaint.audiosAttached.length > 0){
        let audAttachments: string[] = []
        for(const attach of complaint.audiosAttached){
            imageUrlToBase64(attach)
                .then(base64 => audAttachments.push(base64))
                .catch(console.error)
        }
        setValue("audiosAttached", audAttachments)
        setAudioPreviews(audAttachments)
      }
      
      if(complaint.videosAttached && complaint.videosAttached.length > 0){
        let vidAttachments: string[] = []
        for(const attach of complaint.videosAttached){
            imageUrlToBase64(attach)
                .then(base64 => vidAttachments.push(base64))
                .catch(console.error)
        }
        setValue("videosAttached", vidAttachments)
        setVideoPreviews(vidAttachments)
      }
  }, [complaint.videosAttached, complaint.companyId, complaint.audiosAttached, complaint.attachments])
  

  const onSubmit = useCallback(async (data: ComplaintsType) => {
    try {
      const response = await api.patch(`/api/admin/complaints/${complaint.id}`, {
        companyId: data.companyId,
        title: data.title,
        description: data.description,
        category: data.category,
        attachments: data.attachments,
        audiosAttached: data.audiosAttached,
        videosAttached: data.videosAttached,
        municipality: data.municipality
      })
      if(response.data.success){
        toast.success(`Ju sapo rifreskuat ankesen/raportimin ${complaint.title}`)
        setOpen(false);
        reset();
        setAttachmentPreviews([]);
        setAudioPreviews([]);
        setVideoPreviews([]);
        router.refresh();
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Dicka shkoi gabim! Ju lutem provoni perseri.")
    }
  }, [reset, complaint.title, complaint.id, router])

  const handleDeleteComplaint = useCallback(async () => {
    try {
        const response = await api.delete(`/api/admin/complaints/${complaint.id}`)
        if(response.data.success){
            toast.success(`Ju sapo fshite ankesen/raportimin ${complaint.title}`)
            router.refresh();
        }
    } catch (error: any) {
        console.error(error);
        toast.error(error.response.data.message || "Dicka shkoi gabim")
    }
  }, [complaint.id, router, complaint.title])

  const handleFileChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (value: string[]) => void
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newPreviews: string[] = [];
    const fileReaders: FileReader[] = [];
    let filesRead = 0;
    setAttachmentProgress(0)
    let fakeProgress = 0;
  
    const interval = setInterval(() => {
      fakeProgress += 5;
      setAttachmentProgress(Math.min(fakeProgress, 95))
    }, 50);

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      fileReaders.push(reader);

      reader.onloadend = () => {
        filesRead++;
        if (reader.result) {
          newPreviews.push(reader.result as string);
        }
        
        if (filesRead === files.length) {
          clearInterval(interval);
          const updatedPreviews = [...attachmentPreviews, ...newPreviews];
          setAttachmentPreviews(updatedPreviews);
          fieldOnChange(updatedPreviews);
          setAttachmentProgress(null)
        }
      };
      
      reader.readAsDataURL(file);
    });
  }, []);

  const handleMediaChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (value: string[]) => void,
    setPreviews: React.Dispatch<React.SetStateAction<string[]>>,
    currentPreviews: string[],
    acceptType: string
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newPreviews: string[] = [];
    const fileReaders: FileReader[] = [];
    let filesRead = 0;

    let fakeProgress = 0;

    const interval = setInterval(() => {
      fakeProgress += 5;
      setVideoProgress(Math.min(fakeProgress, 95))
    }, 100);

    switch (acceptType) {
      case "audio":
        setAudioProgress(0)
        break;
      case "video":
        setVideoProgress(0)
        break;
    }

    Array.from(files).forEach((file) => {
      if (!file.type.includes(acceptType)) {
        console.warn(`Skipped ${file.name} - not a ${acceptType} file`);
        return;
      }

      const reader = new FileReader();
      fileReaders.push(reader);

      reader.onloadend = () => {
        filesRead++;
        if (reader.result) {
          newPreviews.push(reader.result as string);
        }

        if (filesRead === newPreviews.length) {
          clearInterval(interval);
          switch (acceptType) {
            case "video":
              setVideoProgress(null)
              break;
            case "audio":
              setAudioProgress(null)
              break;
          }
          const updatedPreviews = [...currentPreviews, ...newPreviews];
          setPreviews(updatedPreviews);
          fieldOnChange(updatedPreviews);
        }
      };

      reader.readAsDataURL(file);
    });
  }, []);

  const removeMedia = useCallback((
    index: number,
    fieldOnChange: (value: string[]) => void,
    setPreviews: React.Dispatch<React.SetStateAction<string[]>>,
    currentPreviews: string[]
  ) => {
    const updatedPreviews = currentPreviews.filter((_, i) => i !== index);
    setPreviews(updatedPreviews);
    fieldOnChange(updatedPreviews);
  }, [audioPreviews, videoPreviews]);

  const removeImage = useCallback((
    index: number,
    fieldOnChange: (value: string[]) => void
  ) => {
    const updatedPreviews = attachmentPreviews.filter((_, i) => i !== index);
    setAttachmentPreviews(updatedPreviews);
    fieldOnChange(updatedPreviews);
  }, [attachmentPreviews]);


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
            <Link className="cursor-pointer bg-gray-100 hover:bg-gray-300" target="_blank" href={`/ankesat/${complaint.id}`}>Shiko</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
            <Button onClick={handleDeleteComplaint} className="cursor-pointer w-full" variant={"destructive"}>Fshije</Button>
        </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
    <Dialog open={open} onOpenChange={() => {setOpen(false); reset()}}>
      <DialogContent className="max-w-4xl! max-h-[90vh] overflow-y-auto">
        <DialogHeader>
            <DialogTitle>Ndrysho te dhenat e ankeses/raportimit</DialogTitle>
            <DialogDescription>Perditesoni te dhenat e ankeses/raportimit {complaint.title}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className='flex flex-row gap-2 justify-between'>
            <div className='flex-1'>
              <Label htmlFor='title' className="mb-1">Titulli i ankeses/raportimit</Label>
              <Controller 
                control={control}
                name="title"
                render={({field}) => (
                  <Input id='title' {...field} placeholder='Nje titull terheqes per krijimin e ankeses/raportimit...'/>
                )}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
              )}
            </div>
            <div className='flex-1'>
              <Label htmlFor='komuna' className="mb-1">
                Zgjidhni komunen
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
          <div className='flex flex-row items-center justify-between gap-4'>
            <div className="flex-1">
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
                  <Checkbox id="changePassword" onCheckedChange={(checked: boolean) => setComunalComplaint(checked as boolean)} checked={comunalComplaint}/>
                  <Label htmlFor="changePassword">Ankese Komunale?</Label>
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
                          : "Zgjidh nje kompani"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="max-h-[300px] overflow-y-auto p-0">
                      <Command>
                        <CommandInput placeholder="Kerkoni kompanite..." />
                        <CommandEmpty>Nuk u gjet asnje kompani.</CommandEmpty>
                        <CommandGroup>
                          {isLoading ? (
                            <CommandItem value="loading">Ju lutem prisni...</CommandItem>
                          ) : isError ? (
                            <CommandItem value="error" onSelect={() => refetch()}>
                              Dicka shkoi gabim, klikoni per rifreskim.
                            </CommandItem>
                          ) : !data || data.length === 0 ? (
                            <CommandItem value="empty">Nuk u gjet ndonje kompani</CommandItem>
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
            <div className="flex-1">
              <Label className='mb-1' htmlFor='category'>Kategoria e ankeses</Label>
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
                          : "Zgjidh nje arsyje kontakti"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="max-h-[300px] overflow-y-auto p-0">
                      <Command>
                        <CommandInput placeholder="Kerkoni arsyet..." />
                        <CommandEmpty>Nuk u gjet asnje arsye.</CommandEmpty>
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
                <p className="text-red-500 text-sm mt-1">Zgjidhni nje opsion</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor='description' className="mb-1">Pershkrimi i ankeses</Label>
            <Controller 
              control={control}
              name="description"
              render={({field}) => (
                <Textarea id='description' {...field} placeholder='Pershkruani ankesen ne menyrat dhe ne detajet me te mira te mundshme...' rows={10}/>
              )}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>
              
          
          <div className='mx-auto w-full'>
            <Label htmlFor='attachments' className="mb-1 flex items-center justify-center">Bashkengjitjet e Imazheve</Label>
            <Controller 
              control={control}
              name="attachments"
              render={({ field: { onChange } }) => (
                  <div className="space-y-2">
                  {attachmentPreviews.length > 0 ? ( <div className='shadow-xl p-4 mt-2' style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '10px', 
                  }}>
                    {attachmentPreviews.map((preview, index) => (
                      <div key={index} style={{ position: 'relative' }}>
                        <Image
                          src={preview} 
                          alt={`preview ${index}`} 
                          width={100}
                          height={100}
                          className='h-44 w-full'
                        />
                        <button 
                          type="button"
                          className='flex items-center justify-center'
                          onClick={() => removeImage(index, onChange)}
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
                    </div>) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Klikoni për të ngarkuar Imazhe/Dokumente
                        </p>
                      </div>
                      <Input 
                        id='attachments'
                        type="file"
                        multiple 
                        className="hidden" 
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e, onChange)}
                      />
                    </label>
                  )}
                  {typeof attachmentProgress === "number" && attachmentProgress > 0 && <div className='mt-2 w-full bg-gray-200 rounded-full overflow-hidden'>
                    <div className='h-1.5 bg-indigo-600 transition-all' style={{width: `${attachmentProgress}%`}} />
                  </div>}
                </div>
              )}
            />
            {errors.attachments && (
              <p className="text-red-500 text-sm mt-1 text-center">{errors.attachments.message}</p>
            )}
          </div>
          <div className="flex flex-row items-center justify-between gap-4">
            <div className='flex-1'>
              <Label htmlFor='audioInput' className='mb-1'>Ngarkoni Audio/Inqizime</Label>
              <Controller 
                control={control}
                name="audiosAttached"
                render={({ field: { onChange } }) => (
                  <div className="space-y-2">
                    {audioPreviews.length > 0 ? ( <div className='shadow-xl p-4 mt-2' style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '10px', 
                    }}>
                      {audioPreviews.map((preview, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                          <audio
                            src={preview} 
                            controls
                            className='w-full h-44'
                          />
                          <button 
                            type="button"
                            className='flex items-center justify-center'
                            onClick={() => removeMedia(index, onChange, setAudioPreviews, audioPreviews)}
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
                      </div>) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Klikoni për të ngarkuar Audio/Inqizime
                          </p>
                        </div>
                        <Input 
                          id='audioInput'
                          type="file"
                          multiple 
                          className="hidden" 
                          accept="audio/*"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleMediaChange(e, onChange, setAudioPreviews, audioPreviews, 'audio')}
                        />
                      </label>
                    )}
                    {typeof audioProgress === "number" && audioProgress > 0 && <div className='mt-2 w-full bg-gray-200 rounded-full overflow-hidden'>
                      <div className='h-1.5 bg-indigo-600 transition-all' style={{width: `${audioProgress}%`}} />
                    </div>}
                  </div>
                )}
              />
              {errors.audiosAttached && (
                <p className="text-red-500 text-sm mt-1">{errors.audiosAttached.message}</p>
              )}
            </div>
            <div className="flex-1">
              <Label htmlFor='videoInput' className='mb-1'>Ngarkoni Video/Inqizime</Label>
              <Controller 
                control={control}
                name="videosAttached"
                render={({ field: { onChange } }) => (
                  <>
                  <div className="space-y-2">
                    {videoPreviews.length > 0 ? ( <div className='shadow-xl p-4 mt-2' style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '10px', 
                    }}>
                      {videoPreviews.map((preview, index) => (
                        <div key={index} style={{ position: 'relative' }}>
                          <video
                            src={preview} 
                            controls
                            className='w-full h-44'
                          />
                          <button 
                            type="button"
                            className='flex items-center justify-center'
                            onClick={() => removeMedia(index, onChange, setVideoPreviews, videoPreviews)}
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
                      </div>) : (
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground">
                            Klikoni për të ngarkuar Video/Inqizime
                          </p>
                        </div>
                        <Input 
                          id='videoInput'
                          type="file"
                          multiple 
                          className="hidden" 
                          accept="video/*"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleMediaChange(e, onChange, setVideoPreviews, videoPreviews, 'video')}
                        />
                      </label>
                    )}
                    {typeof videoProgress === "number" && videoProgress > 0 && <div className='mt-2 w-full bg-gray-200 rounded-full overflow-hidden'>
                      <div className='h-1.5 bg-indigo-600 transition-all' style={{width: `${videoProgress}%`}} />
                    </div>}
                  </div>
                  </>
                )}
              />
              {errors.videosAttached && (
                <p className="text-red-500 text-sm mt-1">{errors.videosAttached.message}</p>
              )}
            </div>
          </div>
          <div className="flex-1">
              <CTAButton type='submit' isLoading={isSubmitting} text={isSubmitting ? "Duke aplikuar..." : "Apliko per ankesen/raportimin"} classNames="flex-1 w-full mt-2" primary/>
          </div>
        </form>
      </DialogContent>
    </Dialog>
    </>
  )
}

export default memo(CreateComplaintDialog)