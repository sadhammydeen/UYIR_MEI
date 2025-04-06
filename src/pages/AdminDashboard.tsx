import React, { useEffect, useState } from 'react';
import { 
  Users, DollarSign, Heart, Calendar, BarChart2, 
  Settings, FileText, Bell, Sliders, UserPlus, Plus,
  ListChecks, Package, Database, ShieldCheck
} from 'lucide-react';
import Button from '@/components/ui/button.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalBeneficiaries: 0,
    totalVolunteers: 0,
    pendingRequests: 0
  });
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchAdminStats = () => {
      setIsLoading(true);
      
      // Mock data
      setTimeout(() => {
        setStats({
          totalDonations: 450000,
          totalBeneficiaries: 750,
          totalVolunteers: 250,
          pendingRequests: 12
        });
        setIsLoading(false);
      }, 500);
    };
    
    fetchAdminStats();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-4 items-start">
        <h2 className="text-2xl font-bold text-theuyir-darkgrey">Admin Dashboard</h2>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center">
            <Settings size={16} className="mr-2" />
            Settings
          </Button>
          <Button variant="outline" className="flex items-center">
            <Bell size={16} className="mr-2" />
            Notifications
            <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full text-xs">3</span>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center mb-3">
            <div className="bg-theuyir-yellow/10 p-3 rounded-full mr-3">
              <DollarSign size={24} className="text-theuyir-darkgrey" />
            </div>
            <h3 className="font-semibold text-lg text-theuyir-darkgrey">Total Donations</h3>
          </div>
          {isLoading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
          ) : (
            <p className="text-3xl font-bold text-theuyir-darkgrey mb-1">₹{stats.totalDonations.toLocaleString()}</p>
          )}
          <p className="text-sm text-gray-600">All time donations</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center mb-3">
            <div className="bg-theuyir-yellow/10 p-3 rounded-full mr-3">
              <Heart size={24} className="text-theuyir-darkgrey" />
            </div>
            <h3 className="font-semibold text-lg text-theuyir-darkgrey">Beneficiaries</h3>
          </div>
          {isLoading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          ) : (
            <p className="text-3xl font-bold text-theuyir-darkgrey mb-1">{stats.totalBeneficiaries}</p>
          )}
          <p className="text-sm text-gray-600">Registered beneficiaries</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center mb-3">
            <div className="bg-theuyir-yellow/10 p-3 rounded-full mr-3">
              <Users size={24} className="text-theuyir-darkgrey" />
            </div>
            <h3 className="font-semibold text-lg text-theuyir-darkgrey">Volunteers</h3>
          </div>
          {isLoading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          ) : (
            <p className="text-3xl font-bold text-theuyir-darkgrey mb-1">{stats.totalVolunteers}</p>
          )}
          <p className="text-sm text-gray-600">Active volunteers</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center mb-3">
            <div className="bg-theuyir-yellow/10 p-3 rounded-full mr-3">
              <ListChecks size={24} className="text-theuyir-darkgrey" />
            </div>
            <h3 className="font-semibold text-lg text-theuyir-darkgrey">Pending</h3>
          </div>
          {isLoading ? (
            <div className="animate-pulse h-8 bg-gray-200 rounded w-1/5 mb-2"></div>
          ) : (
            <p className="text-3xl font-bold text-theuyir-darkgrey mb-1">{stats.pendingRequests}</p>
          )}
          <p className="text-sm text-gray-600">Service requests</p>
        </div>
      </div>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6 bg-theuyir-lightgrey">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="beneficiaries">Beneficiaries</TabsTrigger>
          <TabsTrigger value="volunteers">Volunteers</TabsTrigger>
          <TabsTrigger value="donations">Donations</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-theuyir-darkgrey">Recent Activity</h3>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <DollarSign size={18} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-theuyir-darkgrey">New Donation - ₹25,000</p>
                    <p className="text-xs text-gray-500">15 minutes ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <Heart size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-theuyir-darkgrey">New Beneficiary Application</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <Package size={18} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-theuyir-darkgrey">Service Request Completed</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <Users size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-theuyir-darkgrey">New Volunteer Joined</p>
                    <p className="text-xs text-gray-500">Yesterday</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-theuyir-darkgrey">Quick Actions</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-auto py-4 justify-start" variant="outline">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center mb-2">
                      <UserPlus size={18} className="mr-2 text-theuyir-pink" />
                      <span className="font-medium">Add User</span>
                    </div>
                    <p className="text-xs text-left text-gray-500">Register new user</p>
                  </div>
                </Button>
                
                <Button className="h-auto py-4 justify-start" variant="outline">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center mb-2">
                      <Calendar size={18} className="mr-2 text-theuyir-pink" />
                      <span className="font-medium">New Event</span>
                    </div>
                    <p className="text-xs text-left text-gray-500">Schedule an event</p>
                  </div>
                </Button>
                
                <Button className="h-auto py-4 justify-start" variant="outline">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center mb-2">
                      <FileText size={18} className="mr-2 text-theuyir-pink" />
                      <span className="font-medium">Reports</span>
                    </div>
                    <p className="text-xs text-left text-gray-500">Generate reports</p>
                  </div>
                </Button>
                
                <Button className="h-auto py-4 justify-start" variant="outline">
                  <div className="flex flex-col items-start">
                    <div className="flex items-center mb-2">
                      <Package size={18} className="mr-2 text-theuyir-pink" />
                      <span className="font-medium">Services</span>
                    </div>
                    <p className="text-xs text-left text-gray-500">Manage services</p>
                  </div>
                </Button>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-theuyir-darkgrey">System Status</h3>
              <Button variant="ghost" size="sm">Refresh</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center">
                  <Database size={18} className="text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-theuyir-darkgrey">Database</p>
                    <p className="text-xs text-gray-500">Connected</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Healthy</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-100">
                <div className="flex items-center">
                  <ShieldCheck size={18} className="text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-theuyir-darkgrey">Security</p>
                    <p className="text-xs text-gray-500">No threats detected</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs font-medium">Secure</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-100">
                <div className="flex items-center">
                  <Sliders size={18} className="text-yellow-600 mr-3" />
                  <div>
                    <p className="font-medium text-theuyir-darkgrey">Maintenance</p>
                    <p className="text-xs text-gray-500">Scheduled: Oct 25</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-medium">Pending</span>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="beneficiaries">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-theuyir-darkgrey">Beneficiary Management</h3>
              <Button className="flex items-center">
                <Plus size={16} className="mr-2" />
                Add Beneficiary
              </Button>
            </div>
            
            <p className="text-gray-500">Beneficiary management content would go here, including lists of beneficiaries, approval workflows, and service tracking.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="volunteers">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-theuyir-darkgrey">Volunteer Management</h3>
              <Button className="flex items-center">
                <Plus size={16} className="mr-2" />
                Add Volunteer
              </Button>
            </div>
            
            <p className="text-gray-500">Volunteer management content would go here, including volunteer listings, hour tracking, and opportunity management.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="donations">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-theuyir-darkgrey">Donation Management</h3>
              <Button className="flex items-center">
                <BarChart2 size={16} className="mr-2" />
                Export Reports
              </Button>
            </div>
            
            <p className="text-gray-500">Donation management content would go here, including transaction records, campaign performance, and financial reporting.</p>
          </div>
        </TabsContent>
        
        <TabsContent value="services">
          <div className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-theuyir-darkgrey">Service Management</h3>
              <Button className="flex items-center">
                <Plus size={16} className="mr-2" />
                Add Service
              </Button>
            </div>
            
            <p className="text-gray-500">Service management content would go here, including service catalog, request tracking, and resource allocation.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard; 