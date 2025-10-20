import { ComponentType } from 'react';
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
const SafetySuiteModal = () => import('@/components/vehicle-details/modals/SafetySuiteModal').then(m => ({ default: m.default }));
const ConnectivityModal = () => import('@/components/vehicle-details/modals/ConnectivityModal').then(m => ({ default: m.default }));
const HybridTechModal = () => import('@/components/vehicle-details/modals/HybridTechModal').then(m => ({ default: m.default }));
const InteriorModal = () => import('@/components/vehicle-details/modals/InteriorModal').then(m => ({ default: m.default }));
const OffersModal = () => import('@/components/home/OffersModal').then(m => ({ default: m.default }));
const BookTestDrive = () => import('@/components/vehicle-details/BookTestDrive').then(m => ({ default: m.default }));
const FinanceCalculator = () => import('@/components/vehicle-details/FinanceCalculator').then(m => ({ default: m.default }));
const CarBuilder = () => import('@/components/vehicle-details/CarBuilder').then(m => ({ default: m.default }));

export const modalRegistry: Record<string, ModalEntry> = {
  'safety-suite': {
    id: 'safety-suite',
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
