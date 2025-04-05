import React, { useEffect, useState } from 'react';
import { 
  Clock, Calendar, BookOpen, FileText, PlusCircle, 
  ArrowRight, MessageCircle, CheckCircle, HelpCircle,
  Briefcase, Utensils, Heart, Stethoscope
} from 'lucide-react';
import Button from '@/components/ui/button';
import BeneficiaryService, { ServiceRequest } from '@/api/services/beneficiary.service';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';

const BeneficiaryDashboard: React.FC = () => {
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchServiceRequests = async () => {
      setIsLoading(true);
      
      try {
        const requests = await BeneficiaryService.getMyServiceRequests();
        setServiceRequests(requests);
      } catch (error) {
        console.error("Error fetching service requests:", error);
        toast({
          title: "Error",
          description: "Failed to load your service requests. Please try again later.",
          variant: "destructive",
        });
        
        // Fallback to mock data in case of API error
        const mockRequests: ServiceRequest[] = [
          { 
            id: '1', 
            beneficiaryId: 'user123',
            serviceType: 'Food Assistance', 
            description: 'Monthly grocery support for family of four',
            status: 'approved',
            priority: 'medium',
            createdAt: '2023-10-05T12:00:00Z',
            updatedAt: '2023-10-07T16:30:00Z'
          },
          { 
            id: '2', 
            beneficiaryId: 'user123',
            serviceType: 'Education Support', 
            description: 'School supplies for upcoming academic year',
            status: 'completed',
            priority: 'medium',
            createdAt: '2023-09-20T09:15:00Z',
            updatedAt: '2023-09-30T14:20:00Z',
            completedAt: '2023-09-30T14:20:00Z'
          },
          { 
            id: '3', 
            beneficiaryId: 'user123',
            serviceType: 'Healthcare', 
            description: 'Medical checkup and medicine',
            status: 'pending',
            priority: 'high',
            createdAt: '2023-10-12T10:45:00Z',
            updatedAt: '2023-10-12T10:45:00Z'
          },
        ];
        
        setServiceRequests(mockRequests);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchServiceRequests();
  }, [toast]);
  
  const handleNewRequest = () => {
    navigate('/services');
  };
  
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending':
        return <Clock className="text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="text-blue-500" />;
      case 'in-progress':
        return <Briefcase className="text-orange-500" />;
      case 'completed':
        return <CheckCircle className="text-green-500" />;
      case 'rejected':
        return <HelpCircle className="text-red-500" />;
      default:
        return <HelpCircle className="text-gray-500" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-orange-100 text-orange-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center mb-3">
            <div className="bg-theuyir-pink/10 p-3 rounded-full mr-3">
              <Utensils size={24} className="text-theuyir-pink" />
            </div>
            <h3 className="font-semibold text-lg text-theuyir-darkgrey">Food Assistance</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Access nutritious meals and grocery support for you and your family</p>
          <Button variant="outline" asChild className="w-full">
            <a href="/services#food">Learn More</a>
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center mb-3">
            <div className="bg-theuyir-pink/10 p-3 rounded-full mr-3">
              <BookOpen size={24} className="text-theuyir-pink" />
            </div>
            <h3 className="font-semibold text-lg text-theuyir-darkgrey">Education Support</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Get resources for educational needs including books, supplies, and tutoring</p>
          <Button variant="outline" asChild className="w-full">
            <a href="/services#education">Learn More</a>
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center mb-3">
            <div className="bg-theuyir-pink/10 p-3 rounded-full mr-3">
              <Stethoscope size={24} className="text-theuyir-pink" />
            </div>
            <h3 className="font-semibold text-lg text-theuyir-darkgrey">Healthcare Services</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">Access medical checkups, medicines, and health education for your family</p>
          <Button variant="outline" asChild className="w-full">
            <a href="/services#healthcare">Learn More</a>
          </Button>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-theuyir-darkgrey">Your Service Requests</h3>
          <Button variant="outline" className="flex items-center group" onClick={handleNewRequest}>
            <PlusCircle size={16} className="mr-2" />
            New Request
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-theuyir-yellow border-t-theuyir-pink rounded-full animate-spin"></div>
          </div>
        ) : serviceRequests.length > 0 ? (
          <div className="space-y-4">
            {serviceRequests.map((request) => (
              <div 
                key={request.id} 
                className="border rounded-lg p-4 hover:border-theuyir-pink transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-semibold text-theuyir-darkgrey">{request.serviceType}</h4>
                      <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1).replace('-', ' ')}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap gap-y-2 gap-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar size={14} className="mr-1" />
                        Requested: {new Date(request.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-700">{request.description}</p>
                    
                    {request.completedAt && (
                      <p className="mt-2 text-sm text-gray-500 italic">
                        Completed on {new Date(request.completedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex items-center space-x-2">
                    <Button variant="outline" size="sm" className="flex items-center">
                      <MessageCircle size={14} className="mr-1" />
                      Inquire
                    </Button>
                    
                    <Button variant="outline" size="sm" asChild>
                      <a href={`/service-request/${request.id}`}>
                        Details
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't made any service requests yet.</p>
            <Button variant="default" asChild>
              <a href="/services">Browse Available Services</a>
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold text-theuyir-darkgrey mb-6">Upcoming Events</h3>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4 hover:border-theuyir-yellow transition-colors">
              <h4 className="font-semibold text-theuyir-darkgrey">Health Camp</h4>
              <div className="flex flex-wrap gap-y-2 gap-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  October 30, 2023
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  9:00 AM - 1:00 PM
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">Free health checkups and consultations for all family members</p>
              
              <Button variant="outline" size="sm" className="mt-3">
                Register
              </Button>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 hover:border-theuyir-yellow transition-colors">
              <h4 className="font-semibold text-theuyir-darkgrey">Career Guidance Workshop</h4>
              <div className="flex flex-wrap gap-y-2 gap-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  November 5, 2023
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  2:00 PM - 5:00 PM
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600">Career counseling and job opportunities for young adults</p>
              
              <Button variant="outline" size="sm" className="mt-3">
                Register
              </Button>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold text-theuyir-darkgrey mb-6">Support Resources</h3>
          
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="bg-theuyir-yellow/10 p-3 rounded-full mr-4">
                <FileText size={20} className="text-theuyir-darkgrey" />
              </div>
              <div>
                <h4 className="font-semibold text-theuyir-darkgrey">Eligibility Guidelines</h4>
                <p className="text-sm text-gray-600 mb-1">Learn about eligibility requirements for our services</p>
                <a href="/resources/eligibility" className="text-theuyir-pink text-sm hover:underline">
                  View Guidelines
                </a>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-theuyir-yellow/10 p-3 rounded-full mr-4">
                <Heart size={20} className="text-theuyir-darkgrey" />
              </div>
              <div>
                <h4 className="font-semibold text-theuyir-darkgrey">Counseling Services</h4>
                <p className="text-sm text-gray-600 mb-1">Access free mental health and counseling support</p>
                <a href="/services/counseling" className="text-theuyir-pink text-sm hover:underline">
                  Learn More
                </a>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="bg-theuyir-yellow/10 p-3 rounded-full mr-4">
                <Briefcase size={20} className="text-theuyir-darkgrey" />
              </div>
              <div>
                <h4 className="font-semibold text-theuyir-darkgrey">Job Training Programs</h4>
                <p className="text-sm text-gray-600 mb-1">Develop skills for employment opportunities</p>
                <a href="/services/job-training" className="text-theuyir-pink text-sm hover:underline">
                  View Programs
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-theuyir-lightgrey p-6 rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-theuyir-darkgrey mb-2">Need Additional Support?</h3>
            <p className="text-gray-600">Our team is here to help. Explore our services or contact us for assistance.</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="default" asChild className="flex items-center group">
              <a href="/services">
                Browse Services
                <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/contact">Contact Support</a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryDashboard; 