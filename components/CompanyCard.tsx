// components/CompanyCard.tsx
"use client";

import { Companies } from "@/app/generated/prisma";
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
}: Companies) {
  return (
    <div className="bg-white shadow-lg p-6 flex flex-col gap-4 hover:shadow-md transition">
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
          {foundedYear && <div>📅 Founded: {foundedYear}</div>}
        </div>
        {images && images.length > 0 && (
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {Array(images).map((img) => (
              <img
                key={img}
                src={img}
                alt={name}
                className="w-20 h-20 object-cover rounded-md"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
