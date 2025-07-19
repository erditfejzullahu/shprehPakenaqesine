"use client";

import Link from "next/link";
import React, { memo } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Badge } from "../ui/badge";

interface ReportedComplaintsCardProps {
  complaintId: string;
  complaintTitle: string;
  complaintResolvedStatus: "PENDING" | "RESOLVED";
  complaintStatus: "PENDING" | "ACCEPTED";
  totalReports: number;
  complaintContributions: number;
  complaintUser: {
    name: string;
    image: string;
  };
  complaintCompany: {
    companyName: string;
    companyId: string;
  } | null;
  complaintUpVotes: number;
  complaintAttachments: number;
  complaintVideoAttachments: number;
  complaintAudioAttachments: number;
  complaintCategory: string;
  complaintMunicipality: string;
  mostRecentReport: {
    title: string;
    description: string;
    attachments: string[];
    videoAttachments: string[];
    audioAttachments: string[];
    createdAt: Date;
  } | null;
}

const ReportedComplaintsCard = ({
  complaintId,
  complaintTitle,
  complaintResolvedStatus,
  complaintStatus,
  totalReports,
  complaintContributions,
  complaintUser,
  complaintCompany,
  complaintUpVotes,
  complaintAttachments,
  complaintVideoAttachments,
  complaintAudioAttachments,
  complaintCategory,
  complaintMunicipality,
  mostRecentReport
}: ReportedComplaintsCardProps) => {
  const router = useRouter();
  const pathname = usePathname();

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
      year: "2-digit"
    });
  };

  return (
    <div className={`w-full bg-white shadow-lg p-6 flex flex-col gap-4 hover:shadow-md transition relative`}>
      <div className="flex justify-between items-start">
        <div>
          <Link href={`/ankesat/${complaintId}`} className="text-lg font-semibold text-gray-900 line-clamp-1 hover:underline">
            {complaintTitle}
          </Link>
          {mostRecentReport && (
            <div className="mt-2 border-l-4 border-red-200 pl-3">
              <h3 className="text-sm font-medium text-gray-800">Raporti më i ri: {mostRecentReport.title}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">{mostRecentReport.description}</p>
              <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                <span>{formatDate(mostRecentReport.createdAt)}</span>
                <span>•</span>
                <span>
                  {mostRecentReport.attachments.length + 
                   mostRecentReport.videoAttachments.length + 
                   mostRecentReport.audioAttachments.length} bashkëngjitje
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium text-red-600">{totalReports}</span>
            <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-500">{complaintUpVotes}</span>
            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="destructive">
          {totalReports} Raporte
        </Badge>
        <Badge
          variant={
            complaintStatus === 'ACCEPTED' ? 'default' :
            complaintResolvedStatus === 'RESOLVED' ? 'secondary' :
            'outline'
          }
        >
          {complaintResolvedStatus === 'RESOLVED' ? 'Zgjidhur' : 
           complaintStatus === 'ACCEPTED' ? 'Pranuar' : 'Në pritje'}
        </Badge>
        <Badge variant="outline">{getCategoryLabel(complaintCategory)}</Badge>
        {complaintContributions > 0 && (
          <Badge variant="outline">
            {complaintContributions} Kontribute
          </Badge>
        )}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        {complaintCompany ? (
          <span>Kundër: <button 
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/kompanite/${complaintCompany.companyId}`);
            }} 
            className="text-indigo-600 cursor-pointer hover:underline"
          >
            {complaintCompany.companyName}
          </button></span>
        ) : (
          <span>Ankese Komunale ne: <span className="text-gray-700">{complaintMunicipality}</span></span>
        )}
        <div className="flex items-center gap-1 text-xs">
          {complaintAttachments > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
              </svg>
              {complaintAttachments}
            </span>
          )}
          {complaintVideoAttachments > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
              </svg>
              {complaintVideoAttachments}
            </span>
          )}
          {complaintAudioAttachments > 0 && (
            <span className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 3a1 1 0 00-1.447-.894L8.763 6H5a3 3 0 000 6h.28l1.771 5.316A1 1 0 008 18h1a1 1 0 001-1v-4.382l6.553 3.276A1 1 0 0018 15V3z" clipRule="evenodd" />
              </svg>
              {complaintAudioAttachments}
            </span>
          )}
        </div>
      </div>

      <div className="text-sm text-gray-500">
        Postuar nga: <span className="text-gray-700">{complaintUser.name}</span>
      </div>
      {complaintMunicipality && <Badge className="absolute bottom-1 right-1" variant={"default"}>{complaintMunicipality}</Badge>}
    </div>
  );
}

export default memo(ReportedComplaintsCard);