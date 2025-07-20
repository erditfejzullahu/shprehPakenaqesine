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
import { updateProfileSchema } from '@/lib/schemas/updateProfileDetails'

type ValidationSchema = z.infer<typeof updateProfileSchema>

const UpdateProfileData = ({session}: {session: Session | null}) => {
    if(!session) return null;

    const {update} = useSession();
    const [imageProfilePreview, setImageProfilePreview] = useState<string | null>(null)

    const {control, reset, watch, handleSubmit, formState: {errors, isSubmitting}, setValue} = useForm<ValidationSchema>({
      resolver: zodResolver(updateProfileSchema),
      defaultValues: useMemo(() => ({
          fullName: "",
          email: "",
          gender: "MASHKULL",
          username: "",
          userProfileImage: null,
          password: null,
          confirmPassword: null,
          changePassword: false
      }), []),
      mode: "onChange"
    })

    const removeLogo = useCallback(() => {
        setImageProfilePreview(null);
        setValue("userProfileImage", "");
    }, [imageProfilePreview, setValue]);

    const handleLogoUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            setImageProfilePreview(base64);
            setValue("userProfileImage", base64);
        };
        reader.readAsDataURL(file);
        }
    }, [imageProfilePreview, setValue]);


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
        }
      }, [session])

      const onSubmit = useCallback(async (data: ValidationSchema) => {          
        try {
            const response = await api.patch(`/api/auth/updateUserDetails`, data)
            if(response.data.success){
              toast.success('Sapo ndryshuat te dhenat tua me sukses!');
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
            toast.error(error.response.data.message || "Dicka shkoi gabim!")
          }
        }, [reset])

  return (
        <div className="p-6">
          <h3 className="text-lg font-medium text-gray-900">Detajet e llogarise</h3>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className=' flex flex-row justify-between gap-2'>
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
                      // defaultValue={session.user.fullName}
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

            <div className='flex flex-row justify-between gap-2'>
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
                      // defaultValue={session.user.email}
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
                      // defaultValue={session.user.username}
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

            {changePassword && <div className='flex flex-row justify-between gap-2'>
              <div className={`${!password ? "flex-[0.5]" : "flex-1"}`}>
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
              <Controller 
                control={control}
                name="userProfileImage"
                render={({field}) => (
                  <div className="space-y-2">
                  {imageProfilePreview ? (
                    <div className="relative group w-fit">
                      <Image 
                        width={200}
                        height={200}
                        src={imageProfilePreview} 
                        alt="Logo preview" 
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
                        <p className="text-sm text-muted-foreground">
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
                )}
              />
            </div>

            <div className="pt-2">
              <CTAButton
                isLoading={isSubmitting}
                onClick={handleSubmit(onSubmit)}
                type="submit"
                primary
                text={`${isSubmitting ? "Duke ruajtur ndryshimet..." : "Ruaj ndryshimet"}`}
              />
            </div>
          </form>
        </div>
  )
}

export default memo(UpdateProfileData)