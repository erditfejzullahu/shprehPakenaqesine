"use client"
import { createComplaintsSchema } from '@/lib/schemas/createComplaintsSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { memo, useCallback, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {z} from "zod"
import { Label } from './ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { Category, Companies } from '@/app/generated/prisma'
import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'
import { Input } from './ui/input'
import { FileUp, Image, AudioLines, Video } from 'lucide-react'
import { Textarea } from './ui/textarea'
import CTAButton from './CTAButton'
import { ImagePlus, X } from 'lucide-react'


type ComplaintsType = z.infer<typeof createComplaintsSchema> 

const CreateComplaintForm = () => {

  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [audioPreviews, setAudioPreviews] = useState<string[]>([]);
  const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

  const imageAttachmentsRef = useRef<HTMLInputElement>(null)
  const audioAttachmentsRef = useRef<HTMLInputElement>(null)
  const videoAttachmentsRef = useRef<HTMLInputElement>(null)

  const {data, isLoading, isError, refetch} = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const res = await api.get<Companies[]>(`/api/companiesAllComplaintsForm`);
      return res.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5
  })

  console.log(data);
  

  const {control, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm<ComplaintsType>({
    resolver: zodResolver(createComplaintsSchema),
    defaultValues: useMemo(() => ({
      companyId: "",
      title: "",
      description: "",
      category: "FAVORIZIMI",
      attachments: [],
      audiosAttached: [],
      videosAttached: []
    }), []),
    mode: "onChange"
  })

  const onSubmit = useCallback(async (data: ComplaintsType) => {
    console.log(data)
  }, [])

  
  const handleFileChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
    fieldOnChange: (value: string[]) => void
  ) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newPreviews: string[] = [];
    const fileReaders: FileReader[] = [];
    let filesRead = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      fileReaders.push(reader);

      reader.onloadend = () => {
        filesRead++;
        if (reader.result) {
          newPreviews.push(reader.result as string);
        }

        if (filesRead === files.length) {
          const updatedPreviews = [...imagePreviews, ...newPreviews];
          setImagePreviews(updatedPreviews);
          fieldOnChange(updatedPreviews);
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
    const updatedPreviews = imagePreviews.filter((_, i) => i !== index);
    setImagePreviews(updatedPreviews);
    fieldOnChange(updatedPreviews);
  }, [imagePreviews]);


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl mx-auto flex flex-col gap-4 my-4">
      <div className='max-w-lg mx-auto w-full'>
        <Label htmlFor='title' className="mb-1 flex items-center justify-center">Titulli i ankeses/raportimit</Label>
        <Controller 
          control={control}
          name="title"
          render={({field}) => (
            <Input id='title' {...field} placeholder='Nje titull terheqes per krijimin e ankeses/raportimit...' className="placeholder:text-center text-center"/>
          )}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1 text-center">{errors.title.message}</p>
        )}
      </div>
      <div className='flex flex-row items-center justify-between gap-4'>
        <div className="flex-1">
          <Label className='mb-1' htmlFor='companyId'>Kompania</Label>
          <Controller 
            control={control}
            name='companyId'
            render={({field}) => (
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
              <SelectTrigger id='companyId' className="flex-1 w-full cursor-pointer">
                  <SelectValue placeholder="Zgjidh nje kompani" />
              </SelectTrigger>
              <SelectContent>
                  <SelectGroup>
                  <SelectLabel>Zgjidhni mes opsioneve me poshte</SelectLabel>
                  {isLoading ? (
                    <SelectItem value='loading'>Ju lutem prisni...</SelectItem>
                  ) : isError ? (
                    <SelectItem value='error' onClick={() => refetch()}>Dicka shkoi gabim, klikoni per rifreskim.</SelectItem>
                  ) : !data || data.length === 0 ? (
                    <SelectItem value='empty'>Nuk u gjet ndonje kompani</SelectItem>
                  ) : (
                    (data.map(company => (
                      <SelectItem key={company.id} value={company.id}>{company.name}</SelectItem>
                    )))
                  )}
                  </SelectGroup>
              </SelectContent>
              </Select>
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
            render={({field}) => (
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
              <SelectTrigger id='category' className="flex-1 w-full cursor-pointer">
                  <SelectValue placeholder="Zgjidh nje arsyje kontakti" />
              </SelectTrigger>
              <SelectContent>
                  <SelectGroup>
                  <SelectLabel>Zgjidhni mes opsioneve me poshte</SelectLabel>
                  {Object.keys(Category).map((item) => {
                    let displayText = item.replace(/_/g, ' ');
                    // Convert to lowercase
                    displayText = displayText.toLowerCase();
                    // Capitalize first letter of each word
                    displayText = displayText.replace(/\b\w/g, char => char.toUpperCase());
                    return (
                      <SelectItem key={item} value={item}>{displayText}</SelectItem>
                    )
                  })}
                  </SelectGroup>
              </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
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
            <div className="flex items-center flex-col">
              <div className='flex flex-row items-center gap-2'>
              <Input
                ref={imageAttachmentsRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleFileChange(e, onChange)}
                style={{ display: 'none' }}
                id="attachments"
              />
                <CTAButton type="button" onClick={() => imageAttachmentsRef.current?.click()} text='Ngarko Imazhe'/>
                <ImagePlus className='h-8 w-8'/>
              </div>
              {imagePreviews.length > 0 && <div className='shadow-xl p-4 mt-2' style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: '10px', 
              }}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} style={{ position: 'relative' }}>
                    <img 
                      src={preview} 
                      alt={`preview ${index}`} 
                      style={{ 
                        width: '100px', 
                        height: '100px', 
                        objectFit: 'cover' 
                      }}
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
          <Controller 
            control={control}
            name="audiosAttached"
            render={({ field: { onChange } }) => (
              <div className="shadow-lg rounded-lg p-4 pb-2">
                <Input
                  ref={audioAttachmentsRef}
                  type="file"
                  multiple
                  accept="audio/*"
                  onChange={(e) => 
                    handleMediaChange(e, onChange, setAudioPreviews, audioPreviews, 'audio')
                  }
                  className="hidden"
                  id="audio-upload"
                />
                <Label 
                  htmlFor="audio-upload"
                  className="mb-2"
                >
                  Ngarko Audio/Zerim
                </Label>
                <CTAButton text='Ngarko Audio' onClick={() => audioAttachmentsRef.current?.click()}/>
                
                <div className="mt-4 space-y-2">
                  {audioPreviews.map((preview, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                      <audio controls src={preview} className="w-full" />
                      <button
                        type="button"
                        onClick={() => 
                          removeMedia(index, onChange, setAudioPreviews, audioPreviews)
                        }
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          />
          {errors.audiosAttached && (
            <p className="text-red-500 text-sm mt-1">{errors.audiosAttached.message}</p>
          )}
        </div>
        <div className="flex-1">
          <Controller 
            control={control}
            name="videosAttached"
            render={({ field: { onChange } }) => (
              <div className="shadow-lg rounded-lg p-4 pb-2">
                <Input
                  ref={videoAttachmentsRef}
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={(e) => 
                    handleMediaChange(e, onChange, setVideoPreviews, videoPreviews, 'video')
                  }
                  className="hidden"
                  id="video-upload"
                />
                <Label 
                  htmlFor="video-upload"
                  className="mb-2"
                >
                  Ngarko Video/Inxhiqime
                </Label>
                <CTAButton text='Ngarko Video' onClick={() => videoAttachmentsRef.current?.click()}/>
                
                <div className="mt-4 space-y-4">
                  {videoPreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <video controls className="w-full rounded" src={preview} />
                      <button
                        type="button"
                        onClick={() => 
                          removeMedia(index, onChange, setVideoPreviews, videoPreviews)
                        }
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          />
          {errors.videosAttached && (
            <p className="text-red-500 text-sm mt-1">{errors.videosAttached.message}</p>
          )}
        </div>
      </div>
      <div className="flex-1">
          <CTAButton text='Apliko per ankesen/raportimin' classNames="flex-1 w-full mt-2" primary/>
      </div>
    </form>
  )
}

export default memo(CreateComplaintForm)