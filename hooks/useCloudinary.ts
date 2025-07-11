// hooks/useCloudinary.ts
import { useState } from 'react';

type CloudinaryConfig = {
  cloudName: string;
  uploadPreset?: string;
  apiKey?: string;
};

export function useCloudinary() {
  const [config] = useState<CloudinaryConfig>({
    cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
    uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
  });

  return config;
}