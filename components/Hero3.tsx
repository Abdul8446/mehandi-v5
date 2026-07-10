'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { ShoppingBag, ArrowRight, Calendar } from 'react-feather';
import { Award, ImageIcon, Sparkles, Star, Users } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface StatItem {
  icon: React.ComponentType<{ size: number; className?: string }>;
  number: string;
  label: string;
}

interface Hero3Props {
  scrollToGallery: () => void;
}

export default function Hero3({ scrollToGallery }: Hero3Props) {
  const router = useRouter();
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  const [activeRipple, setActiveRipple] = useState<string | null>(null);
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setStartAnimation(true);
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  const stats: StatItem[] = [
    { icon: Users, number: '500+', label: 'Happy Clients' },
    { icon: Sparkles, number: '50+', label: 'Designs' },
    { icon: Star, number: '10+', label: 'Artists' },
    { icon: Award, number: '5+', label: 'Awards' },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 70,
        damping: 15,
        mass: 0.8
      }
    }
  };

  const statsContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const statItemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 90,
        damping: 14
      }
    }
  };

  const handleLinkClick = (e: React.MouseEvent, href: string, buttonId: string) => {
    e.preventDefault();

    // Get click position relative to the button
    const rect = e.currentTarget.getBoundingClientRect();
    setTapPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });

    // Set active ripple
    setActiveRipple(buttonId);

    setTimeout(() => {
      setActiveRipple(null);
      router.push(href);
    }, 500); // Match with animation duration
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-12 sm:py-0">
      {/* Background with overlay */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-brown-900/90 via-brown-800/80 to-brown-900/90 z-10"></div>
        <motion.img
          src="https://images.pexels.com/photos/1612513/pexels-photo-1612513.jpeg?auto=compress&cs=tinysrgb&w=1920&q=80"
          alt="Beautiful mehandi design"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1.05 }}
          transition={{
            opacity: { duration: 1.2, ease: 'easeOut' },
            scale: { duration: 25, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }
          }}
          className="w-full h-full object-cover will-change-transform"
          decoding="async"
        />
      </div>

      {/* Floating elements */}
      <div className="absolute inset-0 z-[5]">
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full will-change-transform"
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
          className="absolute top-40 right-20 w-16 h-16 bg-yellow-400/20 rounded-full will-change-transform"
        />
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
          className="absolute bottom-40 left-20 w-12 h-12 bg-white/10 rounded-full will-change-transform"
        />
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 3.2, ease: 'easeInOut' }}
          className="absolute bottom-20 right-10 w-24 h-24 bg-brown-400/20 rounded-full will-change-transform"
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <motion.div
          initial="hidden"
          animate={startAnimation ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-4xl mx-auto text-center text-white"
        >
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 sm:px-6 py-1.5 sm:py-2 mb-6 sm:mb-8 text-xs sm:text-sm"
          >
            <Sparkles size={16} className="text-yellow-400" />
            <span className="font-medium">Premium Henna Experience Since 2020</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            variants={itemVariants}
            className="font-serif text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 leading-tight"
          >
            <span className="block">Discover the</span>
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Art of Mehandi
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-base sm:text-lg md:text-xl text-brown-100 mb-6 sm:mb-8 max-w-md sm:max-w-2xl mx-auto leading-relaxed"
          >
            Premium henna products and professional artist booking – all in one place.
            Create beautiful traditions with authentic, natural henna.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 relative"
          >
            <a
              href="/shop"
              onClick={(e) => handleLinkClick(e, '/shop', 'shop-button')}
              className="group relative overflow-hidden bg-white text-brown-900 px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-2"
            >
              <ShoppingBag size={20} />
              <span>Shop Products</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 group-active:translate-x-1 transition-transform" />

              <AnimatePresence>
                {activeRipple === 'shop-button' && (
                  <motion.span
                    className="absolute bg-black/10 rounded-full"
                    initial={{
                      scale: 0,
                      opacity: 1,
                      x: tapPosition.x,
                      y: tapPosition.y,
                      width: 10,
                      height: 10,
                    }}
                    animate={{
                      scale: 25,
                      opacity: 0,
                      x: tapPosition.x - 5,
                      y: tapPosition.y - 5,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    style={{
                      transformOrigin: 'center',
                    }}
                  />
                )}
              </AnimatePresence>
            </a>

            <a
              href="/booking"
              onClick={(e) => handleLinkClick(e, '/booking', 'booking-button')}
              className="group relative overflow-hidden bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-2"
            >
              <Calendar size={20} />
              <span>Book Artist</span>

              <AnimatePresence>
                {activeRipple === 'booking-button' && (
                  <motion.span
                    className="absolute bg-white/30 rounded-full"
                    initial={{
                      scale: 0,
                      opacity: 1,
                      x: tapPosition.x,
                      y: tapPosition.y,
                      width: 10,
                      height: 10,
                    }}
                    animate={{
                      scale: 25,
                      opacity: 0,
                      x: tapPosition.x - 5,
                      y: tapPosition.y - 5,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                      transformOrigin: 'center',
                    }}
                  />
                )}
              </AnimatePresence>
            </a>
            <a
              // href="/gallery"
              onClick={scrollToGallery}
              className="group relative cursor-pointer overflow-hidden bg-brown-700/80 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full font-semibold text-base sm:text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-2 border border-brown-500/50"
            >
              <ImageIcon size={20} />
              <span>View Gallery</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 group-active:translate-x-1 transition-transform" />
              <AnimatePresence>
                {activeRipple === 'gallery-button' && (
                  <motion.span
                    className="absolute bg-white/20 rounded-full"
                    initial={{
                      scale: 0,
                      opacity: 1,
                      x: tapPosition.x,
                      y: tapPosition.y,
                      width: 10,
                      height: 10,
                    }}
                    animate={{
                      scale: 25,
                      opacity: 0,
                      x: tapPosition.x - 5,
                      y: tapPosition.y - 5,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                    style={{
                      transformOrigin: 'center',
                    }}
                  />
                )}
              </AnimatePresence>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={statsContainerVariants}
            className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6 max-w-sm sm:max-w-2xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={statItemVariants}
                className="text-center"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <stat.icon size={20} className="text-yellow-400" />
                </div>
                <div className="text-xl sm:text-2xl font-bold">{stat.number}</div>
                <div className="text-xs sm:text-sm text-brown-200">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        {/* Desktop: mouse scroll */}
        <div className="hidden sm:flex w-6 h-10 border-2 border-white/30 rounded-full justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-bounce"></div>
        </div>

        {/* Mobile: finger swipe icon */}
        <div className="flex sm:hidden justify-center items-center">
          <Image
            src="/swipe-down.svg"
            alt="Swipe down"
            width={30}
            height={30}
            className="animate-bounce"
          />
        </div>
      </div>
    </section>
  );
};












