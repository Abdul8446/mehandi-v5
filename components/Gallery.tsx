'use client';
import React from 'react';


interface VideoGalleryProps {  
    id?: string; // Optional ID for the section
}

export default function VideoGallery({ id }: VideoGalleryProps) {
  // Sample media data - in a real app, this could come from an API or file system
  const mediaItems = [
    {
      id: 1,
      type: 'image',
      src: '/images/gallery/WhatsApp Image 2025-08-01 at 21.10.05_3892ce3a.jpg', // Path to your local video file
    //   title: 'Stunning Bridal Mehandi',
    //   description: 'Learn the secrets behind intricate wedding henna.'
    },
    {
      id: 2,
      type: 'image',
      src: '/images/gallery/WhatsApp Image 2025-08-01 at 21.10.08_8bc01761.jpg', // Path to your local image file
    //   title: 'Intricate Hand Design',
    //   description: 'A look at one of our most popular designs.'
    },
    {
      id: 3,
      type: 'image',
      src: '/images/gallery/WhatsApp Image 2025-08-01 at 21.10.08_f91f999d.jpg',
    //   title: 'How to Make a Henna Cone',
    //   description: 'A step-by-step tutorial on making perfect mehandi cones.'
    },
    {
      id: 4,
      type: 'video',
      src: '/images/gallery/WhatsApp Video 2025-08-01 at 21.10.07_39cb9c85.mp4', // Path to your local video file
      title: 'Eid ul fitr 2025  henna stall at centro mall',
    //   description: 'Simple yet elegant designs for any occasion.'
    },
    {
      id: 5,
      type: 'image',
      src: '/images/gallery/WhatsApp Image 2025-08-01 at 21.10.09_7091c242.jpg',
    //   title: 'Easy 3D Floral Henna Design',
    //   description: 'Create beautiful floral patterns with this easy tutorial.'
    },
    {
      id: 6,
      type: 'image',
      src: '/images/gallery/WhatsApp Image 2025-08-01 at 21.10.09_919916fc.jpg',
    //   title: 'Traditional Mehandi Designs',
    //   description: 'A gallery of timeless and classic henna patterns.'
    },
    {
      id: 7,
      type: 'video',
      src: '/images/gallery/WhatsApp Video 2025-08-01 at 21.10.07_9dc97616.mp4',
      title: 'Henna tutorial: How to make a henna cone',
    //   description: 'A gallery of timeless and classic henna patterns.'
    },
    {
      id: 8,
      type: 'video',
      src: '/images/gallery/WhatsApp Video 2025-08-01 at 21.10.08_1bea6849.mp4',
      title: 'Mehandi competition 2025',
    //   description: 'A gallery of timeless and classic henna patterns.'
    },
    {
      id: 9,
      type: 'image',
      src: '/images/gallery/WhatsApp Image 2025-08-01 at 21.10.09_bef2cfc6.jpg',
    //   title: 'Traditional Mehandi Designs',
    //   description: 'A gallery of timeless and classic henna patterns.'
    },
    {
      id: 10,
      type: 'image',
      src: '/images/gallery/WhatsApp Image 2025-08-01 at 21.10.09_e04d88c6.jpg',
    //   title: 'Traditional Mehandi Designs',
    //   description: 'A gallery of timeless and classic henna patterns.'
    },
    {
      id: 11,
      type: 'image',
      src: '/images/gallery/WhatsApp Image 2025-08-01 at 21.10.10_4654b3a2.jpg',
    //   title: 'Traditional Mehandi Designs',
    //   description: 'A gallery of timeless and classic henna patterns.'
    },
    {
      id: 12,
      type: 'image',
      src: '/images/gallery/WhatsApp Image 2025-08-01 at 21.10.10_ebc16ec4.jpg',
    //   title: 'Traditional Mehandi Designs',
    //   description: 'A gallery of timeless and classic henna patterns.'
    },
    {
      id: 13,
      type: 'image',
      src: '/images/gallery/WhatsApp Image 2025-08-01 at 21.10.11_fe007bb9.jpg',
    //   title: 'Traditional Mehandi Designs',
    //   description: 'A gallery of timeless and classic henna patterns.'
    },
  ];

  return (
    <>
      <style jsx global>{`
        .heading-font {
          font-family: 'Playfair Display', serif;
        }
        .video-scroll-container::-webkit-scrollbar {
          display: none;
        }
        .video-scroll-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <section id='video-gallery' className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center md:text-left mb-12 md:mb-16">
            <h2 className="font-serif text-3xl text-amber-900 leading-tight">
              Unreeling the Magic Behind Mehandi
            </h2>
            <p className="mt-2 text-lg text-gray-600 max-w-3xl">
              A curated collection of our best work and mehandi tutorials.
            </p>
          </div>

          <div className="flex flex-row overflow-x-auto gap-6 pb-6 md:pb-0 video-scroll-container">
            {mediaItems.map((item) => (
              <div 
                key={item.id}
                className="flex-none w-64 bg-[#4A2E20] rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="aspect-[9/16] overflow-hidden relative">
                  {item.type === 'video' ? (
                    <video className="w-full h-full object-cover" controls loop muted autoPlay>
                      <source src={item.src as string} type="video/mp4"/>
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={item.src as string}
                      alt={item?.title}
                      className="w-full h-full object-cover"
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 p-4 h-20 bg-gradient-to-t from-[#4A2E20] via-[#4A2E20]/70 to-transparent text-white">
                    <p className="text-base font-semibold">{item?.title}</p>
                    {/* <p className="text-sm mt-1 opacity-75">{item?.description}</p> */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
