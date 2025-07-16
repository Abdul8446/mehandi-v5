'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

interface User {
  id: string;
  phone: string;
  name: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  register: (
    phone: string,
    name: string,
    password: string,
    securityQuestion1: string,
    securityAnswer1: string,
    securityQuestion2: string,
    securityAnswer2: string
  ) => Promise<boolean>;
  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  validateToken: () => Promise<boolean>;
  getSecurityQuestions: (phone: string) => Promise<string[] | null>;
  resetPassword: (phone: string, answers: string[], newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

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
          
          if (!authData?.token || !authData?.user || !authData?.expiresAt) {
            throw new Error('Invalid auth data structure');
          }

          const isExpired = new Date(authData.expiresAt) <= new Date();
          if (isExpired) {
            throw new Error('Token expired');
          }

          const isValid = await validateTokenWithServer(authData.token);
          if (!isValid) {
            throw new Error('Invalid token');
          }

          setUser(authData.user);
        } catch (error) {
          console.error('Auth initialization failed:', error);
          localStorage.removeItem('auth');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth') {
        if (e.newValue) {
          try {
            const authData = JSON.parse(e.newValue);
            setUser(authData.user);
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const saveAuth = (userData: User) => {
    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      
      const authData = {
        user: userData,
        expiresAt: expiryDate.toISOString(),
        token: userData.token
      };
      
      localStorage.setItem('auth', JSON.stringify(authData));
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Failed to save auth:', error);
      return false;
    }
  };

  const register = async (
    phone: string,
    name: string, 
    password: string,
    securityQuestion1: string,
    securityAnswer1: string,
    securityQuestion2: string,
    securityAnswer2: string
  ) => {
    console.log(securityQuestion1,'securityQuestion1 is here in the  context');
    setLoading(true);
    try {
      // Then register the user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone, 
          name, 
          password ,
          securityQuestion1,
          securityAnswer1,
          securityQuestion2,
          securityAnswer2
        })
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      
      const data = await response.json();
      
      console.log(data, 'Registration response data');

      const userData: User = {
        id: data.user.id,
        phone: data.user.phone,
        name: data.user.name,
        token: data.token
      };
      
      saveAuth(userData);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();

      console.log('Login response:', data);
      const userData: User = {
        id: data.user._id,
        phone: data.user.phone,
        name: data.user.name,
        token: data.token
      };
      
      saveAuth(userData);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (
    phone: string, 
    answers: string[], 
    newPassword: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, answers, newPassword })
      });

      if (!response.ok) {
        throw new Error('Password reset failed');
      }

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Password reset failed:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getSecurityQuestions = async (phone: string): Promise<string[] | null> => {
    try {
      const response = await fetch(`/api/auth/security-questions?phone=${phone}`);
      if (!response.ok) {
        throw new Error('Failed to get security questions');
      }
      const data = await response.json();
      return data.questions;
    } catch (error) {
      console.error('Error getting security questions:', error);
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

  useEffect(() => {
    console.log('Auth state updated:', { user, isAuthenticated: !!user, loading });
  }, [user, loading]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      register,
      login,
      logout,
      loading,
      validateToken,
      resetPassword,
      getSecurityQuestions
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