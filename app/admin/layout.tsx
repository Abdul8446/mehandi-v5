'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingBag, Users,
  Calendar, BookOpen, UserCheck, BarChart2,
  Settings, LogOut, Menu, X, Bell
} from 'lucide-react';
import { useAdminAuth } from '../../contexts/AdminAuthContext'; // Adjust path as needed

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Start closed on mobile
  const { admin, isAdminAuthenticated, adminLogin, adminLoading, adminLogout } = useAdminAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Auto-open sidebar on larger screens
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    // Set initial state
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!adminLoading && (!admin || !isAdminAuthenticated)) {
      router.push('/admin/login');
    }
  }, [admin, isAdminAuthenticated, adminLoading, router]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isActive = (path: string) =>
    pathname === path
      ? 'bg-red-800 text-white'
      : 'text-gray-300 hover:bg-red-800 hover:text-white';

  const getTitle = () => {
    switch (pathname) {
      case '/admin': return 'Dashboard';
      case '/admin/products': return 'Products Management';
      case '/admin/orders': return 'Orders Management';
      case '/admin/users': return 'Users Management';
      case '/admin/bookings': return 'Bookings Management';
      case '/admin/class-schedule': return 'Class Schedule Management';
      case '/admin/artists': return 'Artists Management';
      case '/admin/reports': return 'Reports & Analytics';
      case '/admin/settings': return 'Site Settings';
      default: return '';
    }
  };

  if (adminLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      {isAdminAuthenticated && (
        <aside 
          className={`bg-red-900 text-white ${
            isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'
          } h-screen fixed md:sticky md:top-0 z-30 md:z-0 transition-all duration-300 ease-in-out`}
        >
          <div className="p-4 flex items-center justify-between">
            <Link href="/admin" className="text-xl font-bold">
              {isSidebarOpen ? 'Admin Panel' : 'MM'}
            </Link>
            <button 
              onClick={toggleSidebar} 
              className="p-1 rounded-md hover:bg-red-800"
              aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="mt-6">
            <ul className="space-y-2 px-2">
              {[
                { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
                { href: '/admin/products', icon: Package, label: 'Products' },
                { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
                { href: '/admin/users', icon: Users, label: 'Users' },
                { href: '/admin/bookings', icon: Calendar, label: 'Bookings' },
                { href: '/admin/class-schedule', icon: BookOpen, label: 'Class Schedule' },
                { href: '/admin/artists', icon: UserCheck, label: 'Artists' },
                { href: '/admin/reports', icon: BarChart2, label: 'Reports' },
                { href: '/admin/settings', icon: Settings, label: 'Settings' },
              ].map(({ href, icon: Icon, label }) => (
                <li key={href}>
                  <Link 
                    href={href} 
                    className={`flex items-center p-3 rounded-md ${isActive(href)} transition-colors`}
                    onClick={() => window.innerWidth < 768 && setIsSidebarOpen(false)}
                  >
                    <Icon size={20} className="mr-3" />
                    {isSidebarOpen && <span>{label}</span>}
                  </Link>
                </li>
              ))}

              <li>
                <button
                  onClick={adminLogout}
                  className="w-full flex items-center p-3 rounded-md text-gray-300 hover:bg-red-800 hover:text-white transition-colors"
                >
                  <LogOut size={20} className="mr-3" />
                  {isSidebarOpen && <span>Logout</span>}
                </button>
              </li>
            </ul>
          </nav>
        </aside>
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col ${isAdminAuthenticated ? '' : ''}`}>
        {/* Header - Sticky to top */}
        {isAdminAuthenticated && (
          <header className="bg-white shadow-sm sticky top-0 z-10">
            <div className="px-4 py-3 flex justify-between items-center">
              <div className="flex items-center">
                <button 
                  onClick={toggleSidebar}
                  className="mr-4 p-1 rounded-md hover:bg-gray-100 md:hidden"
                  aria-label="Toggle sidebar"
                >
                  <Menu size={20} />
                </button>
                <h1 className="text-xl font-semibold text-gray-800">{getTitle()}</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Bell size={20} className="text-gray-600 cursor-pointer" />
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-900 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">A</span>
                  </div>
                  <span className="text-sm font-medium hidden md:inline">Admin</span>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;