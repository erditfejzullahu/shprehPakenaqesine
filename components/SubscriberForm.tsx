"use client"
import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import {z} from "zod"
import { Input } from './ui/input'
import { Label } from './ui/label'
import CTAButton from './CTAButton'
import { zodResolver } from '@hookform/resolvers/zod'
import { subscriberSchema } from '@/lib/schemas/createSubscriptionSchema'
import api from '@/lib/api'
import { toast } from 'sonner'
import Image from 'next/image'



type subscriberType = z.infer<typeof subscriberSchema>;

const SubscriberForm = () => {
    const {register, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm<subscriberType>({
        resolver: zodResolver(subscriberSchema),
        defaultValues: useMemo(() => ({
            email: ""
        }), []),
        mode: "onChange"
    })

    const abortControllerRef = useRef<AbortController | null>(null)

    useEffect(() => {
      return () => {
        if(abortControllerRef.current){
            abortControllerRef.current.abort()
        }
      }
    }, [])
    

    const onSubmit = useCallback(async (data: subscriberType) => {
        if(abortControllerRef.current){
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController()

        try {
            const response = await api.post('/api/subscribers', data)            
            if(response.data.success){
                toast.success(response.data.message)
                reset()
            }
        } catch (error: any) {            
            toast.error(error.response.data.message || "Dicka shkoi gabim. Ju lutem provoni perseri")
            reset()
        } finally {
            abortControllerRef.current = null
        }
    }, [reset])

  return (
    <div className='max-w-6xl relative mx-auto flex items-center justify-center shadow-md p-2 flex-col gap-3 py-8 rounded-b-2xl overflow-hidden'>
        <Image 
            src={'/underline-1.webp'}
            alt='underline'
            width={700}
            height={700}
            className='w-fit -z-50 opacity-5 absolute top-8 left-0 indigo-mask'
        />
        <Image 
            src={'/underline-1.webp'}
            alt='underline'
            width={700}
            height={700}
            className='w-fit -z-50 opacity-5 absolute -top-0 right-0 rotate-[180deg] indigo-mask'
        />
        <div>
            <h2 className='font-semibold text-2xl sm:text-3xl text-center'>Bëhuni pjesë e <span className='text-indigo-600'>Buletinit</span> tonë</h2>
            <p className="text-center text-gray-600 text-sm mt-2">Nga abonimi përmes kësaj forme, ju informoheni në lidhje me ankesat e krijuara edhe nëse nuk jeni pjesë e platformës.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Label htmlFor='email' className="text-center mb-1 flex justify-center">Emaili</Label>
            <Input id='email' type='email' {...register("email")} className='text-center text-sm sm:text-base' placeholder='perdoruesi@shembull.com'/>
            <CTAButton type='submit' text={isSubmitting ? "Duke u abonuar..." : "Abonohu"} classNames='w-full !py-1.5 mt-2' primary/>
            {errors.email && (
                 <p className="text-red-500 text-sm mt-1 text-center">{errors.email.message}</p>
            )}
        </form>
    </div>
  )
}

export default memo(SubscriberForm)