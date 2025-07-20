"use client";

import { useState, useMemo, memo, useCallback } from 'react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '../ui/button';
import { MoreVerticalIcon } from 'lucide-react';
import { FaCopy, FaDownload, FaTrash } from 'react-icons/fa';
import { copyToClipboard } from '@/lib/utils';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { toast } from 'sonner';
import api from '@/lib/api';
import { Municipality } from '@/app/generated/prisma';

interface ContributionCardProps {
  id: string;
  complaintId: string;
  userId: string;
  attachments: string[];
  contributionValidated: boolean;
  audiosAttached: string[];
  videosAttached: string[];
  createdAt: Date;
  updatedAt: Date;
  complaint: {
    id: string;
    title: string;
    description: string;
    status: string;
    category: string;
    municipality: Municipality;
    company: {
      id: string;
      name: string;
    } | null;
  };
  user: {
    id: string;
    fullName: string;
    userProfileImage: string;
    email: string;
  };
}

const ContributionCard = ({
  id,
  attachments,
  audiosAttached,
  videosAttached,
  contributionValidated,
  createdAt,
  complaint,
  user
}: ContributionCardProps) => {
  const router = useRouter();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [showImageMoreOptions, setShowImageMoreOptions] = useState(false);
  const [openLightBox, setOpenLightBox] = useState(false);

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

  const getCategoryLabel = (category: string) => {
    const words = category.split('_').map(word => {
      if (word === 'NE') return 'në';
      return word.charAt(0) + word.slice(1).toLowerCase();
    });
    return words.join(' ');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('sq-AL', {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

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
      } finally {
        setShowImageMoreOptions(false)
      }
    }, [id, images, currentImageIndex, router])

  const handleDownloadPhoto = async () => {
    try {
      const response = await api.get(`/api/admin/download?file=${images[currentImageIndex]}`, {
        responseType: "blob"
      });

      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = images[currentImageIndex].split('/').pop() || 'download';
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success('Tani do filloje shkarkimi i imazhit');
    } catch (error) {
      console.error(error);
      toast.error('Dicka shkoi gabim! Ju lutem provoni perseri.');
    } finally {
      setShowImageMoreOptions(false);
    }
  };

  const handleDeleteContribution = async () => {
    try {
      const response = await api.delete(`/api/admin/contributions/${id}`);
      if (response.data.success) {
        toast.success('Kontributi u fshi me sukses');
        router.refresh();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Dicka shkoi gabim!");
    }
  };

  const handleValidateContribution = async () => {
    try {
      const response = await api.patch(`/api/admin/contributions/${id}`, {
        validated: true
      });
      if (response.data.success) {
        toast.success('Kontributi u validua me sukses');
        router.refresh();
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Dicka shkoi gabim!");
    }
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <div className="w-full bg-white shadow-lg p-6 flex flex-col gap-4 hover:shadow-md transition relative">
      {/* Header with complaint info */}
      <div className="flex justify-between items-start">
        <div>
          <Link href={`/ankesat/${complaint.id}`} className="text-lg font-semibold text-gray-900 hover:underline">
            {complaint.title}
          </Link>
          <p className="text-sm text-gray-600 mt-1">Kontribut i {contributionValidated ? 'validuar' : 'pavaliduar'}</p>
        </div>
        <div className="flex flex-col gap-1">
          <Badge variant="outline">{getCategoryLabel(complaint.category)}</Badge>
          <Badge className="ml-auto">{complaint.municipality}</Badge>
        </div>
      </div>

      {/* User info */}
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden">
          <Image
            src={user.userProfileImage}
            alt={user.fullName}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-row justify-between flex-1">
          <div>
            <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
            <p className="text-xs text-gray-500">Kontribues</p>
          </div>
          <div className="flex flex-col">
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
              onClick={() => {setOpenLightBox(true); document.body.style.pointerEvents = "all"}}
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
        close={() => {setOpenLightBox(false); document.body.style.pointerEvents = "none"}} 
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
        }}
      />

      {/* Video Attachments */}
      {videosAttached.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Video:</h3>
          <div className="grid grid-cols-1 gap-2">
            {videosAttached.map((video, index) => (
              <video
                key={index}
                src={video}
                controls
                className="w-full rounded-lg"
              />
            ))}
          </div>
        </div>
      )}

      {/* Audio Attachments */}
      {audiosAttached.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Audio:</h3>
          <div className="space-y-2">
            {audiosAttached.map((audio, index) => (
              <div key={index} className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <div className="bg-indigo-100 p-2 rounded-full">
                  <svg className="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
                  </svg>
                </div>
                <audio
                  src={audio}
                  controls
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Document Attachments */}
      {documents.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Dokumenta:</h3>
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

      {/* Footer with actions */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500">
          Postuar më: {formatDate(createdAt)}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleDeleteContribution}
            className="px-3 py-1 text-sm text-red-600 border border-red-200 rounded hover:bg-red-50"
          >
            Fshij
          </button>
          {!contributionValidated && (
            <button
              onClick={handleValidateContribution}
              className="px-3 py-1 text-sm text-white bg-green-600 rounded hover:bg-green-700"
            >
              Valido
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(ContributionCard);