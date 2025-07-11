// app/providers.tsx
'use client'

import { AdminAuthProvider } from "@/contexts/AdminAuthContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { BookingProvider } from "@/contexts/BookingContext"
import { CartProvider } from "@/contexts/CartContext"
import { ProductProvider } from "@/contexts/ProductContext"
import { WishlistProvider } from "@/contexts/WishlistContext"


export function Providers({ children }: { children: React.ReactNode }) {
  return <AuthProvider>
            <AdminAuthProvider>
                <ProductProvider>
                    <BookingProvider>
                        <CartProvider>
                            <WishlistProvider>
                                {children}
                            </WishlistProvider>
                        </CartProvider>
                    </BookingProvider>
                </ProductProvider>
            </AdminAuthProvider>
        </AuthProvider>
}


