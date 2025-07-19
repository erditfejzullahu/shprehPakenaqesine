"use client";

import Link from "next/link";
import React, { memo } from "react";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface LatestPendingComplaintCardProps {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "ACCEPTED";
  resolvedStatus: "PENDING" | "RESOLVED";
  category: string;
  upVotes: number;
  createdAt: Date;
  company: {
    id: string;
    name: string;
  } | null;
  user: {
    id: string;
    fullName: string;
    anonimity: boolean;
  };
  municipality: string;
  attachments: string[];
  videosAttached: string[];
  audiosAttached: string[];
}

const LatestPendingComplaintCard = ({
  id,
  title,
  description,
  status,
  resolvedStatus,
  category,
  upVotes,
  createdAt,
  company,
  user,
  municipality,
  attachments,
  videosAttached,
  audiosAttached
}: LatestPendingComplaintCardProps) => {
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

  const totalAttachments = attachments.length + videosAttached.length + audiosAttached.length;

  return (
    <>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className={`w-full cursor-pointer bg-white shadow-lg p-6 flex flex-col gap-4 hover:shadow-md transition relative`}>
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">{title}</h2>
              <p className="text-sm text-gray-600 mt-1 line-clamp-3">{description}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                <span className="text-sm text-gray-500">{upVotes}</span>
                <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                </svg>
              </div>
              {totalAttachments > 0 && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  {totalAttachments} bashkëngjitje
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant={"default"}
            >
              {resolvedStatus === 'RESOLVED' ? 'Zgjidhur' :  "Në pritje"}
            </Badge>
            <Badge variant="outline">{getCategoryLabel(category)}</Badge>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            {company ? (
              <span>Kundër: <button 
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  router.push(`/kompanite/${company.id}`);
                }} 
                className="text-indigo-600 cursor-pointer hover:underline"
              >
                {company.name}
              </button></span>
            ) : (
              <span>Ankese Komunale ne: <span className="text-gray-700">{municipality}</span></span>
            )}
            <span>{formatDate(createdAt)}</span>
            {municipality && <Badge className="absolute bottom-1 right-1" variant={"default"}>{municipality}</Badge>}
          </div>

          {user.anonimity ? (
            <div className="text-sm text-gray-500">Postuar nga: Anonim</div>
          ) : (
            <div 
              className="text-sm text-gray-500" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/profili/${user.id}`);
              }}
            >
              Postuar nga: <span className="text-gray-700 cursor-pointer hover:underline">{user.fullName}</span>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Button className="cursor-pointer w-full mb-1" variant={"default"}>Approve</Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
        <Button variant={"destructive"} className="cursor-pointer w-full mb-1">Delete</Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
        <Button variant={"outline"} className="cursor-pointer w-full">View complaint</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
  );
}

export default memo(LatestPendingComplaintCard);