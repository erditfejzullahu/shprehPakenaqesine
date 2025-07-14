"use client"
import { createCompanySchema } from '@/lib/schemas/createCompanySchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Phone, Mail, Globe, Upload, Image as ImageIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import CTAButton from './CTAButton';

type CompanySchemaType = z.infer<typeof createCompanySchema>;

const CreateCompanyForm = () => {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const defaultValues = useMemo(() => ({
    name: "",
    description: "",
    logoAttachment: "",
    address: "",
    website: undefined,
    email: undefined,
    phone: undefined,
    imageAttachments: [],
    industry: "",
    foundedYear: undefined
  }), []);

  const form = useForm<CompanySchemaType>({
    resolver: zodResolver(createCompanySchema),
    defaultValues
  });

  const onSubmit = useCallback(async (data: CompanySchemaType) => {
    console.log('Form submitted:', data);
    // Handle form submission logic here
  }, []);

  const handleReset = useCallback(() => {
    form.reset(defaultValues);
    setLogoPreview(null);
    setImagePreviews([]);
  }, [form, defaultValues]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setLogoPreview(base64);
        form.setValue('logoAttachment', base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUploads = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newPreviews: string[] = [];
      const readers: FileReader[] = [];

      Array.from(files).forEach((file, index) => {
        const reader = new FileReader();
        readers.push(reader);
        
        reader.onload = (event) => {
          const base64 = event.target?.result as string;
          newPreviews.push(base64);
          
          if (newPreviews.length === files.length) {
            setImagePreviews(prev => [...prev, ...newPreviews]);
            form.setValue('imageAttachments', [...form.getValues("imageAttachments") || [], ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeLogo = () => {
    setLogoPreview(null);
    form.setValue('logoAttachment', "");
  };

  const removeImage = (index: number) => {
    const updatedPreviews = [...imagePreviews];
    updatedPreviews.splice(index, 1);
    setImagePreviews(updatedPreviews);
    form.setValue('imageAttachments', updatedPreviews);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-6xl mx-auto my-6">
        <div className="flex flex-col gap-4">
          {/* Company Name */}
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

          {/* Logo Attachment */}
          <FormField
            control={form.control}
            name="logoAttachment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Logo e Kompanisë</FormLabel>
                <FormControl>
                  <div className="space-y-2">
                    {logoPreview ? (
                      <div className="relative group">
                        <img 
                          src={logoPreview} 
                          alt="Logo preview" 
                          className="h-32 w-32 object-contain border rounded-md"
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
                          <p className="text-sm text-muted-foreground">
                            Klikoni për të ngarkuar logo
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

            <div className="flex flex-row gap-2">
                <div className="flex-1">
                {/* Industry */}
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
                    {/* Address */}
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

          {/* Description */}
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

          {/* Image Attachments */}
          <FormField
            control={form.control}
            name="imageAttachments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imazhe të Kompanisë</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <label className="flex flex-col items-center justify-center w-full border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors py-8">
                      <div className="flex flex-col items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Klikoni për të ngarkuar imazhe
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            <div className="flex flex-row gap-2">
                <div className="flex-1">
                    {/* Phone */}
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
                    {/* Email */}
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
                                />
                            </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </div>

            <div className="flex flex-row gap-2">
                <div className="flex-1">
                    {/* Website */}
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
                    {/* Founded Year */}
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

        {/* Form Actions */}
        <div className="flex justify-center gap-4 flex-wrap">
          <CTAButton
            type="button"
            onClick={handleReset}
            isLoading={form.formState.isSubmitting}
            text='Pastro'
           />
          <CTAButton
            primary
            type="submit"
            classNames='w-[150px]'
            isLoading={form.formState.isSubmitting}
            text={form.formState.isSubmitting ? 'Duke u ruajtur...' : 'Ruaj'}
           />
        </div>
      </form>
    </Form>
  );
};

export default CreateCompanyForm;