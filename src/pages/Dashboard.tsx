import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  ArrowUpRight, Users, Calendar, DollarSign, BarChart3, 
  Heart, BookOpen, Clock, Trophy, HandHeart, Activity 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import DonorDashboard from './DonorDashboard';
import VolunteerDashboard from './VolunteerDashboard';
import BeneficiaryDashboard from './BeneficiaryDashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [stats, setStats] = useState({
    donationsTotal: 0,
    volunteersActive: 0,
    beneficiariesHelped: 0,
    upcomingEvents: 0
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Fetch dashboard stats
    // This is just mock data. In a real app, you would fetch these from your API
    const fetchStats = () => {
      setStats({
        donationsTotal: 125000,
        volunteersActive: 250,
        beneficiariesHelped: 1250,
        upcomingEvents: 8
      });
    };
    
    fetchStats();
  }, []);
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-16 h-16 border-4 border-theuyir-yellow border-t-theuyir-pink rounded-full animate-spin"></div>
        <p className="mt-4 text-theuyir-darkgrey font-medium">Loading your dashboard...</p>
      </div>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Render dashboard based on user role
  const renderRoleDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return <AdminDashboard />;
      case 'volunteer':
        return <VolunteerDashboard />;
      case 'beneficiary':
        return <BeneficiaryDashboard />;
      default:
        return <DonorDashboard />;
    }
  };
  
  return (
    <div className="flex flex-col">
      <div className="bg-theuyir-darkgrey py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">Welcome, {user?.name || 'Friend'}</h1>
          <p className="text-white/80">Here's your personalized dashboard view</p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {renderRoleDashboard()}
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-theuyir-darkgrey mb-6">Community Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center mb-3">
                <div className="bg-theuyir-yellow/10 p-3 rounded-full mr-3">
                  <DollarSign size={24} className="text-theuyir-darkgrey" />
                </div>
                <h3 className="font-semibold text-lg text-theuyir-darkgrey">Donations</h3>
              </div>
              <p className="text-3xl font-bold text-theuyir-darkgrey mb-1">₹{stats.donationsTotal.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Total funds raised</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center mb-3">
                <div className="bg-theuyir-yellow/10 p-3 rounded-full mr-3">
                  <Users size={24} className="text-theuyir-darkgrey" />
                </div>
                <h3 className="font-semibold text-lg text-theuyir-darkgrey">Volunteers</h3>
              </div>
              <p className="text-3xl font-bold text-theuyir-darkgrey mb-1">{stats.volunteersActive}</p>
              <p className="text-sm text-gray-600">Active volunteers</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center mb-3">
                <div className="bg-theuyir-yellow/10 p-3 rounded-full mr-3">
                  <Heart size={24} className="text-theuyir-darkgrey" />
                </div>
                <h3 className="font-semibold text-lg text-theuyir-darkgrey">Beneficiaries</h3>
              </div>
              <p className="text-3xl font-bold text-theuyir-darkgrey mb-1">{stats.beneficiariesHelped}</p>
              <p className="text-sm text-gray-600">Lives impacted</p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex items-center mb-3">
                <div className="bg-theuyir-yellow/10 p-3 rounded-full mr-3">
                  <Calendar size={24} className="text-theuyir-darkgrey" />
                </div>
                <h3 className="font-semibold text-lg text-theuyir-darkgrey">Events</h3>
              </div>
              <p className="text-3xl font-bold text-theuyir-darkgrey mb-1">{stats.upcomingEvents}</p>
              <p className="text-sm text-gray-600">Upcoming events</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-theuyir-darkgrey mb-6">Ways to Get Involved</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-theuyir-pink/10 p-3 rounded-full">
                  <HandHeart size={28} className="text-theuyir-pink" />
                </div>
                <ArrowUpRight size={20} className="text-theuyir-pink opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-bold text-theuyir-darkgrey mb-2">Volunteer</h3>
              <p className="text-gray-600 mb-4">Share your time and skills to make a direct impact in someone's life.</p>
              <a href="/get-involved" className="text-theuyir-pink font-medium hover:underline inline-flex items-center">
                Browse Opportunities
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-theuyir-pink/10 p-3 rounded-full">
                  <DollarSign size={28} className="text-theuyir-pink" />
                </div>
                <ArrowUpRight size={20} className="text-theuyir-pink opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-bold text-theuyir-darkgrey mb-2">Donate</h3>
              <p className="text-gray-600 mb-4">Support our work financially to help us reach more people in need.</p>
              <a href="/give" className="text-theuyir-pink font-medium hover:underline inline-flex items-center">
                Make a Contribution
              </a>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-theuyir-pink/10 p-3 rounded-full">
                  <Activity size={28} className="text-theuyir-pink" />
                </div>
                <ArrowUpRight size={20} className="text-theuyir-pink opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h3 className="text-xl font-bold text-theuyir-darkgrey mb-2">Spread the Word</h3>
              <p className="text-gray-600 mb-4">Help us reach more people by sharing our mission with your network.</p>
              <a href="/stories" className="text-theuyir-pink font-medium hover:underline inline-flex items-center">
                Share Our Stories
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 