'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { cn } from '@/lib/utils/cn'

interface LazyImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  onLoad?: () => void
  aspectRatio?: string
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  sizes,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  onLoad,
  aspectRatio = '16/9'
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(false)
  const imgRef = useRef<HTMLDivElement>(null)
  
  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) {
      setIsInView(true)
      return
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )
    
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    
    return () => observer.disconnect()
  }, [priority])
  
  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }
  
  // Generate responsive sizes if not provided
  const responsiveSizes = sizes || `
    (max-width: 640px) 100vw,
    (max-width: 768px) 80vw,
    (max-width: 1024px) 60vw,
    50vw
  `
  
  return (
    <div 
      ref={imgRef}
      className={cn(
        'relative overflow-hidden bg-background-secondary',
        className
      )}
      style={{ aspectRatio }}
    >
      {/* Skeleton loader */}
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-background-secondary to-background-tertiary" />
      )}
      
      {/* Image */}
      {isInView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0"
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={responsiveSizes}
            quality={quality}
            priority={priority}
            placeholder={placeholder}
            blurDataURL={blurDataURL}
            onLoad={handleLoad}
            className="object-cover"
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%'
            }}
          />
        </motion.div>
      )}
      
      {/* Low quality placeholder for mobile */}
      {!isLoaded && isInView && (
        <Image
          src={src}
          alt=""
          fill
          sizes="10vw"
          quality={10}
          priority
          className="object-cover blur-xl scale-110"
          style={{
            objectFit: 'cover'
          }}
        />
      )}
    </div>
  )
}

// Picture element for art direction
export function ResponsivePicture({
  sources,
  alt,
  className,
  aspectRatio = '16/9'
}: {
  sources: Array<{
    srcSet: string
    media: string
    type?: string
  }>
  alt: string
  className?: string
  aspectRatio?: string
}) {
  const [isLoaded, setIsLoaded] = useState(false)
  
  return (
    <div 
      className={cn(
        'relative overflow-hidden bg-background-secondary',
        className
      )}
      style={{ aspectRatio }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-background-secondary to-background-tertiary" />
      )}
      
      <picture>
        {sources.map((source, index) => (
          <source
            key={index}
            srcSet={source.srcSet}
            media={source.media}
            type={source.type}
          />
        ))}
        <img
          src={sources[sources.length - 1].srcSet}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      </picture>
    </div>
  )
}