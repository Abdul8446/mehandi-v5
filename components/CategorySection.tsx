'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  image: string;
  description: string;
}

// const categories: Category[] = [
//   {
//     id: 'henna-powders',
//     name: 'Henna Powders',
//     image: 'https://m.media-amazon.com/images/I/51IbikEMEpL._AC_UF350,350_QL80_.jpg',
//     description: 'Premium quality natural henna powders from different regions'
//   },
//   {
//     id: 'ready-cones',
//     name: 'Ready-to-use Cones',
//     image: 'https://images.pexels.com/photos/8472869/pexels-photo-8472869.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//     description: 'Pre-mixed cones for perfect application every time'
//   },
//   {
//     id: 'gift-kits',
//     name: 'Gift Kits',
//     image: 'https://images.pexels.com/photos/6692132/pexels-photo-6692132.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//     description: 'Curated collections for gifting and special occasions'
//   },
//   {
//     id: 'accessories',
//     name: 'Accessories',
//     image: 'https://images.pexels.com/photos/6690924/pexels-photo-6690924.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
//     description: 'Everything you need for perfect henna application'
//   }
// ];

  const categories: Category[] = [
    {
      id: 'henna-powders',
      name: 'Henna Powders',
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


const CategorySection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-amber-900 mb-4">Shop By Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our carefully curated collection of premium henna products
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map(category => (
            <Link 
              key={category.id} 
              href={`/shop?category=${category.name}`}
              className="group block relative overflow-hidden rounded-lg"
            >
              {/* Image */}
              <div className="aspect-square overflow-hidden">
                <Image 
                  src={category.image} 
                  alt={category.name}
                  width={1260}
                  height={750}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 to-transparent flex flex-col justify-end p-6 text-white">
                  <h3 className="text-xl font-medium mb-1">{category.name}</h3>
                  <p className="text-sm text-amber-100 mb-2">{category.description}</p>
                  <span className="inline-block text-sm font-medium border-b-2 border-amber-500 pb-1 opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Explore Collection
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;