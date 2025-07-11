
// app/page.tsx

import React from 'react';
import Footer from '../components/Footer';
// import AdBanner from '../components/AdBanner';
import CategorySection from '../components/CategorySection';
import FeaturedProducts from '../components/FeaturedProducts';
import ArtistShowcase from '../components/ArtistShowcase';
import TestimonialSection from '../components/TestimonialSection';
import Hero3 from '@/components/Hero3';
// import BlogSection from '../components/BlogSection';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <main className="flex-grow">
      {/* <div className="bg-avocado-100 text-amber-600 p-4">Tailwind Test</div> */}
        {/* <AdBanner /> */}
        <Hero3/>
        <CategorySection />
        <FeaturedProducts />
        <ArtistShowcase />
        <TestimonialSection />
        {/* <BlogSection /> */}
      </main>
      {/* <Footer /> */}
    </div>
  );
}

