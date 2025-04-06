import React from 'react';
import Breadcrumbs from './Breadcrumbs';

interface PageContainerProps {
  children: React.ReactNode;
  withBreadcrumbs?: boolean;
  className?: string;
  fluid?: boolean;
  bgColor?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({
  children,
  withBreadcrumbs = true,
  className = "",
  fluid = false,
  bgColor = "bg-white"
}) => {
  return (
    <div className={`${bgColor} py-8 md:py-12 ${className}`}>
      <div className={`${fluid ? 'px-4' : 'container mx-auto px-4'}`}>
        {withBreadcrumbs && (
          <div className="mb-6">
            <Breadcrumbs />
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default PageContainer; 