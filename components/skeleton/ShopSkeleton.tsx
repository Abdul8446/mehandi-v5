// components/ShopSkeleton.tsx
const ShopSkeleton = () => {
    // Skeleton for category filters (radio buttons)
    const categorySkeleton = Array(4).fill(0).map((_, i) => (
      <div key={i} className="h-5 bg-gray-300 rounded mb-2 w-3/4 animate-pulse"></div>
    ));
  
    // Skeleton for products grid cards
    const productSkeleton = Array(8).fill(0).map((_, i) => (
      <div
        key={i}
        className="border border-gray-200 rounded-md space-y-3 animate-pulse"
      >
        <div className="bg-gray-300 h-60 rounded-t-md"></div>
        <div className="p-4 space-y-3 pb-6">
          <div className="h-4 bg-gray-300 rounded w-5/6"></div>
          <div className="h-4 bg-gray-300 rounded w-1/3"></div>
        </div>
      </div>
    ));
  
    return (
      <div className="min-h-screen flex flex-col">
        {/* Header placeholder */}
        {/* <div className="h-20 bg-gray-100 animate-pulse"></div> */}
  
        <main className="flex-grow">
          {/* Hero section */}
          {/* <div className="bg-amber-800 text-white py-16">
            <div className="container mx-auto px-4 text-center">
              <div className="h-10 w-48 mx-auto mb-4 bg-amber-700 rounded animate-pulse"></div>
              <div className="h-4 max-w-2xl mx-auto bg-amber-700 rounded animate-pulse"></div>
            </div>
          </div> */}
  
          <div className="container mx-auto px-4 pt-12 pb-6">
            <div className="flex flex-col md:flex-row">
              {/* Filters sidebar */}
              <div className="md:w-1/4 lg:w-1/5 md:pr-8 block">
                <div className="sticky top-24 md:space-y-8">
                  <div>
                    <div className="h-8 w-full bg-gray-300 md:hidden rounded mb-4 animate-pulse"></div>
                    <div className="h-6 w-28 bg-gray-300 rounded mb-4 animate-pulse"></div>
                    <div className="flex items-center space-x-2">
                      <div className="h-5 w-5 bg-gray-300 md:hidden rounded animate-pulse"></div>
                      <div className="h-8 w-36 bg-gray-300 md:hidden rounded animate-pulse"></div>
                    </div>
                    <div className="hidden md:block">{categorySkeleton}</div>
                    <div className="h-5 w-24 hidden md:block bg-gray-300 rounded mt-4 animate-pulse"></div>
                  </div>
  
                  <div>
                    <div className="h-6 w-28 hidden md:block bg-gray-300 rounded md:mb-4 animate-pulse"></div>
                    <div className="md:flex hidden justify-between md:mb-2">
                      <div className="h-4 w-10 hidden md:block bg-gray-300 rounded animate-pulse"></div>
                      <div className="h-4 w-10 hidden md:block bg-gray-300 rounded animate-pulse"></div>
                    </div>
                    <div className="h-2 bg-gray-300 hidden md:block rounded animate-pulse"></div>
                  </div>
  
                  <div>
                    <div className="h-8 w-full hidden md:block bg-gray-300 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
  
              {/* Products grid */}
              <div className="md:w-3/4 lg:w-4/5">
                <div className="flex flex-wrap items-center justify-between mb-8 pb-4 border-b border-gray-200">
                  <div className="h-4 w-32 bg-gray-300 rounded hidden md:block animate-pulse"></div>
                  <div className="flex items-center space-x-2">
                    <div className="h-5 w-5 bg-gray-300 hidden md:block rounded animate-pulse"></div>
                    <div className="h-8 w-36 bg-gray-300 hidden md:block rounded animate-pulse"></div>
                  </div>
                </div>
  
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {productSkeleton}
                </div>
              </div>
            </div>
          </div>
        </main>
  
        {/* Footer placeholder */}
        <div className="h-24 bg-gray-100 animate-pulse"></div>
      </div>
    );
  };
  
  export default ShopSkeleton;
  