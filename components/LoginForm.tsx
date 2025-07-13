"use client"
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from "zod"
import { Input } from './ui/input'
import { Label } from './ui/label'
import CTAButton from './CTAButton'
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'
import { FaInfoCircle } from 'react-icons/fa'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from './ui/select'
import { loginSchema, registerSchema } from '@/lib/schemas/authSchema'

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true)

  // Login form
  const { 
    register: loginRegister, 
    handleSubmit: handleLoginSubmit, 
    formState: { errors: loginErrors, isSubmitting: isLoginSubmitting } 
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: ""
    },
    mode: "onChange"
  })

  // Registration form
  const { 
    register: registerRegister, 
    handleSubmit: handleRegisterSubmit, 
    formState: { errors: registerErrors, isSubmitting: isRegisterSubmitting },
    control,
    setValue
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      username: "",
      gender: "PA_GJINI",
      password: ""
    },
    mode: "onChange"
  })

  const handleLogin = async (data: z.infer<typeof loginSchema>) => {
    console.log("Login data:", data);
    // Add your login logic here
  }

  const handleRegister = async (data: z.infer<typeof registerSchema>) => {
    console.log("Register data:", data);
    // Add your registration logic here
  }

  return (
    <div className="w-full max-w-6xl mx-auto mt-4 mb-4">
      {isLogin ? (
        // Login Form
        <form className="flex flex-col gap-4 max-w-xl mx-auto shadow-xl p-4" onSubmit={handleLoginSubmit(handleLogin)}>
          <div>
            <Label htmlFor='username' className="mb-1">Emri i perdoruesit</Label>
            <Input 
              id='username' 
              type='text' 
              placeholder='Shtypni ketu emrin e perdoruesist...' 
              {...loginRegister("username")}
            />
            <p className="text-gray-400 text-xs font-normal mt-1">Paraqitni ketu emrin e perdoruesit qe e keni perdorur ne formen e krijimit te llogarise.</p>
            {loginErrors.username && (
              <p className="text-red-500 text-sm mt-1">{loginErrors.username.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor='password' className="mb-1">Fjalekalimi</Label>
            <Input 
              id='password' 
              type='password' 
              {...loginRegister("password")} 
              placeholder='**********'
            />
            <p className="text-gray-400 text-xs font-normal mt-1">Paraqitni ketu fjalekalimin. Siguroni qe te mos e perhapni me asnje njeri.</p>
            {loginErrors.password && (
              <p className="text-red-500 text-sm mt-1">{loginErrors.password.message}</p>
            )}
          </div>
          <div className="flex-1">
            <CTAButton 
              primary 
              classNames='flex-1 w-full' 
              type="submit"
              text={`${isLoginSubmitting ? "Duke u kycur..." : "Kycu"}`}
            />
            <p className="text-sm mt-3 text-right text-gray-600">
              Nuk keni llogari? 
              <span 
                onClick={() => setIsLogin(false)} 
                className="text-indigo-600 cursor-pointer transition-all ease-in-out hover:font-bold ml-1"
              >
                Krijoni Tani!
              </span>
            </p>
          </div>
        </form>
      ) : (
        // Registration Form
        <form className="flex flex-col gap-4 max-w-xl mx-auto shadow-xl p-4" onSubmit={handleRegisterSubmit(handleRegister)}>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative w-fit">
                  <Label htmlFor='fullName' className="mb-1 w-fit">Emri juaj i plote</Label>
                  <FaInfoCircle size={12} color='#4f46e5' className="absolute -right-3.5 -top-2" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Emri juaj duhet te jete valid qe te kaloje procesin e verifikimit.</p>
              </TooltipContent>
            </Tooltip>
            <Input 
              id='fullName' 
              type='text' 
              placeholder='Shkruani ketu emrin tuaj te plote...' 
              {...registerRegister("fullName")}
            />
            <p className="text-gray-400 text-xs font-normal mt-1">Paraqitni ketu emrin tuaj te plote, pasi qe nevojitet per verifikim te llogarise.</p>
            {registerErrors.fullName && (
              <p className="text-red-500 text-sm mt-1">{registerErrors.fullName.message}</p>
            )}
          </div>
          <div>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative w-fit">
                  <Label htmlFor='email' className="mb-1 w-fit">Emaili juaj</Label>
                  <FaInfoCircle size={12} color='#4f46e5' className="absolute -right-3.5 -top-2" />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Emaili juaj duhet te jete valid per verifikim permes emailit.</p>
              </TooltipContent>
            </Tooltip>
            <Input 
              id='email' 
              type='email' 
              placeholder='Shtypni ketu emailin tuaj...' 
              {...registerRegister("email")}
            />
            <p className="text-gray-400 text-xs font-normal mt-1">Paraqitni ketu emailin tuaj valid, pasi qe nevojitet per verifikim permes emailit.</p>
            {registerErrors.email && (
              <p className="text-red-500 text-sm mt-1">{registerErrors.email.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor='username' className="mb-1">Emri i perdoruesit(Nofka)</Label>
            <Input 
              id='username' 
              type='text' 
              placeholder='Shtypni ketu emrin e perdoruesist...' 
              {...registerRegister("username")}
            />
            <p className="text-gray-400 text-xs font-normal mt-1">Paraqitni ketu emrin e perdoruesit, me te cilin keni per tu kycur ne llogari.</p>
            {registerErrors.username && (
              <p className="text-red-500 text-sm mt-1">{registerErrors.username.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor='gender' className="mb-1">Gjinia juaj</Label>
            <Select 
              onValueChange={(value) => setValue("gender", value as any)}
              defaultValue="PA_GJINI"
            >
              <SelectTrigger className="flex-1 w-full cursor-pointer">
                <SelectValue placeholder="Zgjidhni gjinine" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Zgjidhni mes opsioneve me poshte</SelectLabel>
                  <SelectItem value='MASHKULL'>Mashkull</SelectItem>
                  <SelectItem value='FEMER'>Femer</SelectItem>
                  <SelectItem value='TJETER'>Tjeter</SelectItem>
                  <SelectItem value='PA_GJINI'>Nuk dua ta tregoj</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            {registerErrors.gender && (
              <p className="text-red-500 text-sm mt-1">{registerErrors.gender.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor='password' className="mb-1">Fjalekalimi</Label>
            <Input 
              id='password' 
              type='password' 
              {...registerRegister("password")} 
              placeholder='**********'
            />
            <p className="text-gray-400 text-xs font-normal mt-1">Paraqitni ketu fjalekalimin. Siguroni qe te mos e perhapni me asnje njeri.</p>
            {registerErrors.password && (
              <p className="text-red-500 text-sm mt-1">{registerErrors.password.message}</p>
            )}
          </div>
          <div className="flex-1">
            <CTAButton 
              primary 
              classNames='flex-1 w-full' 
              type="submit"
              text={`${isRegisterSubmitting ? "Duke krijuar llogarine..." : "Krijo llogarine"}`}
            />
            <p className="text-sm mt-3 text-right text-gray-600">
              Keni llogari? 
              <span 
                onClick={() => setIsLogin(true)} 
                className="text-indigo-600 cursor-pointer transition-all ease-in-out hover:font-bold ml-1"
              >
                Kycuni Tani!
              </span>
            </p>
          </div>
        </form>
      )}
    </div>
  )
}

export default LoginForm