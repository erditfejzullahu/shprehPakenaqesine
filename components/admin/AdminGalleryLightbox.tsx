"use client";

import React, { useState } from "react";
import Lightbox, { Slide } from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Image from "next/image";

export default function AdminGalleryLightbox({ images, className }: {images: Slide[], className?: string}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        {images.map((img, i) => (
          <Image
            key={i}
            width={1000}
            height={1000}
            src={img.src}
            alt={`Image ${i + 1}`}
            className={`cursor-pointer object-contain rounded shadow ${className}`}
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
          />
        ))}
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images}
        index={index}
        plugins={[Thumbnails]}
      />
    </>
  );
}
