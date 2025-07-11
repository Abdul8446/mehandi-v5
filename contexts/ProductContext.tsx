

// 'use client';

// import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
// import { IProduct } from '@/models/Product';

// interface ProductContextType {
//   products: IProduct[];
//   setProducts: (products: IProduct[]) => void;
//   loading: boolean;
//   error: string | null;
//   refreshProducts: () => Promise<void>;
// }

// const ProductContext = createContext<ProductContextType | undefined>(undefined);

// export const ProductProvider = ({ children, initialProducts }: { 
//   children: ReactNode;
//   initialProducts?: IProduct[]; // For SSR hydration
// }) => {
//   const [products, setProducts] = useState<IProduct[]>(initialProducts || []);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Fetch products from API
//   const fetchProducts = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch('/api/products');
//       const data = await response.json();
//       if (response.ok) {
//         setProducts(data);
//         // Optionally save to localStorage for offline use
//         localStorage.setItem('products', JSON.stringify(data));
//       } else {
//         throw new Error(data.message || 'Failed to fetch products');
//       }
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Unknown error');
//       // Fallback to localStorage if API fails
//       const storedProducts = localStorage.getItem('products');
//       if (storedProducts) {
//         try {
//           setProducts(JSON.parse(storedProducts));
//         } catch (parseError) {
//           console.error('Failed to parse localStorage products', parseError);
//         }
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Initial load
//   useEffect(() => {
//     if (!initialProducts || initialProducts.length === 0) {
//       fetchProducts();
//     }
//   }, []);

//   // Sync with localStorage for client-side changes
//   useEffect(() => {
//     if (products.length > 0) {
//       localStorage.setItem('products', JSON.stringify(products));
//     }
//   }, [products]);

//   return (
//     <ProductContext.Provider value={{ 
//       products, 
//       setProducts, 
//       loading, 
//       error,
//       refreshProducts: fetchProducts
//     }}>
//       {children}
//     </ProductContext.Provider>
//   );
// };

// export const useProducts = () => {
//   const context = useContext(ProductContext);
//   if (context === undefined) {
//     throw new Error('useProducts must be used within a ProductProvider');
//   }
//   return context;
// };



'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { IProduct } from '@/models/Product';

interface ProductContextType {
  products: IProduct[];
  setProducts: (products: IProduct[]) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<IProduct[]>([]);

  // // Load products from localStorage when component mounts
  // useEffect(() => {
  //   const storedProducts = localStorage.getItem('products');
  //   if (storedProducts) {
  //     try {
  //       const parsedProducts: IProduct[] = JSON.parse(storedProducts);
  //       setProducts(parsedProducts);
  //     } catch (error) {
  //       console.error('Failed to parse products from localStorage:', error);
  //     }
  //   }
  // }, []);

  // // Save products to localStorage whenever they change
  // useEffect(() => {
  //   if (products.length > 0) {
  //     console.log('Saving products to localStorage:', products);
  //     localStorage.setItem('products', JSON.stringify(products));
  //   }
  // }, [products]);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};