"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import api from "@/lib/api";
import { toast } from "sonner";
import { Session } from "next-auth";
import {z} from "zod"
import { adminSchema } from "@/lib/schemas/adminSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FaImage } from "react-icons/fa";
import { imageUrlToBase64 } from "@/lib/utils";

type SettingsSchemaType = z.infer<typeof adminSchema>

const SettingsComponent = ({session}: {session: Session}) => {
  const {update} = useSession();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SettingsSchemaType>({
    resolver: zodResolver(adminSchema),
    defaultValues: {
      username: session.user.username,
      email: session.user.email,
      fullName: session.user.fullName,
      gender: session.user.gender,
      userProfileImage: session.user.userProfileImage,
      password: "",
      confirmPassword: "",
      changePassword: false,
    },
  });

  useEffect(() => {
    if(session.user.userProfileImage){
      imageUrlToBase64(session.user.userProfileImage)
          .then(base64 => setValue("userProfileImage", base64))
          .catch(console.error)
    }
  }, [session])

  const [previewImage, setPreviewImage] = useState<string | null>(session.user.userProfileImage)

  const onSubmit = async (data: SettingsSchemaType) => {
    try {
      const response = await api.patch("/api/admin/settings", {
        username: data.username,
        email: data.email,
        fullName: data.fullName,
        changePassword: data.changePassword,
        gender: data.gender,
        userProfileImage: data.userProfileImage,
        password: data.password ? data.password : undefined,
        confirmPassword: data.confirmPassword ? data.confirmPassword : undefined
      });
      if(response.data.success){
        toast.success("Profile updated");
        await update();
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response.data.message || "Dicka shkoi gabim!");
    }
  };

  return (
    <main className="max-w-2xl w-full mx-auto p-8 bg-white shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Celesimet e Administratorit</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label className="mb-1" id="username">Emri perdoruesit(nofka) tuaj</Label>
          <Input id="username" {...register("username", { required: true })} />
          {errors.username && (
            <p className="text-red-600 text-sm mt-1">{errors.username.message}</p>
          )}
        </div>

        <div>
          <Label className="mb-1" htmlFor="email">Email-i juaj</Label>
          <Input
            id="email"
            placeholder="user@example.com"
            type="email"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label className="mb-1" id="fullName">Emri juaj i plote</Label>
          <Input placeholder="Erdit Fejzullahu" id="fullName" {...register("fullName")} />
          {errors.fullName && (
            <p className="text-red-600 text-sm mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <Label className="mb-1" htmlFor="gender">Gjinia juaj</Label>
          <Input id="gender" {...register("gender")} />
          {errors.gender && (
            <p className="text-red-600 text-sm mt-1">{errors.gender.message}</p>
          )}
        </div>

        <div>
          <Label className="mb-1" htmlFor="userProfile">Imazhi i profilit tuaj</Label>
            {previewImage && (
            <div className="mb-4">
                <img 
                src={previewImage} 
                alt="Profile preview" 
                className="h-32 w-32 rounded-full object-cover"
                />
            </div>
            )}
            <Controller
            control={control}
            name="userProfileImage"
            render={({ field }) => (
                <div>
                    <div onClick={() => document.getElementById("userProfile")?.click()} className="border-2 cursor-pointer rounded-md border-dotted bg-gray-100 flex items-center justify-center gap-2 p-4 w-full flex-col">
                        <FaImage size={24}/>
                        <p>Zgjidhni nje imazh per foto te profilit</p>
                    </div>
                <Input
                    id="userProfile"
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/jpg, image/gif, image/webp"
                    onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                        // Validate file size (e.g., 2MB max)
                        if (file.size > 2 * 1024 * 1024) {
                        // Handle error (you can set an error in your form state)
                        return;
                        }

                        const reader = new FileReader();
                        reader.onload = (event) => {
                        const base64String = event.target?.result as string;
                        field.onChange(base64String); // Update form value
                        setPreviewImage(base64String); // Update preview
                        };
                        reader.readAsDataURL(file);
                    }
                    }}
                />
                {errors.userProfileImage && (
                    <p className="text-sm text-red-500 mt-1">{errors.userProfileImage.message}</p>
                )}
                </div>
            )}
            />
        </div>
        <div>
            <div className="flex items-center gap-3">
                <Checkbox id="changePassword" onCheckedChange={(checked: boolean) => setValue("changePassword", checked)} checked={watch("changePassword")}/>
                <Label htmlFor="changePassword">Ndrysho fjalekalimin</Label>
            </div>
        </div>

        <div>
          <Label htmlFor="password" className="mb-1">Fjalekalim i ri</Label>
          <Input
            id="password"
            type="password"
            placeholder="*********"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="mb-1">Konfirmoni fjalekalimin e ri</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="*********"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="text-red-600 text-sm mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit">Ruaj te dhenat</Button>
      </form>
    </main>
  );
}

export default SettingsComponent;