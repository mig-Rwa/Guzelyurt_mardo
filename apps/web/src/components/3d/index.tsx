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

export const Fortune3D = dynamic(() => import('./Fortune3D'), {
  ssr: false,
  loading: () => <div className="h-[200px] w-[200px] bg-mardo-purple/10 animate-pulse rounded-full" />,
});

export const Loyalty3D = dynamic(() => import('./Loyalty3D'), {
  ssr: false,
  loading: () => <div className="h-[180px] w-full max-w-[350px] bg-mardo-dark/20 animate-pulse rounded-xl" />,
});

export const Newsletter3D = dynamic(() => import('./Newsletter3D'), {
  ssr: false,
  loading: () => <div className="h-[160px] w-[160px] bg-mardo-dark/10 animate-pulse rounded-full" />,
});
