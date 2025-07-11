'use client';

import React, { useEffect } from 'react';
import ProductCard from './ProductCard';
import Link from 'next/link';
import { useProducts } from '@/contexts/ProductContext';


const FeaturedProducts = () => {
  const { products } = useProducts();
  
  const featuredProducts = products
      .filter(product => product.isFeatured && product.status === 'Active')
      .slice(0, 4); // show only 4

  console.log(products, 'featuredProducts');    

  return (
    <section className="py-12 bg-amber-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif text-amber-900 mb-4">Our Featured Products</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover our hand-selected premium henna products, crafted with the finest natural ingredients
            for the most beautiful and long-lasting designs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            href="/shop" 
            className="inline-block px-6 py-3 bg-amber-800 text-white rounded-md hover:bg-amber-700 transition-colors"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
