"use client"

import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Phone, Mail, Globe, Upload, Image as ImageIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Companies } from '@/app/generated/prisma'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { toast } from 'sonner'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useForm, Controller } from 'react-hook-form'
import {z} from "zod"
import { createCompanyFormSchema } from '@/lib/schemas/createCompanySchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'
import { getAssetUrl } from '@/lib/utils'
import { uploadFileToBlob, uploadFilesToBlob } from '@/lib/blobUpload'

type CompanyFormType = z.infer<typeof createCompanyFormSchema>;

const CompanyActions = ({company}: {company: Companies}) => {
    const [openDialog, setOpenDialog] = useState(false)
    const [logoFile, setLogoFile] = useState<File | null>(null)
    const [logoPreview, setLogoPreview] = useState<string | null>(company.logoUrl ? getAssetUrl(company.logoUrl) : null)
    const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(company.logoUrl)
    const [existingImageUrls, setExistingImageUrls] = useState<string[]>(company.images || [])
    const [newImageFiles, setNewImageFiles] = useState<File[]>([])
    const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
    const [logoError, setLogoError] = useState<string | null>(null)
    const router = useRouter();

    const defaultValues = useMemo(() => ({
        name: company.name,
        description: company.description || "",
        address: company.address,
        website: company.website,
        email: company.email,
        phone: company.phone || "",
        industry: company.industry,
        foundedYear: company.foundedYear
    }), [company]);

    const {control, reset, handleSubmit, formState: {errors, isSubmitting}} = useForm<CompanyFormType>({
        resolver: zodResolver(createCompanyFormSchema),
        defaultValues,
        mode: "onChange"
    })

    useEffect(() => {
        if (openDialog) {
            reset(defaultValues);
            setLogoFile(null);
            setLogoPreview(company.logoUrl ? getAssetUrl(company.logoUrl) : null);
            setExistingLogoUrl(company.logoUrl);
            setExistingImageUrls(company.images || []);
            setNewImageFiles([]);
            setNewImagePreviews([]);
            setLogoError(null);
        }
    }, [openDialog, company, defaultValues, reset]);

    const handleRemoveCompany = useCallback(async () => {
        try {
            const response = await api.delete(`/api/admin/companies/${company.id}`)
            if(response.data.success){
                toast.success(`Fshirja e kompanise ${company.name} shkoi me sukses!`)
                router.refresh();
            }
        } catch (error: any) {
            console.error(error)
            toast.error(error.response.data.message || "Dicka shkoi gabim!")
        }
    }, [company.id, company.name, router])

    const onSubmit = async (data: CompanyFormType) => {
        if (!logoFile && !existingLogoUrl) {
            setLogoError("Logo e kompanisë është e detyrueshme");
            return;
        }
        setLogoError(null);

        try {
            let logoUrl = existingLogoUrl!;
            if (logoFile) {
                logoUrl = await uploadFileToBlob(logoFile, "companys/logo", company.id);
            }

            const uploadedNewImages = newImageFiles.length > 0
                ? await uploadFilesToBlob(newImageFiles, "companys/images", company.id)
                : [];

            const imageUrls = [...existingImageUrls, ...uploadedNewImages];

            const response = await api.patch(`/api/admin/companies/${company.id}`, {
                ...data,
                logoUrl,
                imageUrls,
            })
            if(response.data.success){
                toast.success(`Kompania ${company.name} u perditesua me sukses`)
                setOpenDialog(false)
                router.refresh();
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || error.message || "Dicka shkoi gabim!")
        }
    }

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (logoPreview && logoFile) URL.revokeObjectURL(logoPreview);
            setLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
            setExistingLogoUrl(null);
            setLogoError(null);
        }
    };

    const handleImageUploads = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            const added = Array.from(files);
            setNewImageFiles(prev => [...prev, ...added]);
            setNewImagePreviews(prev => [...prev, ...added.map(f => URL.createObjectURL(f))]);
        }
    };

    const removeLogo = () => {
        if (logoFile && logoPreview) URL.revokeObjectURL(logoPreview);
        setLogoFile(null);
        setLogoPreview(null);
        setExistingLogoUrl(null);
    };

    const removeImage = (index: number) => {
        const existingCount = existingImageUrls.length;
        if (index < existingCount) {
            setExistingImageUrls(prev => prev.filter((_, i) => i !== index));
        } else {
            const newIndex = index - existingCount;
            URL.revokeObjectURL(newImagePreviews[newIndex]);
            setNewImageFiles(prev => prev.filter((_, i) => i !== newIndex));
            setNewImagePreviews(prev => prev.filter((_, i) => i !== newIndex));
        }
    };

    const imagePreviews = [
        ...existingImageUrls.map(url => getAssetUrl(url)),
        ...newImagePreviews,
    ];

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
            <Button variant={"default"} className="cursor-pointer w-full" onClick={() => setOpenDialog(true)}>Ndrysho</Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="flex justify-center">
            <Link className="cursor-pointer bg-gray-100 hover:bg-gray-300" target="_blank" href={`/kompanite/${company.id}`}>Shiko</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
            <Button onClick={handleRemoveCompany} className="cursor-pointer w-full" variant={"destructive"}>Fshije</Button>
        </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>

    <Dialog open={openDialog} onOpenChange={(open) => { if (!open) { setOpenDialog(false); reset(); } }}>
        <DialogContent className="max-w-4xl! max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>Ndrysho te dhenat e kompanise</DialogTitle>
                <DialogDescription>Perditesoni te dhenat e kompanise {company.name}</DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="flex flex-col gap-4">
                    <div className="max-w-xl mx-auto w-full">
                        <Controller
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <div className="space-y-2">
                                    <label className="text-center flex justify-center">Emri i Kompanisë</label>
                                    <Input 
                                        className='w-full text-center' 
                                        placeholder="Shkruani emrin e kompanisë" 
                                        {...field} 
                                    />
                                    {errors.name && (
                                        <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
                                    )}
                                </div>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <label>Logo e Kompanisë</label>
                        <div className="space-y-2">
                            {logoPreview ? (
                                <div className="relative group w-fit">
                                    <Image 
                                        src={logoPreview} 
                                        alt={`${company.name} Company logo preview`}
                                        width={100}
                                        height={100}
                                        className="h-52 w-full object-contain border rounded-md"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute -right-2 -top-2 rounded-full bg-destructive/90 hover:bg-destructive text-white"
                                        onClick={removeLogo}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                                        <p className="text-sm text-center px-1 text-muted-foreground">
                                            Klikoni për të ngarkuar logo <span className='text-indigo-600'>(Maksimum: 10MB)</span>
                                        </p>
                                    </div>
                                    <input 
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={handleLogoUpload}
                                    />
                                </label>
                            )}
                        </div>
                        {logoError && (
                            <p className="text-sm font-medium text-destructive">{logoError}</p>
                        )}
                    </div>

                    <div className="flex flex-row gap-2">
                        <div className="flex-1 space-y-2">
                            <Controller
                                control={control}
                                name="industry"
                                render={({ field }) => (
                                    <>
                                        <label>Industria</label>
                                        <Input placeholder="Shkruani industrinë" {...field} />
                                        {errors.industry && (
                                            <p className="text-sm font-medium text-destructive">{errors.industry.message}</p>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <Controller
                                control={control}
                                name="address"
                                render={({ field }) => (
                                    <>
                                        <label>Adresa</label>
                                        <Input placeholder="Shkruani adresën e plotë" {...field} />
                                        {errors.address && (
                                            <p className="text-sm font-medium text-destructive">{errors.address.message}</p>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Controller
                            control={control}
                            name="description"
                            render={({ field }) => (
                                <>
                                    <label>Përshkrimi</label>
                                    <Textarea
                                        placeholder="Shkruani një përshkrim të kompanisë"
                                        className="min-h-[120px]"
                                        {...field}
                                    />
                                    {errors.description && (
                                        <p className="text-sm font-medium text-destructive">{errors.description.message}</p>
                                    )}
                                </>
                            )}
                        />
                    </div>

                    <div className="space-y-2">
                        <label>Imazhe të Kompanisë</label>
                        <div className="space-y-4">
                            <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors py-8">
                                <div className="flex flex-col items-center justify-center">
                                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm text-center px-1 text-muted-foreground">
                                        Klikoni për të ngarkuar imazhe <span className='text-indigo-600'>(Maksimum: 50MB)</span>
                                    </p>
                                </div>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUploads}
                                />
                            </label>
                            
                            {imagePreviews.length > 0 && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="relative group">
                                            <img 
                                                src={preview} 
                                                alt={`Preview ${index + 1}`} 
                                                className="h-32 w-full object-cover rounded-md"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute -right-2 -top-2 rounded-full bg-destructive/90 hover:bg-destructive text-white"
                                                onClick={() => removeImage(index)}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-row gap-2">
                        <div className="flex-1 space-y-2">
                            <Controller
                                control={control}
                                name="phone"
                                render={({ field }) => (
                                    <>
                                        <label>Numri i Telefonit</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                placeholder="+383 44 123 456"
                                                className="pl-10"
                                                {...field}
                                                value={field.value || ''}
                                            />
                                        </div>
                                        {errors.phone && (
                                            <p className="text-sm font-medium text-destructive">{errors.phone.message}</p>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <Controller
                                control={control}
                                name="email"
                                render={({ field }) => (
                                    <>
                                        <label>Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                placeholder="info@kompania.com"
                                                className="pl-10"
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        </div>
                                        {errors.email && (
                                            <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </div>

                    <div className="flex flex-row gap-2">
                        <div className="flex-1 space-y-2">
                            <Controller
                                control={control}
                                name="website"
                                render={({ field }) => (
                                    <>
                                        <label>Website</label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                            <Input
                                                placeholder="https://kompania.com"
                                                className="pl-10"
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        </div>
                                        {errors.website && (
                                            <p className="text-sm font-medium text-destructive">{errors.website.message}</p>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                        <div className="flex-1 space-y-2">
                            <Controller
                                control={control}
                                name="foundedYear"
                                render={({ field }) => (
                                    <>
                                        <label>Viti i Themelimit</label>
                                        <Input
                                            type="number"
                                            placeholder="2020"
                                            {...field}
                                            value={field.value || ""}
                                            onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                                        />
                                        {errors.foundedYear && (
                                            <p className="text-sm font-medium text-destructive">{errors.foundedYear.message}</p>
                                        )}
                                    </>
                                )}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center gap-4 flex-wrap">
                    <Button
                        className='cursor-pointer'
                        type="button"
                        variant="outline"
                        onClick={() => setOpenDialog(false)}
                        disabled={isSubmitting}
                    >
                        Anulo
                    </Button>
                    <Button
                        className='cursor-pointer'
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Duke u ruajtur...' : 'Ruaj Ndryshimet'}
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
    </>
  )
}

export default memo(CompanyActions)
