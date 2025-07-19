"use client";

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Companies, Complaint } from '@/app/generated/prisma';
import api from '@/lib/api';
import { toast } from 'sonner';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { Button } from '../ui/button';
import { MoreVerticalIcon } from 'lucide-react';
import { FaCopy, FaDownload, FaTrash } from 'react-icons/fa';
import { copyToClipboard } from '@/lib/utils';

interface ContributionRequestCardProps {
  id: string;
  userId: string;
  attachments: string[];
  audioAttachments: string[];
  videoAttachments: string[];
  complaint: Complaint;
  company?: Companies;
  user: {
    name: string;
    image: string;
    email: string;
  };
}

const ContributionRequestCard = ({
  id,
  userId,
  attachments,
  audioAttachments,
  videoAttachments,
  complaint,
  company,
  user
}: ContributionRequestCardProps) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const [showImageMoreOptions, setShowImageMoreOptions] = useState(false)

  const [openLightBox, setOpenLightBox] = useState(false)

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

  const handleRemovePhoto = useCallback(async () => {
    try {
      const response = await api.patch(`/api/admin/contributions/removeContributtionAttch/${id}?fileName=${images[currentImageIndex]}&fileType=attachments`)
      if(response.data.success){
        toast.success('Sapo larguat me sukses imazhin e ketij indeksi')
        router.refresh()
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response.data.message || "Dicka shkoi gabim!")
    }
  }, [])

  const handleDownloadPhoto = useCallback(async () => {
    try {
      const response = await api.get(`/api/admin/download?file=${images[currentImageIndex]}`, {
        responseType: "blob"
      })

      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)

      const a = document.createElement("a");
      a.href = url;
      a.download = images[currentImageIndex];
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a)

      if(response.status === 200){
        toast.success('Tani do filloje shkarkimi i imazhit')
      }
    } catch (error) {
      console.error(error);
      toast.error('Dicka shkoi gabim! Ju lutem provoni perseri.')
    } finally {
      setShowImageMoreOptions(false)
    }
  }, [])

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const nextAudio = () => setCurrentAudioIndex((prev) => (prev + 1) % audioAttachments.length);
  const prevAudio = () => setCurrentAudioIndex((prev) => (prev - 1 + audioAttachments.length) % audioAttachments.length);

  const nextVideo = () => setCurrentVideoIndex((prev) => (prev + 1) % videoAttachments.length);
  const prevVideo = () => setCurrentVideoIndex((prev) => (prev - 1 + videoAttachments.length) % videoAttachments.length);

  const getCategoryLabel = (category: string) => {
    const words = category.split('_').map(word => {
      if (word === 'NE') return 'në';
      return word.charAt(0) + word.slice(1).toLowerCase();
    });
    return words.join(' ');
  };

  const deleteContribution = async () => {
    try {
        const response = await api.delete(`/api/admin/contributions/${id}`)
        if(response.data.success){
            toast.success(`Sapo fshite me sukses kontribuimin per ankesen ${complaint.title}`)
            router.refresh()
        }
    } catch (error: any) {
        console.error();
        toast.error(error.response.data.message || "Dicka shkoi gabim! Ju lutem provoni perseri.")
    }
  }

  const acceptContribution = async () => {
    try {
        const response = await api.patch(`/api/admin/contributions/${id}`, "APPROVE")
        if(response.data.success){
            toast.success(`Sapo ndryshuat me sukses statusin e kontribuimit per ankesen ${complaint.title}`)
            router.refresh()
        }
    } catch (error:any) {
        console.error(error);
        toast.error(error.response.data.message || "Dicka shkoi gabim! Ju lutem provoni perseri.")
    }
  }

  return (
    <div className="w-full bg-white shadow-lg p-6 flex flex-col gap-4 hover:shadow-md transition relative">
      <div className="flex justify-between items-start">
        <div>
          <Link href={`/ankesat/${complaint.id}`} className="text-lg font-semibold text-gray-900 hover:underline">
            {complaint.title}
          </Link>
          <p className="text-sm text-gray-600 mt-1">Kontribut për ankesë</p>
        </div>
        <div className='flex flex-col gap-1'>
            <Badge variant="outline">{getCategoryLabel(complaint.category)}</Badge>
            <Badge className='ml-auto'>{complaint.municipality}</Badge>
        </div>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={user.image}
            alt={user.name}
            fill
            className="object-cover"
          />
        </div>
        <div className='flex flex-row justify-between flex-1'>
            <div>
                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                <p className="text-xs text-gray-500">Kontribues</p>
            </div>
            <div className='flex flex-col'>
                <p className="text-sm font-medium text-gray-900">Email</p>
                <Link href={`mailto:${user.email}`} className="text-xs text-indigo-600 m-0">{user.email}</Link>
            </div>
        </div>
      </div>

      {/* Image Carousel */}

      {images.length > 0 && (
        <div className="relative">
          <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={images[currentImageIndex]}
              alt={`Attachment ${currentImageIndex + 1}`}
              fill
              className="object-contain cursor-pointer"
              onClick={() => setOpenLightBox(true)}
            />
          </div>
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-1 shadow"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
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

      <Lightbox 
        open={openLightBox} 
        close={() => setOpenLightBox(false)} 
        index={currentImageIndex} 
        slides={images.map((img) => ({src: img}))} 
        plugins={[Thumbnails]}
        render={{
          controls: () => (
            <>
              <Button onClick={() => setShowImageMoreOptions(!showImageMoreOptions)} variant={"outline"} className='fixed cursor-pointer top-2 left-2'><MoreVerticalIcon /></Button>
              {showImageMoreOptions && <div className='fixed top-12 left-2 flex flex-col gap-1 bg-white rounded-lg p-1'>
                <Button onClick={handleRemovePhoto} variant={"destructive"} className='cursor-pointer text-white'>Fshij <FaTrash color='#fff'/></Button>
                <Button onClick={handleDownloadPhoto} variant={"default"} className='cursor-pointer'>Shkarko <FaDownload /></Button>
                <Button onClick={() => {copyToClipboard(images[currentImageIndex]); setShowImageMoreOptions(false)}} variant={"outline"} className='cursor-pointer'>Kopjo Linkun <FaCopy /></Button>
              </div>}
            </>
          ),
        }}/>

      {/* <AdminGalleryLightbox className='w-full h-full' images={images.map((img) => ({src: img}))}/> */}

      {/* Video Carousel */}
      {videoAttachments.length > 0 && (
        <div className="relative">
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
                onClick={(e) => { e.stopPropagation(); prevVideo(); }}
                className="text-sm flex items-center gap-1 text-gray-600"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Previous
              </button>
              <span className="text-sm text-gray-500">
                {currentVideoIndex + 1} / {videoAttachments.length}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); nextVideo(); }}
                className="text-sm flex items-center gap-1 text-gray-600"
              >
                Next
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
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-100 p-2 rounded-full">
              <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
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
                onClick={(e) => { e.stopPropagation(); prevAudio(); }}
                className="text-sm flex items-center gap-1 text-gray-600"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Previous
              </button>
              <span className="text-sm text-gray-500">
                {currentAudioIndex + 1} / {audioAttachments.length}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); nextAudio(); }}
                className="text-sm flex items-center gap-1 text-gray-600"
              >
                Next
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
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Dokumenta:</p>
          <div className="space-y-1">
            {documents.map((doc, index) => (
              <a
                key={index}
                href={doc}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-indigo-600"
                onClick={(e) => e.stopPropagation()}
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

      <div className='flex flex-row justify-between gap-2 items-center'>
        <Badge variant={"destructive"}>
            {company ? `Kunder ${company.name}` : "Ankese komunale"}
        </Badge>
        <div className="flex gap-2">
            <button
            onClick={(e) => {
                e.stopPropagation();
                deleteContribution();
            }}
            className="px-3 py-1 cursor-pointer text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
            >
            Refuzoni
            </button>
            <button
            onClick={(e) => {
                e.stopPropagation();
                acceptContribution();
            }}
            className="px-3 py-1 text-sm cursor-pointer text-white bg-indigo-600 rounded hover:bg-indigo-700"
            >
            Pranoni
            </button>
        </div>
      </div>
    </div>
  );
};

export default ContributionRequestCard;