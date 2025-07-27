"use client"
import dynamic from "next/dynamic"
import { LoadingSpinner } from "./LoadingComponents"
import SubscriberForm from "@/components/SubscriberForm";

export const DynamicCompanysQuery = dynamic(() => import ('@/components/CompanysQuery'), {ssr: false, loading: () => <div className="h-[60px]"><LoadingSpinner /></div>});

export const DynamicComplaintsQuery = dynamic(() => import ('@/components/ComplaintsQuery'), {ssr: false, loading: () => <div className="h-[60px]"><LoadingSpinner /></div>});

export const DynamicSubscriberForm = dynamic(() => import ('@/components/SubscriberForm'), {ssr: false, loading: () => <div className="h-[60px]"><SubscriberForm /></div>});

export const DynamicHeader = dynamic(() => import ('@/components/responsiveHeader'), {ssr: false, loading: () => <div className="fixed top-0 left-0 w-full h-[60px] bg-gray-100 animate-pulse"/>})
