import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import LoadingProvider from '@/contexts/LoadingContext';
import { AuthProvider } from '@/contexts/AuthContext';
import SessionProvider from '@/contexts/SessionContext';
import Layout from '@/components/layout/Layout';
import Index from '@/pages/Index';
import About from '@/pages/About';
import Services from '@/pages/Services';
import GetInvolved from '@/pages/GetInvolved';
import Give from '@/pages/Give';
import Stories from '@/pages/Stories';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import UserProfile from '@/pages/UserProfile';
import NotFound from '@/pages/NotFound';
import BeneficiaryApplication from '@/pages/BeneficiaryApplication';
import BeneficiaryDashboard from '@/pages/BeneficiaryDashboard';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import NGORegistrationForm from '@/components/ngo/NGORegistrationForm';
import NGOProfile from '@/components/ngo/NGOProfile';
import NGODashboard from '@/pages/NGODashboard';
import CollaborationDirectory from '@/components/ngo/CollaborationDirectory';
import ImpactTracker from '@/pages/ImpactTracker';
import NeedsDonate from '@/pages/Donate';

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
        <AuthProvider>
          <LoadingProvider>
            <SessionProvider>
              <Router>
                <Layout>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Index />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/get-involved" element={<GetInvolved />} />
                    <Route path="/give" element={<Give />} />
                    <Route path="/stories" element={<Stories />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/ngo-registration" element={<NGORegistrationForm />} />
                    <Route path="/impact-tracker" element={<ImpactTracker />} />
                    <Route path="/needs-donate" element={<NeedsDonate />} />
                    
                    {/* Protected routes */}
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route path="/ngo-profile" element={
                      <ProtectedRoute>
                        <NGOProfile />
                      </ProtectedRoute>
                    } />
                    <Route path="/ngo-dashboard" element={
                      <ProtectedRoute>
                        <NGODashboard />
                      </ProtectedRoute>
                    } />
                    <Route path="/ngo-directory" element={
                      <ProtectedRoute>
                        <CollaborationDirectory />
                      </ProtectedRoute>
                    } />
                    <Route path="/apply-for-support" element={
                      <ProtectedRoute>
                        <BeneficiaryApplication />
                      </ProtectedRoute>
                    } />
                    <Route path="/beneficiary-dashboard" element={
                      <ProtectedRoute>
                        <BeneficiaryDashboard />
                      </ProtectedRoute>
                    } />
                    
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Layout>
                <Toaster />
                <Sonner />
              </Router>
            </SessionProvider>
          </LoadingProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
