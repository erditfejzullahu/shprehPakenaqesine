"use client"
import { contactFormSchema } from '@/lib/schemas/contactFormSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {z} from "zod"
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { ImagePlus, Upload, X } from 'lucide-react'
import CTAButton from './CTAButton'
import Image from 'next/image'

type validationSchema = z.infer<typeof contactFormSchema>

const ContactForm = () => {
    const [attachmentPreviews, setAttachmentPreviews] = useState<string[]>([])
    const abortControllerRef = useRef<AbortController | null>(null)

    const {control, handleSubmit, formState: {errors, isSubmitting, isSubmitted}, reset} = useForm<validationSchema>({
        resolver: zodResolver(contactFormSchema),
        defaultValues: useMemo(() => ({
            fullName: "",
            email: "",
            subject: "",
            description: "",
            reason: "NDIHMË",
            attachments: []
        }), []),
        mode: "onChange"
    }) 

    

    useEffect(() => {
      return () => {
        if(abortControllerRef.current){
            abortControllerRef.current.abort()
        }
      }
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
              const updatedPreviews = [...attachmentPreviews, ...newPreviews];
              setAttachmentPreviews(updatedPreviews);
              fieldOnChange(updatedPreviews);
            }
          };
          
          reader.readAsDataURL(file);
        });
      }, []);

    const onSubmit = useCallback(async (data: validationSchema) => {
        console.log(data);
    }, [reset])

    const removeImage = useCallback((
        index: number,
        fieldOnChange: (value: string[]) => void
      ) => {
        const updatedPreviews = attachmentPreviews.filter((_, i) => i !== index);
        setAttachmentPreviews(updatedPreviews);
        fieldOnChange(updatedPreviews);
      }, [attachmentPreviews]);
    

  return (
    <div className="max-w-6xl mx-auto mt-6 px-4">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mb-6">
            <div className="flex flex-row max-[580px]:flex-col gap-2 max-[580px]:gap-4">
                <div className="flex-1">
                    <Label htmlFor='name' className="mb-1">Emri Juaj</Label>
                    <Controller 
                        control={control}
                        name="fullName"
                        render={({field}) => (
                            <Input id='name' {...field} placeholder='Shkruani këtu emrin tuaj të plotë...'/>
                        )}
                    />
                    {errors.fullName && (
                        <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                    )}
                </div>
                <div className="flex-1">
                    <Label htmlFor='email' className="mb-1">Emaili Juaj</Label>
                    <Controller 
                        control={control}
                        name="email"
                        render={({field}) => (
                            <Input id='email' type="email" {...field} placeholder='përdoruesi@shembull.com' {...field}/>
                        )}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>
            </div>
            <div className="flex flex-row max-[580px]:flex-col gap-2 max-[580px]:gap-4">
                <div className="flex-1">
                    <Label htmlFor='subject' className="mb-1">Subjekti</Label>
                    <Controller 
                        control={control}
                        name="subject"
                        render={({field}) => (
                            <Input id='subject' {...field} placeholder='Subjekti juaj këtu...'/>
                        )}
                    />
                    {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                    )}
                </div>
                <div className="flex-1">
                    <Label htmlFor='reason' className="mb-1">Arsyeja e kontaktit</Label>
                    <Controller 
                        control={control}
                        name="reason"
                        render={({field}) => (
                            <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                            <SelectTrigger id='reason' className="flex-1 w-full cursor-pointer">
                                <SelectValue placeholder="Zgjidh një arsyje kontakti" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Zgjidhni mes opsioneve më poshtë</SelectLabel>
                                <SelectItem value='NDIHMË'>NDIHMË</SelectItem>
                                <SelectItem value='ANKESË'>ANKESË</SelectItem>
                                <SelectItem value='FSHIRJE'>FSHIRJE</SelectItem>
                                <SelectItem value='KËRKESË_E_RE'>KËRKESË_E_RE</SelectItem>
                                <SelectItem value='TJERA'>TJERA</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                            </Select>
                        )}
                    />
                    {errors.subject && (
                        <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                    )}
                </div>
            </div>
            <div>
                <Label htmlFor='description' className="mb-1">Permbajtja/Arsyeja</Label>
                <Controller 
                    control={control}
                    name="description"
                    render={({field}) => (
                        <Textarea id='description' {...field} placeholder='Shkruani detajisht arsyjen e dëshires së komunikimit me ShprehePakënaqesinë...' rows={14}/>
                    )}
                />
                {errors.description && (
                    <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                )}
            </div>
            <div>
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
                        </div>
                      )}
                    />
                {errors.attachments && (
                    <p className="text-red-500 text-sm mt-1">{errors.attachments.message}</p>
                )}
            </div>
            <div className="mx-auto w-[200px] max-[580px]:w-full">
                <CTAButton primary type='submit' text={isSubmitted ? "Duke u derguar" : "Dërgo"} classNames="!w-full !flex-1 "/>
            </div>
        </form>
    </div>
  )
}

export default memo(ContactForm)