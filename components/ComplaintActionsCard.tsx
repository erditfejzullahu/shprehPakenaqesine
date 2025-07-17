"use client"
import api from '@/lib/api'
import { ComplantPerIdInterface } from '@/types/types'
import { Session } from 'next-auth'
import React, { useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {z} from 'zod'
import Link from 'next/link'
import { AudioLinesIcon, ImageIcon, Video, X } from 'lucide-react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import CTAButton from './CTAButton'
import { ReportsCategory } from '@/app/generated/prisma'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'

const contributionsSchema = z.object({
  attachments: z.array(z.string().regex(/^data:image\/(png|jpeg|jpg|gif);base64,/, {
    message: "Bashkëngjitjet duhet të jenë imazhe në formatin base64 (PNG, JPEG, JPG ose GIF)"
  })).optional(),
  audiosAttached: z.array(z.string().regex(/^data:audio\/(mp3|wav|ogg);base64,/, {
      message: "Audiot e bashkëngjitura duhet të jenë në formatin base64 (MP3, WAV ose OGG)"
  })).optional(),
  videosAttached: z.array(z.string().regex(/^data:video\/(mp4|webm|ogg);base64,/, {
      message: "Videot e bashkëngjitura duhet të jenë në formatin base64 (MP4, WebM ose OGG)"
  })).optional(),
})

const reportsSchema = z.object({
  title: z.string().min(6, "Duhen te pakten 6 karaktere"),
  description: z.string().min(20, "Duhen te pakten 20 karaktere"),
  attachments: z.array(z.string().regex(/^data:image\/(png|jpeg|jpg|gif);base64,/, {
    message: "Bashkëngjitjet duhet të jenë imazhe në formatin base64 (PNG, JPEG, JPG ose GIF)"
  })).optional(),
  audiosAttached: z.array(z.string().regex(/^data:audio\/(mp3|wav|ogg);base64,/, {
      message: "Audiot e bashkëngjitura duhet të jenë në formatin base64 (MP3, WAV ose OGG)"
  })).optional(),
  videosAttached: z.array(z.string().regex(/^data:video\/(mp4|webm|ogg);base64,/, {
      message: "Videot e bashkëngjitura duhet të jenë në formatin base64 (MP4, WebM ose OGG)"
  })).optional(),
  category: z.enum(ReportsCategory),
})

type ValidationSchema = z.infer<typeof contributionsSchema>;
type ReportsValidationSchema = z.infer<typeof reportsSchema>;

const ComplaintActionsCard = ({complaintsData, session}: {complaintsData: ComplantPerIdInterface, session: Session | null}) => {
    
    const [isUpvoting, setIsUpvoting] = useState(false)
    const [upvoteCount, setUpvoteCount] = useState(0)
    const [hasUpvoted, setHasUpvoted] = useState(complaintsData.complaint.hasVoted)

    const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);
    const [audioPreviews, setAudioPreviews] = useState<string[]>([])
    const [videoPreviews, setVideoPreviews] = useState<string[]>([])

    const [videoProgress, setVideoProgress] = useState<number | null>(null)
    const [attachmentProgress, setAttachmentProgress] = useState<number | null>(null)
    const [audioProgress, setAudioProgress] = useState<number | null>(null)

    const {control: contributeControl, setValue, getValues, handleSubmit: contributeHandleSubmit, reset: contributeReset, formState: {errors: contributeErrors, isSubmitting: contributeIsSubmitting}} = useForm<ValidationSchema>({
      resolver: zodResolver(contributionsSchema),
      defaultValues: useMemo(() => ({
        attachments: [],
        audiosAttached: [],
        videosAttached: []
      }), [])
    })

    const {control: reportControl, handleSubmit: reportHandleSubmit, reset: reportReset, formState: {errors: reportErrors, isSubmitting: reportIsSubmitting}} = useForm<ReportsValidationSchema>({

    })

    const reportsOnSubmit = useCallback(async (data: ReportsValidationSchema) => {

    }, [reportReset])

    const contributeOnSubmit = useCallback(async (data: ValidationSchema) => {

    }, [contributeReset])

    const removeItems = (index: number, type: "attachments" | "audiosAttached" | "videosAttached") => {
      switch (type) {
        case "attachments":
          const updatedAttachments = [...attachmentPreviews];
          updatedAttachments.splice(index, 1);
          setAttachmentPreviews(updatedAttachments);
          setValue("attachments", updatedAttachments);
          break;
        case "audiosAttached":
          const updatedAudios = [...audioPreviews];
          updatedAudios.splice(index, 1);
          setAudioPreviews(updatedAudios);
          setValue("audiosAttached", updatedAudios);
          break;
        case "videosAttached":
          const updatedVideos = [...videoPreviews];
          updatedVideos.splice(index, 1);
          setVideoPreviews(updatedVideos);
          setValue("videosAttached", updatedVideos);
          break;
        default:
          return
      }
    };

    const handleAttachmentUploads = (
      e: React.ChangeEvent<HTMLInputElement>,
      type: "attachments" | "audiosAttached" | "videosAttached"
    ) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const newPreviews: string[] = [];
        const readers: FileReader[] = [];
    
        // Init fake progress: one per file
        switch (type) {
          case "attachments":
            setAttachmentProgress(0)
            break;
          case "audiosAttached":
            setAudioProgress(0)
            break;
          case "videosAttached":
            setVideoProgress(0)
            break;
        }
    
        Array.from(files).forEach((file, index) => {
          const reader = new FileReader();
          readers.push(reader);
    
          let fakeProgress = 0;
    
          // Simulate: tick every 50ms
          const interval = setInterval(() => {
            fakeProgress += 5;
            setVideoProgress(Math.min(fakeProgress, 95))
          }, 50);
    
          reader.onload = (event) => {
            clearInterval(interval);
            const base64 = event.target?.result as string;
            newPreviews[index] = base64;
        
            if (newPreviews.filter(Boolean).length === files.length) {
              switch (type) {
                case "attachments":
                  setAttachmentProgress(100)
                  setAttachmentPreviews((prev) => [...prev, ...newPreviews]);
                  setValue("attachments", [
                    ...(getValues("attachments") || []),
                    ...newPreviews,
                  ]);
                  break;
                case "audiosAttached":
                  setAudioProgress(100)
                  setAudioPreviews((prev) => [...prev, ...newPreviews]);
                  setValue("audiosAttached", [
                    ...(getValues("audiosAttached") || []),
                    ...newPreviews,
                  ]);
                  break;
                case "videosAttached":
                  setVideoProgress(100)
                  setVideoPreviews((prev) => [...prev, ...newPreviews]);
                  setValue("videosAttached", [
                    ...(getValues("videosAttached") || []),
                    ...newPreviews,
                  ]);
                  break;
              }
            }
          };
    
          reader.readAsDataURL(file);
        });
      }
    };
    

    const handleUpvote = useCallback(async () => {
        if (!session) return;
        if (hasUpvoted) return;
        
        setIsUpvoting(true);
        try {
          const response = await api.post(`/api/complaintVotes/`, {complaintId: complaintsData.complaint.id, userId: session.user.id})
          if(response.data.success){
            toast.success(response.data.message)
          }
          setUpvoteCount(prev => prev + 1);
          setHasUpvoted(true);
        } catch (error: any) {
          console.error('Failed to upvote:', error);
          toast.error(error.response.data.message)
        } finally {
          setIsUpvoting(false);
        }
      }, []);

      

  return (
    <div className="bg-white shadow-lg overflow-hidden">
        <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Nderveprime</h3>
            <button
            onClick={handleUpvote}
            disabled={isUpvoting || hasUpvoted}
            className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${hasUpvoted ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-3`}
            >
            {isUpvoting ? (
                'Duke procesuar...'
            ) : hasUpvoted ? (
                <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                E votuar
                </>
            ) : (
                <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                Voto larte ({upvoteCount})
                </>
            )}
            </button>
            <Dialog onOpenChange={() => {
              contributeReset();
              setAttachmentPreviews([]);
              setAudioPreviews([]);
              setVideoPreviews([]);
            }}>
              <form onSubmit={contributeHandleSubmit(contributeOnSubmit)}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-3"
                  >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Kontribuo
                  </button>
                </DialogTrigger>
                <DialogContent className='max-h-[90vh] !w-full !max-w-[700px] px-4 overflow-y-scroll'>
                  <DialogHeader>
                    <DialogTitle>Kontribuoni ne {complaintsData.complaint.title}</DialogTitle>
                    <DialogDescription>
                      Ketu mund te kontribuoni duke shtuar deshmi dokumentesh, zerimeve, pamjeve etj.
                    </DialogDescription>
                  </DialogHeader>
                  <div className='flex flex-col gap-4  relative'>
                    <div>
                      <Label htmlFor='attachments' className='mb-2'>Ngarkoni imazhe/dokumente</Label>
                      <Controller 
                        control={contributeControl}
                        name="attachments"
                        render={({field}) => (
                          <div className="space-y-4">
                            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors py-8">
                              <div className="flex flex-col items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  Klikoni për të ngarkuar dokumente/imazhe
                                </p>
                              </div>
                              <input 
                                id='attachments'
                                type="file" 
                                className="hidden" 
                                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                                multiple
                                onChange={(e) => handleAttachmentUploads(e, "attachments")}
                              />
                            </label>
                            {attachmentProgress && attachmentProgress < 100 && <div className='w-full bg-gray-200 rounded-full overflow-hidden'>
                              <div className='h-1.5 bg-indigo-600 transition-all' style={{width: `${attachmentProgress}%`}} />
                            </div>}
                            
                            {attachmentPreviews.length > 0 && (
                              <div className="flex flex-nowrap overflow-x-scroll gap-4">
                                {attachmentPreviews.map((preview, index) => (
                                  <div key={index} className="relative group flex-shrink-0">
                                    <img 
                                      src={preview} 
                                      alt={`Preview ${index + 1}`} 
                                      className="h-44 min-w-full object-cover rounded-md"
                                      />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="absolute -right-0 h-6 -top-0 rounded-full bg-destructive/90 hover:bg-destructive text-white"
                                      onClick={() => removeItems(index, "attachments")}
                                      >
                                      <X className="h-4 w-4 " />
                                    </Button>
                                  </div>
                                ))}
                                </div>
                            )}
                          </div>
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor='audiosAttached' className='mb-2'>Ngarkoni audio/zerime</Label>
                      <Controller 
                        control={contributeControl}
                        name="audiosAttached"
                        render={({field}) => (
                          <div className="space-y-4">
                            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors py-8">
                              <div className="flex flex-col items-center justify-center">
                                <AudioLinesIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  Klikoni për të ngarkuar audio/inqizime
                                </p>
                              </div>
                              <input 
                                id='audiosAttached'
                                type="file" 
                                className="hidden" 
                                accept="audio/*"
                                multiple
                                onChange={(e) => handleAttachmentUploads(e, "audiosAttached")}
                              />
                            </label>
                            {audioProgress && audioProgress < 100 && <div className='w-full bg-gray-200 rounded-full overflow-hidden'>
                              <div className='h-1.5 bg-indigo-600 transition-all' style={{width: `${audioProgress}%`}} />
                            </div>}
                            {audioPreviews.length > 0 && (
                              <div className="flex flex-nowrap overflow-x-scroll gap-4">
                                {audioPreviews.map((preview, index) => (
                                  <div key={index} className="relative group flex-shrink-0">
                                    <audio controls src={preview} className="min-w-full h-44" />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="absolute -right-0 h-6 -top-0 rounded-full bg-destructive/90 hover:bg-destructive text-white"
                                      onClick={() => removeItems(index, "audiosAttached")}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      />
                    </div>
                    <div>
                      <Label htmlFor='videosAttached' className='mb-2'>Ngarkoni video/zerime</Label>
                      <Controller 
                        control={contributeControl}
                        name="videosAttached"
                        render={({field}) => (
                          <div className="space-y-4">
                            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors py-8">
                              <div className="flex flex-col items-center justify-center">
                                <Video className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-muted-foreground">
                                  Klikoni për të ngarkuar video/inqizime
                                </p>
                              </div>
                              <input 
                                id='videosAttached'
                                type="file" 
                                className="hidden" 
                                accept="video/*"
                                multiple
                                onChange={(e) => handleAttachmentUploads(e, "videosAttached")}
                              />
                            </label>
                            {videoProgress && videoProgress < 100 && <div className='w-full bg-gray-200 rounded-full overflow-hidden'>
                              <div className='h-1.5 bg-indigo-600 transition-all' style={{width: `${videoProgress}%`}} />
                            </div>}
                            {videoPreviews.length > 0 && (
                              <div className="flex flex-nowrap overflow-x-scroll gap-4">
                                {videoPreviews.map((preview, index) => (
                                  <div key={index} className="relative group flex-shrink-0">
                                    <video controls className="min-w-full h-44 rounded" src={preview} />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="absolute -right-0 -top-0 h-6 rounded-full bg-destructive/90 hover:bg-destructive text-white"
                                      onClick={() => removeItems(index, "videosAttached")}
                                      >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      />
                    </div>
                    <div>
                      <CTAButton type='button' onClick={contributeHandleSubmit(contributeOnSubmit)} isLoading={contributeIsSubmitting} text='Shto kontribuim' primary classNames='w-full'/>
                    </div>
                  </div>
                </DialogContent>
              </form>
            </Dialog>
            <Dialog>
              <form onSubmit={reportHandleSubmit(reportsOnSubmit)}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                  Raporto
                  </button>
                </DialogTrigger>
                <DialogContent className='max-h-[90vh] !w-full !max-w-[700px] px-4 overflow-y-scroll'>
                    <DialogHeader>
                      <DialogTitle>Krijo Raportim</DialogTitle>
                      <DialogDescription>Ne rast se ankesa/raportimi nuk eshte valid, ju mund ta raportoni ketu.</DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col gap-4  relative'>
                        <div>
                          <Label className='mb-1' htmlFor='title'>Titulli Raportimit</Label>
                          <Controller 
                            control={reportControl}
                            name="title"
                            render={({field}) => (
                              <Input id='title' {...field} placeholder='Titulli i raportimit'/>
                            )}
                          />
                        </div>
                        <div>
                          <Label className='mb-1' htmlFor='description'>Detajet e raportimit</Label>
                          <Controller 
                            control={reportControl}
                            name="description"
                            render={({field}) => (
                              <Textarea id='description' {...field} placeholder='Pershkruani detajisht arsyjen e raportimit' rows={5}/>
                            )}
                          />
                        </div>
                        <div>
                          <Label className='mb-1' htmlFor='category'>Kategoria</Label>
                          <Controller 
                            control={reportControl}
                            name="category"
                            render={({field}) => (
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className='w-full'>
                                  <SelectValue placeholder="Zgjidhni nje kategori"/>
                                </SelectTrigger>
                                <SelectContent className='w-full'>
                                  <SelectGroup>
                                    <SelectLabel>Kategorite</SelectLabel>
                                    <SelectItem value='LAJMERIM_I_RREMSHEM'>Lajmerim i rrejshem</SelectItem>
                                    <SelectItem value='SHPIFJE'>Shpifje</SelectItem>
                                    <SelectItem value='GJUHE_URREJTJE'>Gjuhe urrejtje</SelectItem>
                                    <SelectItem value='PERVERSE_OSE_ABUZIVE'>Perverse ose abuzive</SelectItem>
                                    <SelectItem value='SPAM_OSE_DUPLIKAT'>Span ose duplikat</SelectItem>
                                    <SelectItem value='JO_RELAVANT'>Jo relevant</SelectItem>
                                    <SelectItem value='SHKELJE_PRIVATESIE'>Shkelje privatesie</SelectItem>
                                    <SelectItem value='TJETER'>Tjeter</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </div>
                        <div>
                        <Label htmlFor='attachments' className='mb-2'>Ngarkoni imazhe/dokumente</Label>
                        <Controller 
                          control={contributeControl}
                          name="attachments"
                          render={({field}) => (
                            <div className="space-y-4">
                              <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors py-8">
                                <div className="flex flex-col items-center justify-center">
                                  <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                  <p className="text-sm text-muted-foreground">
                                    Klikoni për të ngarkuar dokumente/imazhe
                                  </p>
                                </div>
                                <input 
                                  id='attachments'
                                  type="file" 
                                  className="hidden" 
                                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                                  multiple
                                  onChange={(e) => handleAttachmentUploads(e, "attachments")}
                                />
                              </label>
                              {attachmentProgress && attachmentProgress < 100 && <div className='w-full bg-gray-200 rounded-full overflow-hidden'>
                                <div className='h-1.5 bg-indigo-600 transition-all' style={{width: `${attachmentProgress}%`}} />
                              </div>}
                              
                              {attachmentPreviews.length > 0 && (
                                <div className="flex flex-nowrap overflow-x-scroll gap-4">
                                  {attachmentPreviews.map((preview, index) => (
                                    <div key={index} className="relative group flex-shrink-0">
                                      <img 
                                        src={preview} 
                                        alt={`Preview ${index + 1}`} 
                                        className="h-44 min-w-full object-cover rounded-md"
                                        />
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute -right-0 h-6 -top-0 rounded-full bg-destructive/90 hover:bg-destructive text-white"
                                        onClick={() => removeItems(index, "attachments")}
                                        >
                                        <X className="h-4 w-4 " />
                                      </Button>
                                    </div>
                                  ))}
                                  </div>
                              )}
                            </div>
                          )}
                          />
                        </div>
                        <div>
                          <Label htmlFor='audiosAttached' className='mb-2'>Ngarkoni audio/zerime</Label>
                          <Controller 
                            control={contributeControl}
                            name="audiosAttached"
                            render={({field}) => (
                              <div className="space-y-4">
                                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors py-8">
                                  <div className="flex flex-col items-center justify-center">
                                    <AudioLinesIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                      Klikoni për të ngarkuar audio/inqizime
                                    </p>
                                  </div>
                                  <input 
                                    id='audiosAttached'
                                    type="file" 
                                    className="hidden" 
                                    accept="audio/*"
                                    multiple
                                    onChange={(e) => handleAttachmentUploads(e, "audiosAttached")}
                                  />
                                </label>
                                {audioProgress && audioProgress < 100 && <div className='w-full bg-gray-200 rounded-full overflow-hidden'>
                                  <div className='h-1.5 bg-indigo-600 transition-all' style={{width: `${audioProgress}%`}} />
                                </div>}
                                {audioPreviews.length > 0 && (
                                  <div className="flex flex-nowrap overflow-x-scroll gap-4">
                                    {audioPreviews.map((preview, index) => (
                                      <div key={index} className="relative group flex-shrink-0">
                                        <audio controls src={preview} className="min-w-full h-44" />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="absolute -right-0 h-6 -top-0 rounded-full bg-destructive/90 hover:bg-destructive text-white"
                                          onClick={() => removeItems(index, "audiosAttached")}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          />
                        </div>
                        <div>
                          <Label htmlFor='videosAttached' className='mb-2'>Ngarkoni video/zerime</Label>
                          <Controller 
                            control={contributeControl}
                            name="videosAttached"
                            render={({field}) => (
                              <div className="space-y-4">
                                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors py-8">
                                  <div className="flex flex-col items-center justify-center">
                                    <Video className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">
                                      Klikoni për të ngarkuar video/inqizime
                                    </p>
                                  </div>
                                  <input 
                                    id='videosAttached'
                                    type="file" 
                                    className="hidden" 
                                    accept="video/*"
                                    multiple
                                    onChange={(e) => handleAttachmentUploads(e, "videosAttached")}
                                  />
                                </label>
                                {videoProgress && videoProgress < 100 && <div className='w-full bg-gray-200 rounded-full overflow-hidden'>
                                  <div className='h-1.5 bg-indigo-600 transition-all' style={{width: `${videoProgress}%`}} />
                                </div>}
                                {videoPreviews.length > 0 && (
                                  <div className="flex flex-nowrap overflow-x-scroll gap-4">
                                    {videoPreviews.map((preview, index) => (
                                      <div key={index} className="relative group flex-shrink-0">
                                        <video controls className="min-w-full h-44 rounded" src={preview} />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="icon"
                                          className="absolute -right-0 -top-0 h-6 rounded-full bg-destructive/90 hover:bg-destructive text-white"
                                          onClick={() => removeItems(index, "videosAttached")}
                                          >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          />
                        </div>
                        <div>
                          <CTAButton type='button' onClick={reportHandleSubmit(reportsOnSubmit)} isLoading={reportIsSubmitting} text='Krijo raportim' classNames='w-full' primary/>
                        </div>
                    </div>
                </DialogContent>
              </form>
            </Dialog>
        </div>
        </div>
  )
}

export default ComplaintActionsCard