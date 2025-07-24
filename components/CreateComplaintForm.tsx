"use client"
import { createComplaintsSchema } from '@/lib/schemas/createComplaintsSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {z} from "zod"
import { Label } from './ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Category, Companies, Municipality } from '@/app/generated/prisma'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Input } from './ui/input'
import { FileUp, Image as ImageLucide, AudioLines, Video, Check, Upload, ChevronsUpDown } from 'lucide-react'
import { Textarea } from './ui/textarea'
import CTAButton from './CTAButton'
import { ImagePlus, X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Checkbox } from './ui/checkbox'
import { Button } from './ui/button'
import Image from 'next/image'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command'
import { cn } from '@/lib/utils'
// import Image from 'next/image'

type ComplaintsType = z.infer<typeof createComplaintsSchema> 

const CreateComplaintForm = () => {
  const router = useRouter();
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

  const {control, handleSubmit, setValue, reset, formState: {errors, isSubmitting}} = useForm<ComplaintsType>({
    resolver: zodResolver(createComplaintsSchema),
    defaultValues: useMemo(() => ({
      companyId: null,
      title: "",
      description: "",
      category: "FAVORIZIMI",
      attachments: [],
      audiosAttached: [],
      videosAttached: [],
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
  }, [comunalComplaint])
  

  const onSubmit = useCallback(async (data: ComplaintsType) => {
    console.log(data);
    
    try {
      const response = await api.post(`/api/createComplaint`, {
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
        toast.success('Ju sapo keni krijuar ankese/raportim me sukses!')
      }
      if(response.data.url){
        router.push(`/ankesat/${response.data.url}`)
      }
    } catch (error: any) {
      toast.error(error.response.data.message || "Dicka shkoi gabim! Ju lutem provoni perseri.")
    }
  }, [reset])

  
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
  
    // Simulate: tick every 50ms
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

    // Simulate: tick every 50ms
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
      // Validate file type
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

      console.log(reader, ' readerrr');
      
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
                      {/* Replace with your actual municipalities data */}
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
                      {/* <CommandLabel>Zgjidhni mes opsioneve me poshte</CommandLabel> */}
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
                    onChange={(e) => handleFileChange(e, onChange)}
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
      <div className="flex flex-row items-center justify-between gap-4 max-[800px]:flex-col">
        <div className='flex-1 w-full'>
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
                      onChange={(e) => handleMediaChange(e, onChange, setAudioPreviews, audioPreviews, 'audio')}
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
        <div className="flex-1 w-full">
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
                      onChange={(e) => handleMediaChange(e, onChange, setVideoPreviews, videoPreviews, 'video')}
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
  )
}

export default memo(CreateComplaintForm)