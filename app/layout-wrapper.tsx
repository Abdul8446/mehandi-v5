'use client';

import { usePathname } from 'next/navigation';
import Footer from '@/components/Footer';
import Header3 from '@/components/Header3';
import { useEffect, useState } from 'react';
import { useProducts } from '@/contexts/ProductContext';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
  const { setProducts } = useProducts()

   // --- Fetch products on mount ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Replace with your actual API endpoint
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.products || data); // adapt to your API response
      } catch (err) {
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      {!isAdmin && <Header3 />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}
