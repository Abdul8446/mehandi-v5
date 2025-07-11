'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface Admin {
  id: string;
  email: string;
  name: string;
  token: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  isAdminAuthenticated: boolean;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  adminLogout: () => void;
  adminLoading: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [adminLoading, setAdminLoading] = useState(true);

  useEffect(() => {
    // Check for saved admin auth on initial load
    const savedAdminAuth = localStorage.getItem('admin-auth');
    
    if (savedAdminAuth) {
      const { admin: savedAdmin, expiresAt } = JSON.parse(savedAdminAuth);
      if (new Date(expiresAt) > new Date()) {
        setAdmin(savedAdmin);
      } else {
        localStorage.removeItem('admin-auth');
      }
    }
    setAdminLoading(false);
  }, []);

  const saveAdminAuth = (adminData: Admin) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
  
    const authData = {
      admin: adminData,
      expiresAt: expiryDate.toISOString()
    };
  
    localStorage.setItem('admin-auth', JSON.stringify(authData));
    setAdmin(adminData);
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        const adminData: Admin = {
          id: data.admin.id,
          email: data.admin.email,
          name: data.admin.name,
          token: data.token
        };
        saveAdminAuth(adminData);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const adminLogout = () => {
    localStorage.removeItem('admin-auth');
    setAdmin(null);
  };

  const isAdminAuthenticated = !!admin;

  return (
    <AdminAuthContext.Provider value={{ 
      admin, 
      isAdminAuthenticated,
      adminLogin, 
      adminLogout,
      adminLoading   
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}