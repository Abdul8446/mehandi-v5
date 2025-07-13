'use client';

import React, { useState, useRef } from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import Image from 'next/image';
import { IProduct } from '@/models/Product';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';  

interface ProductCardProps {
  product: IProduct;   
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const router = useRouter();
  const { addToCart, isLoading } = useCart();
  const { isAuthenticated } = useAuth();
  const { 
    items: wishlistItems, 
    isInWishlist, 
    addToWishlist, 
    removeFromWishlist, 
    isLoading: isWishlistLoading 
  } = useWishlist();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please log in to add items to your cart');
      return;
    }

    if (product.inStock) {
      try {
        await addToCart({
          _id: product._id,
          name: product.name,
          category: product.category,
          price: product.price,
          image: product.images[0],
          weight: product.specifications?.weight || 0,
          quantity: 1
        });
        toast.success(`${product.name} added to cart`);
      } catch (error: any) {
        console.error(error.message); // Or show a toast notification
      }
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please log in to manage your wishlist');
      return;
    }

    try {
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id);
      } else {
        addToWishlist({
          _id: product._id,
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0],
        });
      }
    } catch (error) {
      toast.error('Failed to update wishlist');
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') || 
      target.closest('.no-redirect') ||
      target.tagName === 'BUTTON' ||
      target.closest('.absolute')
    ) {
      return;
    }
    
    const rect = e.currentTarget.getBoundingClientRect();
    setTapPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    setIsTapped(true);
    setTimeout(() => {
      setIsTapped(false);
      router.push(`/product/${encodeURIComponent(product.slug)}`);
    }, 500);
  };

  const cardVariants = {
    initial: { scale: 1, boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)' },
    hover: { 
      scale: 1.02, 
      boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
      transition: { duration: 0.3 }
    },
    tap: { 
      scale: 0.98,
      transition: { duration: 0.2 }
    }
  };

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const priceVariants = {
    hover: { 
      color: '#b45309',
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className='relative'>
      <motion.div
        ref={cardRef}
        className="relative flex flex-col h-full overflow-hidden rounded-lg bg-white cursor-pointer"
        initial="initial"
        whileHover={!isMobile ? "hover" : {}}
        whileTap="tap"
        variants={cardVariants}
        onClick={handleCardClick}
        onHoverStart={() => !isMobile && setIsHovered(true)}
        onHoverEnd={() => !isMobile && setIsHovered(false)}
      >
        {/* Labels with animation */}
        <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
          <AnimatePresence>
            {product.isFeatured && (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded"
              >
                Featured
              </motion.span>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {product.discount > 0 && (
              <motion.span
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded"
              >
                Sale
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Image with parallax effect */}
        <motion.div 
          className="relative overflow-hidden aspect-square bg-gray-100"
          whileHover={!isMobile ? { scale: 1.05 } : {}}
          transition={{ duration: 0.3 }}
        >
          {imageError ? (
            <div className="h-auto w-full rounded-t-md animate-pulse bg-gray-400" />
          ) : (
            <motion.div
              initial={{ scale: 1 }}
              animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Image
                src={product.images[0]}
                alt={product.name}
                width={500}
                height={500}
                className="object-cover w-full h-full"
                onError={() => setImageError(true)}
              />
            </motion.div>
          )}

          {/* Stock status overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">
                Out of Stock
              </span>
            </div>
          )}
        </motion.div>

        {/* Content */}
        <div className="flex flex-col flex-grow p-4">
          {/* Rating with animation */}
          <motion.div 
            className="flex items-center mb-1"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex text-amber-400">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  size={14}
                  fill={
                    product.rating && star <= Math.floor(product.rating)
                      ? '#f59e0b'
                      : '#d1d5db'
                  }
                  className={
                    product.rating && star <= product.rating
                      ? ''
                      : 'text-gray-300'
                  }
                />
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              ({product.reviewsCount})
            </span>
          </motion.div>

          {/* Title and Category */}
          <motion.h3 
            className="text-sm font-medium text-gray-900 mb-1"
            variants={priceVariants}
            whileHover="hover"
          >
            {product.name}
          </motion.h3>
          <p className="text-xs text-gray-500">{product.category}</p>

          {/* Price and Add to Cart */}
          <motion.div 
            className="flex items-center justify-between mt-4"
            layout
          >
            <motion.div layout>
              {product?.discount > 0 ? (
                <div className="flex items-center">
                  <motion.span 
                    className="text-lg font-bold text-amber-700"
                    variants={priceVariants}
                    whileHover="hover"
                  >
                    ₹{product.price}
                  </motion.span>
                  <motion.span 
                    className="ml-2 text-sm text-gray-500 line-through"
                    variants={priceVariants}
                    whileHover="hover"
                  >
                    ₹{product.originalPrice}
                  </motion.span>
                </div>
              ) : (
                <motion.span 
                  className="text-lg font-bold text-amber-700"
                  variants={priceVariants}
                  whileHover="hover"
                >
                  ₹{product.price}
                </motion.span>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Mobile tap feedback overlay with spreading animation */}
        {/* {isMobile && ( */}
          <AnimatePresence>
            {isTapped && (
              <motion.div
                className="absolute inset-0 pointer-events-none overflow-hidden z-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="absolute bg-black/20 rounded-full"
                  style={{
                    left: tapPosition.x,
                    top: tapPosition.y,
                    width: '5px',
                    height: '5px',
                    transform: 'translate(-50%, -50%)',
                    transformOrigin: 'center'
                  }}
                  initial={{ 
                    scale: 1,
                    opacity: 0.8,
                  }}
                  animate={{ 
                    scale: 200,
                    opacity: 0,
                  }}
                  transition={{ 
                    duration: 0.5,   
                    ease: 'easeOut'   
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        {/* )} */}
      </motion.div>

      {/* Wishlist button with animation */}
      <motion.button
        onClick={handleWishlist}
        className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md no-redirect"
        whileHover={{ scale: 1.1, backgroundColor: '#fffbeb' }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Heart
          size={16}
          className={
            isInWishlist(product._id)
              ? 'text-amber-600 fill-amber-600'
              : 'text-gray-700'
          }
        />
      </motion.button>
    
      {/* Add to Cart button */}
      <motion.button
        onClick={(e) => {
          e.stopPropagation();
          handleAddToCart(e);
        }}
        disabled={!product.inStock}
        className={`flex absolute bottom-3 right-3 items-center justify-center px-3 py-2 rounded-md text-sm no-redirect ${
          product.inStock
            ? 'bg-amber-600 text-white hover:bg-amber-700'
            : 'bg-gray-200 text-gray-500 cursor-not-allowed'
        }`}
        variants={buttonVariants}
        whileHover={!isMobile ? "hover" : {}}
        whileTap="tap"
      >
        <ShoppingCart size={16} className="mr-1" />
        {product.inStock ? 'Add' : 'Sold Out'}
      </motion.button>  
    </div>
  );
};

export default ProductCard;