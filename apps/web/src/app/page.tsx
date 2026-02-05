import { Suspense, lazy } from 'react';
import Header from '@/components/sections/Header';
import Hero from '@/components/sections/Hero';
import DailySpecials from '@/components/sections/DailySpecials';

// Lazy load below-the-fold sections for faster initial render
const Menu = lazy(() => import('@/components/sections/Menu'));
const LoyaltyProgram = lazy(() => import('@/components/sections/LoyaltyProgram'));
const About = lazy(() => import('@/components/sections/About'));
const FortuneTelling = lazy(() => import('@/components/sections/FortuneTelling'));
const PhotoGallery = lazy(() => import('@/components/sections/PhotoGallery'));
const Testimonials = lazy(() => import('@/components/sections/Testimonials'));
const Reservation = lazy(() => import('@/components/sections/Reservation'));
const Gallery = lazy(() => import('@/components/sections/Gallery'));
const Newsletter = lazy(() => import('@/components/sections/Newsletter'));
const Contact = lazy(() => import('@/components/sections/Contact'));
const Footer = lazy(() => import('@/components/sections/Footer'));
const CartDrawer = lazy(() => import('@/components/cart/CartDrawer'));
const WhatsAppButton = lazy(() => import('@/components/sections/WhatsAppButton'));

// Loading skeleton for sections
function SectionSkeleton() {
  return <div className="py-20 animate-pulse bg-mardo-cream/50" />;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-mardo-dark">
      <Header />
      <main>
        <Hero />
        <DailySpecials />
        <Suspense fallback={<SectionSkeleton />}>
          <Menu />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <LoyaltyProgram />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <FortuneTelling />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <PhotoGallery />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>          <PhotoGallery />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>          <Testimonials />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Reservation />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Gallery />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Newsletter />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Contact />
        </Suspense>
      </main>
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      <Suspense fallback={null}>
        <CartDrawer />
      </Suspense>
      <Suspense fallback={null}>
        <WhatsAppButton />
      </Suspense>
    </div>
  );
}
