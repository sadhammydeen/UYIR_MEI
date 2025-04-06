import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/button.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Clock, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

// Sample Need data structure
interface NeedItem {
  id: string;
  beneficiaryId: string;
  beneficiaryName: string;
  category: string;
  description: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  estimatedCost: number;
  location: string;
  distance: number;
  createdAt: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  status: 'new' | 'under_review' | 'accepted' | 'in_progress' | 'fulfilled' | 'referred' | 'rejected';
}

const NeedAssessment: React.FC = () => {
  const [needs, setNeeds] = useState<NeedItem[]>([]);
  const [filteredNeeds, setFilteredNeeds] = useState<NeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const { toast } = useToast();

  // Mock data fetch
  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        // Mock API call
        setTimeout(() => {
          const mockNeeds = [
            {
              id: 'need1',
              beneficiaryId: 'ben1',
              beneficiaryName: 'Ramesh Kumar',
              category: 'food',
              description: 'Family of 4 needs monthly grocery support due to job loss',
              urgency: 'high' as const,
              estimatedCost: 5000,
              location: 'Chennai, Tamil Nadu',
              distance: 3.2,
              createdAt: '2023-12-10T14:30:00Z',
              verificationStatus: 'verified' as const,
              status: 'new' as const
            },
            {
              id: 'need2',
              beneficiaryId: 'ben2',
              beneficiaryName: 'Lakshmi Devi',
              category: 'healthcare',
              description: 'Medical treatment for diabetes, monthly medicine supply',
              urgency: 'critical' as const,
              estimatedCost: 8000,
              location: 'Coimbatore, Tamil Nadu',
              distance: 8.5,
              createdAt: '2023-12-08T09:15:00Z',
              verificationStatus: 'verified' as const,
              status: 'under_review' as const
            },
            {
              id: 'need3',
              beneficiaryId: 'ben3',
              beneficiaryName: 'Abdul Rahim',
              category: 'education',
              description: 'School fees and supplies for two children',
              urgency: 'medium' as const,
              estimatedCost: 12000,
              location: 'Madurai, Tamil Nadu',
              distance: 12.1,
              createdAt: '2023-12-05T16:45:00Z',
              verificationStatus: 'pending' as const,
              status: 'new' as const
            },
            {
              id: 'need4',
              beneficiaryId: 'ben4',
              beneficiaryName: 'Saraswati Iyer',
              category: 'housing',
              description: 'Temporary housing assistance for 3 months',
              urgency: 'high' as const,
              estimatedCost: 30000,
              location: 'Chennai, Tamil Nadu',
              distance: 5.7,
              createdAt: '2023-12-01T11:20:00Z',
              verificationStatus: 'verified' as const,
              status: 'accepted' as const
            },
            {
              id: 'need5',
              beneficiaryId: 'ben5',
              beneficiaryName: 'Joseph Mathew',
              category: 'employment',
              description: 'Skills training for computer repair work',
              urgency: 'low' as const,
              estimatedCost: 15000,
              location: 'Trichy, Tamil Nadu',
              distance: 18.3,
              createdAt: '2023-11-28T08:30:00Z',
              verificationStatus: 'verified' as const,
              status: 'in_progress' as const
            }
          ];
          
          setNeeds(mockNeeds);
          setFilteredNeeds(mockNeeds);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching needs:', error);
        toast({
          title: 'Error',
          description: 'Failed to load beneficiary needs',
          variant: 'destructive'
        });
        setLoading(false);
      }
    };
    
    fetchNeeds();
  }, [toast]);

  // Apply filters whenever filter values change
  useEffect(() => {
    let result = [...needs];
    
    // Apply status filter
    if (activeFilter !== 'all') {
      result = result.filter(need => need.status === activeFilter);
    }
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(need => 
        need.beneficiaryName.toLowerCase().includes(term) ||
        need.description.toLowerCase().includes(term) ||
        need.location.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(need => need.category === categoryFilter);
    }
    
    // Apply urgency filter
    if (urgencyFilter !== 'all') {
      result = result.filter(need => need.urgency === urgencyFilter);
    }
    
    setFilteredNeeds(result);
  }, [needs, activeFilter, searchTerm, categoryFilter, urgencyFilter]);

  const handleActionClick = (needId: string, action: 'accept' | 'refer' | 'fulfill' | 'reject') => {
    const updatedNeeds = needs.map(need => {
      if (need.id === needId) {
        switch (action) {
          case 'accept':
            return { ...need, status: 'accepted' as const };
          case 'refer':
            return { ...need, status: 'referred' as const };
          case 'fulfill':
            return { ...need, status: 'fulfilled' as const };
          case 'reject':
            return { ...need, status: 'rejected' as const };
          default:
            return need;
        }
      }
      return need;
    });
    
    setNeeds(updatedNeeds);
    
    toast({
      title: 'Success',
      description: `Need has been ${action === 'accept' ? 'accepted' : action === 'refer' ? 'referred' : action === 'fulfill' ? 'marked as fulfilled' : 'rejected'}.`,
    });
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Category label mapping
  const getCategoryLabel = (category: string) => {
    const categories: Record<string, string> = {
      'food': 'Food Assistance',
      'education': 'Education Support',
      'healthcare': 'Healthcare Services',
      'housing': 'Housing Support',
      'employment': 'Employment Assistance',
      'financial': 'Financial Aid',
      'childcare': 'Childcare Support',
      'counseling': 'Counseling Services'
    };
    
    return categories[category] || category;
  };

  // Get badge color based on urgency
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Critical</Badge>;
      case 'high':
        return <Badge variant="outline" className="bg-orange-100 text-orange-800">High</Badge>;
      case 'medium':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge>{urgency}</Badge>;
    }
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">New</Badge>;
      case 'under_review':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Under Review</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'in_progress':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">In Progress</Badge>;
      case 'fulfilled':
        return <Badge variant="outline" className="bg-teal-100 text-teal-800">Fulfilled</Badge>;
      case 'referred':
        return <Badge variant="outline" className="bg-indigo-100 text-indigo-800">Referred</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Get verification status badge
  const getVerificationBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle size={12} /> Verified
        </Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <Clock size={12} /> Pending
        </Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <XCircle size={12} /> Rejected
        </Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Need Assessment</h2>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={categoryFilter}
          onValueChange={setCategoryFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="food">Food Assistance</SelectItem>
            <SelectItem value="education">Education Support</SelectItem>
            <SelectItem value="healthcare">Healthcare Services</SelectItem>
            <SelectItem value="housing">Housing Support</SelectItem>
            <SelectItem value="employment">Employment Assistance</SelectItem>
            <SelectItem value="financial">Financial Aid</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={urgencyFilter}
          onValueChange={setUrgencyFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="Urgency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Urgency Levels</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList className="grid grid-cols-3 md:grid-cols-7">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="under_review">Under Review</TabsTrigger>
          <TabsTrigger value="accepted">Accepted</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="fulfilled">Fulfilled</TabsTrigger>
          <TabsTrigger value="referred">Referred</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeFilter} className="mt-4">
          {loading ? (
            <div className="grid place-items-center p-8">
              <p>Loading needs...</p>
            </div>
          ) : filteredNeeds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredNeeds.map((need) => (
                <Card key={need.id} className="overflow-hidden">
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{need.beneficiaryName}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-3.5 w-3.5 mr-1 text-gray-500" />
                          {need.location} ({need.distance.toFixed(1)} km)
                        </CardDescription>
                      </div>
                      {getVerificationBadge(need.verificationStatus)}
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <div className="flex justify-between items-center">
                      <Badge variant="outline">{getCategoryLabel(need.category)}</Badge>
                      {getUrgencyBadge(need.urgency)}
                    </div>
                    
                    <p className="text-sm text-gray-700">{need.description}</p>
                    
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <span className="font-medium">Estimated cost:</span> ₹{need.estimatedCost}
                      </div>
                      <div className="text-gray-500">
                        <span>Created: {formatDate(need.createdAt)}</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Status: {getStatusBadge(need.status)}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex flex-wrap gap-2">
                    {(need.status === 'new' || need.status === 'under_review') && (
                      <>
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={() => handleActionClick(need.id, 'accept')}
                        >
                          Accept
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleActionClick(need.id, 'refer')}
                        >
                          Refer
                        </Button>
                      </>
                    )}
                    
                    {need.status === 'in_progress' && (
                      <Button 
                        variant="primary" 
                        size="sm"
                        onClick={() => handleActionClick(need.id, 'fulfill')}
                      >
                        Mark Fulfilled
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No needs found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || categoryFilter !== 'all' || urgencyFilter !== 'all'
                  ? "Try adjusting your filters" 
                  : activeFilter === 'all' 
                  ? "There are no beneficiary needs currently"
                  : `There are no ${activeFilter.replace('_', ' ')} needs currently`}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NeedAssessment; 