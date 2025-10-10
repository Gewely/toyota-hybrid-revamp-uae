import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface PremiumImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export const PremiumImage: React.FC<PremiumImageProps> = ({
  src,
  alt,
  className = '',
  priority = false,
  sizes = '100vw',
  onLoad,
  onError
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    const err = new Error(`Failed to load image: ${src}`);
    if (retryCount < 2) {
      setTimeout(() => setRetryCount(prev => prev + 1), 1000);
    } else {
      setError(err);
      onError?.(err);
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Shimmer placeholder */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]" />
        </div>
      )}
      
      {/* Actual image */}
      {!error && (
        <motion.img
          key={`${src}-${retryCount}`}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className={`w-full h-full object-cover ${isLoaded ? 'visible' : 'invisible'}`}
        />
      )}

      {/* Error fallback */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
          <p className="text-sm text-neutral-500">Failed to load image</p>
        </div>
      )}
    </div>
  );
};
