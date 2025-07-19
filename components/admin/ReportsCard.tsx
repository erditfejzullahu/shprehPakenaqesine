"use client";

import { useState, useMemo, memo, useCallback } from 'react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { toast } from 'sonner';
import api from '@/lib/api';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';

interface ReportsCardProps {
  id: string;
  title: string;
  description: string;
  attachments: string[];
  audioAttachments: string[];
  videoAttachments: string[];
  category: string;
  createdAt: Date;
  complaint: {
    id: string;
    title: string;
    company: {
      id: string;
      name: string;
    } | null;
    municipality: string;
    category: string;
  };
}

const ReportsCard = ({
  id,
  title,
  description,
  attachments,
  audioAttachments,
  videoAttachments,
  category,
  createdAt,
  complaint
}: ReportsCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  // Categorize attachments into images and documents
  const { images, documents } = useMemo(() => {
    const images: string[] = [];
    const documents: string[] = [];
    
    attachments.forEach(attachment => {
      const extension = attachment.split('.').pop()?.toLowerCase();
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
        images.push(attachment);
      } else {
        documents.push(attachment);
      }
    });
    
    return { images, documents };
  }, [attachments]);

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const nextAudio = () => setCurrentAudioIndex((prev) => (prev + 1) % audioAttachments.length);
  const prevAudio = () => setCurrentAudioIndex((prev) => (prev - 1 + audioAttachments.length) % audioAttachments.length);

  const nextVideo = () => setCurrentVideoIndex((prev) => (prev + 1) % videoAttachments.length);
  const prevVideo = () => setCurrentVideoIndex((prev) => (prev - 1 + videoAttachments.length) % videoAttachments.length);

  const getCategoryLabel = useCallback((category: string) => {
    const words = category.split('_').map(word => {
      if (word === 'NE') return 'në';
      return word.charAt(0) + word.slice(1).toLowerCase();
    });
    return words.join(' ');
  }, []);

  const getReportCategoryLabel = useCallback((category: string) => {
    switch (category) {
      case 'LAJMERIM_I_RREMSHEM':
        return 'Lajmërim i rremë';
      case 'SHPIFJE':
        return 'Shpifje';
      case 'GJUHE_URREJTJE':
        return 'Gjuhë urrejtjeje';
      case 'PERVERSE_OSE_ABUZIVE':
        return 'Përmbajtje abuzive';
      case 'SPAM_OSE_DUPLIKAT':
        return 'Spam ose kopje';
      case 'JO_RELAVANT':
        return 'Jo relevante';
      case 'SHKELJE_PRIVATESIE':
        return 'Shkelje privatësie';
      case 'TJETER':
        return 'Tjetër';
      default:
        return category;
    }
  }, []);

  const formatDate = useCallback((date: Date) => {
    return new Date(date).toLocaleDateString('sq-AL', {
      day: "2-digit",
      month: "short",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    });
  }, []);

  const handleReportDelete = useCallback(async () => {
    try {
      const response = await api.delete(`/api/admin/reports/${id}`)
      if(response.data.success){
        toast.success(`Sapo larguat me sukses raportimin mbi ${complaint.title}`)
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message || "Dicka shkoi gabim!")
    }
  }, [])

  const handleExtractReport = useCallback(async () => {
    try {
      
    } catch (error) {
      
    }
  }, [])

  const handleComplaintDelete = useCallback(async () => {
    try {
      
    } catch (error) {
      
    }
  }, [])

  return (
    <div className="w-full bg-white shadow-lg p-6 flex flex-col gap-4 hover:shadow-md transition relative border-l-4 border-red-100">
      {/* Report header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{description}</p>
        </div>
        <Badge variant="destructive" className="whitespace-nowrap">
          {getReportCategoryLabel(category)}
        </Badge>
      </div>

      {/* Complaint info */}
      <div className="mt-2">
        <Link 
          href={`/ankesat/${complaint.id}`} 
          className="text-sm font-medium text-indigo-600 hover:underline"
        >
          Ankesa: {complaint.title}
        </Link>
        <div className="flex items-center gap-2 mt-1">
          {complaint.company ? (
            <span className="text-sm text-gray-600">
              Kundër: <span className="font-medium">{complaint.company.name}</span>
            </span>
          ) : (
            <span className="text-sm text-gray-600">
              Ankese komunale: <span className="font-medium">{complaint.municipality}</span>
            </span>
          )}
          <Badge variant="outline" className="text-xs">
            {getCategoryLabel(complaint.category)}
          </Badge>
          <Badge variant={"default"} className='absolute bottom-0 rounded-none rounded-tl-md right-0 text-xs'>{complaint.municipality}</Badge>
        </div>
      </div>

      {/* Image Carousel */}
      {images.length > 0 && (
        <div className="relative mt-3">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={images[currentImageIndex]}
              alt={`Report attachment ${currentImageIndex + 1}`}
              fill
              className="object-contain"
            />
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Video Carousel */}
      {videoAttachments.length > 0 && (
        <div className="relative mt-3">
          <div className="w-full bg-gray-100 rounded-lg overflow-hidden">
            <video
              src={videoAttachments[currentVideoIndex]}
              controls
              className="w-full max-h-48"
            />
          </div>
          {videoAttachments.length > 1 && (
            <div className="flex justify-between mt-2">
              <button
                onClick={prevVideo}
                className="text-sm flex items-center gap-1 text-gray-600"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Para
              </button>
              <span className="text-sm text-gray-500">
                {currentVideoIndex + 1} / {videoAttachments.length}
              </span>
              <button
                onClick={nextVideo}
                className="text-sm flex items-center gap-1 text-gray-600"
              >
                Tjetër
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Audio Carousel */}
      {audioAttachments.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg mt-3">
          <div className="flex items-center gap-3">
            <div className="bg-red-100 p-2 rounded-full">
              <svg className="w-5 h-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
              </svg>
            </div>
            <audio
              src={audioAttachments[currentAudioIndex]}
              controls
              className="flex-1"
            />
          </div>
          {audioAttachments.length > 1 && (
            <div className="flex justify-between mt-2">
              <button
                onClick={prevAudio}
                className="text-sm flex items-center gap-1 text-gray-600"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Para
              </button>
              <span className="text-sm text-gray-500">
                {currentAudioIndex + 1} / {audioAttachments.length}
              </span>
              <button
                onClick={nextAudio}
                className="text-sm flex items-center gap-1 text-gray-600"
              >
                Tjetër
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Document list */}
      {documents.length > 0 && (
        <div className="space-y-2 mt-3">
          <p className="text-sm font-medium text-gray-700">Dokumenta e bashkangjitura:</p>
          <div className="space-y-1">
            {documents.map((doc, index) => (
              <a
                key={index}
                href={doc}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                </svg>
                {doc.split('/').pop()}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Footer with date and actions */}
      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          Raportuar më: {formatDate(createdAt)}
        </span>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-xs px-3 py-1 bg-gray-100 cursor-pointer text-gray-700 rounded hover:bg-gray-200 transition">Shqyrto</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='flex flex-col gap-1'>
              <DropdownMenuLabel>Nderveprimet</DropdownMenuLabel>
              <DropdownMenuItem asChild>
                <Button onClick={handleExtractReport} variant={"default"} className='cursor-pointer'>Shkarko raportimin</Button>
              </DropdownMenuItem>
              <DropdownMenuItem className='text-center mx-auto flex justify-center' asChild>
                <Link className='w-full bg-gray-100 hover:bg-gray-300 cursor-pointer border' href={'mailto:emaili'}>Dergo email</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button onClick={handleComplaintDelete} variant={"destructive"} className='cursor-pointer w-full'>Fshij Ankesen Tani</Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <button onClick={handleReportDelete} className="text-xs px-3 py-1 cursor-pointer bg-red-100 text-red-700 rounded hover:bg-red-200 transition">
            Fshij Raportin
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ReportsCard);