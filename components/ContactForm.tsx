"use client"
import { contactFormSchema } from '@/lib/schemas/contactFormSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import {z} from "zod"
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { ImagePlus, X } from 'lucide-react'
import CTAButton from './CTAButton'
import Image from 'next/image'

type validationSchema = z.infer<typeof contactFormSchema>

const ContactForm = () => {
    const abortControllerRef = useRef<AbortController | null>(null)

    const inputRef = useRef<HTMLInputElement>(null)
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
    

    const handleFileChange = useCallback(( e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string[]) => void, existingImages: string[]) => {
        const files = e.target.files;
        if (!files) return;

        const newImages: string[] = [...existingImages];
        
        Array.from(files).forEach((file) => {
            if (!file.type.startsWith("image/")) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
            if (event.target?.result) {
                newImages.push(event.target.result as string);
                onChange(newImages);
            }
            };
            reader.readAsDataURL(file);
        });
    }, [reset])

    const onSubmit = useCallback(async (data: validationSchema) => {
        console.log(data);
    }, [reset])
    

  return (
    <div className="max-w-6xl mx-auto mt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 mb-6">
            <div className="flex flex-row gap-2">
                <div className="flex-1">
                    <Label htmlFor='name' className="mb-1">Emri Juaj</Label>
                    <Controller 
                        control={control}
                        name="fullName"
                        render={({field}) => (
                            <Input id='name' {...field} placeholder='Shkruani ketu emrin tuaj te plote...'/>
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
                            <Input id='email' type="email" {...field} placeholder='perdoruesi@shembull.com' {...field}/>
                        )}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                    )}
                </div>
            </div>
            <div className="flex flex-row gap-2">
                <div className="flex-1">
                    <Label htmlFor='subject' className="mb-1">Subjekti</Label>
                    <Controller 
                        control={control}
                        name="subject"
                        render={({field}) => (
                            <Input id='subject' {...field} placeholder='Subjekti juaj ketu...'/>
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
                                <SelectValue placeholder="Zgjidh nje arsyje kontakti" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                <SelectLabel>Zgjidhni mes opsioneve me poshte</SelectLabel>
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
                        <Textarea id='description' {...field} placeholder='Shkruani detajisht arsyjen e deshires se komunikimit me ShprehePakenaqesine...' rows={8}/>
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
                render={({ field: { value = [], onChange } }) => (
                    <div className="space-y-4">
                    {/* Preview Area */}
                    <div className="flex flex-wrap gap-2">
                        {value.map((img, index) => (
                        <div key={index} className="relative group">
                            <Image
                            src={img}
                            width={100}
                            height={100}
                            alt={`Preview ${index}`}
                            className="h-24 w-24 object-cover rounded-md"
                            />
                            <button
                            type="button"
                            onClick={() => {
                                const updated = value.filter((_, i) => i !== index);
                                onChange(updated);
                            }}
                            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 transition-opacity"
                            >
                            <X className="h-4 w-4 text-white" />
                            </button>
                        </div>
                        ))}
                    </div>

                    {/* Upload Button */}
                    <Label className="w-fit">
                        <Input
                            ref={inputRef}
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileChange(e, onChange, value)}
                        />
                        <CTAButton text='Shto Imazhe' onClick={() => inputRef.current?.click()}/>
                        <ImagePlus className="h-4 w-4" />
                    </Label>
                    </div>
                )}
                />
                {errors.attachments && (
                    <p className="text-red-500 text-sm mt-1">{errors.attachments.message}</p>
                )}
            </div>
            <div className="mx-auto w-[200px]">
                <CTAButton primary type='submit' text={isSubmitted ? "Duke u derguar" : "Dergo"} classNames="!w-full !flex-1"/>
            </div>
        </form>
    </div>
  )
}

export default memo(ContactForm)