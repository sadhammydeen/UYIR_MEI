"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  fallbackSrc?: string;
  sizes?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  onClick?: () => void;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  fallbackSrc = '/images/placeholder.jpg',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  objectFit = 'cover',
  onLoad,
  onClick,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  
  // Reset loading state when src changes
  useEffect(() => {
    setIsLoading(true);
    setImgSrc(src);
    setHasError(false);
  }, [src]);
  
  const handleLoad = () => {
    setIsLoading(false);
    if (onLoad) onLoad();
  };
  
  const handleError = () => {
    setHasError(true);
    setImgSrc(fallbackSrc);
  };
  
  return (
    <div
      className={cn(
        'relative overflow-hidden',
        objectFit === 'contain' ? 'flex items-center justify-center' : '',
        isLoading ? 'bg-gray-100 animate-pulse' : '',
        className
      )}
      style={{ width, height }}
      onClick={onClick}
    >
      <Image
        src={imgSrc}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        quality={priority ? 90 : 75}
        loading={priority ? 'eager' : 'lazy'}
        priority={priority}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'object-scale-down',
        )}
      />
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          {alt || 'Image not available'}
        </div>
      )}
    </div>
  );
} 