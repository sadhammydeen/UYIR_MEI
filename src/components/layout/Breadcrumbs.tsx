import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  path: string;
}

interface BreadcrumbsProps {
  items?: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ 
  items = [], 
  showHome = true,
  className = "",
}) => {
  const location = useLocation();
  
  // If no items are provided, generate them from the current path
  const breadcrumbItems = items.length > 0 ? items : generateFromPath(location.pathname);

  return (
    <nav className={`flex items-center text-sm py-3 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap">
        {showHome && (
          <li className="flex items-center">
            <Link 
              to="/" 
              className="text-gray-500 hover:text-theuyir-pink flex items-center"
            >
              <Home className="h-4 w-4 mr-1" />
              <span className="sr-only sm:not-sr-only sm:ml-1">Home</span>
            </Link>
          </li>
        )}
        
        {breadcrumbItems.map((item, index) => (
          <li key={item.path} className="flex items-center">
            <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
            {index === breadcrumbItems.length - 1 ? (
              <span className="font-medium text-theuyir-darkgrey" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link 
                to={item.path} 
                className="text-gray-500 hover:text-theuyir-pink"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

// Helper function to generate breadcrumbs from the current path
function generateFromPath(path: string): BreadcrumbItem[] {
  const pathParts = path.split('/').filter(part => part);
  
  // Map to convert URL parts to readable labels
  const pathLabels: Record<string, string> = {
    'about': 'About Us',
    'services': 'What We Do',
    'get-involved': 'Get Involved',
    'give': 'Ways to Give',
    'impact-tracker': 'Impact',
    'stories': 'Stories',
    'donate': 'Donate',
    'login': 'Login',
    'register': 'Register',
    'profile': 'Profile',
    'dashboard': 'Dashboard',
    'ngo-dashboard': 'NGO Dashboard',
    'ngo-profile': 'NGO Profile',
    'ngo-directory': 'NGO Directory',
    'beneficiary-dashboard': 'Beneficiary Dashboard',
    'apply-for-support': 'Apply for Support'
  };
  
  return pathParts.map((part, index) => {
    const path = '/' + pathParts.slice(0, index + 1).join('/');
    const label = pathLabels[part] || part.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return { path, label };
  });
}

export default Breadcrumbs; 