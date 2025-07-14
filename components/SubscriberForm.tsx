"use client"
import React from 'react'
import { useForm } from 'react-hook-form'
import {z} from "zod"
import { Input } from './ui/input'
import { Label } from './ui/label'
import CTAButton from './CTAButton'
import { zodResolver } from '@hookform/resolvers/zod'

const subscriberSchema = z.object({
    email: z.email("Ju lutem shkruani nje email valid.")
})

type subscriberType = z.infer<typeof subscriberSchema>;

const SubscriberForm = () => {
    const {register, handleSubmit, reset, formState: {errors, isSubmitting}} = useForm<subscriberType>({
        resolver: zodResolver(subscriberSchema),
        defaultValues: {
            email: ""
        },
        mode: "onChange"
    })

    const onSubmit = async (data: subscriberType) => {
        console.log(data)
    }

  return (
    <div className='max-w-6xl mx-auto flex items-center justify-center shadow-xl p-2 flex-col gap-3 py-8'>
        <div>
            <h2 className='font-semibold text-3xl text-center'>Behuni pjese e <span className='text-indigo-600'>Buletinit</span> tone</h2>
            <p className="text-center text-gray-600 text-sm mt-2">Nga abonimi permes kesaj forme, ju informoheni ne lidhje me ankesat e krijuara edhe nese nuk jeni pjese e platformes tone</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Label htmlFor='email' className="text-center mb-1 flex justify-center">Emaili</Label>
            <Input id='email' type='email' {...register("email")} className='text-center' placeholder='perdoruesi@shembull.com'/>
            <CTAButton type='submit' text={isSubmitting ? "Duke u abonuar..." : "Abonohu"} classNames='w-full !py-1.5 mt-2' primary/>
            {errors.email && (
                 <p className="text-red-500 text-sm mt-1 text-center">{errors.email.message}</p>
            )}
        </form>
    </div>
  )
}

export default SubscriberForm