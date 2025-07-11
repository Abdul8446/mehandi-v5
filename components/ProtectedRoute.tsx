// components/ProtectedRoute.tsx
import { useRouter } from 'next/navigation';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Store the attempted URL for redirecting after login
        // const currentPath = router.asPath;
        router.push('/auth');
        toast.error('Please login to access this page.');
      } else {
        setIsAuthorized(true);
      }
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;