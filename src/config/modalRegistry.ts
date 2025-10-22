import { ComponentType, lazy } from 'react';
import { PageContext } from '@/contexts/ModalProvider';

export type ModalVariant = 'plain' | 'gallery' | 'form' | 'specs' | 'cta' | 'wizard';

export interface ModalEntry {
  id: string;
  title: string;
  description?: string;
  variant: ModalVariant;
  component: ComponentType<any>;
  imageSrc?: string | ((context: PageContext) => string);
  priority?: number;
  deepLinkEnabled?: boolean;
}

// Lazy load modal components
const SafetySuiteModal = lazy(() => import('@/components/vehicle-details/modals/SafetySuiteModal'));
const ConnectivityModal = lazy(() => import('@/components/vehicle-details/modals/ConnectivityModal'));
const HybridTechModal = lazy(() => import('@/components/vehicle-details/modals/HybridTechModal'));
const InteriorModal = lazy(() => import('@/components/vehicle-details/modals/InteriorModal'));
const ExteriorModal = lazy(() => import('@/components/vehicle-details/modals/ExteriorModal'));
const PerformanceModal = lazy(() => import('@/components/vehicle-details/modals/PerformanceModal'));
const OffersModal = lazy(() => import('@/components/home/OffersModal'));
const BookTestDrive = lazy(() => import('@/components/vehicle-details/BookTestDrive'));
const FinanceCalculator = lazy(() => import('@/components/vehicle-details/FinanceCalculator'));
const CarBuilder = lazy(() => import('@/components/vehicle-details/CarBuilder'));

export const modalRegistry: Record<string, ModalEntry> = {
  'safety': {
    id: 'safety',
    title: 'Toyota Safety Sense 2.0',
    description: 'Advanced safety features designed to protect you',
    variant: 'gallery',
    component: SafetySuiteModal as any,
    imageSrc: (ctx) => ctx.heroImage || ctx.galleryImages?.[0] || '',
    priority: 40,
    deepLinkEnabled: true,
  },
  'connectivity': {
    id: 'connectivity',
    title: 'Connected Services',
    description: 'Stay connected on every journey',
    variant: 'gallery',
    component: ConnectivityModal as any,
    imageSrc: (ctx) => ctx.galleryImages?.[1] || ctx.heroImage || '',
    priority: 35,
    deepLinkEnabled: true,
  },
  'hybrid-tech': {
    id: 'hybrid-tech',
    title: 'Hybrid Technology',
    description: 'Experience the power of hybrid innovation',
    variant: 'gallery',
    component: HybridTechModal as any,
    imageSrc: (ctx) => ctx.galleryImages?.[2] || ctx.heroImage || '',
    priority: 38,
    deepLinkEnabled: true,
  },
  'interior': {
    id: 'interior',
    title: 'Interior Features',
    description: 'Discover premium comfort and design',
    variant: 'gallery',
    component: InteriorModal as any,
    imageSrc: (ctx) => ctx.galleryImages?.[3] || ctx.heroImage || '',
    priority: 30,
    deepLinkEnabled: true,
  },
  'exterior': {
    id: 'exterior',
    title: 'Exterior Design',
    description: 'Bold styling meets aerodynamic excellence',
    variant: 'gallery',
    component: ExteriorModal as any,
    imageSrc: (ctx) => ctx.galleryImages?.[1] || ctx.heroImage || '',
    priority: 32,
    deepLinkEnabled: true,
  },
  'performance': {
    id: 'performance',
    title: 'Performance',
    description: 'Unleash legendary power and capability',
    variant: 'specs',
    component: PerformanceModal as any,
    imageSrc: (ctx) => ctx.galleryImages?.[2] || ctx.heroImage || '',
    priority: 42,
    deepLinkEnabled: true,
  },
  'technology': {
    id: 'technology',
    title: 'Technology & Connectivity',
    description: 'Advanced tech for modern driving',
    variant: 'gallery',
    component: ConnectivityModal as any,
    imageSrc: (ctx) => ctx.galleryImages?.[1] || ctx.heroImage || '',
    priority: 36,
    deepLinkEnabled: true,
  },
  'offers': {
    id: 'offers',
    title: 'Special Offers',
    description: 'Exclusive deals and promotions',
    variant: 'cta',
    component: OffersModal as any,
    imageSrc: (ctx) => ctx.heroImage || '',
    priority: 25,
    deepLinkEnabled: false,
  },
  'test-drive': {
    id: 'test-drive',
    title: 'Book a Test Drive',
    description: 'Experience your dream car today',
    variant: 'form',
    component: BookTestDrive as any,
    imageSrc: (ctx) => ctx.heroImage || '',
    priority: 50,
    deepLinkEnabled: true,
  },
  'finance': {
    id: 'finance',
    title: 'Finance Calculator',
    description: 'Calculate your monthly payments',
    variant: 'form',
    component: FinanceCalculator as any,
    imageSrc: (ctx) => ctx.heroImage || '',
    priority: 45,
    deepLinkEnabled: true,
  },
  'car-builder': {
    id: 'car-builder',
    title: 'Build Your Car',
    description: 'Customize your perfect vehicle',
    variant: 'wizard',
    component: CarBuilder as any,
    imageSrc: (ctx) => ctx.heroImage || '',
    priority: 60,
    deepLinkEnabled: true,
  },
};
