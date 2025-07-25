"use client"
import api from '@/lib/api'
import { ComplantPerIdInterface } from '@/types/types'
import { Session } from 'next-auth'
import React, { memo, useCallback, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {z} from 'zod'
import { AudioLinesIcon, ImageIcon, Video, X } from 'lucide-react'
import { Button } from './ui/button'
import { Label } from './ui/label'
import CTAButton from './CTAButton'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { contributionsSchema } from '@/lib/schemas/contributionsSchema'
import { reportsSchema } from '@/lib/schemas/reportsSchema'
import { useRouter } from 'next/navigation'

type ValidationSchema = z.infer<typeof contributionsSchema>;
type ReportsValidationSchema = z.infer<typeof reportsSchema>;

const ComplaintActionsCard = ({complaintsData, session}: {complaintsData: ComplantPerIdInterface, session: Session | null}) => {
    const router = useRouter();
    const [isUpvoting, setIsUpvoting] = useState(false)
    const [upvoteCount, setUpvoteCount] = useState(complaintsData.complaint.upVotes)
    const [hasUpvoted, setHasUpvoted] = useState(complaintsData.complaint.hasVoted)

    const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([]);
    const [audioPreviews, setAudioPreviews] = useState<string[]>([])
    const [videoPreviews, setVideoPreviews] = useState<string[]>([])

    const [videoProgress, setVideoProgress] = useState<number | null>(null)
    const [attachmentProgress, setAttachmentProgress] = useState<number | null>(null)
    const [audioProgress, setAudioProgress] = useState<number | null>(null)

    const [reportsDialog, setReportsDialog] = useState(false)
    const [contributeDialog, setContributeDialog] = useState(false)

    const {control: contributeControl, setValue, getValues, handleSubmit: contributeHandleSubmit, reset: contributeReset, formState: {errors: contributeErrors, isSubmitting: contributeIsSubmitting}} = useForm<ValidationSchema>({
      resolver: zodResolver(contributionsSchema),
      defaultValues: useMemo(() => ({
        attachments: [],
        audiosAttached: [],
        videosAttached: []
      }), [])
    })

    const {control: reportControl, handleSubmit: reportHandleSubmit, setValue: reportSetValue, getValues: reportGetValues, reset: reportReset, formState: {errors: reportErrors, isSubmitting: reportIsSubmitting}} = useForm<ReportsValidationSchema>({
      resolver: zodResolver(reportsSchema),
      defaultValues: useMemo(() => ({
        title: "",
        description: "",
        attachments: [],
        audiosAttached: [],
        videosAttached: []
      }), [])
    })

    const reportsOnSubmit = useCallback(async (data: ReportsValidationSchema) => {      
      try {
        const response = await api.post(`/api/createReport`, {
          title: data.title,
          description: data.description,
          attachments: data.attachments,
          audiosAttached: data.audiosAttached,
          videosAttached: data.videosAttached,
          complaintId: complaintsData.complaint.id,
          category: data.category,
          email: data.email
        })
        if(response.data.success){
          toast.success(`Sapo keni krijuar raportimin me sukses! Do te njoftoheni vazhdimisht per cdo ndryshim ne lidhje me kete raportim.`)
          setReportsDialog(false)
          reportReset()
          setAttachmentPreviews([])
          setAudioPreviews([])
          setVideoPreviews([])
        }
      } catch (error: any) {
        console.error(error)
        toast.error(error.response.data.message || "Dicka shkoi gabim")
      }
    }, [reportReset])

    const contributeOnSubmit = useCallback(async (data: ValidationSchema) => {
      try {
        const response = await api.post(`/api/createContribution`, {
          complaintId: complaintsData.complaint.id,
          attachments: data.attachments,
          audiosAttached: data.audiosAttached,
          videosAttached: data.videosAttached
        })
        if(response.data.success){
          toast.success(`Aplikimi per kontribuim ne kete ankese/raport shkoi me sukses. Do njoftoheni kur te behet validimi i evidences tuaj.`)
          setContributeDialog(false)
          contributeReset()
          setAttachmentPreviews([])
          setAudioPreviews([])
          setVideoPreviews([])
        }
      } catch (error: any) {
        console.error(error)
        toast.error(error.response.data.message || "Dicka shkoi gabim")
      }
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
            
            const base64 = event.target?.result as string;
            newPreviews[index] = base64;
        
            if (newPreviews.filter(Boolean).length === files.length) {
              switch (type) {
                case "attachments":
                  setAttachmentPreviews((prev) => [...prev, ...newPreviews]);

                  contributeDialog ?
                  setValue("attachments", [
                    ...(getValues("attachments") || []),
                    ...newPreviews,
                  ]) : 
                  reportSetValue("attachments", [
                    ...(reportGetValues("attachments") || []),
                    ...newPreviews
                  ]);
                  break;
                case "audiosAttached":
                  setAudioPreviews((prev) => [...prev, ...newPreviews]);

                  contributeDialog ?
                  setValue("audiosAttached", [
                    ...(getValues("audiosAttached") || []),
                    ...newPreviews,
                  ]) : 
                  reportSetValue("audiosAttached", [
                    ...(reportGetValues("audiosAttached") || []),
                    ...newPreviews
                  ]);

                  break;
                case "videosAttached":
                  setVideoPreviews((prev) => [...prev, ...newPreviews]);

                  contributeDialog ?
                  setValue("videosAttached", [
                    ...(getValues("videosAttached") || []),
                    ...newPreviews,
                  ]) : 
                  reportSetValue("videosAttached", [
                    ...(reportGetValues("videosAttached") || []),
                    ...newPreviews
                  ]);
                  
                  break;
              }
            }
          };

          reader.onloadend = () => {
            clearInterval(interval);
            switch (type) {
              case "attachments":
                setAttachmentProgress(null)
                break;
              case "audiosAttached":
                setAudioProgress(null)
                break;
              case "videosAttached":
                setVideoProgress(null)
                break;
            }
          }
    
          reader.readAsDataURL(file);
        });
      }
    };
    

    const handleUpvote = useCallback(async () => {
        if (!session) {
          toast.error('Ju duhet të jeni të kycur për votim të ankesës/raportimit!', {action: {label: "Kycuni", onClick: () => router.push('/kycuni')}})
          return;
        }
        
        setIsUpvoting(true);
        try {
          const response = await api.post(`/api/complaintVotes/`, {complaintId: complaintsData.complaint.id, userId: session.user.id})
          if(response.data.success){
            toast.success(response.data.message)
          }
          if(response.data.hasUpVoted){
            setUpvoteCount(prev => prev + 1);
          }else{
            setUpvoteCount(prev => prev - 1);
          }
          router.refresh();
          setHasUpvoted(response.data.hasUpVoted);
        } catch (error: any) {
          console.error('Failed to upvote:', error);
          toast.error(error.response.data.message)
        } finally {
          setIsUpvoting(false);
        }
      }, [router]);

      

  return (
    <div className="bg-white shadow-lg overflow-hidden">
        <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ndërveprime</h3>
            <button
            onClick={handleUpvote}
            disabled={isUpvoting}
            className={`w-full cursor-pointer flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${hasUpvoted ? 'bg-green-600' : 'bg-indigo-600 hover:bg-indigo-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-3`}
            >
            {isUpvoting ? (
                'Duke procesuar...'
            ) : hasUpvoted ? (
                <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                E votuar ({upvoteCount})
                </>
            ) : (
                <>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
                Voto lartë ({upvoteCount})
                </>
            )}
            </button>
            <Dialog open={contributeDialog} onOpenChange={() => {
              reportReset();
              setAttachmentPreviews([]);
              setAudioPreviews([]);
              setVideoPreviews([]);
              setAudioProgress(null)
              setVideoProgress(null)
              setAttachmentProgress(null)
              setContributeDialog(!contributeDialog)
            }}>
              <form onSubmit={contributeHandleSubmit(contributeOnSubmit)}>
                {session ? (
                  <DialogTrigger asChild>
                    <button
                      type="button"
                      className="w-full cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-3"
                    >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Kontribuo
                    </button>
                  </DialogTrigger>
                ) : (
                  <button 
                      onClick={() => toast.error('Ju duhet te jeni te kycur per shtim te kontribimit!', {action: {label: "Kycuni", onClick: () => router.push('/kycuni')}})}
                      type="button"
                      className="w-full cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-3"
                    >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    Kontribuo
                  </button>
                )}
                <DialogContent className='max-h-[90vh] !w-full !max-w-[700px] max-[750px]:max-w-[calc(100%-48px)]! px-4 overflow-y-scroll'>
                  <DialogHeader>
                    <DialogTitle>Kontriboni</DialogTitle>
                    <DialogDescription className='max-[420px]:text-sm'>
                      Këtu mund të aplikoni për kontribim në këtë rast duke shtuar dëshmi dokumentesh, zërimeve, pamjeve etj.
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
                                <p className="text-sm text-center px-1 text-muted-foreground">
                                  Klikoni për të ngarkuar dokumente/imazhe <span className='text-indigo-600'>(Maksimum: 50MB)</span>
                                </p>
                              </div>
                              <input 
                                id='attachments'
                                type="file" 
                                className="hidden" 
                                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                                multiple
                                onChange={(e) => handleAttachmentUploads(e, "attachments")}
                              />
                            </label>
                            {typeof attachmentProgress === "number" && attachmentProgress > 0 && <div className='w-full bg-gray-200 rounded-full overflow-hidden'>
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
                      {contributeErrors.attachments && (
                        <p className="text-red-500 text-sm mt-1">{contributeErrors.attachments.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor='audiosAttached' className='mb-2'>Ngarkoni audio/zërime</Label>
                      <Controller 
                        control={contributeControl}
                        name="audiosAttached"
                        render={({field}) => (
                          <div className="space-y-4">
                            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors py-8">
                              <div className="flex flex-col items-center justify-center">
                                <AudioLinesIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-center px-1 text-muted-foreground">
                                  Klikoni për të ngarkuar audio/inqizime <span className='text-indigo-600'>(Maksimum: 50MB)</span>
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
                            {typeof audioProgress === "number" && audioProgress > 0 && <div className='w-full bg-gray-200 rounded-full overflow-hidden'>
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
                      {contributeErrors.audiosAttached && (
                        <p className="text-red-500 text-sm mt-1">{contributeErrors.audiosAttached.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor='videosAttached' className='mb-2'>Ngarkoni video/zërime</Label>
                      <Controller 
                        control={contributeControl}
                        name="videosAttached"
                        render={({field}) => (
                          <div className="space-y-4">
                            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors py-8">
                              <div className="flex flex-col items-center justify-center">
                                <Video className="h-8 w-8 text-muted-foreground mb-2" />
                                <p className="text-sm text-center px-1 text-muted-foreground">
                                  Klikoni për të ngarkuar video/inqizime <span className='text-indigo-600'>(Maksimum: 50MB)</span>
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
                            {typeof videoProgress === "number" && videoProgress > 0 && <div className='w-full bg-gray-200 rounded-full overflow-hidden'>
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
                      {contributeErrors.videosAttached && (
                        <p className="text-red-500 text-sm mt-1">{contributeErrors.videosAttached.message}</p>
                      )}
                    </div>
                    <div>
                      <CTAButton type='button' onClick={contributeHandleSubmit(contributeOnSubmit)} isLoading={contributeIsSubmitting} text={`${contributeIsSubmitting ? "Duke shtuar..." : "Shto kontribim"}`} primary classNames='w-full'/>
                    </div>
                  </div>
                </DialogContent>
              </form>
            </Dialog>
            <Dialog open={reportsDialog} onOpenChange={() => {
              reportReset();
              setAttachmentPreviews([]);
              setAudioPreviews([]);
              setVideoPreviews([]);
              setAudioProgress(null)
              setVideoProgress(null)
              setAttachmentProgress(null)
              setReportsDialog(!reportsDialog)
            }}>
              <form onSubmit={reportHandleSubmit(reportsOnSubmit)}>
                <DialogTrigger asChild>
                  <button
                    type="button"
                    className="w-full cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                  Raporto
                  </button>
                </DialogTrigger>
                <DialogContent className='max-h-[90vh] !w-full !max-w-[700px] max-[750px]:max-w-[calc(100%-48px)]! px-4 overflow-y-scroll'>
                    <DialogHeader>
                      <DialogTitle>Krijo Raportim</DialogTitle>
                      <DialogDescription>Në rast se ankesa/raportimi nuk është valid, ju mund ta raportoni këtu duke shtuar detaje relevante në lidhje me ankesën/raportim.</DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col gap-4  relative'>
                        <div>
                          <Label className='mb-1' htmlFor='title'>Titulli raportimit</Label>
                          <Controller 
                            control={reportControl}
                            name="title"
                            render={({field}) => (
                              <Input id='title' {...field} placeholder='Titulli i raportimit'/>
                            )}
                          />
                          {reportErrors.title && (
                            <p className="text-red-500 text-sm mt-1">{reportErrors.title.message}</p>
                          )}
                        </div>
                        <div>
                          <Label className='mb-1' htmlFor='description'>Detajet e raportimit</Label>
                          <Controller 
                            control={reportControl}
                            name="description"
                            render={({field}) => (
                              <Textarea id='description' {...field} placeholder='Përshkruani detajisht arsyjen e raportimit' rows={5}/>
                            )}
                          />
                          {reportErrors.description && (
                            <p className="text-red-500 text-sm mt-1">{reportErrors.description.message}</p>
                          )}
                        </div>
                        <div>
                          <Label className='mb-1' htmlFor='reportEmail'>Email</Label>
                          <Controller 
                            control={reportControl}
                            name="email"
                            render={({field}) => (
                              <Input placeholder='user@shembull.com' id='reportEmail' {...field}/>
                              
                            )}
                          />
                          {reportErrors.email && (
                            <p className="text-red-500 text-sm mt-1">{reportErrors.email.message}</p>
                          )}
                        </div>
                        <div>
                          <Label className='mb-1' htmlFor='category'>Kategoria</Label>
                          <Controller 
                            control={reportControl}
                            name="category"
                            render={({field}) => (
                              <Select value={field.value} onValueChange={field.onChange}>
                                <SelectTrigger className='w-full'>
                                  <SelectValue placeholder="Zgjidhni një kategori"/>
                                </SelectTrigger>
                                <SelectContent className='w-full'>
                                  <SelectGroup>
                                    <SelectLabel>Kategoritë</SelectLabel>
                                    <SelectItem value='LAJMERIM_I_RREMSHEM'>Lajmërim i rrejshëm</SelectItem>
                                    <SelectItem value='SHPIFJE'>Shpifje</SelectItem>
                                    <SelectItem value='GJUHE_URREJTJE'>Gjuhë urrejtje</SelectItem>
                                    <SelectItem value='PERVERSE_OSE_ABUZIVE'>Perverse ose abuzive</SelectItem>
                                    <SelectItem value='SPAM_OSE_DUPLIKAT'>Spam ose duplikat</SelectItem>
                                    <SelectItem value='JO_RELAVANT'>Jo relevant</SelectItem>
                                    <SelectItem value='SHKELJE_PRIVATESIE'>Shkelje privatësie</SelectItem>
                                    <SelectItem value='TJETER'>Tjetër</SelectItem>
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          />
                          {reportErrors.category && (
                            <p className="text-red-500 text-sm mt-1">Zgjidhni një opsion</p>
                          )}
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
                                  <p className="text-sm text-center px-1 text-muted-foreground">
                                    Klikoni për të ngarkuar dokumente/imazhe <span className='text-indigo-600'>(Maksimum: 50MB)</span>
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
                              {typeof attachmentProgress === "number" && attachmentProgress > 0 && <div className='w-full bg-gray-200 rounded-full overflow-hidden'>
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
                          {reportErrors.attachments && (
                            <p className="text-red-500 text-sm mt-1">{reportErrors.attachments.message}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor='audiosAttached' className='mb-2'>Ngarkoni audio/zërime</Label>
                          <Controller 
                            control={contributeControl}
                            name="audiosAttached"
                            render={({field}) => (
                              <div className="space-y-4">
                                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors py-8">
                                  <div className="flex flex-col items-center justify-center">
                                    <AudioLinesIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-center px-1 text-muted-foreground">
                                      Klikoni për të ngarkuar audio/inqizime <span className='text-indigo-600'>(Maksimum: 50MB)</span>
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
                                {typeof audioProgress === "number" && audioProgress > 0 && <div className='w-full bg-gray-200 rounded-full overflow-hidden'>
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
                          {reportErrors.audiosAttached && (
                            <p className="text-red-500 text-sm mt-1">{reportErrors.audiosAttached.message}</p>
                          )}
                        </div>
                        <div>
                          <Label htmlFor='videosAttached' className='mb-2'>Ngarkoni video/zërime</Label>
                          <Controller 
                            control={contributeControl}
                            name="videosAttached"
                            render={({field}) => (
                              <div className="space-y-4">
                                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors py-8">
                                  <div className="flex flex-col items-center justify-center">
                                    <Video className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-center px-1 text-muted-foreground">
                                      Klikoni për të ngarkuar video/inqizime <span className='text-indigo-600'>(Maksimum: 50MB)</span>
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
                                {typeof videoProgress === "number" && videoProgress > 0 && <div className='w-full bg-gray-200 rounded-full overflow-hidden'>
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
                          {reportErrors.videosAttached && (
                            <p className="text-red-500 text-sm mt-1">{reportErrors.videosAttached.message}</p>
                          )}
                        </div>
                        <div>
                          <CTAButton type='button' onClick={reportHandleSubmit(reportsOnSubmit)} isLoading={reportIsSubmitting} text={`${reportIsSubmitting ? "Duke krijuar raportimin..." : "Krijo raportim"}`} classNames='w-full' primary/>
                        </div>
                    </div>
                </DialogContent>
              </form>
            </Dialog>
        </div>
        </div>
  )
}

export default memo(ComplaintActionsCard)