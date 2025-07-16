import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['localhost:3000','images.pexels.com','drive.google.com','images.unsplash.com','res.cloudinary.com','m.media-amazon.com','i.pinimg.com','img3.exportersindia.com','lifeline-foundation.org'],
    remotePatterns: [new URL('http://localhost:3000/**')]
  },
  eslint: {
    ignoreDuringBuilds: true, // Disables ESLint during builds
  },
  env: {
    NEXTAUTH_URL: process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL || 'http://localhost:3000',
  },
};

export default nextConfig;
