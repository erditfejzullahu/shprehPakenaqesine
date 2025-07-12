// components/CompanyCard.tsx
"use client";

import { CompanyInterface } from "@/types/types";
import Image from "next/image";
import React from "react";

export default function CompanyCard({
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
}: CompanyInterface) {
  
  const parsedImages = React.useMemo(() => {
    if (!images) return [];
    if (Array.isArray(images)) return images;
    try {
      const parsed = JSON.parse(images as any);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [images]);
  
  return (
    <div className="bg-white shadow-lg p-6 flex flex-col gap-4 hover:shadow-md transition relative">
      <div>
        <Image
          src={logoUrl}
          width={100}
          height={100}
          alt={name}
          className="w-full h-20 object-cover"
        />
      </div>
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
        {description && (
          <p className="text-gray-600 text-sm mt-1 line-clamp-4 mb-2">{description}</p>
        )}
        <div className="text-sm text-gray-500 mt-2 flex flex-col gap-1 ">
          {address && <div>📍 {address}</div>}
          {website && (
            <div>
              🌐{" "}
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {website}
              </a>
            </div>
          )}
          {email && <div>📧 {email}</div>}
          {phone && <div>📞 {phone}</div>}
          {industry && <div>🏢 Industria: <span className="text-gray-800">{industry}</span></div>}
          {foundedYear && <div>📅 E krijuar: {foundedYear}</div>}
        </div>
        {parsedImages.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Galeria</h3>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {parsedImages.map((img, index) => (
                <div key={index} className="flex-shrink-0">
                  <Image
                    src={img}
                    width={200}
                    height={100}
                    alt={`${name} gallery image ${index + 1}`}
                    className="w-40 h-20 object-cover rounded-md border border-gray-200"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {complaintsCount !== 0 && (
          <div className="absolute bottom-0 right-0 rounded-tl-lg px-2 py-1 flex items-center bg-indigo-600">
            <span className="text-xs font-normal text-white"><span className="font-bold">{complaintsCount}</span> Ankesa</span>
          </div>
        )}
      </div>
    </div>
  );
}
