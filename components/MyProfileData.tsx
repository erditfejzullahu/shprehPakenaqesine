"use client"
import { useCallback, useState, useMemo, useEffect, memo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import CTAButton from '@/components/CTAButton';
import { Session } from 'next-auth';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { MyProfileComplaintsContributions } from '@/types/types';
import { LoadingSpinner } from './LoadingComponents';
import { FaChevronDown } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationNext,
  PaginationEllipsis,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateProfileSchema } from '@/lib/schemas/updateProfileDetails';
import { Checkbox } from './ui/checkbox';
import {z} from "zod"
import { Upload, X } from 'lucide-react';
import { Button } from './ui/button';
import Image from 'next/image';

const ITEMS_PER_PAGE = 5;
type ValidationSchema = z.infer<typeof updateProfileSchema>
type ActiveTab = "myComplaints" | "contributions" | "settings"

const MyProfileData = ({session}: {session: Session}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ActiveTab>('myComplaints');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [votesSort, setVotesSort] = useState<'most' | 'least'>('most');
  const [changePassword, setChangePassword] = useState(false)
  const [imageProfilePreview, setImageProfilePreview] = useState<string | null>(null)

  const {data, isLoading, isError, refetch} = useQuery({
    queryKey: ['userProfileDetails', session.user.id],
    queryFn: async () => {
      const response = await api.get<MyProfileComplaintsContributions>(`/api/auth/userAuthedProfileDetails`)
      return response.data;
    }
  })

  const {control, reset, watch, handleSubmit, formState: {errors, isSubmitting}, setValue} = useForm<ValidationSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      gender: "MASHKULL",
      username: "",
      userProfileImage: "",
      password: "",
      confirmPassword: ""
    },
    mode: "onChange"
  })

  const password = watch("password");

  useEffect(() => {
    if(session){
      reset({
        fullName: session.user.fullName,
        email: session.user.email,
        gender: session.user.gender,
        username: session.user.username,
        userProfileImage: session.user.userProfileImage,
        password: "",
        confirmPassword: ""
      })
    }
  }, [session])
  

  const onSubmit = useCallback(async (data: ValidationSchema) => {
    console.log(data);
  }, [reset])

  const contributions = data?.details?.contributions || [];
  const complaints = data?.details?.complaints || [];

  const handleTabChange = useCallback((val: ActiveTab) => {
    setActiveTab(val);
    setCurrentPage(1); // Reset to first page when changing tabs
    setSearchTerm(''); // Reset search term when changing tabs
  }, [])

  // Filter and sort complaints
  const filteredComplaints = useMemo(() => {
    let result = [...complaints];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(complaint => 
        complaint.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        complaint.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });
    
    // Apply votes sorting if selected
    if (votesSort) {
      result.sort((a, b) => {
        if (votesSort === 'most') {
          return b.upVotes - a.upVotes;
        } else {
          return a.upVotes - b.upVotes;
        }
      });
    }
    
    return result;
  }, [complaints, searchTerm, sortOrder, votesSort]);

  // Filter and sort contributions
  const filteredContributions = useMemo(() => {
    let result = [...contributions];
    
    // Apply search filter
    if (searchTerm) {
      result = result.filter(contribution => 
        contribution.complaintTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });
    
    return result;
  }, [contributions, searchTerm, sortOrder]);

  // Pagination logic
  const currentComplaints = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredComplaints.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredComplaints, currentPage]);

  const currentContributions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredContributions.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredContributions, currentPage]);

  const totalComplaintPages = Math.ceil(filteredComplaints.length / ITEMS_PER_PAGE);
  const totalContributionPages = Math.ceil(filteredContributions.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const removeLogo = () => {
    setImageProfilePreview(null);
    setValue("userProfileImage", "");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    };

    const renderPagination = useCallback((totalPages: number) => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
        </PaginationItem>
      );
      if (startPage > 2) {
        pages.push(<PaginationEllipsis key="ellipsis-start" />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={i === currentPage}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<PaginationEllipsis key="ellipsis-end" />);
      }
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return (
      <Pagination style={{listStyle: "none"}}>
        <PaginationContent style={{listStyle: "none", cursor: "pointer"}}>
          <PaginationItem>
            <PaginationPrevious 
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              // disabled={currentPage === 1}
              
            />
          </PaginationItem>
            {pages}
          <PaginationItem>
            <PaginationNext
              className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              // disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  }, [currentPage]);

  if(!session){
    return null;
  }

  return (
    <>      
      <div className='flex flex-row'>
        <button type='button' onClick={() => handleTabChange("myComplaints")} className={`cursor-pointer ${activeTab === "myComplaints" ? "bg-white font-medium shadow-md border-b-indigo-300 text-black" : "bg-gray-100 shadow-none border-b-gray-200 text-gray-600 font-normal"}  px-4 py-2 border-b-2 border-r border-r-gray-200 `}>
            Ankesat e krijuara
        </button>
        <button type='button' onClick={() => handleTabChange("contributions")} className={`cursor-pointer ${activeTab === "contributions" ? "bg-white font-medium shadow-md border-b-indigo-300 text-black" : "bg-gray-100 shadow-none border-b-gray-200 text-gray-600 font-normal"}  px-4 py-2 border-b-2 border-r border-r-gray-200 `}>
            Kontribuimet e bera
        </button>
        <button type='button' onClick={() => handleTabChange("settings")} className={`cursor-pointer ${activeTab === "settings" ? "bg-white font-medium shadow-md border-b-indigo-300 text-black" : "bg-gray-100 shadow-none border-b-gray-200 text-gray-600 font-normal"}  px-4 py-2 border-b-2 border-r border-r-gray-200 `}>
            Te dhenat tua
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="bg-white shadow-md overflow-hidden">
        {activeTab === 'myComplaints' && (
          <div className="divide-y divide-gray-200">
            {/* Search and Sort Controls */}
            <div className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="w-full sm:w-1/2">
                <Input
                  type="text"
                  placeholder="Kërko ankesa..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="shadow-sm"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Select
                  value={sortOrder}
                  onValueChange={(value: 'newest' | 'oldest') => setSortOrder(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Rendit sipas dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Më të rejat</SelectItem>
                    <SelectItem value="oldest">Më të vjetrat</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={votesSort}
                  onValueChange={(value: 'most' | 'least') => setVotesSort(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Rendit sipas votes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="most">Më shumë vota</SelectItem>
                    <SelectItem value="least">Më pak vota</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className='my-6'><LoadingSpinner /></div>
            ) : isError && !isLoading ? (
              <div className="mx-auto flex flex-col items-center right-0 left-0 my-8">
                <div className="flex flex-row gap-1">
                  <div>
                    <h3 className="text-gray-600 font-normal mb-3">Dicka shkoi gabim. Provoni perseri!</h3>
                  </div>
                  <div className="pt-2 rotate-[50deg]">
                    <FaChevronDown size={22} color='#4f46e5'/>
                  </div>
                </div>
                <CTAButton onClick={() => refetch()} text='Provo perseri'/>
              </div>
            ) : currentComplaints.length > 0 ? (
              <>
                {currentComplaints.map((complaint) => (
                  <div onClick={() => router.push(`/ankesat/${complaint.id}`)} key={complaint.id} className="p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{complaint.title}</h3>
                        <p className="text-gray-600 mt-1">
                          Kunder <span onClick={() => router.push(`/kompanite/${complaint.companyId}`)} className="font-medium hover:text-indigo-600">{complaint.companyName}</span> • {new Date(complaint.createdAt).toLocaleDateString('sq-AL', {day: "2-digit", month: "short" ,year: "numeric"})}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          complaint.resolvedStatus === "RESOLVED" ? 'bg-green-100 text-green-800' :
                          complaint.resolvedStatus === "PENDING" ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {complaint.resolvedStatus === "PENDING" ? "E pazgjidhur" : "E zgjidhur"}
                        </span>
                        <span className="flex items-center text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                          </svg>
                          {complaint.upVotes}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-4 flex justify-center">
                  {renderPagination(totalComplaintPages)}
                </div>
              </>
            ) : (
              <div className="p-8 text-center cursor-pointer">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  {searchTerm ? "Nuk u gjet asnjë ankesë" : "Nuk ke ankesa/raportime ende"}
                </h3>
                <p className="mt-1 text-gray-500">
                  {searchTerm ? "Provoni një kërkim tjetër" : "Fillo duke krijuar/apeluar ankese/raportim per ndonje kompani te listuar."}
                </p>
                {!searchTerm && (
                  <div className="mt-6">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      Krijo ankese/raport
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'contributions' && (
          <div className="divide-y divide-gray-200">
            {/* Search and Sort Controls */}
            <div className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="w-full sm:w-1/2">
                <Input
                  type="text"
                  placeholder="Kërko kontribuime..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="shadow-sm"
                />
              </div>
              <div className="w-full sm:w-auto">
                <Select
                  // value={sortOrder}
                  defaultValue={sortOrder}
                  onValueChange={(value: 'newest' | 'oldest') => setSortOrder(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Rendit sipas dates" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Më të rejat</SelectItem>
                    <SelectItem value="oldest">Më të vjetrat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoading ? (
              <div className="my-6"><LoadingSpinner /></div>
            ) : isError && !isLoading ? (
              <div className="mx-auto flex flex-col items-center right-0 left-0 my-8">
                <div className="flex flex-row gap-1">
                  <div>
                    <h3 className="text-gray-600 font-normal mb-3">Dicka shkoi gabim. Provoni perseri!</h3>
                  </div>
                  <div className="pt-2 rotate-[50deg]">
                    <FaChevronDown size={22} color='#4f46e5'/>
                  </div>
                </div>
                <CTAButton onClick={() => refetch()} text='Provo perseri'/>
              </div>
            ) : currentContributions.length > 0 ? (
              <>
                {currentContributions.map((contribution) => (
                  <div onClick={() => router.push(`/ankesat/${contribution.complaintId}`)} key={contribution.complaintId} className="p-6 hover:bg-gray-50 cursor-pointer transition-colors duration-150">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{contribution.complaintTitle}</h3>
                        <p className="text-gray-600 mt-1">
                          {new Date(contribution.createdAt).toLocaleDateString('sq-AL', {day: "2-digit", month: "short", year: "numeric"})}
                        </p>
                      </div>
                      <span className="flex items-center text-gray-500">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        {contribution.complaintUpVotes}
                      </span>
                    </div>
                  </div>
                ))}
                <div className="p-4 flex justify-center">
                  {renderPagination(totalContributionPages)}
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">
                  {searchTerm ? "Nuk u gjet asnjë kontribuim" : "Nuk ka kontribuime ende."}
                </h3>
                <p className="mt-1 text-gray-500">
                  {searchTerm ? "Provoni një kërkim tjetër" : "Ndihmoje komunitetin tone duke kontribuar ne ankesa/raportime te ndryshme."}
                </p>
                {!searchTerm && (
                  <div className='mx-auto mt-6'>
                    <CTAButton text='Shko tek ankesat' onClick={() => router.push('/ankesat')}/>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
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

              <div className="flex items-center gap-3">
                <Checkbox id="changePassword" onCheckedChange={(checked) => setChangePassword(checked as boolean)} checked={changePassword}/>
                <Label htmlFor="changePassword">Ndrysho fjalekalimin</Label>
              </div>

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
                  text='Ruaj ndryshimet'
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default memo(MyProfileData);