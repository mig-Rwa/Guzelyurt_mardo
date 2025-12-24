import Header from '@/components/sections/Header';
import Hero from '@/components/sections/Hero';
import DailySpecials from '@/components/sections/DailySpecials';
import Menu from '@/components/sections/Menu';
import LoyaltyProgram from '@/components/sections/LoyaltyProgram';
import About from '@/components/sections/About';
import FortuneTelling from '@/components/sections/FortuneTelling';
import Testimonials from '@/components/sections/Testimonials';
import Reservation from '@/components/sections/Reservation';
import Gallery from '@/components/sections/Gallery';
import Newsletter from '@/components/sections/Newsletter';
import Contact from '@/components/sections/Contact';
import Footer from '@/components/sections/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import WhatsAppButton from '@/components/sections/WhatsAppButton';

export default function Home() {
  return (
    <div className="min-h-screen bg-mardo-dark">
      <Header />
      <main>
        <Hero />
        <DailySpecials />
        <Menu />
        <LoyaltyProgram />
        <About />
        <FortuneTelling />
        <Testimonials />
        <Reservation />
        <Gallery />
        <Newsletter />
        <Contact />
      </main>
      <Footer />
      <CartDrawer />
      <WhatsAppButton />
    </div>
  );
}
