"use client"
import api from '@/lib/api'
import { ComplantPerIdInterface } from '@/types/types'
import { Session } from 'next-auth'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
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
import { reportFormSchema } from '@/lib/schemas/reportsSchema'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import SocialShareButtons from './SocialShareButtons'
import { uploadEvidenceFiles } from '@/lib/blobUpload'

type ReportFormType = z.infer<typeof reportFormSchema>

type FilePreview = { file: File; previewUrl: string }

const contributeFormSchema = z.object({})
type ContributeFormType = z.infer<typeof contributeFormSchema>

const ComplaintActionsCard = ({complaintsData, session}: {complaintsData: ComplantPerIdInterface, session: Session | null}) => {
    const router = useRouter();
    const {update} = useSession();
    const [isUpvoting, setIsUpvoting] = useState(false)
    const [upvoteCount, setUpvoteCount] = useState(complaintsData.complaint.upVotes)
    const [hasUpvoted, setHasUpvoted] = useState(complaintsData.complaint.hasVoted)

    const [contributeAttachmentFiles, setContributeAttachmentFiles] = useState<FilePreview[]>([])
    const [contributeAudioFiles, setContributeAudioFiles] = useState<FilePreview[]>([])
    const [contributeVideoFiles, setContributeVideoFiles] = useState<FilePreview[]>([])

    const [reportAttachmentFiles, setReportAttachmentFiles] = useState<FilePreview[]>([])
    const [reportAudioFiles, setReportAudioFiles] = useState<FilePreview[]>([])
    const [reportVideoFiles, setReportVideoFiles] = useState<FilePreview[]>([])

    const [isContributeUploading, setIsContributeUploading] = useState(false)
    const [isReportUploading, setIsReportUploading] = useState(false)

    const [reportsDialog, setReportsDialog] = useState(false)
    const [contributeDialog, setContributeDialog] = useState(false)

    const { handleSubmit: contributeHandleSubmit, reset: contributeReset, formState: { isSubmitting: contributeIsSubmitting } } = useForm<ContributeFormType>({
      resolver: zodResolver(contributeFormSchema),
      defaultValues: useMemo(() => ({}), [])
    })

    const {control: reportControl, handleSubmit: reportHandleSubmit, reset: reportReset, formState: {errors: reportErrors, isSubmitting: reportIsSubmitting}} = useForm<ReportFormType>({
      resolver: zodResolver(reportFormSchema),
      defaultValues: useMemo(() => ({
        title: "",
        description: "",
        category: "GJUHE_URREJTJE",
        email: "",
      }), [])
    })

    const revokePreviews = useCallback((previews: FilePreview[]) => {
      previews.forEach((p) => URL.revokeObjectURL(p.previewUrl));
    }, [])

    const clearContributeFiles = useCallback(() => {
      revokePreviews([...contributeAttachmentFiles, ...contributeAudioFiles, ...contributeVideoFiles]);
      setContributeAttachmentFiles([]);
      setContributeAudioFiles([]);
      setContributeVideoFiles([]);
    }, [contributeAttachmentFiles, contributeAudioFiles, contributeVideoFiles, revokePreviews])

    const clearReportFiles = useCallback(() => {
      revokePreviews([...reportAttachmentFiles, ...reportAudioFiles, ...reportVideoFiles]);
      setReportAttachmentFiles([]);
      setReportAudioFiles([]);
      setReportVideoFiles([]);
    }, [reportAttachmentFiles, reportAudioFiles, reportVideoFiles, revokePreviews])

    useEffect(() => {
      return () => {
        revokePreviews([
          ...contributeAttachmentFiles,
          ...contributeAudioFiles,
          ...contributeVideoFiles,
          ...reportAttachmentFiles,
          ...reportAudioFiles,
          ...reportVideoFiles,
        ]);
      };
    }, [])

    const addFiles = useCallback((
      e: React.ChangeEvent<HTMLInputElement>,
      setFiles: React.Dispatch<React.SetStateAction<FilePreview[]>>,
      acceptType?: string
    ) => {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      const newPreviews = Array.from(files)
        .filter((file) => !acceptType || file.type.includes(acceptType))
        .map((file) => ({
          file,
          previewUrl: URL.createObjectURL(file),
        }));

      setFiles((prev) => [...prev, ...newPreviews]);
      e.target.value = "";
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

    const reportsOnSubmit = useCallback(async (data: ReportFormType) => {
      try {
        setIsReportUploading(true)
        const entityId = crypto.randomUUID()
        const { attachments, audiosAttached, videosAttached } = await uploadEvidenceFiles(
          entityId,
          reportAttachmentFiles.map((p) => p.file),
          reportAudioFiles.map((p) => p.file),
          reportVideoFiles.map((p) => p.file),
          "reports"
        )

        const response = await api.post(`/api/createReport`, {
          ...data,
          attachments,
          audiosAttached,
          videosAttached,
          complaintId: complaintsData.complaint.id,
        })
        if(response.data.success){
          toast.success(`Sapo keni krijuar raportimin me sukses! Do te njoftoheni vazhdimisht per cdo ndryshim ne lidhje me kete raportim.`)
          setReportsDialog(false)
          reportReset()
          clearReportFiles()
        }
      } catch (error: any) {
        console.error(error)
        toast.error(
          error?.message ||
            error.response?.data?.message ||
            "Dicka shkoi gabim"
        )
      } finally {
        setIsReportUploading(false)
      }
    }, [reportAttachmentFiles, reportAudioFiles, reportVideoFiles, complaintsData.complaint.id, reportReset, clearReportFiles])

    const contributeOnSubmit = useCallback(async () => {
      if (
        contributeAttachmentFiles.length === 0 &&
        contributeAudioFiles.length === 0 &&
        contributeVideoFiles.length === 0
      ) {
        toast.error("Duhet të paktën një evidence nga rubrikat e paraqitura!")
        return
      }

      try {
        setIsContributeUploading(true)
        const entityId = crypto.randomUUID()
        const { attachments, audiosAttached, videosAttached } = await uploadEvidenceFiles(
          entityId,
          contributeAttachmentFiles.map((p) => p.file),
          contributeAudioFiles.map((p) => p.file),
          contributeVideoFiles.map((p) => p.file),
          "contributions"
        )

        const response = await api.post(`/api/createContribution`, {
          complaintId: complaintsData.complaint.id,
          attachments,
          audiosAttached,
          videosAttached,
        })
        if(response.data.success){
          toast.success(`Aplikimi per kontribuim ne kete ankese/raport shkoi me sukses. Do njoftoheni kur te behet validimi i evidences tuaj.`)
          if(session){
            await update({contributions: session?.user.contributions + 1})
          }
          setContributeDialog(false)
          contributeReset()
          clearContributeFiles()
          router.refresh();
        }
      } catch (error: any) {
        console.error(error)
        toast.error(
          error?.message ||
            error.response?.data?.message ||
            "Dicka shkoi gabim"
        )
      } finally {
        setIsContributeUploading(false)
      }
    }, [contributeAttachmentFiles, contributeAudioFiles, contributeVideoFiles, complaintsData.complaint.id, session, update, contributeReset, clearContributeFiles, router])

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
      }, [router, session, complaintsData.complaint.id]);

    const contributeBusy = contributeIsSubmitting || isContributeUploading
    const reportBusy = reportIsSubmitting || isReportUploading

  return (
    <>
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
            clearReportFiles();
            setContributeDialog(!contributeDialog)
            if (contributeDialog) clearContributeFiles();
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
                    <Label htmlFor='contribute-attachments' className='mb-2'>Ngarkoni imazhe/dokumente</Label>
                    <div className="space-y-4">
                      <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors py-8">
                        <div className="flex flex-col items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-center px-1 text-muted-foreground">
                            Klikoni për të ngarkuar dokumente/imazhe <span className='text-indigo-600'>(Maksimum: 50MB)</span>
                          </p>
                        </div>
                        <input
                          id='contribute-attachments'
                          type="file"
                          className="hidden"
                          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                          multiple
                          onChange={(e) => addFiles(e, setContributeAttachmentFiles)}
                        />
                      </label>

                      {contributeAttachmentFiles.length > 0 && (
                        <div className="flex flex-nowrap overflow-x-auto gap-4">
                          {contributeAttachmentFiles.map((preview, index) => (
                            <div key={index} className="relative group flex-shrink-0">
                              <img
                                src={preview.previewUrl}
                                alt={`Preview ${index + 1}`}
                                className="h-44 min-w-full object-cover rounded-md"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute -right-0 h-6 -top-0 rounded-full bg-destructive/90 hover:bg-destructive text-white"
                                onClick={() => removeFile(index, setContributeAttachmentFiles)}
                              >
                                <X className="h-4 w-4 " />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor='contribute-audios' className='mb-2'>Ngarkoni audio/zërime</Label>
                    <div className="space-y-4">
                      <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors py-8">
                        <div className="flex flex-col items-center justify-center">
                          <AudioLinesIcon className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-center px-1 text-muted-foreground">
                            Klikoni për të ngarkuar audio/inqizime <span className='text-indigo-600'>(Maksimum: 50MB)</span>
                          </p>
                        </div>
                        <input
                          id='contribute-audios'
                          type="file"
                          className="hidden"
                          accept="audio/*"
                          multiple
                          onChange={(e) => addFiles(e, setContributeAudioFiles, "audio")}
                        />
                      </label>
                      {contributeAudioFiles.length > 0 && (
                        <div className="flex flex-nowrap overflow-x-auto gap-4">
                          {contributeAudioFiles.map((preview, index) => (
                            <div key={index} className="relative group flex-shrink-0">
                              <audio controls src={preview.previewUrl} className="min-w-full h-44" />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute -right-0 h-6 -top-0 rounded-full bg-destructive/90 hover:bg-destructive text-white"
                                onClick={() => removeFile(index, setContributeAudioFiles)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor='contribute-videos' className='mb-2'>Ngarkoni video/zërime</Label>
                    <div className="space-y-4">
                      <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors py-8">
                        <div className="flex flex-col items-center justify-center">
                          <Video className="h-8 w-8 text-muted-foreground mb-2" />
                          <p className="text-sm text-center px-1 text-muted-foreground">
                            Klikoni për të ngarkuar video/inqizime <span className='text-indigo-600'>(Maksimum: 50MB)</span>
                          </p>
                        </div>
                        <input
                          id='contribute-videos'
                          type="file"
                          className="hidden"
                          accept="video/*"
                          multiple
                          onChange={(e) => addFiles(e, setContributeVideoFiles, "video")}
                        />
                      </label>
                      {contributeVideoFiles.length > 0 && (
                        <div className="flex flex-nowrap overflow-x-auto gap-4">
                          {contributeVideoFiles.map((preview, index) => (
                            <div key={index} className="relative group flex-shrink-0">
                              <video controls className="min-w-full h-44 rounded" src={preview.previewUrl} />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute -right-0 -top-0 h-6 rounded-full bg-destructive/90 hover:bg-destructive text-white"
                                onClick={() => removeFile(index, setContributeVideoFiles)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <CTAButton type='submit' isLoading={contributeBusy} text={`${contributeBusy ? "Duke shtuar..." : "Shto kontribim"}`} primary classNames='w-full'/>
                  </div>
                </div>
              </DialogContent>
            </form>
          </Dialog>
          <Dialog open={reportsDialog} onOpenChange={() => {
            reportReset();
            clearContributeFiles();
            setReportsDialog(!reportsDialog)
            if (reportsDialog) clearReportFiles();
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
                            <Select value={field.value} defaultValue={field.value} onValueChange={field.onChange}>
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
                      <Label htmlFor='report-attachments' className='mb-2'>Ngarkoni imazhe/dokumente</Label>
                      <div className="space-y-4">
                        <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors py-8">
                          <div className="flex flex-col items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                            <p className="text-sm text-center px-1 text-muted-foreground">
                              Klikoni për të ngarkuar dokumente/imazhe <span className='text-indigo-600'>(Maksimum: 50MB)</span>
                            </p>
                          </div>
                          <input
                            id='report-attachments'
                            type="file"
                            className="hidden"
                            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                            multiple
                            onChange={(e) => addFiles(e, setReportAttachmentFiles)}
                          />
                        </label>

                        {reportAttachmentFiles.length > 0 && (
                          <div className="flex flex-nowrap overflow-x-scroll gap-4">
                            {reportAttachmentFiles.map((preview, index) => (
                              <div key={index} className="relative group flex-shrink-0">
                                <img
                                  src={preview.previewUrl}
                                  alt={`Preview ${index + 1}`}
                                  className="h-44 min-w-full object-cover rounded-md"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute -right-0 h-6 -top-0 rounded-full bg-destructive/90 hover:bg-destructive text-white"
                                  onClick={() => removeFile(index, setReportAttachmentFiles)}
                                >
                                  <X className="h-4 w-4 " />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      </div>
                      <div>
                        <Label htmlFor='report-audios' className='mb-2'>Ngarkoni audio/zërime</Label>
                        <div className="space-y-4">
                          <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors py-8">
                            <div className="flex flex-col items-center justify-center">
                              <AudioLinesIcon className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-center px-1 text-muted-foreground">
                                Klikoni për të ngarkuar audio/inqizime <span className='text-indigo-600'>(Maksimum: 50MB)</span>
                              </p>
                            </div>
                            <input
                              id='report-audios'
                              type="file"
                              className="hidden"
                              accept="audio/*"
                              multiple
                              onChange={(e) => addFiles(e, setReportAudioFiles, "audio")}
                            />
                          </label>
                          {reportAudioFiles.length > 0 && (
                            <div className="flex flex-nowrap overflow-x-scroll gap-4">
                              {reportAudioFiles.map((preview, index) => (
                                <div key={index} className="relative group flex-shrink-0">
                                  <audio controls src={preview.previewUrl} className="min-w-full h-44" />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute -right-0 h-6 -top-0 rounded-full bg-destructive/90 hover:bg-destructive text-white"
                                    onClick={() => removeFile(index, setReportAudioFiles)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor='report-videos' className='mb-2'>Ngarkoni video/zërime</Label>
                        <div className="space-y-4">
                          <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors py-8">
                            <div className="flex flex-col items-center justify-center">
                              <Video className="h-8 w-8 text-muted-foreground mb-2" />
                              <p className="text-sm text-center px-1 text-muted-foreground">
                                Klikoni për të ngarkuar video/inqizime <span className='text-indigo-600'>(Maksimum: 50MB)</span>
                              </p>
                            </div>
                            <input
                              id='report-videos'
                              type="file"
                              className="hidden"
                              accept="video/*"
                              multiple
                              onChange={(e) => addFiles(e, setReportVideoFiles, "video")}
                            />
                          </label>
                          {reportVideoFiles.length > 0 && (
                            <div className="flex flex-nowrap overflow-x-scroll gap-4">
                              {reportVideoFiles.map((preview, index) => (
                                <div key={index} className="relative group flex-shrink-0">
                                  <video controls className="min-w-full h-44 rounded" src={preview.previewUrl} />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute -right-0 -top-0 h-6 rounded-full bg-destructive/90 hover:bg-destructive text-white"
                                    onClick={() => removeFile(index, setReportVideoFiles)}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <CTAButton type='submit' isLoading={reportBusy} text={`${reportBusy ? "Duke krijuar raportimin..." : "Krijo raportim"}`} classNames='w-full' primary/>
                      </div>
                  </div>
              </DialogContent>
            </form>
          </Dialog>
      </div>
    </div>
      <SocialShareButtons
        url={`${process.env.NEXT_PUBLIC_BASE_URL}/ankesat/${complaintsData.complaint.id}`}
        title={complaintsData.complaint.title}
        description={complaintsData.complaint.description}
        className={"!mt-0 justify-between"}
      />
    </>
  )
}

export default memo(ComplaintActionsCard)
