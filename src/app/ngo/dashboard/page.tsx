'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import ClientLayout from '../../client-layout';
import Link from 'next/link';

export default function NgoDashboard() {
  const { userData, logout } = useAuth();

  return (
    <ClientLayout>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">NGO Dashboard</h1>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-6 bg-white">
              <h2 className="text-2xl font-semibold mb-4">Welcome, {userData?.displayName || 'NGO User'}</h2>
              
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Account Information</h3>
                <ul className="space-y-2">
                  <li><strong>Email:</strong> {userData?.email}</li>
                  <li><strong>Role:</strong> {userData?.role}</li>
                  <li><strong>Account Status:</strong> {userData?.isVerified ? 'Verified' : 'Pending Verification'}</li>
                </ul>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-white shadow rounded-lg p-5 border border-gray-200">
                  <h3 className="text-lg font-medium mb-2">Profile Completion</h3>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">70% Complete</p>
                  <Link href="/ngo/profile" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
                    Complete your profile
                  </Link>
                </div>
                
                <div className="bg-white shadow rounded-lg p-5 border border-gray-200">
                  <h3 className="text-lg font-medium mb-2">Impact Metrics</h3>
                  <p className="text-3xl font-bold">0</p>
                  <p className="text-sm text-gray-600">Beneficiaries helped</p>
                  <Link href="/ngo/impact" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
                    Track your impact
                  </Link>
                </div>
                
                <div className="bg-white shadow rounded-lg p-5 border border-gray-200">
                  <h3 className="text-lg font-medium mb-2">Current Projects</h3>
                  <p className="text-3xl font-bold">0</p>
                  <p className="text-sm text-gray-600">Active projects</p>
                  <Link href="/ngo/projects" className="mt-4 inline-block text-blue-600 hover:text-blue-800">
                    Manage projects
                  </Link>
                </div>
              </div>
              
              <div className="bg-white shadow rounded-lg p-5 border border-gray-200">
                <h3 className="text-xl font-medium mb-4">Getting Started</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                    <span>Complete your NGO profile with all required information</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                    <span>Upload verification documents to get verified status</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                    <span>Create your first project to start tracking impact</span>
                  </li>
                  <li className="flex items-start">
                    <span className="h-6 w-6 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                    <span>Connect with other NGOs using the Partner Finder</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ClientLayout>
  );
} 