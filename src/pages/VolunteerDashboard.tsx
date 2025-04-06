import React, { useEffect, useState } from 'react';
import { 
  Clock, Calendar, Users, Award, CheckCircle2, 
  PlusCircle, ArrowRight, MapPin, ClipboardList
} from 'lucide-react';
import Button from '@/components/ui/button.tsx';

interface VolunteerOpportunity {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  hours: number;
}

interface VolunteerStats {
  totalHours: number;
  completedEvents: number;
  upcomingEvents: number;
  impact: number;
}

const VolunteerDashboard: React.FC = () => {
  const [opportunities, setOpportunities] = useState<VolunteerOpportunity[]>([]);
  const [stats, setStats] = useState<VolunteerStats>({
    totalHours: 0,
    completedEvents: 0,
    upcomingEvents: 0,
    impact: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchVolunteerData = () => {
      setIsLoading(true);
      
      // Mock data
      const mockOpportunities: VolunteerOpportunity[] = [
        { 
          id: '1', 
          title: 'After-School Tutoring', 
          date: '2023-10-25', 
          location: 'Chennai Community Center',
          description: 'Help children with homework and educational activities',
          status: 'upcoming',
          hours: 2
        },
        { 
          id: '2', 
          title: 'Food Distribution', 
          date: '2023-10-15', 
          location: 'Chennai Central',
          description: 'Distribute meals to homeless individuals',
          status: 'completed',
          hours: 3
        },
        { 
          id: '3', 
          title: 'Beach Cleanup', 
          date: '2023-09-30', 
          location: 'Marina Beach',
          description: 'Participate in cleaning up the beach area',
          status: 'completed',
          hours: 4
        },
      ];
      
      const mockStats: VolunteerStats = {
        totalHours: 24,
        completedEvents: 5,
        upcomingEvents: 1,
        impact: 75
      };
      
      setTimeout(() => {
        setOpportunities(mockOpportunities);
        setStats(mockStats);
        setIsLoading(false);
      }, 500);
    };
    
    fetchVolunteerData();
  }, []);
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center mb-3">
            <div className="bg-theuyir-yellow/10 p-3 rounded-full mr-3">
              <Clock size={24} className="text-theuyir-darkgrey" />
            </div>
            <h3 className="font-semibold text-lg text-theuyir-darkgrey">Total Hours</h3>
          </div>
          <p className="text-3xl font-bold text-theuyir-darkgrey mb-1">{stats.totalHours}</p>
          <p className="text-sm text-gray-600">Hours of service</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center mb-3">
            <div className="bg-theuyir-yellow/10 p-3 rounded-full mr-3">
              <CheckCircle2 size={24} className="text-theuyir-darkgrey" />
            </div>
            <h3 className="font-semibold text-lg text-theuyir-darkgrey">Completed</h3>
          </div>
          <p className="text-3xl font-bold text-theuyir-darkgrey mb-1">{stats.completedEvents}</p>
          <p className="text-sm text-gray-600">Events completed</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center mb-3">
            <div className="bg-theuyir-yellow/10 p-3 rounded-full mr-3">
              <Calendar size={24} className="text-theuyir-darkgrey" />
            </div>
            <h3 className="font-semibold text-lg text-theuyir-darkgrey">Upcoming</h3>
          </div>
          <p className="text-3xl font-bold text-theuyir-darkgrey mb-1">{stats.upcomingEvents}</p>
          <p className="text-sm text-gray-600">Events scheduled</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center mb-3">
            <div className="bg-theuyir-yellow/10 p-3 rounded-full mr-3">
              <Users size={24} className="text-theuyir-darkgrey" />
            </div>
            <h3 className="font-semibold text-lg text-theuyir-darkgrey">Impact</h3>
          </div>
          <p className="text-3xl font-bold text-theuyir-darkgrey mb-1">{stats.impact}</p>
          <p className="text-sm text-gray-600">Lives impacted</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-theuyir-darkgrey">Your Volunteer Activities</h3>
          <Button variant="outline" className="flex items-center group">
            <PlusCircle size={16} className="mr-2" />
            Log Hours
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-theuyir-yellow border-t-theuyir-pink rounded-full animate-spin"></div>
          </div>
        ) : opportunities.length > 0 ? (
          <div className="space-y-4">
            {opportunities.map((opportunity) => (
              <div 
                key={opportunity.id} 
                className={`border rounded-lg p-4 transition-all ${
                  opportunity.status === 'upcoming' 
                    ? 'border-theuyir-yellow bg-theuyir-yellow/5' 
                    : opportunity.status === 'completed'
                      ? 'border-green-300 bg-green-50'
                      : 'border-red-300 bg-red-50'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <h4 className="font-semibold text-theuyir-darkgrey">{opportunity.title}</h4>
                    <div className="flex flex-wrap gap-y-2 gap-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        {new Date(opportunity.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-1" />
                        {opportunity.location}
                      </div>
                      <div className="flex items-center">
                        <Clock size={14} className="mr-1" />
                        {opportunity.hours} hours
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{opportunity.description}</p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      opportunity.status === 'upcoming' 
                        ? 'bg-theuyir-yellow/20 text-theuyir-darkgrey' 
                        : opportunity.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
                    </span>
                    
                    {opportunity.status === 'upcoming' && (
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    )}
                    
                    {opportunity.status === 'completed' && (
                      <Button variant="outline" size="sm">
                        Certificate
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't signed up for any volunteer opportunities yet.</p>
            <Button variant="primary" asChild>
              <a href="/get-involved">Browse Opportunities</a>
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold text-theuyir-darkgrey mb-6">Suggested Opportunities</h3>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-theuyir-yellow transition-colors">
              <h4 className="font-semibold text-theuyir-darkgrey">Elder Care Assistant</h4>
              <div className="flex flex-wrap gap-y-2 gap-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  Weekends
                </div>
                <div className="flex items-center">
                  <MapPin size={14} className="mr-1" />
                  Coimbatore
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  4 hours/week
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="mt-3">
                View Details
              </Button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:border-theuyir-yellow transition-colors">
              <h4 className="font-semibold text-theuyir-darkgrey">Community Garden Project</h4>
              <div className="flex flex-wrap gap-y-2 gap-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  Saturday Mornings
                </div>
                <div className="flex items-center">
                  <MapPin size={14} className="mr-1" />
                  Chennai
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  3 hours/week
                </div>
              </div>
              
              <Button variant="outline" size="sm" className="mt-3">
                View Details
              </Button>
            </div>
          </div>
          
          <div className="mt-4 text-center">
            <a href="/get-involved" className="text-theuyir-pink hover:underline inline-flex items-center">
              View All Opportunities
              <ArrowRight size={14} className="ml-1" />
            </a>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold text-theuyir-darkgrey mb-6">Your Achievements</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="bg-theuyir-yellow/10 p-3 rounded-full mr-4">
                <Award size={24} className="text-theuyir-darkgrey" />
              </div>
              <div>
                <h4 className="font-semibold text-theuyir-darkgrey">20 Hour Club</h4>
                <p className="text-sm text-gray-600">Completed 20+ hours of volunteer service</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <Award size={24} className="text-gray-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-600">50 Hour Club</h4>
                <p className="text-sm text-gray-500">Complete 50+ hours to unlock</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-theuyir-pink h-2 rounded-full" style={{ width: '48%' }}></div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="bg-gray-100 p-3 rounded-full mr-4">
                <Award size={24} className="text-gray-400" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-600">Dedicated Volunteer</h4>
                <p className="text-sm text-gray-500">Volunteer for 3 consecutive months</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div className="bg-theuyir-pink h-2 rounded-full" style={{ width: '33%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-theuyir-lightgrey p-6 rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-theuyir-darkgrey mb-2">Ready to Help Again?</h3>
            <p className="text-gray-600">Explore new volunteer opportunities that match your interests.</p>
          </div>
          <Button variant="primary" asChild className="flex items-center group">
            <a href="/get-involved">
              Find Opportunities
              <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard; 