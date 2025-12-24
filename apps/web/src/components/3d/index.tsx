'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import 3D components with no SSR
export const Hero3D = dynamic(() => import('./Hero3D'), {
  ssr: false,
  loading: () => null,
});

export const Gallery3D = dynamic(() => import('./Gallery3D'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-mardo-dark/50 animate-pulse rounded-xl" />,
});

export const MenuSpotlight3D = dynamic(() => import('./MenuSpotlight3D'), {
  ssr: false,
  loading: () => <div className="h-[300px] w-full bg-mardo-dark/20 animate-pulse rounded-xl" />,
});
