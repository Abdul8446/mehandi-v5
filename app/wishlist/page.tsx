'use client'; // Required since we're using hooks and client-side interactivity

import Link from 'next/link';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWishlist } from '../../contexts/WishlistContext';
import { useCart } from '../../contexts/CartContext';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import ProtectedRoute from '@/components/ProtectedRoute';

const WishlistPage = () => {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      ...item,
      quantity: 1
    });
    removeFromWishlist(item._id);
  };

  if (items.length === 0) {
    return (
      <ProtectedRoute>
        <div className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="w-20 h-20 bg-brown-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart size={32} className="text-brown-900" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Your Wishlist is Empty</h1>
              <p className="text-gray-600 mb-6">Save items you love to your wishlist and review them anytime.</p>
              <Button variant='primary' size='lg'>
                  <Link href="/shop" className="inline-flex items-center">
                  Start Shopping
                  </Link>
              </Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">My Wishlist ({items.length} items)</h1>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {items.map(item => (
              <motion.div 
                key={item._id}
                variants={itemVariants}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="relative">
                  <Link href={`/product/${item._id}`}>
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-64 object-cover"
                      width={400}
                      height={256}
                    />
                  </Link>
                  <button 
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50"
                    onClick={() => removeFromWishlist(item._id)}
                  >
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </div>
                
                <div className="p-4">
                  <Link 
                    href={`/product/${item._id}`}
                    className="text-lg font-medium text-gray-900 hover:text-red-900"
                  >
                    {item.name}
                  </Link>
                  <p className="text-red-900 font-semibold mt-2 mb-4">₹{item.price}</p>
                  
                  <Button variant="primary" size="lg" className=" w-full" onClick={() => handleAddToCart(item)}>
                    <ShoppingCart size={18} className="mr-2" />
                    Add to Cart
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default WishlistPage;