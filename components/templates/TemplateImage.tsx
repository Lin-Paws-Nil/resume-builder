'use client';

import Image from 'next/image';
import { useState } from 'react';

interface TemplateImageProps {
  src: string;
  alt: string;
  templateName: string;
}

export function TemplateImage({ src, alt, templateName }: TemplateImageProps) {
  const [imageError, setImageError] = useState(false);

  if (imageError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
        <div className="text-center px-4">
          <p className="text-gray-400 text-sm font-medium mb-1">
            {templateName}
          </p>
          <p className="text-gray-300 text-xs">
            Upload {templateName.toLowerCase()}.png to display
          </p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-contain"
      quality={100}
      unoptimized={true}
      onError={() => setImageError(true)}
      sizes="(max-width: 768px) 100vw, 33vw"
      priority={false}
    />
  );
}
