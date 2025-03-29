import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster as Sonner } from '@/components/ui/sonner';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden">
      <Navbar />
      <main className="flex-grow pt-[72px] md:pt-[88px] w-full max-w-[100vw] overflow-x-hidden">
        {children}
      </main>
      <Footer />
      <Sonner />
    </div>
  );
};

export default Layout; 