"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import CTAButton from "./CTAButton";
import { toast } from "sonner";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

const schema = z
  .object({
    password: z.string()
    .min(8, { message: 'Fjalëkalimi duhet të ketë të paktën 8 karaktere' })
    .refine(
        (val) => /[a-z]/.test(val),
        { message: 'Fjalëkalimi duhet të përmbajë të paktën një shkronjë të vogël' }
    )
    .refine(
        (val) => /[A-Z]/.test(val),
        { message: 'Fjalëkalimi duhet të përmbajë të paktën një shkronjë të madhe' }
    )
    .refine(
        (val) => /[0-9]/.test(val),
        { message: 'Fjalëkalimi duhet të përmbajë të paktën një numër' }
    )
    .refine(
        (val) => /[^A-Za-z0-9]/.test(val),
        { message: 'Fjalëkalimi duhet të përmbajë të paktën një simbol' }
    ),
        confirmPassword: z.string(),
    })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Fjalëkalimet nuk përputhen.",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const PasswordResetComponent = ({token}: {token: string}) => {
    const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    try {
        const response = await api.post(`/api/auth/changePassword/resetPassword`, {password: data.password, token})
        if(response.data.success){
            toast.success('Fjalëkalimi u rivendos me sukses!')
            router.replace('/kycuni')
        }
    } catch (error: any) {
        toast.error(error.response.data.message)
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto mt-4 mb-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 max-w-xl mx-auto shadow-lg p-4">
        <div>
          <Label className="mb-1">Fjalëkalimi i Ri</Label>
          <Input
            type="password"
            {...register("password")}
            placeholder="Fjalëkalimi i ri"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <Label className="mb-1">
            Konfirmo Fjalëkalimin
          </Label>
          <Input
            type="password"
            {...register("confirmPassword")}
            placeholder="Konfirmo fjalëkalimin"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <CTAButton
            primary
          type="submit"
          text="Rivendos Fjalëkalimin"
        />
      </form>
    </div>
  );
};

export default PasswordResetComponent;
