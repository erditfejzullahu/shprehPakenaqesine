"use client"
import { createCompanyFormSchema } from '@/lib/schemas/createCompanySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { memo, useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Phone, Mail, Globe, Upload, Image as ImageIcon, X } from 'lucide-react';
import CTAButton from './CTAButton';
import api from '@/lib/api';
import { toast } from 'sonner';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { uploadFileToBlob, uploadFilesToBlob } from '@/lib/blobUpload';

type CompanyFormType = z.infer<typeof createCompanyFormSchema>;

const CreateCompanyForm = () => {
  const router = useRouter();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [logoError, setLogoError] = useState<string | null>(null);

  const defaultValues = useMemo(() => ({
    name: "",
    description: "",
    address: "",
    website: null,
    email: null,
    phone: "",
    industry: "",
    foundedYear: null
  }), []);

  const form = useForm<CompanyFormType>({
    resolver: zodResolver(createCompanyFormSchema),
    defaultValues
  });

  const onSubmit = useCallback(async (data: CompanyFormType) => {
    if (!logoFile) {
      setLogoError("Logo e kompanisë është e detyrueshme");
      return;
    }
    setLogoError(null);

    try {
      const uploadKey = crypto.randomUUID();
      const logoUrl = await uploadFileToBlob(logoFile, "companys/logo", uploadKey);
      const imageUrls = imageFiles.length > 0
        ? await uploadFilesToBlob(imageFiles, "companys/images", uploadKey)
        : [];

      const response = await api.post('/api/createCompany', { ...data, logoUrl, imageUrls });

      if(response.data.success){
        toast.success('Sapo keni shtuar nje kompani ne platforme. Ju faleminderit!')
      }
      if(response.data.url){
        router.push(`/kompanite/${response.data.url}`)
      }
    } catch (error: any) {
      console.error(error)
      toast.error(error.response?.data?.message || error.message || "Dicka shkoi gabim")
    }
  }, [logoFile, imageFiles, router]);

  const handleReset = useCallback(() => {
    form.reset(defaultValues);
    setLogoFile(null);
    setLogoPreview(null);
    setImageFiles([]);
    setImagePreviews([]);
    setLogoError(null);
  }, [form, defaultValues]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
      setLogoError(null);
    }
  };

  const handleImageUploads = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);
      setImageFiles(prev => [...prev, ...newFiles]);
      setImagePreviews(prev => [...prev, ...newFiles.map(f => URL.createObjectURL(f))]);
    }
  };

  const removeLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoPreview(null);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-6xl mx-auto my-6 shadow-lg p-4">
        <div className="flex flex-col gap-4">
          <div className="max-w-xl mx-auto w-full">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                <FormItem>
                    <FormLabel className='text-center flex justify-center'>Emri i Kompanisë</FormLabel>
                    <FormControl>
                    <Input className='w-full text-center' placeholder="Shkruani emrin e kompanisë" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
          </div>

          <FormItem>
            <FormLabel htmlFor='logoAttachment'>Logo e Kompanisë</FormLabel>
            <FormControl>
              <div className="space-y-2">
                {logoPreview ? (
                  <div className="relative group w-fit">
                    <Image 
                      src={logoPreview} 
                      alt={`${form.getValues("name")} Company logo preview`}
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
                      id='logoAttachment'
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </label>
                )}
              </div>
            </FormControl>
            {logoError && <p className="text-sm font-medium text-destructive">{logoError}</p>}
          </FormItem>

            <div className="flex flex-row max-[570px]:flex-col gap-2 max-[570px]:gap-4">
                <div className="flex-1">
                <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Industria</FormLabel>
                        <FormControl>
                        <Input placeholder="Shkruani industrinë" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                </div>
                <div className="flex-1">
                    <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Adresa</FormLabel>
                            <FormControl>
                            <Input placeholder="Shkruani adresën e plotë" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Përshkrimi</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Shkruani një përshkrim të kompanisë"
                    className="min-h-[120px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel htmlFor='imagesComp'>Imazhe të Kompanisë</FormLabel>
            <FormControl>
              <div className="space-y-4">
                <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors py-8">
                  <div className="flex flex-col items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-center px-1 text-muted-foreground">
                      Klikoni për të ngarkuar imazhe <span className='text-indigo-600'>(Maksimum: 50MB)</span>
                    </p>
                  </div>
                  <input 
                    id='imagesComp'
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
            </FormControl>
          </FormItem>
            <div className="flex flex-row max-[570px]:flex-col gap-2 max-[570px]:gap-4">
                <div className="flex-1">
                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Numri i Telefonit</FormLabel>
                            <FormControl>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                placeholder="+383 44 123 456"
                                className="pl-10"
                                {...field}
                                value={field.value || ''}
                                />
                            </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <div className="flex-1">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                placeholder="info@kompania.com"
                                className="pl-10"
                                {...field}
                                value={field.value || ""}
                                />
                            </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </div>

            <div className="flex flex-row max-[570px]:flex-col gap-2 max-[570px]:gap-4">
                <div className="flex-1">
                    <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                            <div className="relative">
                                <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                placeholder="https://kompania.com"
                                className="pl-10"
                                {...field}
                                value={field.value || ""}
                                />
                            </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
                <div className="flex-1">
                    <FormField
                        control={form.control}
                        name="foundedYear"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Viti i Themelimit</FormLabel>
                            <FormControl>
                            <Input
                                type="number"
                                placeholder="2020"
                                {...field}
                                value={field.value || ""}
                                onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                            />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </div>
        </div>

        <div className="flex justify-center gap-4 flex-wrap">
          <CTAButton
            type="button"
            onClick={handleReset}
            isLoading={form.formState.isSubmitting}
            classNames='max-[303px]:w-full'
            text='Pastro'
           />
          <CTAButton
            primary
            type="submit"
            classNames='min-w-[150px] max-[303px]:w-full'
            isLoading={form.formState.isSubmitting}
            text={form.formState.isSubmitting ? 'Duke u ruajtur...' : 'Ruaj'}
           />
        </div>
      </form>
    </Form>
  );
};

export default memo(CreateCompanyForm);
