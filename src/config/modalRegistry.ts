import React from 'react';

export type ModalVariant = 'gallery' | 'form' | 'specs' | 'wizard';

export interface ModalEntry {
  id: string;
  title: string;
  description: string;
  variant: ModalVariant;
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  imageSrc?: (ctx: any) => string;
  priority?: number;
  deepLinkEnabled?: boolean;
}

export const modalRegistry: Record<string, ModalEntry> = {
  // AppleStorytelling modals
  'story-interior': {
    id: 'story-interior',
    title: 'Luxury Redefined',
    description: 'Step into comfort and sophistication',
    variant: 'gallery',
    component: React.lazy(() => import('@/components/vehicle-details/modals/content/StoryInteriorContent').then(m => ({ default: m.StoryInteriorContent }))),
    imageSrc: (ctx) => ctx.galleryImages?.[3] || '',
    deepLinkEnabled: true,
  },
  'story-technology': {
    id: 'story-technology',
    title: 'Innovation at Your Fingertips',
    description: 'Advanced technology that anticipates your needs',
    variant: 'specs',
    component: React.lazy(() => import('@/components/vehicle-details/modals/content/StoryTechnologyContent').then(m => ({ default: m.StoryTechnologyContent }))),
    imageSrc: (ctx) => ctx.galleryImages?.[1] || '',
    deepLinkEnabled: true,
  },
  'story-performance': {
    id: 'story-performance',
    title: 'Unstoppable Performance',
    description: 'Power meets precision in every journey',
    variant: 'specs',
    component: React.lazy(() => import('@/components/vehicle-details/modals/content/StoryPerformanceContent').then(m => ({ default: m.StoryPerformanceContent }))),
    imageSrc: (ctx) => ctx.galleryImages?.[2] || '',
    deepLinkEnabled: true,
  },
  'story-safety': {
    id: 'story-safety',
    title: 'Proactive Protection',
    description: '360° awareness for every journey',
    variant: 'specs',
    component: React.lazy(() => import('@/components/vehicle-details/modals/content/StorySafetyContent').then(m => ({ default: m.StorySafetyContent }))),
    imageSrc: (ctx) => ctx.galleryImages?.[0] || '',
    deepLinkEnabled: true,
  },
  'story-exterior': {
    id: 'story-exterior',
    title: 'Sculpted for Performance',
    description: 'Every curve designed with purpose',
    variant: 'gallery',
    component: React.lazy(() => import('@/components/vehicle-details/modals/content/StoryExteriorContent').then(m => ({ default: m.StoryExteriorContent }))),
    imageSrc: (ctx) => ctx.galleryImages?.[1] || '',
    deepLinkEnabled: true,
  },

  // SeamlessCinematicShowroom modals
  'interior': {
    id: 'interior',
    title: 'Interior Showcase',
    description: 'Explore every detail',
    variant: 'gallery',
    component: React.lazy(() => import('@/components/vehicle-details/modals/content/ShowroomInteriorContent').then(m => ({ default: m.ShowroomInteriorContent }))),
    imageSrc: (ctx) => ctx.galleryImages?.[3] || '',
    deepLinkEnabled: true,
  },
  'exterior': {
    id: 'exterior',
    title: 'Commanding Presence',
    description: 'Bold design meets capability',
    variant: 'gallery',
    component: React.lazy(() => import('@/components/vehicle-details/modals/content/ShowroomExteriorContent').then(m => ({ default: m.ShowroomExteriorContent }))),
    imageSrc: (ctx) => ctx.galleryImages?.[1] || '',
    deepLinkEnabled: true,
  },
  'performance': {
    id: 'performance',
    title: 'Performance & Capability',
    description: 'Technical specifications',
    variant: 'specs',
    component: React.lazy(() => import('@/components/vehicle-details/modals/content/ShowroomPerformanceContent').then(m => ({ default: m.ShowroomPerformanceContent }))),
    imageSrc: (ctx) => ctx.galleryImages?.[2] || '',
    deepLinkEnabled: true,
  },
  'safety': {
    id: 'safety',
    title: 'Toyota Safety Sense',
    description: 'Advanced protection systems',
    variant: 'specs',
    component: React.lazy(() => import('@/components/vehicle-details/modals/content/ShowroomSafetyContent').then(m => ({ default: m.ShowroomSafetyContent }))),
    imageSrc: (ctx) => ctx.galleryImages?.[0] || '',
    deepLinkEnabled: true,
  },
  'technology': {
    id: 'technology',
    title: 'Connected Experience',
    description: 'Intuitive technology',
    variant: 'specs',
    component: React.lazy(() => import('@/components/vehicle-details/modals/content/ShowroomTechnologyContent').then(m => ({ default: m.ShowroomTechnologyContent }))),
    imageSrc: (ctx) => ctx.galleryImages?.[1] || '',
    deepLinkEnabled: true,
  },
  
  // Alias for legacy compatibility
  'connectivity': {
    id: 'connectivity',
    title: 'Connected Experience',
    description: 'Intuitive technology',
    variant: 'specs',
    component: React.lazy(() => import('@/components/vehicle-details/modals/content/ShowroomTechnologyContent').then(m => ({ default: m.ShowroomTechnologyContent }))),
    imageSrc: (ctx) => ctx.galleryImages?.[1] || '',
    deepLinkEnabled: true,
  },
};
