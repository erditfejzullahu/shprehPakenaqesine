"use client"
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import {z} from "zod"
import { Label } from './ui/label'
import { Controller, useForm } from 'react-hook-form'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Checkbox } from './ui/checkbox'
import Image from 'next/image'
import { Button } from './ui/button'
import { Upload, X } from 'lucide-react'
import CTAButton from './CTAButton'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/react'
import { zodResolver } from '@hookform/resolvers/zod'
import api from '@/lib/api'
import { toast } from 'sonner'
import { updateProfileFormSchema } from '@/lib/schemas/updateProfileDetails'
import { uploadFileToBlob } from '@/lib/blobUpload'

type ValidationSchema = z.infer<typeof updateProfileFormSchema>

const UpdateProfileData = ({session}: {session: Session | null}) => {
    if(!session) return null;

    const {update} = useSession();
    const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
    const [imageProfilePreview, setImageProfilePreview] = useState<string | null>(session.user.userProfileImage ?? null)
    const [isUploading, setIsUploading] = useState(false)

    const {control, reset, watch, handleSubmit, formState: {errors, isSubmitting}} = useForm<ValidationSchema>({
      resolver: zodResolver(updateProfileFormSchema),
      defaultValues: useMemo(() => ({
          fullName: "",
          email: "",
          gender: "MASHKULL",
          username: "",
          password: null,
          confirmPassword: null,
          changePassword: false
      }), []),
      mode: "onChange"
    })

    const removeLogo = useCallback(() => {
        if (profileImageFile && imageProfilePreview?.startsWith("blob:")) {
          URL.revokeObjectURL(imageProfilePreview);
        }
        setProfileImageFile(null);
        setImageProfilePreview(null);
    }, [profileImageFile, imageProfilePreview]);

    const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
          if (profileImageFile && imageProfilePreview?.startsWith("blob:")) {
            URL.revokeObjectURL(imageProfilePreview);
          }
          setProfileImageFile(file);
          setImageProfilePreview(URL.createObjectURL(file));
        }
        e.target.value = "";
    }, [profileImageFile, imageProfilePreview]);

    const password = watch("password");
    const changePassword = watch("changePassword")

    useEffect(() => {
      if(session){
        reset({
          fullName: session.user.fullName,
          email: session.user.email,
          gender: session.user.gender,
          username: session.user.username,
          password: "",
          confirmPassword: ""
        })
        if (!profileImageFile) {
          setImageProfilePreview(session.user.userProfileImage ?? null);
        }
      }
    }, [session, reset, profileImageFile])

    const onSubmit = useCallback(async (data: ValidationSchema) => {
        try {
            setIsUploading(true)
            let userProfileImageUrl: string | null | undefined = session.user.userProfileImage;
            if (profileImageFile) {
              userProfileImageUrl = await uploadFileToBlob(profileImageFile, "users", session.user.id);
            } else if (imageProfilePreview === null) {
              userProfileImageUrl = null;
            }

            const response = await api.patch(`/api/auth/updateUserDetails`, {
              ...data,
              userProfileImageUrl,
            })
            if(response.data.success){
              toast.success('Sapo ndryshuat te dhenat tua me sukses!');
              setProfileImageFile(null);
              await update ({
                email: data.email,
                gender: data.gender,
                fullName: data.fullName,
                username: data.username,
                userProfileImage: response.data.profilePic || session.user.userProfileImage
              })
            }
          } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Dicka shkoi gabim!")
          } finally {
            setIsUploading(false)
          }
        }, [session, profileImageFile, imageProfilePreview, update])

    const isBusy = isSubmitting || isUploading

  return (
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Detajet e llogarise</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className=' flex flex-row max-[550px]:flex-col max-[550px]:gap-4 justify-between gap-2'>
              <div className='flex-1'>
                <Label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                  Emri i plote
                </Label>
                <Controller
                  control={control}
                  name="fullName"
                  render={({field}) => (
                    <Input
                      type="text"
                      id="fullName"
                      {...field}
                      className="shadow-sm"
                    />
                  )}
                />
                {errors.fullName && (
                  <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
                )}
              </div>

              <div className='flex-1'>
                <Label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gjinia
                </Label>
                <Controller
                  control={control}
                  name="gender"
                  render={({field}) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="w-full shadow-sm">
                        <SelectValue placeholder="Zgjidhni gjinine" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="MASHKULL">Mashkull</SelectItem>
                          <SelectItem value="FEMER">Femer</SelectItem>
                          <SelectItem value="TJETER">Tjeter</SelectItem>
                          <SelectItem value='PA_GJINI'>Nuk dua ta them</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.gender && (
                  <p className="text-red-500 text-sm mt-1">{errors.gender.message}</p>
                )}
              </div>
            </div>

            <div className='flex flex-row max-[550px]:flex-col max-[550px]:gap-4 justify-between gap-2'>
              <div className='flex-1'>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Controller
                  control={control}
                  name="email"
                  render={({field}) => (
                    <Input
                      type="email"
                      id="email"
                      {...field}
                      className="shadow-sm"
                    />
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              <div className='flex-1'>
                <Label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Emri i perdoruesit(Nofka)
                </Label>
                <Controller
                  control={control}
                  name="username"
                  render={({field}) => (
                    <Input
                      type="username"
                      id="username"
                      {...field}
                      className="shadow-sm"
                    />
                  )}
                />
                {errors.username && (
                  <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>
                )}
              </div>
            </div>

            <Controller
                control={control}
                name="changePassword"
                render={({field}) => (
                    <div className="flex items-center gap-3">
                    <Checkbox id="changePassword" onCheckedChange={(checked) => field.onChange(checked as boolean)} checked={field.value}/>
                    <Label htmlFor="changePassword">Ndrysho fjalekalimin</Label>
                    </div>
                )}
            />

            {changePassword && <div className='flex flex-row max-[550px]:flex-col max-[550px]:gap-3 justify-between gap-2'>
              <div className={`${!password ? "flex-[0.5] max-[550px]:flex-1" : "flex-1"}`}>
                <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Fjalekalimi
                </Label>
                <Controller
                  control={control}
                  name="password"
                  render={({field}) => (
                    <Input
                      type="password"
                      id="email"
                      {...field}
                      value={field.value || ""}
                      placeholder='*******'
                      className="shadow-sm"
                    />
                  )}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                )}
              </div>
              {password && <div className='flex-1'>
                <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Konfirmo Fjalekalimin
                </Label>
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({field}) => (
                    <Input
                      type="password"
                      id="confirmPassword"
                      {...field}
                      value={field.value || ""}
                      placeholder='*******'
                      className="shadow-sm"
                    />
                  )}
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                )}
              </div>}
            </div>}

            <div>
              <div className="space-y-2">
                {imageProfilePreview ? (
                  <div className="relative group w-fit">
                    <Image
                      width={200}
                      height={200}
                      src={imageProfilePreview}
                      alt="Logo preview"
                      unoptimized={imageProfilePreview.startsWith("blob:")}
                      className="h-32 w-32 object-contain border rounded-md"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute cursor-pointer -right-2 -top-2 rounded-full bg-destructive/90 hover:bg-destructive text-white"
                      onClick={removeLogo}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer hover:bg-accent/50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm px-1 text-center text-muted-foreground">
                        Klikoni për të ngarkuar foton e profilit
                      </p>
                    </div>
                    <Input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleLogoUpload}
                    />
                  </Label>
                )}
              </div>
            </div>

            <div className="pt-2">
              <CTAButton
                isLoading={isBusy}
                onClick={handleSubmit(onSubmit)}
                type="submit"
                primary
                classNames='max-[550px]:w-full'
                text={`${isBusy ? "Duke ruajtur ndryshimet..." : "Ruaj ndryshimet"}`}
              />
            </div>
          </form>
        </div>
  )
}

export default memo(UpdateProfileData)
