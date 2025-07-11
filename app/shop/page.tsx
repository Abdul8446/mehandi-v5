'use client'

import { useState, useEffect, Suspense } from 'react'
import Head from 'next/head';
import ProductCard from '../../components/ProductCard';
// import { Product } from '@/models/Product'
import { Filter, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '@/contexts/ProductContext';
import ShopSkeleton from '@/components/skeleton/ShopSkeleton';
import { useSearchParams } from 'next/navigation';

const Shop = () => (
  <Suspense fallback={<div className="text-center py-12 text-gray-500">Loading...</div>}>
    <ShopContent />
  </Suspense>
);


const ShopContent = () => {
  // const [products, setProducts] = useState<Product[]>([]);
  const { products, setProducts } = useProducts();
  // const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  // const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<string>('featured');
  // Initialize loading to true *only* if products are empty
  const [loading, setLoading] = useState(products.length === 0);
  const searchParams = useSearchParams();
  const rawCategoryParam = searchParams.get('category');
  const categoryParam = rawCategoryParam ? decodeURIComponent(rawCategoryParam) : null;


  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam || null);

  useEffect(() => {
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryParam]);
  
  


    useEffect(() => {
      if (products.length === 0) {
        // If no products, fetch them
        const fetchProducts = async () => {
          try {
            const res = await fetch('/api/products');
            const data = await res.json();
            setProducts(data);
          } catch (error) {
            console.error('Failed to fetch products:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchProducts();
      } else {
        // If products already loaded, no need to load
        setLoading(false);
      }
    }, []);    

  console.log(products, 'products in shop page');

 
  const filteredProducts = products.filter(product => {
    if (product.status !== 'Active') return false;
    if (selectedCategory && product.category !== selectedCategory) return false;
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    return true;
  });

  console.log(filteredProducts, 'filteredProducts');

  console.log(selectedCategory, 'selectedCategory in shop page');

  const testFilter = () => {
    return products.filter(product => {
      console.log('Checking product:', product.name, {
        statusActive: product.status === 'active',
        categoryMatch: !selectedCategory || product.category === selectedCategory,
        priceMatch: product.price >= priceRange[0] && product.price <= priceRange[1]
      });
      return (!selectedCategory || product.category === selectedCategory) && 
            (product.price >= priceRange[0] && product.price <= priceRange[1]);
    });
  };
  console.log('Test filter results:', testFilter());

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    }
  });

  console.log(sortedProducts, 'sortedProducts');

  // const categories = [...new Set(products.map(product => product.status === 'Active'?product.category:null))];
  const categories = [...new Set(products.filter(product => product.status === 'Active').map(product => product.category))];

  console.log(categories, 'categories');

  return (
    <>
      <Head>
        <title>Mehandi Shop | Premium Henna Products</title>
        <meta name="description" content="Discover our premium range of natural henna products and accessories for beautiful designs" />
      </Head>
        <div className="min-h-screen flex flex-col">
          <main className="flex-grow pt-20">
            <div className="bg-amber-800 text-white py-16">
              <div className="container mx-auto px-4 text-center">
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">Our Products</h1>
                <p className="max-w-2xl mx-auto">
                  Discover our premium range of natural henna products and accessories,
                  crafted with care for the most beautiful designs.
                </p>
              </div>
            </div>
            {loading?(
              <ShopSkeleton/>
            ):(
              <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col md:flex-row">
                  {/* Mobile Filter Toggle */}
                  <div className="md:hidden mb-6">
                    <button
                      onClick={() => setShowFilters(!showFilters)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-md text-amber-800"
                    >
                      <Filter size={18} />
                      {showFilters ? 'Hide Filters' : 'Show Filters'}
                    </button>
                  </div>
    
                  {/* Filter Sidebar */}
                  <div className={`md:w-1/4 lg:w-1/5 md:pr-8 ${showFilters ? 'block' : 'hidden md:block'}`}>
                    <div className="sticky top-24">
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
                        <div className="space-y-2">
                          {categories.map(category => (
                            <div key={category} className="flex items-center">
                              <input
                                type="radio"
                                id={category}
                                name="category"
                                className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                                checked={selectedCategory === category}
                                onChange={() => setSelectedCategory(category)}
                              />
                              <label htmlFor={category} className="ml-2 text-sm text-gray-700">{category}</label>
                            </div>
                          ))}
                          <div className="flex items-center mt-2">
                            <input
                              type="radio"
                              id="all-categories"
                              name="category"
                              className="h-4 w-4 text-amber-600 focus:ring-amber-500"
                              checked={selectedCategory === null}
                              onChange={() => setSelectedCategory(null)}
                            />
                            <label htmlFor="all-categories" className="ml-2 text-sm text-gray-700">Show All</label>
                          </div>
                        </div>
                      </div>
    
                      <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Price Range</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600">₹{priceRange[0]}</span>
                            <span className="text-sm text-gray-600">₹{priceRange[1]}</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="10000"
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                            className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      </div>
    
                      <button
                        onClick={() => {
                          setSelectedCategory(null);
                          setPriceRange([0, 10000]);
                        }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md text-sm hover:bg-gray-200 transition-colors"
                      >
                        Clear Filters
                      </button>
                    </div>
                  </div>
    
                  {/* Products Grid */}
                  <div className="md:w-3/4 lg:w-4/5">
                    <div className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-gray-200">
                      <p className="text-gray-600 text-sm mb-4 sm:mb-0">
                        Showing {sortedProducts.length} product(s)
                      </p>
                      <div className="flex items-center">
                        <SlidersHorizontal size={18} className="text-gray-500 mr-2" />
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-amber-500"
                        >
                          <option value="featured">Featured</option>
                          <option value="price-low">Price: Low to High</option>
                          <option value="price-high">Price: High to Low</option>
                          <option value="name">Name</option>
                        </select>
                      </div>
                    </div>
    
                    {loading ? (
                      // <ShopSkeleton/>
                      <div className="text-center py-12 text-gray-500">Loading products...</div>
                    ) : sortedProducts.length === 0 ? (
                      <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">No products match your selected filters.</p>
                        <button
                          onClick={() => {
                            setSelectedCategory(null);
                            setPriceRange([0, 10000]);
                          }}
                          className="text-amber-700 underline"
                        >
                          Clear filters
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedProducts.map(product => (
                          <ProductCard key={product._id} product={product} />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
    </>
  );
};

export default Shop;   
