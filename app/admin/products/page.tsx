'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Edit, Trash2, Eye, X, VideoIcon, ImageIcon, AlertCircle, ChevronDown, ChevronUp, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { CldImage, CldUploadButton, CldUploadWidget } from 'next-cloudinary';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import Button from '@/components/ui/Button';

interface CloudinaryImage {
  url: string;
  publicId: string; 
}

function isCloudinaryImage(img: string | CloudinaryImage): img is CloudinaryImage {
  return typeof img !== 'string' && 'url' in img && 'publicId' in img;
}

interface Product {
  _id: string;
  name: string;
  slug: string;
  price: number;
  discount?: number;
  originalPrice?: number;
  images: string[] | CloudinaryImage[];
  category: string;
  description: string;   
  features: string[];
  specifications: {
    weight: string;
    "shelf life": string;
    origin: string;
    ingredients: string;
    certification: string;
    contents: string;
    material: string;
  };
  inStock: boolean;
  stock: number;
  isFeatured: boolean;
  sku: string;
  tags: string[];
  status: 'Active' | 'Disabled';
}

const categories = [
  { id: 'all', name: 'All Categories' },
  { id: 'bridal-essentials', name: 'Bridal Essentials' },
  { id: 'mehandi-cones', name: 'Mehandi Cones' },
  { id: 'hair-products', name: 'Hair Products' },
  { id: 'stencils-and-practice', name: 'Stencils and Practice' },
  { id: 'beginners-kit', name: 'Beginners Kit' },
  // { id: 'accessories', name: 'Accessories' },
  { id: 'aftercare', name: 'Aftercare' },
  // { id: 'hair-henna', name: 'Hair Henna' },
  // { id: 'books', name: 'Books' }
];

const generateSlug = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '',
    discount: '',
    originalPrice: '',
    images: [] as string[],
    category: '',
    description: '',
    features: [''] as string[],
    specifications: {
      weight: '',
      "shelf life": '',
      origin: '',
      ingredients: '',
      certification: '',
      contents: '',
      material: ''
    },
    inStock: true,
    stock: '',
    isFeatured: false,
    sku: '',
    tags: [''] as string[],
    status: 'Active' as 'Active' | 'Disabled'
  });
  const [uploadedImages, setUploadedImages] = useState<CloudinaryImage[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [isEditForm, setIsEditForm] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<Record<string, boolean>>({});

  // Fetch products from your API route
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleUploadSuccess = (result: any) => {
    if (result?.info?.secure_url && result?.info?.public_id) {
      const newImage = {
        url: result.info.secure_url,
        publicId: result.info.public_id
      };
      
      setUploadedImages(prev => [...prev, newImage]);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, result.info.secure_url]
      }));
    }
  };

  const removeImage = async (index: number) => {
    const imageToRemove = uploadedImages[index];
    
    if (!imageToRemove?.publicId) {
      console.error('No publicId available for this image');
      return;
    }

    try {
      const response = await fetch('/api/delete-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ publicId: imageToRemove.publicId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete image from Cloudinary');
      }

      setUploadedImages(prev => prev.filter((_, i) => i !== index));
      setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index)
      }));

    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         product.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ||
      product.category.toLowerCase() === categories.find(cat => cat.id === selectedCategory)?.name.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const calculatePrice = () => {
      const original = parseFloat(formData.originalPrice) || 0;
      const discount = parseFloat(formData.discount) || 0;
      const discountedPrice = original - (original * (discount / 100));
      const roundedPrice = Math.round(discountedPrice);

      setFormData(prev => ({
        ...prev,
        price: discountedPrice > 0 ? String(roundedPrice) : "0"
      }));
    };

    calculatePrice();
  }, [formData.originalPrice, formData.discount]);

  const handleSaveProduct = async () => {
    try {
      const productData = {
        ...formData,
      };

      const url = isEditForm 
        ? `/api/products?id=${selectedProduct}`
        : '/api/products';
      const method = isEditForm ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${isEditForm ? 'update' : 'add'} product`);
      }

      const resultProduct = await response.json();

      if (isEditForm) {
        setProducts(prev => 
          prev.map(p => p._id === selectedProduct ? resultProduct : p)
        );
      } else {
        setProducts(prev => [...prev, resultProduct]);
      }

      setShowAddModal(false);
      resetForm();
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err instanceof Error ? err.message : `Failed to save product`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      price: '',
      discount: '',
      originalPrice: '',
      images: [],
      category: '',
      description: '',
      features: [''],
      specifications: {
        weight: '',
        "shelf life": '',
        origin: '',
        ingredients: '',
        certification: '',
        contents: '',
        material: ''
      },
      inStock: true,
      stock: '',
      isFeatured: false,
      sku: '',
      tags: [''],
      status: 'Active'
    });
    setUploadedImages([]);
  };

  const handleEditProduct = (productId: string) => {
    const product = products.find(p => p._id === productId);
    setIsEditForm(true);
    if (product) {
      setSelectedProduct(productId)
      setFormData({
        name: product.name,
        slug: product.slug,
        price: product.price.toString(),
        discount: product.discount?.toString() || '',
        originalPrice: product.originalPrice?.toString() || product.price.toString(),
        images: Array.isArray(product.images) 
          ? product.images.map(img => typeof img === 'string' ? img : img.url)
          : [],
        category: product.category,
        description: product.description,
        features: product.features.length > 0 ? product.features : [''],
        specifications: product.specifications,
        inStock: product.inStock,
        stock: product.stock.toString(),
        isFeatured: product.isFeatured,
        sku: product.sku,
        tags: product.tags.length > 0 ? product.tags : [''],
        status: product.status 
      });

      const imagesToSet = Array.isArray(product.images)
        ? product.images.map(img => ({
            url: typeof img === 'string' ? img : img.url,
            publicId: typeof img === 'string' ? extractPublicId(img) : img.publicId
          }))
        : [];
      
      setUploadedImages(imagesToSet);
      setShowAddModal(true);
    }
  };

  function extractPublicId(url: string): string {
    const parts = url.split('/');
    const filename = parts[parts.length - 1];
    return filename.split('.')[0];
  }

  const handleDeleteConfirm = async () => {
    if (!selectedProduct) return;

    try {
      const response = await fetch(`/api/products?id=${selectedProduct}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(prev => prev.filter(p => p._id !== selectedProduct));
      setShowDeleteModal(false);
      setSelectedProduct(null);
    } catch (err) {
      console.error('Error deleting product:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete product');
    }
  };

  const handleStatusUpdate = async (productId: string, newStatus: 'Active' | 'Disabled') => {
    setIsUpdatingStatus(prev => ({ ...prev, [productId]: true }));
    try {
      const response = await fetch(`/api/products?id=${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update product status');
      }

      const updatedProduct = await response.json();
      setProducts(prev => 
        prev.map(p => p._id === productId ? updatedProduct : p)
      );
    } catch (error) {
      console.error('Failed to update product status:', error);
    } finally {
      setIsUpdatingStatus(prev => ({ ...prev, [productId]: false }));
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle size={16} className="mr-1" />,
          message: 'Active'
        };
      case 'disabled':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <XCircle size={16} className="mr-1" />,
          message: 'Disabled'
        };
      case 'out of stock':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <XCircle size={16} className="mr-1" />,
          message: 'Out of Stock'
        };
      case 'featured':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <CheckCircle size={16} className="mr-1" />,
          message: 'Featured'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: null,
          message: status
        };
    }
  };

  const getStatus = (product: Product) => {
    if (!product.inStock) return 'Out of Stock';
    if (product.stock <= 0) return 'Out of Stock';
    return product.status;
  };

  useEffect(() => {
    if (showAddModal) {
      const slug = generateSlug(formData.name);
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, showAddModal]);

  const handleCloseModal = () => {
    setShowAddModal(false);
    setSelectedProduct(null);
    resetForm();
  };

  const toggleExpand = (productId: string) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  const renderProductDetails = (product: Product) => {
    const getImageInfo = (img: string | CloudinaryImage) => {
      if (isCloudinaryImage(img)) {
        return {
          url: img.url,
          publicId: img.publicId
        };
      }
      return {
        url: img,
        publicId: img.split('/').pop()?.split('.')[0] || ''
      };
    };

    return (
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Product Images */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Product Images</h3>
          <div className="space-y-4">
            {product.images.length > 0 ? (
              <>
                <div className="w-full h-48 bg-gray-100 rounded-md overflow-hidden">
                  {isCloudinaryImage(product.images[0]) ? (
                    product.images[0].url.match(/\.(mp4|mov)$/i) ? (
                      <video 
                        src={product.images[0].url} 
                        className="w-full h-full object-contain"
                        controls
                      />
                    ) : (
                      <CldImage
                        width="600"
                        height="600"
                        src={product.images[0].publicId}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    )
                  ) : product.images[0].match(/\.(mp4|mov)$/i) ? (
                    <video 
                      src={product.images[0]} 
                      className="w-full h-full object-contain"
                      controls
                    />
                  ) : (
                    <CldImage
                      width="600"
                      height="600"
                      src={product.images[0].split('/').pop()?.split('.')[0] || ''}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
                {product.images.length > 1 && (
                  <div className="grid grid-cols-3 gap-2">
                    {product.images.slice(1).map((image, index) => (
                      <div key={index} className="h-24 bg-gray-100 rounded-md overflow-hidden">
                        {isCloudinaryImage(image) ? (
                          image.url.match(/\.(mp4|mov)$/i) ? (
                            <video 
                              src={image.url} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <CldImage
                              width="200"
                              height="200"
                              src={image.publicId}
                              alt={`${product.name} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          )
                        ) : image.match(/\.(mp4|mov)$/i) ? (
                          <video 
                            src={image} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <CldImage
                            width="200"
                            height="200"
                            src={image.split('/').pop()?.split('.')[0] || ''}
                            alt={`${product.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-48 bg-gray-100 rounded-md flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Product Information */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Product Information</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Name:</span> {product.name}
            </p>
            <p className="text-sm">
              <span className="font-medium">SKU:</span> {product.sku}
            </p>
            <p className="text-sm">
              <span className="font-medium">Price:</span> ₹{product.price.toLocaleString('en-IN')}
            </p>
            {product.discount && product.discount > 0 && (
              <p className="text-sm">
                <span className="font-medium">Discount:</span> {product.discount}% (₹{product.originalPrice?.toLocaleString('en-IN')})
              </p>
            )}
            <p className="text-sm">
              <span className="font-medium">Category:</span> {product.category}
            </p>
            <p className="text-sm">
              <span className="font-medium">Stock:</span> {product.stock}
            </p>
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Status:</span>
              <select
                value={product.status}
                onChange={(e) => handleStatusUpdate(product._id, e.target.value as 'Active' | 'Disabled')}
                disabled={isUpdatingStatus[product._id]}
                className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-500"
              >
                <option value="Active">Active</option>
                <option value="Disabled">Disabled</option>
              </select>
              {isUpdatingStatus[product._id] && (
                <Loader2 className="h-4 w-4 animate-spin text-gray-500 ml-2" />
              )}
            </div>
          </div>
        </div>

        {/* Description & Features */}
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Description & Features</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Description:</span> {product.description}
            </p>
            {product.features.length > 0 && (
              <div>
                <p className="text-sm font-medium">Features:</p>
                <ul className="list-disc pl-5 text-sm">
                  {product.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center min-h-screen p-4"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5 }}
        >
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        </motion.div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading products</h3>
        <p className="text-gray-600 mb-4 text-center">{error}</p>
        <motion.button 
          onClick={() => window.location.reload()}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your henna products
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full appearance-none focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </motion.div>

          <motion.button
            onClick={() => {
              setIsEditForm(false);
              setShowAddModal(true);
            }}
            className="flex items-center justify-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus size={18} className="mr-2" />
            Add Product
          </motion.button>
        </motion.div>

        {/* Products List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white shadow overflow-hidden sm:rounded-lg"
        >
          {filteredProducts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center"
            >
              <p className="text-gray-500">No products found matching your criteria</p>
            </motion.div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredProducts.map((product) => {
                const statusConfig = getStatusConfig(getStatus(product));
                const isExpanded = expandedProduct === product._id;

                return (
                  <motion.li 
                    key={product._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-wrap gap-2">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              {product.images[0] ? (
                                isCloudinaryImage(product.images[0]) ? (
                                  product.images[0].url.match(/\.(mp4|mov)$/i) ? (
                                    <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                                      <VideoIcon className="h-5 w-5 text-gray-500" />
                                    </div>
                                  ) : (
                                    <img 
                                      src={product.images[0].url} 
                                      alt={product.name} 
                                      className="h-10 w-10 rounded-md object-cover"
                                    />
                                  )
                                ) : product.images[0].match(/\.(mp4|mov)$/i) ? (
                                  <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                                    <VideoIcon className="h-5 w-5 text-gray-500" />
                                  </div>
                                ) : (
                                  <img 
                                    src={product.images[0]} 
                                    alt={product.name} 
                                    className="h-10 w-10 rounded-md object-cover"
                                  />
                                )
                              ) : (
                                <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center">
                                  <ImageIcon className="h-5 w-5 text-gray-500" />
                                </div>
                              )}
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">
                                {product.name}
                              </p>
                              <p className="text-xs text-gray-500">SKU: {product.sku}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <motion.span 
                              className={`px-2 py-1 text-xs rounded-full flex items-center ${statusConfig.color}`}
                              whileHover={{ scale: 1.05 }}
                            >
                              {statusConfig.icon}
                              <span className="ml-1">{statusConfig.message}</span>
                            </motion.span>
                            {product.isFeatured && (
                              <motion.span 
                                className="px-2 py-1 text-xs rounded-full flex items-center bg-blue-100 text-blue-800"
                                whileHover={{ scale: 1.05 }}
                              >
                                <CheckCircle size={16} className="mr-1" />
                                <span className="ml-1">Featured</span>
                              </motion.span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <p className="text-sm text-gray-500 hidden sm:block">
                            ₹{product.price.toLocaleString('en-IN')}
                          </p>
                          <div className="flex space-x-2">
                            <motion.button
                              onClick={() => handleEditProduct(product._id)}
                              className="text-gray-400 hover:text-gray-500"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Edit className="h-5 w-5" />
                            </motion.button>
                            <motion.button
                              onClick={() => {
                                setSelectedProduct(product._id);
                                setShowDeleteModal(true);
                              }}
                              className="text-gray-400 hover:text-gray-500"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Trash2 className="h-5 w-5" />
                            </motion.button>
                            <motion.button
                              onClick={() => toggleExpand(product._id)}
                              className="text-gray-400 hover:text-gray-500"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-5 w-5" />
                              ) : (
                                <ChevronDown className="h-5 w-5" />
                              )}
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            {renderProductDetails(product)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </motion.div>

        {/* Add/Edit Product Modal */}
        <AnimatePresence>
          {showAddModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                  <h2 className="text-xl font-semibold">
                    {isEditForm ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <motion.button 
                    className="text-gray-400 hover:text-gray-600"
                    onClick={() => handleCloseModal()}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={24} />
                  </motion.button>
                </div>
                
                <div className="p-6">
                  <form onSubmit={(e) => { e.preventDefault(); handleSaveProduct(); }}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Name
                        </label>
                        <input 
                          type="text" 
                          className="input-field pl-2 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          SKU
                        </label>
                        <input 
                          type="text" 
                          className="input-field pl-2 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                          value={formData.sku}
                          onChange={(e) => setFormData({...formData, sku: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Slug
                        </label>
                        <input 
                          type="text" 
                          className="input-field pl-2 pr-4 py-2 border border-gray-300 rounded-md w-full bg-gray-100 cursor-not-allowed"
                          value={formData.slug}
                          readOnly
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Original Price (₹)
                        </label>
                        <input 
                          type="number" 
                          className="input-field pl-2 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                          value={formData.originalPrice}
                          onChange={(e) => setFormData({...formData, originalPrice: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount (%)
                        </label>
                        <input 
                          type="number" 
                          className="input-field pl-2 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                          value={formData.discount}
                          onChange={(e) => setFormData({...formData, discount: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price (₹)
                        </label>
                        <input 
                          type="number" 
                          className="input-field pl-2 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                          value={formData.price}
                          readOnly
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Category
                        </label>
                        <select 
                          className="input-field pl-2 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          required
                        >
                          <option value="">Select Category</option>
                          {categories.filter(cat => cat.id !== 'all').map(category => (
                            <option key={category.id} value={category.name}>{category.name}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Stock Quantity
                        </label>
                        <input 
                          type="number" 
                          className="input-field pl-2 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                          value={formData.stock}
                          onChange={(e) => setFormData({...formData, stock: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="isFeatured"
                          className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                          checked={formData.isFeatured}
                          onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                        />
                        <label htmlFor="isFeatured" className="ml-2 block text-sm text-gray-700">
                          Featured Product
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input 
                          type="checkbox" 
                          id="inStock"
                          className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                          checked={formData.inStock}
                          onChange={(e) => setFormData({...formData, inStock: e.target.checked})}
                        />
                        <label htmlFor="inStock" className="ml-2 block text-sm text-gray-700">
                          In Stock
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Status
                        </label>
                        <select 
                          className="input-field pl-2 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                          value={formData.status}
                          onChange={(e) => setFormData({...formData, status: e.target.value as 'Active' | 'Disabled'})}
                        >
                          <option value="Active">Active</option>
                          <option value="Disabled">Disabled</option>
                        </select>
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product Images
                        </label>
                        
                        <CldUploadWidget
                          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                          options={{
                            sources: ['local'],
                            multiple: false,
                            resourceType: 'auto',
                            maxFileSize: 100000000,
                            clientAllowedFormats: ['jpg', 'png', 'webp', 'mp4', 'mov'],
                            publicId: formData.slug
                          }}
                          onSuccess={handleUploadSuccess}
                        >   
                          {({ open }) => (
                            <Button
                              variant="secondary"
                              type="button"
                              onClick={() => open()}
                              className="mb-4 btn-outline flex items-center"
                              disabled={isUploading}
                            >
                              {isUploading ? 'Uploading...' : 'Upload Image/Video'}
                            </Button>
                          )}
                        </CldUploadWidget>

                        {formData.images.length > 0 && (
                          <div className="grid grid-cols-3 gap-4">
                            {formData.images.map((image, index) => (
                              <div key={index} className="relative group">
                                {image.match(/\.(mp4|mov)$/i) ? (
                                  <video 
                                    src={image} 
                                    className="w-full h-32 object-cover rounded-md"
                                    controls
                                  />
                                ) : (
                                  <CldImage
                                    width="200"
                                    height="200"
                                    src={image.split('/').pop()?.split('.')[0] || ''}
                                    alt={`Product image ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-md"
                                  />
                                )}
                                <motion.button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <X size={16} />
                                </motion.button>
                              </div>
                            ))}
                          </div>   
                        )}
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <textarea 
                          className="input-field min-h-[100px] pl-2 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          required
                        ></textarea>
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Features (one per line)
                        </label>
                        <textarea 
                          className="input-field min-h-[100px] pl-2 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                          value={formData.features.join('\n')}
                          onChange={(e) => setFormData({...formData, features: e.target.value.split('\n')})}
                        ></textarea>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Weight
                        </label>
                        <input 
                          type="text" 
                          className="input-field pl-2 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                          value={formData.specifications.weight}
                          required
                          onChange={(e) => setFormData({
                            ...formData, 
                            specifications: {
                              ...formData.specifications,
                              weight: e.target.value
                            }
                          })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Shelf Life
                        </label>
                        <input 
                          type="text" 
                          className="input-field pl-2 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                          value={formData.specifications["shelf life"]}
                          onChange={(e) => setFormData({
                            ...formData, 
                            specifications: {
                              ...formData.specifications,
                              "shelf life": e.target.value
                            }
                          })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Origin
                        </label>
                        <input 
                          type="text" 
                          className="input-field pl-2 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                          value={formData.specifications.origin}
                          onChange={(e) => setFormData({
                            ...formData, 
                            specifications: {
                              ...formData.specifications,
                              origin: e.target.value
                            }
                          })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ingredients
                        </label>
                        <input 
                          type="text" 
                          className="input-field pl-2 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                          value={formData.specifications.ingredients}
                          onChange={(e) => setFormData({
                            ...formData, 
                            specifications: {
                              ...formData.specifications,
                              ingredients: e.target.value
                            }
                          })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Certification
                        </label>
                        <input 
                          type="text" 
                          className="input-field pl-2 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                          value={formData.specifications.certification}
                          onChange={(e) => setFormData({
                            ...formData, 
                            specifications: {
                              ...formData.specifications,
                              certification: e.target.value
                            }
                          })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Contents
                        </label>
                        <input 
                          type="text" 
                          className="input-field pl-2 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                          value={formData.specifications.contents}
                          onChange={(e) => setFormData({
                            ...formData, 
                            specifications: {
                              ...formData.specifications,
                              contents: e.target.value
                            }
                          })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Material
                        </label>
                        <input 
                          type="text" 
                          className="input-field pl-2 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                          value={formData.specifications.material}
                          onChange={(e) => setFormData({
                            ...formData, 
                            specifications: {
                              ...formData.specifications,
                              material: e.target.value
                            }
                          })}
                        />
                      </div>
                      
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tags (comma separated)
                        </label>
                        <input 
                          type="text" 
                          className="input-field pl-2 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
                          value={formData.tags.join(', ')}
                          onChange={(e) => setFormData({...formData, tags: e.target.value.split(',').map(tag => tag.trim())})}
                        />
                      </div>
                    </div>    
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <motion.button 
                        type="button" 
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                        onClick={() => setShowAddModal(false)}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Cancel
                      </motion.button>
                      <motion.button 
                        type="submit" 
                        className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {isEditForm ? 'Update Product' : 'Add Product'}
                      </motion.button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>        

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteModal && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="bg-white rounded-lg shadow-lg w-full max-w-md"
              >
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirm Deletion</h3>
                  <p className="text-gray-600 mb-6">
                    Are you sure you want to delete this product? This action cannot be undone.
                  </p>
                  <div className="flex justify-end space-x-3">
                    <motion.button 
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                      onClick={() => setShowDeleteModal(false)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button 
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      onClick={handleDeleteConfirm}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Delete
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductsPage;
