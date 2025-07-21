import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import api from '@/lib/api'
import { ExtendedUser } from '@/types/admin'
import { MoreHorizontal, ImagePlus, X } from 'lucide-react'
import Link from 'next/link'
import React, { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Gender } from '@/app/generated/prisma'
import Image from 'next/image'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'

const userEditSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.email("Invalid email"),
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  gender: z.enum(Gender),
  anonimity: z.boolean(),
  userProfileImage: z.url("Invalid image URL"),
  acceptedUser: z.boolean(),
  email_verified: z.boolean()
})

type UserEditFormValues = z.infer<typeof userEditSchema>

const UsersActions = ({users}: {users: ExtendedUser}) => {
    const router = useRouter();
    const [open, setOpen] = useState(false)
    const [imagePreview, setImagePreview] = useState(users.userProfileImage)

    const { control, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<UserEditFormValues>({
      resolver: zodResolver(userEditSchema),
      defaultValues: {
        username: users.username,
        email: users.email,
        fullName: users.fullName,
        gender: users.gender,
        anonimity: users.anonimity,
        userProfileImage: users.userProfileImage,
        acceptedUser: users.acceptedUser,
        email_verified: users.email_verified
      }
    })

    const handleDeleteUser = useCallback(async () => {
        try {
            const response = await api.delete(`/api/admin/users/${users.id}`)
            if(response.data.success){
                toast.success('Perdoruesi u fshi me sukses!')
                router.refresh();
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response.data.message || "Dicka shkoi gabim!")
        }
    }, [users.id, router])

    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          const imageUrl = event.target.result as string
          setImagePreview(imageUrl)
          onChange(imageUrl)
        }
      }
      reader.readAsDataURL(file)
    }, [])

    const onSubmit = useCallback(async (data: UserEditFormValues) => {
        console.log(data);
        
      try {
        const response = await api.patch(`/api/admin/users/${users.id}`, data)
        if(response.data.success) {
          toast.success('Te dhenat e perdoruesit u perditesuan me sukses!')
          router.refresh()
          setOpen(false)
        }
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Dicka shkoi gabim!")
      }
    }, [users.id, router, reset])

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
                <Button variant={"default"} className="cursor-pointer w-full" onClick={() => setOpen(true)}>Ndrysho</Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="flex justify-center">
                <Link className="cursor-pointer bg-gray-100 hover:bg-gray-300" target="_blank" href={`/ankesat/${users.id}`}>Vizito profilin</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
                <Button onClick={handleDeleteUser} className="cursor-pointer w-full" variant={"destructive"}>Fshije</Button>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

        <Dialog open={open} onOpenChange={() => {setOpen(false); reset()}}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edito te dhenat e perdoruesit</DialogTitle>
              <DialogDescription>
                Bej ndryshimet e nevojshme dhe kliko Ruaj per te perditesuar te dhenat.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
              {/* Profile Image */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200">
                  <Image
                    src={imagePreview}
                    alt="Profile preview"
                    fill
                    className="object-cover"
                  />
                </div>
                <Controller
                  name="userProfileImage"
                  control={control}
                  render={({ field: { onChange } }) => (
                    <>
                      <label className="flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md cursor-pointer">
                        <ImagePlus className="mr-2 h-4 w-4" />
                        Ndrysho foton
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(e, onChange)}
                        />
                      </label>
                    </>
                  )}
                />
                {errors.userProfileImage && (
                  <p className="col-span-4 text-right text-sm text-red-500">
                    {errors.userProfileImage.message}
                  </p>
                )}
              </div>

              {/* Username */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">
                  Username
                </Label>
                <Controller
                  name="username"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="username"
                      className="col-span-3"
                      {...field}
                    />
                  )}
                />
                {errors.username && (
                  <p className="col-span-4 text-right text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="email"
                      type="email"
                      className="col-span-3"
                      {...field}
                    />
                  )}
                />
                {errors.email && (
                  <p className="col-span-4 text-right text-sm text-red-500">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Full Name */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fullName" className="text-right">
                  Emri i plote
                </Label>
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="fullName"
                      className="col-span-3"
                      {...field}
                    />
                  )}
                />
                {errors.fullName && (
                  <p className="col-span-4 text-right text-sm text-red-500">
                    {errors.fullName.message}
                  </p>
                )}
              </div>

              {/* Gender */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="gender" className="text-right">
                  Gjinia
                </Label>
                <Controller
                  name="gender"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Zgjidh gjinine" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Gender).map((gender) => (
                          <SelectItem key={gender} value={gender}>
                            {gender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Checkboxes */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">
                  Opsione
                </Label>
                <div className="col-span-3 space-y-2">
                  <Controller
                    name="anonimity"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="anonimity"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="anonimity">Anonim</Label>
                      </div>
                    )}
                  />
                  <Controller
                    name="acceptedUser"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="acceptedUser"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="acceptedUser">Pranuar</Label>
                      </div>
                    )}
                  />
                  <Controller
                    name="email_verified"
                    control={control}
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="email_verified"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                        <Label htmlFor="email_verified">Email i verifikuar</Label>
                      </div>
                    )}
                  />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="complaints" className="text-right">
                  Ankesat
                </Label>
                <Input
                  id="complaints"
                  className="col-span-3"
                  value={users._count.complaints}
                  disabled
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="contributions" className="text-right">
                  Kontributet
                </Label>
                <Input
                  id="contributions"
                  className="col-span-3"
                  value={users._count.contributions}
                  disabled
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Duke ruajtur..." : "Ruaj ndryshimet"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
    </>
  )
}

export default UsersActions