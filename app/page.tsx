// app/page.tsx
'use client';
import React from 'react';
import Footer from '../components/Footer';
import CategorySection from '../components/CategorySection';
import FeaturedProducts from '../components/FeaturedProducts';
import ArtistShowcase from '../components/ArtistShowcase';
import TestimonialSection from '../components/TestimonialSection';
import Hero3 from '@/components/Hero3';
import VideoGallery from '@/components/Gallery';

export default function HomePage() {
  const scrollToGallery = () => {
    const galleryElement = document.getElementById('video-gallery');
    if (galleryElement) {
      galleryElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Hero3 scrollToGallery={scrollToGallery} />
        <CategorySection />
        <FeaturedProducts />
        <ArtistShowcase />
        <VideoGallery id="video-gallery" />
        <TestimonialSection />
      </main>
    </div>
  );
}