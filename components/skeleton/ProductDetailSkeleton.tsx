// components/ProductDetailSkeleton.tsx
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductDetailSkeleton = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-20">
      <div className="container mx-auto px-4">
        <div className="mb-6">
          <Skeleton width={200} height={20} />
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Image skeleton */}
            <div>
              <Skeleton height={384} className="mb-4" />
              <div className="flex space-x-2">
                {Array(4).fill(0).map((_, idx) => (
                  <Skeleton key={idx} width={80} height={80} />
                ))}
              </div>
            </div>

            {/* Info skeleton */}
            <div>
              <Skeleton height={32} width={300} className="mb-2" />
              <Skeleton height={28} width={150} className="mb-4" />
              <Skeleton height={20} width={100} className="mb-4" />
              <Skeleton count={3} className="mb-6" />
              <Skeleton height={20} width={100} className="mb-4" />
              <div className="flex space-x-4 mb-6">
                <Skeleton height={48} width={200} />
                <Skeleton height={48} width={48} />
              </div>
              <Skeleton count={3} className="mb-4" />
              <div className="grid grid-cols-3 gap-4 mt-6">
                {Array(3).fill(0).map((_, idx) => (
                  <Skeleton key={idx} height={80} />
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8">
            <Skeleton height={48} width={200} className="my-4 ml-6" />
            <div className="p-6">
              <Skeleton count={5} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailSkeleton;
