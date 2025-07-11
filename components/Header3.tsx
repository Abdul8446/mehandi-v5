'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, Search, ShoppingCart, Heart, User, 
  ChevronDown, Menu, X, Instagram, Facebook, Twitter, Gift 
} from 'react-feather';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useProducts } from '@/contexts/ProductContext';

interface UserData {
  name?: string;
  phone?: string;
}

const Header3 = () => {
  const pathname = usePathname();  
  const { products } = useProducts();

  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const [tapPosition, setTapPosition] = useState({ x: 0, y: 0 });
  const [activeRipple, setActiveRipple] = useState<string | null>(null);

  useEffect(() => {
  if (isMenuOpen) {
    document.body.classList.add('overflow-hidden');
  } else {
    document.body.classList.remove('overflow-hidden');
  }
  // Clean up in case component unmounts while menu is open
  return () => {
    document.body.classList.remove('overflow-hidden');
  };
}, [isMenuOpen]);

  // Filter products as user types
  useEffect(() => {
  if (search.trim().length > 0) {
    const results = products
      .filter((product: any) =>
        product.status === 'Active' &&
        product.name?.toLowerCase().includes(search.toLowerCase())
      );
    setSearchResults(results);
    setShowResults(true);
  } else {
    setSearchResults([]);
    setShowResults(false);
  }
}, [search, products]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  const handleProtectedRoute = (path: string) => {
    return isAuthenticated ? path : '/auth';
  };

  const isActive = (path: string) => {
    return pathname === path ? 'text-red-900 font-medium' : 'text-gray-700 hover:text-red-900';
  };

  const handleClick = (e: React.MouseEvent, buttonId: string) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTapPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setActiveRipple(buttonId);
    setTimeout(() => setActiveRipple(null), 500);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-gradient-to-r sticky top-0 z-50 from-brown-900 to-brown-800 text-white py-2 px-4 text-sm">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            {/* <div className="flex items-center space-x-2">
              <Phone size={14} />
              <span>+91 98765 43210</span>
            </div> */}
            <div className="hidden sm:flex items-center space-x-2">
              <Gift size={14} />
              <span>Free shipping on orders above ₹699</span>
            </div>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-3">
              <Link 
                href="https://www.instagram.com/mehandi__mansion/" 
                className="hover:text-red-200 transition-colors relative rounded-md overflow-hidden"
                onClick={(e) => handleClick(e, 'instagram')}
              >
                <Instagram size={14} />
              </Link>
              <Link 
                href="https://www.facebook.com/profile.php?id=61573746197341" 
                className="hover:text-red-200 transition-colors relative rounded-md overflow-hidden"
                onClick={(e) => handleClick(e, 'facebook')}
              >
                <Facebook size={14} />
              </Link>
              <Link 
                href="#" 
                className="hover:text-red-200 transition-colors relative rounded-md overflow-hidden"
                onClick={(e) => handleClick(e, 'twitter')}
              >
                <Twitter size={14} />
                <AnimatePresence>
                  {activeRipple === 'twitter' && (
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
                        scale: 10,
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
              </Link>
            </div>
            <span className="hidden md:inline-block">|</span>
          
            <Link 
              href="/faq" 
              className="hidden md:block hover:text-red-200 transition-colors relative rounded-md overflow-hidden px-1 py-1"
              onClick={(e) => handleClick(e, 'faq')}
            >
              FAQ
              <AnimatePresence>
                {activeRipple === 'faq' && (
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
                      scale: 10,
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
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
          : 'bg-white shadow-sm'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center space-x-3 group relative"
              onClick={(e) => { handleClick(e, 'logo'); closeMenu(); }}
            >
              <div className="relative">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-120 group-active:scale-120"
                  style={{
                    backgroundImage: "url('/images/logo.png')",
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              </div>
              <div className="relative">
                <span className="text-xl font-bold bg-gradient-to-r from-brown-900 to-brown-700 bg-clip-text text-transparent">
                  Mehandi Mansion
                </span>
                <div className="text-xs text-gray-500 -mt-1">
                  Premium Henna Products
                </div>
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <AnimatePresence>
                    {activeRipple === 'logo' && (
                      <motion.span
                        className="absolute inset-0 bg-black/10 rounded"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-4">
              {[
                { path: '/', label: 'Home', id: 'nav-home' },
                { path: '/shop', label: 'Shop', id: 'nav-shop' },
                { path: '/booking', label: 'Book Artist', id: 'nav-booking' },
                { path: '/about', label: 'About Us', id: 'nav-about' },
                { path: '/contact', label: 'Contact', id: 'nav-contact' },
              ].map((item) => (
                <Link 
                  key={item.path}
                  href={item.path} 
                  className={`relative py-2 px-4 transition-all duration-200 ${isActive(item.path)} group rounded-md overflow-hidden`}
                  onClick={(e) => handleClick(e, item.id)}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-brown-900 to-brown-700 transform transition-transform duration-200 ${
                    pathname === item.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`}></span>
                  <AnimatePresence>
                    {activeRipple === item.id && (
                      <motion.span
                        className="absolute inset-0 bg-black/10 rounded"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                      />
                    )}
                  </AnimatePresence>
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search */}
              <div 
                className="relative group"
                // onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking inside dropdown
              >
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-64 pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent focus:bg-white transition-all duration-200"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)} // Increased delay
                />
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-brown-500 transition-colors" />
                
                {showResults && (
                  <div 
                    className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-72 overflow-auto"
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking results
                  >
                    {searchResults.length > 0 ? (
                      searchResults.map((product: any) => (
                        <Link
                          href={`/product/${product.slug}`}
                          key={product._id}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-brown-50 text-gray-900"
                          onClick={() => {
                            setSearch('');
                            setShowResults(false);
                          }}
                        >
                          <img
                            src={product.images?.[0] || '/images/placeholder.png'}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-md border border-gray-100"
                          />
                          <span>{product.name}</span>
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">No products found.</div>
                    )}
                  </div>
                )}
              </div>
             

              {/* Cart */}
              <Link 
                href={handleProtectedRoute('/cart')} 
                className="relative p-2 hover:bg-brown-50 rounded-full transition-colors group"
                onClick={(e) => handleClick(e, 'cart')}
              >
                <ShoppingCart size={20} className="group-hover:text-brown-900 transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse">
                    {totalItems}
                  </span>
                )}
                <AnimatePresence>
                  {activeRipple === 'cart' && (
                    <motion.span
                      className="absolute inset-0 bg-black/10 rounded-full overflow-visible"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                  )}
                </AnimatePresence>
              </Link>

              {/* Wishlist */}
              <Link 
                href={handleProtectedRoute('/wishlist')} 
                className="p-2 relative hover:bg-brown-50 rounded-full transition-colors group overflow-hidden"
                onClick={(e) => handleClick(e, 'wishlist')}
              >
                <Heart size={20} className="group-hover:text-brown-900 transition-colors" />
                <AnimatePresence>
                  {activeRipple === 'wishlist' && (
                    <motion.span
                      className="absolute inset-0 bg-black/10 rounded-full overflow-visible"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                  )}
                </AnimatePresence>
              </Link>

              {/* User Menu - No ripple effect here */}
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 hover:bg-red-50 rounded-full transition-colors">
                    {/* <div className="w-8 h-8 bg-gradient-to-br from-brown-900 to-brown-700 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div> */}
                    <div className="w-8 h-8 bg-gradient-to-br from-brown-900 to-brown-700 rounded-full flex items-center justify-center transition-transform duration-300 group-hover:rotate-[10deg]">
                      <User size={16} className="text-white" />
                    </div>
                    <ChevronDown size={14} className="text-gray-500 group-hover:text-brown-900 transition-colors" />
                  </button>
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-medium text-gray-900">Hello, {user?.name || 'User'}</div>
                      <div className="text-sm text-gray-500">{user?.phone}</div>
                    </div>
                    {[
                      { href: "/profile", label: "Profile", key: "profile" },
                      { href: "/my-orders", label: "My Orders", key: "my-orders" },
                      { href: "/my-bookings", label: "My Bookings", key: "my-bookings" },
                    ].map((item) => (
                      <Link
                        key={item.key}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-brown-50 hover:text-brown-900 transition-colors relative"
                        onClick={(e) => handleClick(e, item.key)}
                      >
                        {item.label}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          <AnimatePresence>
                            {activeRipple === item.key && (
                              <motion.span
                                className="absolute inset-0 bg-black/10 rounded"
                                initial={{ opacity: 1 }}
                                animate={{ opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.5, ease: 'easeInOut' }}
                              />
                            )}
                          </AnimatePresence>
                        </div>
                      </Link>
                    ))}
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={logout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-brown-50 hover:text-brown-900 transition-colors relative"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link 
                  href="/auth" 
                  className="bg-gradient-to-r from-brown-900 to-brown-700 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 font-medium relative overflow-hidden"
                  onClick={(e) => handleClick(e, 'login')}
                >
                  Login
                  <AnimatePresence>
                    {activeRipple === 'login' && (
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
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className='flex space-x-2 lg:hidden items-center'>
              {/* Cart */}
              <Link 
                href={handleProtectedRoute('/cart')} 
                className="relative p-2 hover:bg-brown-50 rounded-full transition-colors group"
                onClick={(e) => handleClick(e, 'cart')}
              >
                <ShoppingCart size={20} className="group-hover:text-brown-900 transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse">
                    {totalItems}
                  </span>
                )}
                <AnimatePresence>
                  {activeRipple === 'cart' && (
                    <motion.span
                      className="absolute inset-0 bg-black/10 rounded-full overflow-visible"
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5, ease: 'easeInOut' }}
                    />
                  )}
                </AnimatePresence>
              </Link>

            <button 
              className="lg:hidden p-2 hover:bg-gray-100 rounded-full transition-colors relative overflow-hidden" 
              onClick={(e) => { handleClick(e, 'mobile-menu'); toggleMenu(); }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              <AnimatePresence>
                {activeRipple === 'mobile-menu' && (
                  <motion.span
                    className="absolute inset-0 bg-black/10 rounded"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: 'easeInOut' }}
                  />
                )}
              </AnimatePresence>
            </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
       {isMenuOpen && (
        <div className="fixed inset-0 z-40 h-full bg-white lg:hidden flex flex-col">
          <div className={`flex-1 overflow-y-auto ${isScrolled?'mt-11':'mt-20'} max-h-[90vh] pt-4`}>
            <div className="container mx-auto px-4 py-4">
              {/* Mobile Search */}
              <div className="relative mb-4 group">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brown-500 focus:border-transparent"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onFocus={() => searchResults.length > 0 && setShowResults(true)}
                  onBlur={() => setTimeout(() => setShowResults(false), 200)} // Increased delay
                />
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                {showResults && (
                  <div 
                    className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-72 overflow-auto"
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur when clicking results
                  >
                    {searchResults.length > 0 ? (
                      searchResults.map((product: any) => (
                        <Link
                          href={`/product/${product.slug}`}
                          key={product._id}
                          className="flex items-center gap-3 px-4 py-2 hover:bg-brown-50 text-gray-900"
                          onClick={() => {
                            setSearch('');
                            setShowResults(false);
                            closeMenu();
                          }}
                        >
                          <img
                            src={product.images?.[0] || '/images/placeholder.png'}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded-md border border-gray-100"
                          />
                          <span>{product.name}</span>
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-gray-500">No products found.</div>
                    )}
                  </div>
                )} 
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-1 mb-6">
                {[
                  { path: '/', label: 'Home', id: 'mobile-home' },
                  { path: '/shop', label: 'Shop', id: 'mobile-shop' },
                  { path: '/booking', label: 'Book Artist', id: 'mobile-booking' },
                  { path: '/about', label: 'About Us', id: 'mobile-about' },
                  { path: '/contact', label: 'Contact', id: 'mobile-contact' },
                ].map((item) => (
                  <Link 
                    key={item.path}
                    href={item.path} 
                    className={`block py-3 px-4 rounded-lg transition-colors relative overflow-hidden ${
                      pathname === item.path 
                        ? 'bg-brown-50 text-brown-900 font-medium' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={(e) => { 
                      e.preventDefault();
                      handleClick(e, item.id); 
                      setTimeout(() => {
                        closeMenu();
                        router.push(item.path);
                      }, 300);
                    }}
                  >
                    {item.label}
                    <AnimatePresence>
                      {activeRipple === item.id && (
                      <motion.span
                        className="absolute inset-0 bg-black/10 rounded"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                      />                        
                      )}
                    </AnimatePresence>
                  </Link>
                ))}
              </div>
              
              {/* Mobile Actions */}
              <div className="border-t border-gray-100 pt-4">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Link 
                    href={isAuthenticated ? '/cart' : '/auth'} 
                    className={`flex items-center justify-center py-3 bg-red-50 text-brown-900 rounded-lg font-medium transition-colors hover:bg-brown-100 relative overflow-hidden`} 
                    onClick={(e) => {
                      //  handleClick(e, 'mobile-cart'); closeMenu(); 
                      e.preventDefault();
                      handleClick(e, 'mobile-cart');
                      setTimeout(() => {
                        closeMenu();
                        router.push(isAuthenticated ? '/cart' : '/auth');
                      }, 300);
                    }}
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Cart ({totalItems})
                    <AnimatePresence>
                      {activeRipple === 'mobile-cart' && (
                      <motion.span
                        className="absolute inset-0 bg-black/10 rounded"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                      />                        
                      )}
                    </AnimatePresence>
                  </Link>
                  <Link 
                    href="/wishlist" 
                    className={`flex items-center justify-center py-3 bg-gray-50 text-gray-700 rounded-lg font-medium transition-colors hover:bg-gray-100 relative overflow-hidden`} 
                    onClick={(e) => { 
                      // handleClick(e, 'mobile-wishlist'); closeMenu();
                      e.preventDefault();
                      handleClick(e, 'mobile-wishlist');
                      setTimeout(() => {
                        closeMenu();
                        router.push(isAuthenticated ? '/wishtlist' : '/auth');
                      }, 300); 
                    }}
                  >
                    <Heart size={18} className="mr-2" />
                    Wishlist
                    <AnimatePresence>
                      {activeRipple === 'mobile-wishlist' && (
                      <motion.span
                        className="absolute inset-0 bg-black/10 rounded"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                      />                        
                      )}
                    </AnimatePresence>
                  </Link>
                </div>
                
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-10 h-10 bg-gradient-to-br from-red-900 to-red-700 rounded-full flex items-center justify-center">
                        <User size={18} className="text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{user?.name || 'User'}</div>
                        <div className="text-sm text-gray-500">{user?.phone}</div>
                      </div>
                    </div>
                    <Link 
                      href="/profile" 
                      className="block py-2 px-3 text-gray-700 hover:text-brown-900 transition-colors relative overflow-hidden rounded-md"
                      onClick={(e) => { handleClick(e, 'mobile-profile'); closeMenu(); }}
                    >
                      Profile
                      <AnimatePresence>
                        {activeRipple === 'mobile-profile' && (
                          <motion.span
                          className="absolute inset-0 bg-black/10 rounded"
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5, ease: 'easeInOut' }}
                        />                   
                        )}
                      </AnimatePresence>
                    </Link>
                    <Link 
                      href="/my-orders" 
                      className="block py-2 px-3 text-gray-700 hover:text-brown-900 transition-colors relative overflow-hidden rounded-md"
                      onClick={(e) => { handleClick(e, 'mobile-orders'); closeMenu(); }}
                    >
                      My Orders
                      <AnimatePresence>
                        {activeRipple === 'mobile-orders' && (
                        <motion.span
                          className="absolute inset-0 bg-black/10 rounded"
                          initial={{ opacity: 1 }}
                          animate={{ opacity: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.5, ease: 'easeInOut' }}
                        />  
                        )}
                      </AnimatePresence>
                    </Link>
                    <Link 
                      href="/my-bookings" 
                      className="block py-2 px-3 text-gray-700 hover:text-brown-900 transition-colors relative overflow-hidden rounded-md"
                      onClick={(e) => { handleClick(e, 'mobile-bookings'); closeMenu(); }}
                    >
                      My Bookings
                      <AnimatePresence>
                        {activeRipple === 'mobile-bookings' && (
                          <motion.span
                            className="absolute inset-0 bg-black/10 rounded"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                          />
                        )}
                      </AnimatePresence>
                    </Link>
                    <button 
                      onClick={(e) => {
                        handleClick(e, 'mobile-logout');
                        setTimeout(() => {
                          logout();
                          closeMenu();
                        }, 300);
                        // logout(); closeMenu(); 
                      }} 
                      className="block w-full text-left py-2 px-3 text-gray-700 hover:text-brown-900 transition-colors relative overflow-hidden rounded-md"
                    >
                      Logout
                      <AnimatePresence>
                        {activeRipple === 'mobile-logout' && (
                          <motion.span
                            className="absolute inset-0 bg-black/10 rounded"
                            initial={{ opacity: 1 }}
                            animate={{ opacity: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5, ease: 'easeInOut' }}
                          />
                        )}
                      </AnimatePresence>
                    </button>
                  </div>
                ) : (
                  <Link 
                    href="/auth" 
                    className="block w-full text-center py-3 bg-gradient-to-r from-brown-900 to-brown-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-lg relative overflow-hidden"
                    onClick={(e) => { handleClick(e, 'mobile-login'); closeMenu(); }}
                  >
                    Login
                    <AnimatePresence>
                      {activeRipple === 'mobile-login' && (
                        <motion.span
                        className="absolute inset-0 bg-black/10 rounded"
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                      />
                      )}
                    </AnimatePresence>
                  </Link>
                )}
              </div>
            </div>
          </div>
      </div>
       )}
    </>
  );
};

export default Header3;
