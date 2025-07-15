"use client";

import Link from "next/link";
import React, { memo } from "react";
import { Badge } from "./ui/badge";
import { ComplaintCardProps } from "@/types/types";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const ComplaintCard = ({
  id,
  title,
  description,
  status,
  resolvedStatus,
  category,
  upVotes,
  createdAt,
  company,
  user
}: ComplaintCardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const getCategoryLabel = (category: string) => {
    const words = category.split('_').map(word => {
      if (word === 'NE') return 'në';
      return word.charAt(0) + word.slice(1).toLowerCase();
    });
    return words.join(' ');
  };

  return (
    <Link href={`/ankesat/${id}`} aria-description="ankesa" className={`${pathname === "/ankesat" ? "w-full" : "w-[400px]"} bg-white shadow-lg p-6 flex flex-col gap-4 hover:shadow-md transition relative`}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 line-clamp-1">{title}</h2>
          <p className="text-sm text-gray-600 mt-1 line-clamp-3">{description}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm text-gray-500">{upVotes}</span>
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge
          variant={
            status === 'ACCEPTED' ? 'default' :
            resolvedStatus === 'RESOLVED' ? 'secondary' :
            'outline'
          }
        >
          {resolvedStatus === 'RESOLVED' ? 'Zgjidhur' : 
           status === 'ACCEPTED' ? 'Pranuar' : 'Në pritje'}
        </Badge>
        <Badge variant="outline">{getCategoryLabel(category)}</Badge>
      </div>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <span>Kundër: <button onClick={() => router.push(`/kompanite/${company.id}`)} className="text-indigo-600 hover:underline">{company.name}</button></span>
        <span>{new Date(createdAt).toLocaleDateString('sq-AL', {day: "2-digit", month: "short", year: "2-digit"})}</span>
      </div>

      {user.anonimity ? (
        <div className="text-sm text-gray-500">Postuar nga: Anonim</div>
      ) : (
        <div className="text-sm text-gray-500">
          Postuar nga: <span className="text-gray-700">{user.fullName}</span>
        </div>
      )}
    </Link>
  );
}

export default memo(ComplaintCard);