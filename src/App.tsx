import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import LoadingProvider from '@/contexts/LoadingContext';
import Layout from '@/components/layout/Layout';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Services from '@/pages/Services';
import GetInvolved from '@/pages/GetInvolved';
import Give from '@/pages/Give';
import Stories from '@/pages/Stories';
import NotFound from '@/pages/NotFound';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LoadingProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/services" element={<Services />} />
                <Route path="/get-involved" element={<GetInvolved />} />
                <Route path="/give" element={<Give />} />
                <Route path="/stories" element={<Stories />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </Router>
        </LoadingProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
