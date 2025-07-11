'use client';

import React from 'react';
import Button from './ui/Button';
import Image from 'next/image';
import Link from 'next/link';

const ArtistShowcase = () => {
  return (
    <section className="py-16 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <div className="relative">
            <Image
              src="https://images.pexels.com/photos/1081997/pexels-photo-1081997.jpeg"
              alt="Mehandi Artist at work"
              width={1260}
              height={750}
              className="rounded-lg shadow-lg w-full h-auto"
              priority
            />
            <div className="absolute -bottom-6 -right-6 w-40 h-40 rounded-full border-8 border-white overflow-hidden shadow-lg hidden md:block">
              <Image
                src="https://images.pexels.com/photos/3014853/pexels-photo-3014853.jpeg"
                alt="Mehandi design closeup"
                width={500}
                height={500}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Content Side */}
          <div>
            <span className="text-green-700 font-medium text-sm mb-2 block">PROFESSIONAL SERVICES</span>
            <h2 className="text-3xl font-serif text-amber-900 mb-6">Book a Professional Mehandi Artist</h2>
            <p className="text-gray-700 mb-6">
              Our team of skilled artists brings years of experience and artistic excellence to create stunning designs for your special occasions. Whether it's a wedding, engagement, festival, or any celebration, we ensure beautiful, long-lasting mehandi designs.
            </p>
            
            <ul className="space-y-4 mb-8">
              {[
                'Traditional and modern design expertise',
                'Premium quality henna for rich color',
                'Bridal packages for the complete experience',
                'Group bookings for parties and events',
                'Flexible scheduling to suit your needs'
              ].map((point, index) => (
                <li key={index} className="flex items-start">
                  <svg className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            
            <Button variant="secondary" size="lg">
              <Link href="/booking">
              Book an Appointment
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtistShowcase;