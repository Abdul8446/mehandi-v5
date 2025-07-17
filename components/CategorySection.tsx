'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}

const categories: Category[] = [
  {
    id: 'hair-products',
    name: 'Hair Products',
    image: 'https://m.media-amazon.com/images/I/51IbikEMEpL._AC_UF350,350_QL80_.jpg',
    description: 'Premium quality natural henna powders from different regions'
  },
  {
    id: 'ready-cones',
    name: 'Mehandi Cones',
    image: 'https://i.pinimg.com/736x/3f/20/23/3f202389a43470f64dfa81cb34bb9531.jpg',
    description: 'Pre-mixed cones for perfect application every time'
  },
  {
    id: 'bridal-essentials',
    name: 'Bridal Essentials',
    image: 'https://img3.exportersindia.com/product_images/bc-small/2019/2/6133967/whatsapp-image-2018-07-02-at-4-05-19-pm-1--1549299281.jpeg',
    description: 'Everything you need for bridal mehndi — from cones to after-care'
  },
  {
    id: 'stencils-practice',
    name: 'Stencils and Practice',
    image: 'https://lifeline-foundation.org/wp-content/uploads/2024/11/DSC_2826-scaled.jpg',
    description: 'Stencils, books, and tools to improve your mehndi skills'
  }
];

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      // delayChildren: 0.3
    }
  },
};

const itemVariants = {
  hidden: { y: -8, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    }
  }
};

const CategorySection = () => {
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (isAnimating) return;
    
    setIsAnimating(true);
    
    // Wait for animations to complete (300ms)
    setTimeout(() => {
      router.push(href);
      setIsAnimating(false);
    }, 500);
  };
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-serif text-amber-900 mb-4">Shop By Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our carefully curated collection of premium henna products
          </p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {categories.map((category) => (
            <motion.div 
              key={category.id}
              variants={itemVariants}
              className="group block relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all ease-in duration-300"
              whileTap={{ scale: 0.98 }} // Add a slight tap effect
            >
              <div 
                className="relative block"
                onClick={(e) => handleClick(e, `/shop?category=${category.name}`)}
              >
                {/* Image with tap/hover zoom */}
                <motion.div 
                  className="aspect-square overflow-hidden"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 1.05 }} // Same as hover for mobile
                >
                  <Image 
                    src={category.image} 
                    alt={category.name}
                    width={1260}
                    height={750}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 group-active:scale-110"
                  />
                </motion.div>
                
                {/* Overlay with tap/hover effects */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-amber-900/70 to-transparent flex flex-col justify-end p-6 text-white"
                  initial={false}
                  animate={{
                    '--overlay-opacity': ['group-hover:opacity-100', 'group-active:opacity-100'],
                    '--text-translate': ['group-hover:translate-y-0', 'group-active:translate-y-0']
                  }}
                >
                  <h3 className="text-xl font-medium mb-1">
                    {category.name}
                  </h3>
                  <p className="text-sm text-amber-100 mb-2">
                    {category.description}
                  </p>
                  <motion.span 
                    className="inline-block text-sm font-medium border-b-2 border-amber-500 pb-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 group-active:opacity-100 group-active:translate-y-0 transition-all duration-300"
                  >
                    Explore Collection
                  </motion.span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategorySection;


