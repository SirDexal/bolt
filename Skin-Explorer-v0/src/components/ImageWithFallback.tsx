import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ImageWithFallbackProps {
  primarySrc: string;
  fallbackSrc: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  primarySrc,
  fallbackSrc,
  alt,
  className = '',
  onLoad
}) => {
  const [currentSrc, setCurrentSrc] = useState(primarySrc);
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleError = () => {
    if (currentSrc === primarySrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  if (hasError) {
    return (
      <div className={`flex items-center justify-center bg-slate-800/50 ${className}`}>
        <ImageOff className="h-8 w-8 text-slate-500" />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800/50 animate-pulse rounded-lg" />
      )}
      <img
        src={currentSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        className={`${className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        loading="lazy"
      />
    </div>
  );
};

export default ImageWithFallback;