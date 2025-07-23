// components/CompanyCard.tsx
"use client";

import { CompanyInterface } from "@/types/types";
import Image from "next/image";
import Link from "next/link";
import React, { memo } from "react";
import { Badge } from "./ui/badge";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { MdThumbDownAlt } from "react-icons/md";

const CompanyCard = ({
  id,
  name,
  description,
  logoUrl,
  address,
  website,
  email,
  phone,
  industry,
  images,
  foundedYear,
  complaintsCount
}: CompanyInterface) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Link 
      href={`/kompanite/${id}`} 
      aria-description="kompania" 
      className={`w-full bg-white shadow-lg p-6 flex flex-col gap-4 hover:shadow-md transition relative`}
    >
      <div className="flex justify-between items-start gap-4 flex-1">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-md overflow-hidden border border-gray-200">
            <Image
              src={logoUrl}
              width={64}
              height={64}
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-lg text-left font-semibold text-gray-900 line-clamp-1 break-all">{name}</h2>
            {industry && (
              <p className="text-sm text-gray-600 mt-1 text-left">{industry}</p>
            )}
          </div>
        </div>
        {complaintsCount !== 0 && (
          <Badge variant="default" className="flex items-center gap-1">
            <span>{complaintsCount}</span>
            <MdThumbDownAlt size={14} color="#fff"/>
          </Badge>
        )}
      </div>

      {description && (
        <p className="text-gray-600 text-sm line-clamp-3 text-left">{description}</p>
      )}

      <div className="flex flex-wrap gap-2 overflow-x-auto">
        {address && (
          <Badge variant="outline" className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="line-clamp-1 flex-1">{address}</span>
          </Badge>
        )}
        {foundedYear && (
          <Badge variant="outline" className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            {foundedYear}
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-2 text-sm text-gray-500">
        {website && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
            </svg>
            <button
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(website, '_blank');
              }}
            >
              {website}
            </button>
          </div>
        )}
        {email && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            {email}
          </div>
        )}
        {phone && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            {phone}
          </div>
        )}
      </div>

      {images && images.length > 0 && (
        <div className="mt-2">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.slice(0, 3).map((img, index) => (
              <div key={index} className="flex-shrink-0">
                <Image
                  src={img || process.env.NEXT_PUBLIC_BASE_URL + img}
                  width={120}
                  height={80}
                  alt={`${name} gallery image ${index + 1}`}
                  className="w-24 h-16 object-cover rounded-md border border-gray-200"
                />
              </div>
            ))}
            {images.length > 3 && (
              <div className="flex-shrink-0 w-24 h-16 bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center text-xs text-gray-500">
                +{images.length - 3} më shumë
              </div>
            )}
          </div>
        </div>
      )}
    </Link>
  );
}

export default memo(CompanyCard);