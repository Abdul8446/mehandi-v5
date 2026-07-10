'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Play, X, ChevronLeft, ChevronRight, Video, Image as ImageIcon, Loader2 } from 'lucide-react';

interface MediaItem {
  _id: string;
  type: 'image' | 'video';
  src: string;
  title: string;
}

export default function GalleryPage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await fetch('/api/gallery');
        if (res.ok) {
          const data = await res.json();
          setMediaItems(data);
        }
      } catch (err) {
        console.error('Failed to fetch gallery items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  // Filtered list of items
  const filteredItems = mediaItems.filter(
    (item) => filter === 'all' || item.type === filter
  );

  const openLightbox = (id: string) => {
    const index = filteredItems.findIndex((item) => item._id === id);
    if (index !== -1) {
      setLightboxIndex(index);
    }
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const handleNext = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prevIndex) => 
        prevIndex! === filteredItems.length - 1 ? 0 : prevIndex! + 1
      );
    }
  };

  const handlePrev = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((prevIndex) => 
        prevIndex! === 0 ? filteredItems.length - 1 : prevIndex! - 1
      );
    }
  };

  // Keyboard navigation inside lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, filteredItems]);

  const activeMedia = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <div className="min-h-screen bg-amber-50/50 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 border-b border-amber-900/10 pb-8">
          <div>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm font-medium text-amber-800 hover:text-amber-950 mb-3 transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-amber-900 leading-tight">
              Our Latest Works
            </h1>
            <p className="mt-2 text-gray-600 max-w-xl">
              Take a look at our natural henna products in action and browse professional artist applications.
            </p>
          </div>

          {/* Filter Buttons */}
          <div className="flex items-center gap-2 p-1 bg-amber-100/50 backdrop-blur rounded-full self-start md:self-auto border border-amber-200">
            {(['all', 'image', 'video'] as const).map((type) => (
              <button
                key={type}
                onClick={() => {
                  setFilter(type);
                  setLightboxIndex(null);
                }}
                className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium capitalize transition-all duration-300 ${
                  filter === type
                    ? 'bg-amber-800 text-white shadow-sm'
                    : 'text-amber-900/70 hover:text-amber-950 hover:bg-amber-200/40'
                }`}
              >
                {type === 'all' ? 'All Works' : type + 's'}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-amber-800" size={36} />
          </div>
        ) : (
          <motion.div 
            layout
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((item) => (
                <motion.div
                  layout
                  key={item._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="group relative cursor-pointer aspect-[9/16] bg-[#4A2E20] rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
                  onClick={() => openLightbox(item._id)}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full relative">
                      <video className="w-full h-full object-cover pointer-events-none" muted playsInline loop>
                        <source src={item.src} type="video/mp4" />
                      </video>
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transform group-hover:scale-110 transition-all duration-300">
                          <Play size={20} className="fill-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full relative">
                      <Image
                        src={item.src}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        <div className="text-white flex items-center gap-1.5 text-xs">
                          <ImageIcon size={14} />
                          <span>View Photo</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Title Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-[#4A2E20] via-[#4A2E20]/50 to-transparent text-white pt-10">
                    <h3 className="text-xs sm:text-sm font-semibold truncate">{item.title}</h3>
                    <div className="flex items-center gap-1 mt-1 opacity-75">
                      {item.type === 'video' ? (
                        <Video size={10} />
                      ) : (
                        <ImageIcon size={10} />
                      )}
                      <span className="text-[10px] capitalize">{item.type}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-20 text-gray-500">
            No works matching the filters were found.
          </div>
        )}
      </div>

      {/* Lightbox Overlay */}
      <AnimatePresence>
        {activeMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex flex-col justify-between p-4"
          >
            {/* Header controls */}
            <div className="flex items-center justify-between text-white p-2">
              <span className="text-xs sm:text-sm font-medium opacity-80">
                {activeMedia.title} ({lightboxIndex! + 1} / {filteredItems.length})
              </span>
              <button 
                onClick={closeLightbox}
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Main Stage */}
            <div className="flex-grow flex items-center justify-center relative max-h-[80vh]">
              {/* Prev Button */}
              <button
                onClick={handlePrev}
                className="absolute left-2 sm:left-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <ChevronLeft size={24} />
              </button>

              <motion.div
                key={activeMedia._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex items-center justify-center"
              >
                {activeMedia.type === 'video' ? (
                  <video 
                    className="max-w-full max-h-full rounded-lg object-contain" 
                    controls 
                    autoPlay
                    loop
                  >
                    <source src={activeMedia.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <div className="relative w-full h-full max-w-[85vw] max-h-[70vh] sm:max-h-[75vh]">
                    <img
                      src={activeMedia.src}
                      alt={activeMedia.title}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                )}
              </motion.div>

              {/* Next Button */}
              <button
                onClick={handleNext}
                className="absolute right-2 sm:right-4 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
              >
                <ChevronRight size={24} />
              </button>
            </div>

            {/* Footer details */}
            <div className="text-center text-white/60 text-[10px] sm:text-xs pb-4">
              Tip: Use Left and Right arrow keys to navigate, Escape to close.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
