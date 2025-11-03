import React from 'react';
import { cn } from '@/lib/utils';

export type ShimmerVariant = 'card' | 'text' | 'image' | 'list' | 'hero' | 'gallery';

interface ShimmerLoaderProps {
  variant?: ShimmerVariant;
  className?: string;
  count?: number;
  'aria-label'?: string;
}

const shimmerAnimation = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
`;

const baseShimmerClass = cn(
  "relative overflow-hidden bg-muted/20",
  "before:absolute before:inset-0",
  "before:bg-gradient-to-r before:from-transparent before:via-muted/40 before:to-transparent",
  "before:animate-[shimmer_2s_ease-in-out_infinite]"
);

export const ShimmerLoader: React.FC<ShimmerLoaderProps> = ({
  variant = 'card',
  className,
  count = 1,
  'aria-label': ariaLabel = 'Loading content'
}) => {
  const renderShimmer = () => {
    switch (variant) {
      case 'hero':
        return (
          <div className={cn("w-full h-[500px] md:h-[600px]", baseShimmerClass, className)} />
        );

      case 'card':
        return (
          <div className={cn("rounded-lg p-4 space-y-3", className)}>
            <div className={cn("h-48 rounded-md", baseShimmerClass)} />
            <div className={cn("h-4 rounded", baseShimmerClass)} />
            <div className={cn("h-4 rounded w-3/4", baseShimmerClass)} />
            <div className={cn("h-8 rounded w-1/2 mt-4", baseShimmerClass)} />
          </div>
        );

      case 'text':
        return (
          <div className={cn("space-y-2", className)}>
            <div className={cn("h-4 rounded", baseShimmerClass)} />
            <div className={cn("h-4 rounded w-5/6", baseShimmerClass)} />
            <div className={cn("h-4 rounded w-4/6", baseShimmerClass)} />
          </div>
        );

      case 'image':
        return (
          <div className={cn("aspect-video rounded-lg", baseShimmerClass, className)} />
        );

      case 'list':
        return (
          <div className={cn("space-y-3", className)}>
            {[...Array(count)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={cn("h-12 w-12 rounded-full flex-shrink-0", baseShimmerClass)} />
                <div className="flex-1 space-y-2">
                  <div className={cn("h-4 rounded w-3/4", baseShimmerClass)} />
                  <div className={cn("h-3 rounded w-1/2", baseShimmerClass)} />
                </div>
              </div>
            ))}
          </div>
        );

      case 'gallery':
        return (
          <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", className)}>
            {[...Array(count)].map((_, i) => (
              <div key={i} className={cn("aspect-square rounded-lg", baseShimmerClass)} />
            ))}
          </div>
        );

      default:
        return <div className={cn(baseShimmerClass, className)} />;
    }
  };

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={ariaLabel}
    >
      <style>{shimmerAnimation}</style>
      {variant === 'list' || variant === 'gallery' ? (
        renderShimmer()
      ) : (
        <>
          {[...Array(count)].map((_, i) => (
            <div key={i} className={i > 0 ? 'mt-4' : ''}>
              {renderShimmer()}
            </div>
          ))}
        </>
      )}
      <span className="sr-only">{ariaLabel}</span>
    </div>
  );
};

// Specialized shimmer components
export const HeroShimmer = () => (
  <ShimmerLoader variant="hero" aria-label="Loading hero section" />
);

export const CardShimmer = ({ count = 1 }: { count?: number }) => (
  <ShimmerLoader variant="card" count={count} aria-label="Loading cards" />
);

export const GalleryShimmer = ({ count = 8 }: { count?: number }) => (
  <ShimmerLoader variant="gallery" count={count} aria-label="Loading gallery" />
);

export const TextShimmer = ({ lines = 3 }: { lines?: number }) => (
  <ShimmerLoader variant="text" count={lines} aria-label="Loading text" />
);
