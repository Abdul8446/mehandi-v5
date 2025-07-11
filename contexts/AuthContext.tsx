// AuthContext.tsx
// This file provides authentication context for the application, managing user state and authentication logic.
'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface User {
  id: string;
  phone: string;
  name?: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (phone: string) => Promise<boolean>;
  register: (phone: string, name: string) => Promise<boolean>;
  verifyOtp: (phone: string, otp: string, isLogin: boolean, name?: string) => Promise<User | null>;
  logout: () => void;
  loading: boolean;
  validateToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Validate token with server
  const validateTokenWithServer = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/validate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const savedAuth = localStorage.getItem('auth');

      if (savedAuth) {
        try {
          const authData = JSON.parse(savedAuth);
          
          // Basic client-side checks
          if (!authData?.token || !authData?.user || !authData?.expiresAt) {
            throw new Error('Invalid auth data structure');
          }

          // Check expiration locally first
          const isExpired = new Date(authData.expiresAt) <= new Date();
          if (isExpired) {
            throw new Error('Token expired');
          }

          // Then validate with server
          const isValid = await validateTokenWithServer(authData.token);
          if (!isValid) {
            throw new Error('Invalid token');
          }

          setUser(authData.user);
        } catch (error) {
          console.error('Auth initialization failed:', error);
          localStorage.removeItem('auth');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const saveAuth = (userData: User) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);
    
    const authData = {
      user: userData,
      expiresAt: expiryDate.toISOString(),
      token: userData.token
    };
    
    localStorage.setItem('auth', JSON.stringify(authData));
    setUser(userData);
  };

  const login = async (phone: string) => {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const register = async (phone: string, name: string) => {
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  const verifyOtp = async (phone: string, otp: string, isLogin: boolean, name?: string) => {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, name })
      });

      if (response.ok) {
        const data = await response.json();
        const userData: User = {
          id: data.user.id,
          phone: data.user.phone,
          name: data.user.name,
          token: data.token
        };
        saveAuth(userData);
        return userData;
      }
      return null;
    } catch (error) {
      console.error('OTP verification failed:', error);
      return null;
    }
  };

  const validateToken = async (): Promise<boolean> => {
    if (!user?.token) return false;
    return await validateTokenWithServer(user.token);
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated,
      login, 
      register, 
      verifyOtp, 
      logout,
      loading,
      validateToken
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}