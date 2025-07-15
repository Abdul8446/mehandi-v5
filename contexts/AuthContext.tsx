// 'use client';

// import { createContext, useContext, ReactNode, useState, useEffect } from 'react';

// interface User {
//   id: string;
//   phone: string;
//   name?: string;
//   token: string;
// }

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   login: (phone: string) => Promise<boolean>;
//   register: (phone: string, name: string) => Promise<boolean>;
//   verifyOtp: (phone: string, otp: string, isLogin: boolean, name?: string) => Promise<User | null>;
//   logout: () => void;
//   loading: boolean;
//   validateToken: () => Promise<boolean>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);

//   const validateTokenWithServer = async (token: string): Promise<boolean> => {
//     try {
//       const response = await fetch('/api/auth/validate', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`
//         }
//       });
//       return response.ok;
//     } catch (error) {
//       return false;
//     }
//   };

//   useEffect(() => {
//     const initializeAuth = async () => {
//       const savedAuth = localStorage.getItem('auth');

//       if (savedAuth) {
//         try {
//           const authData = JSON.parse(savedAuth);
          
//           if (!authData?.token || !authData?.user || !authData?.expiresAt) {
//             throw new Error('Invalid auth data structure');
//           }

//           const isExpired = new Date(authData.expiresAt) <= new Date();
//           if (isExpired) {
//             throw new Error('Token expired');
//           }

//           const isValid = await validateTokenWithServer(authData.token);
//           if (!isValid) {
//             throw new Error('Invalid token');
//           }

//           setUser(authData.user);
//         } catch (error) {
//           console.error('Auth initialization failed:', error);
//           localStorage.removeItem('auth');
//           setUser(null);
//         }
//       }
//       setLoading(false);
//     };

//     initializeAuth();

//     const handleStorageChange = (e: StorageEvent) => {
//       if (e.key === 'auth') {
//         if (e.newValue) {
//           try {
//             const authData = JSON.parse(e.newValue);
//             setUser(authData.user);
//           } catch {
//             setUser(null);
//           }
//         } else {
//           setUser(null);
//         }
//       }
//     };

//     window.addEventListener('storage', handleStorageChange);
//     return () => window.removeEventListener('storage', handleStorageChange);
//   }, []);

//   const saveAuth = (userData: User) => {
//     try {
//       const expiryDate = new Date();
//       expiryDate.setDate(expiryDate.getDate() + 7);
      
//       const authData = {
//         user: userData,
//         expiresAt: expiryDate.toISOString(),
//         token: userData.token
//       };
      
//       localStorage.setItem('auth', JSON.stringify(authData));
//       setUser(userData);
//       return true;
//     } catch (error) {
//       console.error('Failed to save auth:', error);
//       return false;
//     }
//   };

//   const login = async (phone: string) => {
//     try {
//       const response = await fetch('/api/auth/send-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ phone })
//       });
//       return response.ok;
//     } catch (error) {
//       return false;
//     }
//   };

//   const register = async (phone: string, name: string) => {
//     try {
//       const response = await fetch('/api/auth/send-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ phone, name })
//       });
//       return response.ok;
//     } catch (error) {
//       return false;
//     }
//   };

//   const verifyOtp = async (phone: string, otp: string, isLogin: boolean, name?: string) => {
//     setLoading(true);
//     try {
//       const response = await fetch('/api/auth/verify-otp', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ phone, otp, name })
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const data = await response.json();
//       const userData: User = {
//         id: data.user.id,
//         phone: data.user.phone,
//         name: data.user.name,
//         token: data.token
//       };
      
//       if (!saveAuth(userData)) {
//         throw new Error('Failed to save auth data');
//       }
      
//       return userData;
//     } catch (error) {
//       console.error('OTP verification failed:', error);
//       setUser(null);
//       localStorage.removeItem('auth');
//       return null;
//     } finally {
//       setLoading(false);
//     }
//   };

//   const validateToken = async (): Promise<boolean> => {
//     if (!user?.token) return false;
//     return await validateTokenWithServer(user.token);
//   };

//   const logout = () => {
//     localStorage.removeItem('auth');
//     setUser(null);
//   };

//   useEffect(() => {
//     console.log('Auth state updated:', { user, isAuthenticated: !!user, loading });
//   }, [user, loading]);

//   return (
//     <AuthContext.Provider value={{ 
//       user, 
//       isAuthenticated: !!user,
//       login, 
//       register, 
//       verifyOtp, 
//       logout,
//       loading,
//       validateToken
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }


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
  register: (phone: string, name: string, password: string) => Promise<boolean>;
  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
  validateToken: () => Promise<boolean>;
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

  const register = async (phone: string, name: string, password: string) => {
    setLoading(true);
    try {
      // Then register the user
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name, password })
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
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
      const userData: User = {
        id: data.user.id,
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

  const validateToken = async (): Promise<boolean> => {
    if (!user?.token) return false;
    return await validateTokenWithServer(user.token);
  };

  const logout = () => {
    localStorage.removeItem('auth');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user,
      register,
      login,
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