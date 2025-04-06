import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import Button from '@/components/ui/Button.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, AlertCircle, Clock, Heart, Clock3, Users, Calendar } from 'lucide-react';

// Sample need type definition
interface NeedItem {
  id: string;
  title: string;
  category: string;
  beneficiaryStory: string;
  ngoId: string;
  ngoName: string;
  verified: boolean;
  amountRequired: number;
  amountRaised: number;
  deadline?: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  location: string;
  imageUrl: string;
  createdAt: string;
}

const NeedMarketplace: React.FC = () => {
  const [needs, setNeeds] = useState<NeedItem[]>([]);
  const [filteredNeeds, setFilteredNeeds] = useState<NeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [urgencyFilter, setUrgencyFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [selectedNeed, setSelectedNeed] = useState<NeedItem | null>(null);
  const [donationAmount, setDonationAmount] = useState<number>(0);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Mock data load
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockNeeds = [
        {
          id: 'need1',
          title: 'Educational support for 25 children',
          category: 'education',
          beneficiaryStory: 'These children from low-income families in Chennai need educational materials and tuition fees to continue their education. Your support will help them stay in school and build a better future.',
          ngoId: 'ngo1',
          ngoName: 'Education First Foundation',
          verified: true,
          amountRequired: 120000,
          amountRaised: 45000,
          deadline: '2023-12-31',
          urgency: 'high' as const,
          location: 'Chennai, Tamil Nadu',
          imageUrl: 'https://images.unsplash.com/photo-1518291344630-4857135fb581?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGVkdWNhdGlvbnxlbnwwfHwwfHx8MA%3D%3D',
          createdAt: '2023-11-15T14:30:00Z'
        },
        {
          id: 'need2',
          title: 'Medical treatment for elderly patients',
          category: 'healthcare',
          beneficiaryStory: 'These elderly residents need urgent medical treatment including surgeries and ongoing medication. Many have been abandoned by their families and have no means to pay for their treatments.',
          ngoId: 'ngo2',
          ngoName: 'Healthcare for All',
          verified: true,
          amountRequired: 250000,
          amountRaised: 180000,
          deadline: '2023-11-30',
          urgency: 'critical' as const,
          location: 'Madurai, Tamil Nadu',
          imageUrl: 'https://images.unsplash.com/photo-1612531385446-f7e6d131e1d0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGhlYWx0aGNhcmV8ZW58MHx8MHx8fDA%3D',
          createdAt: '2023-11-10T09:45:00Z'
        },
        {
          id: 'need3',
          title: 'Food and shelter for flood victims',
          category: 'disaster',
          beneficiaryStory: 'Recent floods have displaced hundreds of families who have lost their homes and belongings. They need immediate support for food, clean water, and temporary shelter.',
          ngoId: 'ngo3',
          ngoName: 'Disaster Relief Network',
          verified: true,
          amountRequired: 500000,
          amountRaised: 320000,
          deadline: '2023-11-25',
          urgency: 'critical' as const,
          location: 'Coimbatore, Tamil Nadu',
          imageUrl: 'https://images.unsplash.com/photo-1595123550441-d377e017de6a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Zmxvb2R8ZW58MHx8MHx8fDA%3D',
          createdAt: '2023-11-08T16:20:00Z'
        },
        {
          id: 'need4',
          title: 'Vocational training for unemployed youth',
          category: 'employment',
          beneficiaryStory: 'These young adults from disadvantaged backgrounds need skills training to secure stable employment. Funding will provide training in IT, hospitality, and construction trades.',
          ngoId: 'ngo4',
          ngoName: 'Skills Development Trust',
          verified: true,
          amountRequired: 180000,
          amountRaised: 72000,
          deadline: '2023-12-15',
          urgency: 'medium' as const,
          location: 'Trichy, Tamil Nadu',
          imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHRyYWluaW5nfGVufDB8fDB8fHww',
          createdAt: '2023-11-05T11:30:00Z'
        },
        {
          id: 'need5',
          title: 'Nutrition program for malnourished children',
          category: 'food',
          beneficiaryStory: 'These children suffer from malnutrition and need a regular supply of nutritious meals. Your support will provide daily meals and nutrition supplements for 6 months.',
          ngoId: 'ngo5',
          ngoName: 'Child Welfare Initiative',
          verified: true,
          amountRequired: 150000,
          amountRaised: 98000,
          deadline: '2023-12-20',
          urgency: 'high' as const,
          location: 'Chennai, Tamil Nadu',
          imageUrl: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGNoaWxkcmVuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D',
          createdAt: '2023-11-12T10:15:00Z'
        }
      ];
      
      setNeeds(mockNeeds);
      setFilteredNeeds(mockNeeds);
      setLoading(false);
    }, 1000);
  }, []);

  // Apply filters
  useEffect(() => {
    let result = [...needs];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(need => 
        need.title.toLowerCase().includes(term) ||
        need.beneficiaryStory.toLowerCase().includes(term) ||
        need.ngoName.toLowerCase().includes(term)
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
    
    // Apply location filter
    if (locationFilter !== 'all') {
      result = result.filter(need => need.location.includes(locationFilter));
    }
    
    setFilteredNeeds(result);
  }, [needs, searchTerm, categoryFilter, urgencyFilter, locationFilter]);

  // Handle donation
  const handleDonate = (needId: string) => {
    if (donationAmount <= 0) return;
    
    // Find the need and update the amount raised
    const updatedNeeds = needs.map(need => {
      if (need.id === needId) {
        return {
          ...need,
          amountRaised: Math.min(need.amountRaised + donationAmount, need.amountRequired)
        };
      }
      return need;
    });
    
    setNeeds(updatedNeeds);
    setDonationAmount(0);
    setIsDetailModalOpen(false);
    
    // In a real implementation, this would make an API call to process the donation
    alert(`Thank you for your donation of ₹${donationAmount} to support this cause!`);
  };

  // Open need details modal
  const openNeedDetails = (need: NeedItem) => {
    setSelectedNeed(need);
    setIsDetailModalOpen(true);
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

  // Calculate days remaining until deadline
  const calculateDaysRemaining = (deadline?: string) => {
    if (!deadline) return null;
    
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  };

  // Get urgency badge
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Donation Marketplace</h2>
      </div>
      
      <div className="text-center max-w-3xl mx-auto mb-8">
        <p className="text-gray-600">
          Browse verified needs from beneficiaries and contribute directly to make a difference. 
          100% of your donation goes to the specific need you choose to support.
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search needs..."
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
            <SelectItem value="education">Education</SelectItem>
            <SelectItem value="healthcare">Healthcare</SelectItem>
            <SelectItem value="food">Food & Nutrition</SelectItem>
            <SelectItem value="disaster">Disaster Relief</SelectItem>
            <SelectItem value="employment">Employment</SelectItem>
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
        
        <Select
          value={locationFilter}
          onValueChange={setLocationFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Locations</SelectItem>
            <SelectItem value="Chennai">Chennai</SelectItem>
            <SelectItem value="Madurai">Madurai</SelectItem>
            <SelectItem value="Coimbatore">Coimbatore</SelectItem>
            <SelectItem value="Trichy">Trichy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="mt-6">
        <Tabs defaultValue="all">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Needs</TabsTrigger>
            <TabsTrigger value="urgent" className="flex items-center gap-1">
              <AlertCircle className="h-4 w-4" /> Urgent Needs
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            {loading ? (
              <div className="grid place-items-center p-8">
                <p>Loading needs...</p>
              </div>
            ) : filteredNeeds.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredNeeds.map((need) => (
                  <Card key={need.id} className="overflow-hidden">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={need.imageUrl} 
                        alt={need.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="line-clamp-2 text-lg">{need.title}</CardTitle>
                          <CardDescription className="mt-1">
                            By {need.ngoName}
                          </CardDescription>
                        </div>
                        {getUrgencyBadge(need.urgency)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-700 line-clamp-3">{need.beneficiaryStory}</p>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Raised: ₹{need.amountRaised.toLocaleString()}</span>
                          <span>Goal: ₹{need.amountRequired.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={(need.amountRaised / need.amountRequired) * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      {need.deadline && (
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>
                            {calculateDaysRemaining(need.deadline)} days left
                          </span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="primary"
                        className="w-full"
                        onClick={() => openNeedDetails(need)}
                      >
                        Donate Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900">No needs found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your filters to see more results.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="urgent" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {needs
                .filter(need => need.urgency === 'critical' || need.urgency === 'high')
                .map((need) => (
                  <Card key={need.id} className="overflow-hidden border-red-200">
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={need.imageUrl} 
                        alt={need.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="line-clamp-2 text-lg">{need.title}</CardTitle>
                          <CardDescription className="mt-1">
                            By {need.ngoName}
                          </CardDescription>
                        </div>
                        {getUrgencyBadge(need.urgency)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-700 line-clamp-3">{need.beneficiaryStory}</p>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Raised: ₹{need.amountRaised.toLocaleString()}</span>
                          <span>Goal: ₹{need.amountRequired.toLocaleString()}</span>
                        </div>
                        <Progress 
                          value={(need.amountRaised / need.amountRequired) * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      {need.deadline && (
                        <div className="flex items-center text-sm text-red-500 font-medium">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>
                            Urgent: {calculateDaysRemaining(need.deadline)} days left
                          </span>
                        </div>
                      )}
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="primary"
                        className="w-full"
                        onClick={() => openNeedDetails(need)}
                      >
                        Donate Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Need Detail Modal */}
      {selectedNeed && isDetailModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold">{selectedNeed.title}</h3>
                <button 
                  onClick={() => setIsDetailModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={selectedNeed.imageUrl} 
                    alt={selectedNeed.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                  
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between">
                      <Badge>{selectedNeed.category}</Badge>
                      {getUrgencyBadge(selectedNeed.urgency)}
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                      <span>Created on {formatDate(selectedNeed.createdAt)}</span>
                    </div>
                    
                    {selectedNeed.deadline && (
                      <div className="flex items-center text-sm">
                        <Clock3 className="h-4 w-4 mr-1 text-gray-500" />
                        <span>Deadline: {formatDate(selectedNeed.deadline)} ({calculateDaysRemaining(selectedNeed.deadline)} days left)</span>
                      </div>
                    )}
                    
                    <div className="space-y-1 mt-4">
                      <div className="flex justify-between text-sm font-medium">
                        <span>Raised: ₹{selectedNeed.amountRaised.toLocaleString()}</span>
                        <span>Goal: ₹{selectedNeed.amountRequired.toLocaleString()}</span>
                      </div>
                      <Progress 
                        value={(selectedNeed.amountRaised / selectedNeed.amountRequired) * 100} 
                        className="h-3"
                      />
                      <p className="text-sm text-center">
                        {Math.round((selectedNeed.amountRaised / selectedNeed.amountRequired) * 100)}% complete
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">About the Need</h4>
                    <p className="text-gray-700">{selectedNeed.beneficiaryStory}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">NGO Partner</h4>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2 text-gray-500" />
                      <span>{selectedNeed.ngoName}</span>
                      {selectedNeed.verified && (
                        <Badge className="ml-2 bg-green-100 text-green-800">Verified</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-3">Make a Donation</h4>
                    
                    <div className="grid grid-cols-4 gap-2 mb-3">
                      {[500, 1000, 2000, 5000].map((amount) => (
                        <button
                          key={amount}
                          className={`py-2 rounded-md border ${
                            donationAmount === amount 
                              ? 'bg-blue-50 border-blue-500 text-blue-700' 
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                          onClick={() => setDonationAmount(amount)}
                        >
                          ₹{amount}
                        </button>
                      ))}
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm mb-1">Custom Amount</label>
                      <Input
                        type="number"
                        min="1"
                        value={donationAmount || ''}
                        onChange={(e) => setDonationAmount(Number(e.target.value))}
                        placeholder="Enter amount"
                      />
                    </div>
                    
                    <Button
                      variant="primary"
                      className="w-full"
                      disabled={donationAmount <= 0}
                      onClick={() => handleDonate(selectedNeed.id)}
                    >
                      <Heart className="mr-2 h-4 w-4" />
                      Donate ₹{donationAmount || 0}
                    </Button>
                    
                    <p className="text-xs text-center mt-2 text-gray-500">
                      100% of your donation goes directly to this need
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NeedMarketplace; 