// 'use client'

// import React, { useEffect, useState } from 'react';
// import { useParams } from 'next/navigation';
// import Link from 'next/link';
// import Image from 'next/image';
// import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, ChevronRight, Minus, Plus } from 'lucide-react';
// import { useCart } from '@/contexts/CartContext';
// import { useWishlist } from '@/contexts/WishlistContext';
// import { useProducts } from '@/contexts/ProductContext';
// import { IProduct } from '@/models/Product';
// import ProductDetailSkeleton from '@/components/skeleton/ProductDetailSkeleton';
// import Button from '@/components/ui/Button';
// import toast from 'react-hot-toast';
// import { useAuth } from '@/contexts/AuthContext';

// const ProductDetailPage = () => {
//   const { slug } = useParams() as { slug: string };;
//   const [quantity, setQuantity] = useState(1);
//   const [activeImage, setActiveImage] = useState(0);
//   const [activeTab, setActiveTab] = useState('description');
//   const [imageError, setImageError] = useState(false)
//   const [thumbnailErrors, setThumbnailErrors] = useState<{ [key: number]: boolean }>({});
//   const {isAuthenticated} = useAuth();

//   const handleThumbnailError = (index: number) => {
//     setThumbnailErrors(prev => ({ ...prev, [index]: true }));
//   };

  
//   const { addToCart } = useCart();
//   const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
//   const { products } = useProducts();
//   console.log(slug)
//   console.log(products)

//   useEffect(() => {
//     // Reset imageError when the activeImage changes
//     setImageError(false);
//   }, [activeImage]);    

//   // Find the product by slug from the ProductContext
//   const product = products.find(p => p.slug === slug);

//   if (!product) {
//     return <ProductDetailSkeleton/>
//   }

//   const handleQuantityChange = (value: number) => {
//     if (value < 1) return;
//     setQuantity(value);
//   };

//   const handleAddToCart = async (e: React.MouseEvent) => {
//     e.stopPropagation();

//     if (!isAuthenticated) {
//       toast.error('Please log in to add items to your cart');
//       return;
//     }

//     if (product.inStock) {
//       try {
//         await addToCart({
//           _id: product._id,
//           name: product.name,
//           category: product.category,
//           price: product.price,
//           image: product.images[0],
//           weight: product.specifications?.weight || 0,
//           quantity: quantity
//         });
//         toast.success(`${product.name} added to cart`);
//       } catch (error: any) {
//         console.error(error.message); // Or show a toast notification
//       }
//     }
//   };

//   const handleWishlist = () => {
//     if (isInWishlist(product._id)) {
//       removeFromWishlist(product._id);
//     } else {
//       addToWishlist({
//         _id: product._id,
//         productId: product._id,
//         name: product.name,
//         price: product.price,
//         image: product.images[0]
//       });
//     }
//   };

//   // Format date for reviews
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     });
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen py-20">
//       <div className="container mx-auto px-4">
//         {/* Breadcrumb */}
//         <div className="flex items-center text-sm text-gray-500 mb-6">
//           <Link href="/" className="hover:text-red-900">Home</Link>
//           <ChevronRight size={16} className="mx-1" />
//           <Link href="/shop" className="hover:text-red-900">Shop</Link>
//           <ChevronRight size={16} className="mx-1" />
//           <Link href={`/shop?category=${product.category}`} className="hover:text-red-900">{product.category}</Link>
//           <ChevronRight size={16} className="mx-1" />
//           <span className="text-gray-700">{product.name}</span>
//         </div>
        
//         {/* Product Details */}
//         <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
//             {/* Product Images */}
//             <div>
//               <div className="mb-4 overflow-hidden bg-black rounded-lg">
//               {imageError?(
//                 <div className="h-96 w-full rounded-md animate-pulse bg-gray-400" />
//               ):(
//                 <img 
//                   src={product.images[activeImage]} 
//                   alt={product.name} 
//                   className="w-full h-[30rem] rounded-md object-cover"
//                   onError={() => {
//                     setImageError(true);
//                   }}
//                 />
//               )}
//               </div>
//               <div className="flex space-x-2">
//                 {product.images.map((image: string, index: number) => (
//                   <button 
//                     key={index}
//                     className={`w-20 h-20 rounded-md overflow-hidden ${activeImage === index ? 'ring-2 ring-red-900' : 'opacity-70'}`}
//                     onClick={() => setActiveImage(index)}
//                   >
//                     {thumbnailErrors[index] ? (
//                       <div className="w-full h-full bg-gray-400 animate-pulse" />
//                     ) : (
//                       <img 
//                         src={image} 
//                         alt={`${product.name} - view ${index + 1}`} 
//                         className="w-full h-full object-cover"
//                         onError={() => handleThumbnailError(index)}
//                       />
//                     )}
//                     {/* <img 
//                       src={image} 
//                       alt={`${product.name} - view ${index + 1}`} 
//                       className="w-full h-full object-cover"
//                     /> */}
//                   </button>
//                 ))}
//               </div>
//             </div>
            
//             {/* Product Info */}
//             <div>
//               <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
              
//               {/* Price display with original price if discounted */}
//               {product.originalPrice && product.originalPrice > product.price ? (
//                 <div className="flex items-center mb-4">
//                   <div className="text-2xl font-bold text-red-900 mr-3">₹{product.price}</div>
//                   <div className="text-lg text-gray-500 line-through">₹{product.originalPrice}</div>
//                 </div>
//               ) : (
//                 <div className="text-2xl font-bold text-red-900 mb-4">₹{product.price}</div>
//               )}
              
//               {/* Rating */}
//               <div className="flex items-center mb-4">
//                 <div className="flex text-yellow-400">
//                   {[...Array(5)].map((_, i) => (
//                     <Star 
//                       key={i} 
//                       size={18} 
//                       fill={i < Math.floor(product.rating) ? "#facc15" : "#d1d5db"} 
//                       className={i < Math.floor(product.rating) ? "" : "text-gray-300"} 
//                     />
//                   ))}
//                 </div>
//                 <span className="ml-2 text-sm text-gray-600">
//                   {product.rating && product.rating.toFixed(1)} ({product?.reviewsCount} reviews)
//                 </span>
//               </div>
              
//               <p className="text-gray-600 mb-6">{product.description}</p>
              
//               {/* Stock information */}
//               {product.stock && (
//                 <div className="mb-4">
//                   <span className="text-sm font-medium text-gray-700">
//                     {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
//                   </span>
//                 </div>
//               )}
              
//               {/* Quantity Selector */}
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
//                 <div className="flex items-center">
//                   <button 
//                     className="w-10 h-10 rounded-l-md border border-gray-300 flex items-center justify-center hover:bg-gray-100"
//                     onClick={() => handleQuantityChange(quantity - 1)}
//                   >
//                     <Minus size={16} />
//                   </button>
//                   <input 
//                     type="number" 
//                     min="1" 
//                     max={product.stock || undefined}
//                     value={quantity} 
//                     onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
//                     className="w-16 h-10 border-t border-b border-gray-300 text-center focus:outline-none"
//                   />
//                   <button 
//                     className="w-10 h-10 rounded-r-md border border-gray-300 flex items-center justify-center hover:bg-gray-100"
//                     onClick={() => handleQuantityChange(quantity + 1)}
//                     disabled={product.stock ? quantity >= product.stock : false}
//                   >
//                     <Plus size={16} />
//                   </button>
//                 </div>
//               </div>
              
//               {/* Action Buttons */}
//               <div className="flex space-x-4 mb-6">
//                 <Button 
//                   variant="primary"
//                   className={`flex-1 btn-primary flex items-center justify-center `}
//                   onClick={handleAddToCart}
//                   disabled={!product.inStock || (product.stock ? product.stock <= 0 : false)}
//                 >
//                   <ShoppingCart size={18} className="mr-2" />
//                   {product.inStock ? 'Add to Cart' : 'Out of Stock'}
//                 </Button>
//                 <button 
//                   className="w-12 h-12 border border-red-900 rounded-md flex items-center justify-center hover:bg-red-50"
//                   onClick={handleWishlist}
//                 >
//                   <Heart 
//                     size={18} 
//                     className={isInWishlist(product._id) ? 'text-red-600 fill-red-600' : 'text-red-900'} 
//                   />
//                 </button>
//               </div>
              
//               {/* Product Meta */}
//               <div className="border-t border-gray-200 pt-4">
//                 <div className="flex items-center text-sm text-gray-600 mb-2">
//                   <span className="font-medium mr-2">SKU:</span>
//                   <span>{product.sku}</span>
//                 </div>
//                 <div className="flex items-center text-sm text-gray-600 mb-2">
//                   <span className="font-medium mr-2">Category:</span>
//                   <Link href={`/shop?category=${product.category}`} className="hover:text-red-900">
//                     {product.category}
//                   </Link>
//                 </div>
//                 {product.tags && product.tags.length > 0 && (
//                   <div className="flex items-center text-sm text-gray-600 mb-2">
//                     <span className="font-medium mr-2">Tags:</span>
//                     <div className="flex flex-wrap gap-1">
//                       {product.tags.map((tag: string, index: number )=> (
//                         <Link     
//                           key={tag} 
//                           href={`/shop?tag=${tag}`}
//                           className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 hover:text-red-900"
//                         >
//                           {tag}
//                         </Link>
//                       ))}
//                     </div>
//                   </div>
//                 )}
//               </div>
              
//               {/* Shipping Info */}
//               <div className="grid grid-cols-3 gap-4 mt-6">
//                 <div className="flex flex-col items-center text-center p-3 border border-gray-200 rounded-md">
//                   <Truck size={20} className="text-red-900 mb-2" />
//                   <span className="text-sm">Free Shipping</span>
//                   <span className="text-xs text-gray-500">On orders over ₹699</span>
//                 </div>
//                 <div className="flex flex-col items-center text-center p-3 border border-gray-200 rounded-md">
//                   <Shield size={20} className="text-red-900 mb-2" />
//                   <span className="text-sm">Secure Payment</span>
//                   <span className="text-xs text-gray-500">100% secure checkout</span>
//                 </div>
//                 <div className="flex flex-col items-center text-center p-3 border border-gray-200 rounded-md">
//                   <RotateCcw size={20} className="text-red-900 mb-2" />
//                   <span className="text-sm">Easy Returns</span>
//                   <span className="text-xs text-gray-500">within 2 days of delivery</span>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           {/* Product Tabs */}
//           <div className="border-t border-gray-200">
//             <div className="flex border-b border-gray-200">
//               <button 
//                 className={`px-6 py-3 text-sm font-medium ${activeTab === 'description' ? 'border-b-2 border-red-900 text-red-900' : 'text-gray-600 hover:text-red-900'}`}
//                 onClick={() => setActiveTab('description')}
//               >
//                 Description
//               </button>
//               <button 
//                 className={`px-6 py-3 text-sm font-medium ${activeTab === 'specifications' ? 'border-b-2 border-red-900 text-red-900' : 'text-gray-600 hover:text-red-900'}`}
//                 onClick={() => setActiveTab('specifications')}
//               >
//                 Specifications
//               </button>
//               <button 
//                 className={`px-6 py-3 text-sm font-medium ${activeTab === 'reviews' ? 'border-b-2 border-red-900 text-red-900' : 'text-gray-600 hover:text-red-900'}`}
//                 onClick={() => setActiveTab('reviews')}
//               >
//                 Reviews ({product?.reviewsCount})
//               </button>
//             </div>
            
//             <div className="p-6">
//               {activeTab === 'description' && (
//                 <div>
//                   <p className="text-gray-700 mb-4">{product.description}</p>
//                   {product.features && product.features.length > 0 && (
//                     <>
//                       <h3 className="font-semibold text-lg mb-2">Features:</h3>
//                       <ul className="list-disc pl-5 space-y-1 text-gray-700">
//                         {product.features.map((feature: string, index: number) => (
//                           <li key={index}>{feature}</li>
//                         ))}
//                       </ul>
//                     </>
//                   )}
//                 </div>
//               )}
              
//               {activeTab === 'specifications' && product.specifications && (
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <tbody className="divide-y divide-gray-200">
//                       {Object.entries(product.specifications).map(([key, value]) => (
//                         <tr key={key}>
//                           <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 w-1/3">{key}</td>
//                           <td className="px-4 py-3 text-sm text-gray-700">{String(value)}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
              
//               {activeTab === 'reviews' && (
//                 <div>
//                   <div className="mb-6">
//                     <div className="flex items-center mb-4">
//                       <div className="flex text-yellow-400 mr-2">
//                         {[...Array(5)].map((_, i) => (
//                           <Star 
//                             key={i} 
//                             size={24} 
//                             fill={i < Math.floor(product.rating) ? "#facc15" : "#d1d5db"} 
//                             className={i < Math.floor(product.rating) ? "" : "text-gray-300"} 
//                           />
//                         ))}
//                       </div>
//                       <span className="text-2xl font-bold">{product.rating && product.rating.toFixed(1)}</span>
//                       <span className="text-gray-600 ml-2">based on {product?.reviewsCount} reviews</span>
//                     </div>
//                     <Link href="#write-review" className="btn-primary inline-block">Write a Review</Link>
//                   </div>
                  
//                   {product.reviews && product.reviews.length > 0 ? (
//                     <div className="space-y-6">
//                       {product.reviews.map((review:any) => (
//                         <div key={review.userId} className="border-b border-gray-200 pb-6">
//                           <div className="flex items-start">
//                             <img 
//                               src={review.avatar} 
//                               alt={review.user} 
//                               className="w-10 h-10 rounded-full mr-4"
//                             />
//                             <div className="flex-1">
//                               <div className="flex items-center mb-1">
//                                 <h4 className="font-medium mr-2">{review.user}</h4>
//                                 <span className="text-xs text-gray-500">
//                                   {formatDate(review.date)}
//                                 </span>
//                               </div>
//                               <div className="flex text-yellow-400 mb-2">
//                                 {[...Array(5)].map((_, i) => (
//                                   <Star 
//                                     key={i} 
//                                     size={16} 
//                                     fill={i < review.rating ? "#facc15" : "#d1d5db"} 
//                                     className={i < review.rating ? "" : "text-gray-300"} 
//                                   />
//                                 ))}
//                               </div>
//                               <p className="text-gray-700">{review.comment}</p>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetailPage;


'use client'

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Star, Heart, ShoppingCart, Truck, Shield, RotateCcw, ChevronRight, Minus, Plus } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useProducts } from '@/contexts/ProductContext';
import { IProduct } from '@/models/Product';
import ProductDetailSkeleton from '@/components/skeleton/ProductDetailSkeleton';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
// import { useSession } from 'next-auth/react';

const ProductDetailPage = () => {
  const { slug } = useParams() as { slug: string };
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState('description');
  const [imageError, setImageError] = useState(false);
  const [thumbnailErrors, setThumbnailErrors] = useState<{ [key: number]: boolean }>({});
  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewsCount, setReviewsCount] = useState(0);
  const [reviewForm, setReviewForm] = useState({
    rating: 0,
    comment: '',
    isSubmitting: false
  });
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  // const { data: session } = useSession();
  const { isAuthenticated } = useAuth();
  const { addToCart, addToCartLoadingProductId } = useCart();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const { products } = useProducts();

  const product = products.find(p => p.slug === slug);

  useEffect(() => {
    if (product) {
      fetchReviews();
    }
  }, [product]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/products/${product?._id}/reviews`);
      const data = await response.json();
      console.log(data, 'data');
      if (response.ok) {
        setReviews(data.reviews);
        setAverageRating(data.rating);
        setReviewsCount(data.reviewsCount);
        
        // Check if current user has reviewed this product
        if (user?.id) {
          const hasReviewed = data.reviews.some(
            (review: any) => review.userId === user.id
          );
          setUserHasReviewed(hasReviewed);
        }
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const handleThumbnailError = (index: number) => {
    setThumbnailErrors(prev => ({ ...prev, [index]: true }));
  };

  useEffect(() => {
    setImageError(false);
  }, [activeImage]);

  if (!product) {
    return <ProductDetailSkeleton />;
  }

  const handleQuantityChange = (value: number) => {
    if (value < 1) return;
    setQuantity(value);
  };

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
          quantity: quantity,
          stock: product.stock
        });
      } catch (error: any) {
        console.error(error.message);
      }
    }
  };

  const handleWishlist = () => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist({
        _id: product._id,
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]
      });
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      toast.error('Please log in to submit a review');
      return;
    }
    
    if (userHasReviewed) {
      toast.error('You have already reviewed this product');
      return;
    }

    if (!reviewForm.rating) {
      toast.error('Please select a rating');
      return;
    }

    if (reviewForm.comment.length < 10) {
      toast.error('Review comment must be at least 10 characters');
      return;
    }

    setReviewForm(prev => ({ ...prev, isSubmitting: true }));

    try {
      const response = await fetch(`/api/products/${product._id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          rating: reviewForm.rating,
          comment: reviewForm.comment
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Review submitted successfully');
        setReviewForm({
          rating: 0,
          comment: '',
          isSubmitting: false
        });
        setUserHasReviewed(true);
        fetchReviews(); // Refresh reviews
      } else {
        toast.error(data.message || 'Failed to submit review');
      }
    } catch (error) {
      toast.error('An error occurred while submitting your review');
    } finally {
      setReviewForm(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-red-900">Home</Link>
          <ChevronRight size={16} className="mx-1" />
          <Link href="/shop" className="hover:text-red-900">Shop</Link>
          <ChevronRight size={16} className="mx-1" />
          <Link href={`/shop?category=${product.category}`} className="hover:text-red-900">{product.category}</Link>
          <ChevronRight size={16} className="mx-1" />
          <span className="text-gray-700">{product.name}</span>
        </div>
        
        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div>
              <div className="mb-4 overflow-hidden bg-black rounded-lg">
                {imageError ? (
                  <div className="h-96 w-full rounded-md animate-pulse bg-gray-400" />
                ) : (
                  <img 
                    src={product.images[activeImage]} 
                    alt={product.name} 
                    className="w-full h-[30rem] rounded-md object-cover"
                    onError={() => setImageError(true)}
                  />
                )}
              </div>
              <div className="flex space-x-2">
                {product.images.map((image: string, index: number) => (
                  <button 
                    key={index}
                    className={`w-20 h-20 rounded-md overflow-hidden ${activeImage === index ? 'ring-2 ring-red-900' : 'opacity-70'}`}
                    onClick={() => setActiveImage(index)}
                  >
                    {thumbnailErrors[index] ? (
                      <div className="w-full h-full bg-gray-400 animate-pulse" />
                    ) : (
                      <img 
                        src={image} 
                        alt={`${product.name} - view ${index + 1}`} 
                        className="w-full h-full object-cover"
                        onError={() => handleThumbnailError(index)}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
              
              {/* Price display */}
              {product.originalPrice && product.originalPrice > product.price ? (
                <div className="flex items-center mb-4">
                  <div className="text-2xl font-bold text-red-900 mr-3">₹{product.price}</div>
                  <div className="text-lg text-gray-500 line-through">₹{product.originalPrice}</div>
                </div>
              ) : (
                <div className="text-2xl font-bold text-red-900 mb-4">₹{product.price}</div>
              )}
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={18} 
                      fill={i < Math.floor(averageRating) ? "#facc15" : "#d1d5db"} 
                      className={i < Math.floor(averageRating) ? "" : "text-gray-300"} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {averageRating?.toFixed(1)} ({reviewsCount} reviews)
                </span>
              </div>
              
              <p className="text-gray-600 mb-6">{product.description}</p>
              
              {/* Stock information */}
              {product.stock && (
                <div className="mb-4">
                  <span className="text-sm font-medium text-gray-700">
                    {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
                  </span>
                </div>
              )}
              
              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <div className="flex items-center">
                  <button 
                    className="w-10 h-10 rounded-l-md border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    onClick={() => handleQuantityChange(quantity - 1)}
                  >
                    <Minus size={16} />
                  </button>
                  <input 
                    type="number" 
                    min="1" 
                    max={product.stock || undefined}
                    value={quantity} 
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    className="w-16 h-10 border-t border-b border-gray-300 text-center focus:outline-none"
                  />
                  <button 
                    className="w-10 h-10 rounded-r-md border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={product.stock ? quantity >= product.stock : false}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex space-x-4 mb-6">
                <Button 
                  variant="primary"
                  className={`flex-1 btn-primary flex items-center justify-center`}
                  onClick={(e) => {e.stopPropagation(); handleAddToCart(e)}}
                  disabled={!product.inStock || addToCartLoadingProductId === product._id}
                >
                  {addToCartLoadingProductId === product._id && <div className="w-4 h-4 border-b-2 border-white rounded-full animate-spin" />}
                  &nbsp;&nbsp;<ShoppingCart size={18} className="mr-2" />
                   Add to Cart   
                </Button>
                <button 
                  className="w-12 h-12 border border-red-900 rounded-md flex items-center justify-center hover:bg-red-50"
                  onClick={handleWishlist}
                >
                  <Heart 
                    size={18} 
                    className={isInWishlist(product._id) ? 'text-red-600 fill-red-600' : 'text-red-900'} 
                  />
                </button>
              </div>
              
              {/* Product Meta */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span className="font-medium mr-2">SKU:</span>
                  <span>{product.sku}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span className="font-medium mr-2">Category:</span>
                  <Link href={`/shop?category=${product.category}`} className="hover:text-red-900">
                    {product.category}
                  </Link>
                </div>
                {product.tags && product.tags.length > 0 && (
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <span className="font-medium mr-2">Tags:</span>
                    <div className="flex flex-wrap gap-1">
                      {product.tags.map((tag: string) => (
                        <Link     
                          key={tag} 
                          href={`/shop?tag=${tag}`}
                          className="px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 hover:text-red-900"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Shipping Info */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="flex flex-col items-center text-center p-3 border border-gray-200 rounded-md">
                  <Truck size={20} className="text-red-900 mb-2" />
                  <span className="text-sm">Free Shipping</span>
                  <span className="text-xs text-gray-500">On orders over ₹699</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 border border-gray-200 rounded-md">
                  <Shield size={20} className="text-red-900 mb-2" />
                  <span className="text-sm">Secure Payment</span>
                  <span className="text-xs text-gray-500">100% secure checkout</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 border border-gray-200 rounded-md">
                  <RotateCcw size={20} className="text-red-900 mb-2" />
                  <span className="text-sm">Easy Returns</span>
                  <span className="text-xs text-gray-500">within 2 days of delivery</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Tabs */}
          <div className="border-t border-gray-200">
            <div className="flex border-b border-gray-200">
              <button 
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'description' ? 'border-b-2 border-red-900 text-red-900' : 'text-gray-600 hover:text-red-900'}`}
                onClick={() => setActiveTab('description')}
              >
                Description
              </button>
              <button 
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'specifications' ? 'border-b-2 border-red-900 text-red-900' : 'text-gray-600 hover:text-red-900'}`}
                onClick={() => setActiveTab('specifications')}
              >
                Specifications
              </button>
              <button 
                className={`px-6 py-3 text-sm font-medium ${activeTab === 'reviews' ? 'border-b-2 border-red-900 text-red-900' : 'text-gray-600 hover:text-red-900'}`}
                onClick={() => setActiveTab('reviews')}
              >
                Reviews ({reviewsCount})
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'description' && (
                <div>
                  <p className="text-gray-700 mb-4">{product.description}</p>
                  {product.features && product.features.length > 0 && (
                    <>
                      <h3 className="font-semibold text-lg mb-2">Features:</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {product.features.map((feature: string, index: number) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
              
              {activeTab === 'specifications' && product.specifications && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-200">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 w-1/3">{key}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{String(value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {activeTab === 'reviews' && (
                <div>
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={24} 
                            fill={i < Math.floor(averageRating) ? "#facc15" : "#d1d5db"} 
                            className={i < Math.floor(averageRating) ? "" : "text-gray-300"} 
                          />
                        ))}
                      </div>
                      <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                      <span className="text-gray-600 ml-2">based on {reviewsCount} reviews</span>
                    </div>
                    
                    {!userHasReviewed && isAuthenticated && (
                      <div id="write-review" className="mb-8">
                        <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
                        <form onSubmit={handleReviewSubmit}>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                  key={star}
                                  type="button"
                                  onClick={() => setReviewForm(prev => ({ ...prev, rating: star }))}
                                  className="focus:outline-none"
                                >
                                  <Star
                                    size={24}
                                    fill={star <= reviewForm.rating ? "#facc15" : "#d1d5db"}
                                    className={star <= reviewForm.rating ? "text-yellow-400" : "text-gray-300"}
                                  />
                                </button>
                              ))}
                            </div>
                          </div>
                          <div className="mb-4">
                            <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                              Your Review
                            </label>
                            <textarea
                              id="comment"
                              rows={4}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-900"
                              value={reviewForm.comment}
                              onChange={(e) => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                              required
                              minLength={10}
                              maxLength={500}
                            />
                          </div>
                          <Button
                            type="submit"
                            variant="primary"
                            disabled={reviewForm.isSubmitting || userHasReviewed}
                          >
                            {reviewForm.isSubmitting ? 'Submitting...' : 'Submit Review'}
                          </Button>
                        </form>
                      </div>
                    )}
                  </div>
                  
                  {reviews.length > 0 ? (
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div key={review._id || review.userId} className="border-b border-gray-200 pb-6 last:border-0">
                          <div className="flex items-start">
                            {/* <img 
                              src={review.avatar} 
                              alt={review.user} 
                              className="w-10 h-10 rounded-full mr-4"
                            /> */}
                            <span className="w-10 h-10 bg-gray-300 rounded-full items-center justify-center flex mr-4">{review.user.charAt(0).toUpperCase()}</span>
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <h4 className="font-medium mr-2">{review.user}</h4>
                                <span className="text-xs text-gray-500">
                                  {formatDate(review.createdAt)}
                                </span>
                              </div>
                              <div className="flex text-yellow-400 mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    size={16} 
                                    fill={i < review.rating ? "#facc15" : "#d1d5db"} 
                                    className={i < review.rating ? "" : "text-gray-300"} 
                                  />
                                ))}
                              </div>
                              <p className="text-gray-700">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
