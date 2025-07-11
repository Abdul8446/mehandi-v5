import 'next-cloudinary';

declare module 'next-cloudinary' {
  interface CldUploadButtonProps {
    onSuccess?: (result: CloudinaryUploadResult) => void;
  }
}

type CloudinaryUploadResult = {
  event?: string;
  info?: {
    public_id: string;
    secure_url: string;
    resource_type: 'image' | 'video';
    width?: number;
    height?: number;
    format?: string;
  };
};