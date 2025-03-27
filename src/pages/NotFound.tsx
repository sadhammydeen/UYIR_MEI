import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      '404 Error: User attempted to access non-existent route:',
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="text-center px-4">
        <div className="relative">
          <h1 className="text-9xl font-bold text-theuyir-darkgrey/10 absolute inset-0 -z-10">404</h1>
          <h2 className="text-4xl font-bold text-theuyir-darkgrey mb-4">Oops!</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="primary"
            size="lg"
            className="group"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
            Go Back
          </Button>
          <Link to="/">
            <Button
              variant="outline"
              size="lg"
              className="group"
            >
              <Home className="mr-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
