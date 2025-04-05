import React, { useEffect, useState } from 'react';
import { 
  ArrowRight, 
  Search, 
  Heart, 
  Filter, 
  Calendar, 
  MapPin, 
  Users, 
  Bookmark, 
  ListFilter 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Pagination } from '@/components/ui/pagination';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';
import DonationService, { DonationNeed } from '@/api/services/donation.service';
import { formatDistanceToNow } from 'date-fns';

// Category icons mapping
const categoryIcons = {
  education: '🎓',
  healthcare: '🏥',
  food: '🍲',
  shelter: '🏠',
  livelihood: '💼',
  other: '📦'
};

const NeedsDonate = () => {
  const { user, isAuthenticated } = useAuth();
  const { setIsLoading } = useLoading();
  const { toast } = useToast();
  
  const [needs, setNeeds] = useState<DonationNeed[]>([]);
  const [filteredNeeds, setFilteredNeeds] = useState<DonationNeed[]>([]);
  const [selectedNeed, setSelectedNeed] = useState<DonationNeed | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [isDonateDialogOpen, setIsDonateDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    beneficiaryType: '',
    location: ''
  });
  const [selectedDonationAmount, setSelectedDonationAmount] = useState<number>(0);
  const [customDonationAmount, setCustomDonationAmount] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [needsPerPage] = useState(9);
  
  useEffect(() => {
    fetchNeeds();
    window.scrollTo(0, 0);
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, needs]);
  
  const fetchNeeds = async () => {
    try {
      setIsLoading(true);
      const needsData = await DonationService.getActiveNeeds();
      setNeeds(needsData);
      setFilteredNeeds(needsData);
    } catch (error) {
      console.error('Error fetching needs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load donation needs. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const applyFilters = () => {
    let result = [...needs];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(need => 
        need.title.toLowerCase().includes(term) || 
        need.description.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (filters.category) {
      result = result.filter(need => need.category === filters.category);
    }
    
    // Apply beneficiary type filter
    if (filters.beneficiaryType) {
      result = result.filter(need => need.beneficiaryType === filters.beneficiaryType);
    }
    
    // Apply location filter
    if (filters.location && filters.location !== 'all') {
      result = result.filter(need => need.location?.includes(filters.location));
    }
    
    setFilteredNeeds(result);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      category: '',
      beneficiaryType: '',
      location: ''
    });
  };
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  const openNeedDetail = (need: DonationNeed) => {
    setSelectedNeed(need);
    setIsDetailDialogOpen(true);
  };
  
  const handleDonate = (need: DonationNeed) => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication Required',
        description: 'Please log in to donate',
        action: (
          <Button variant="link" onClick={() => window.location.href = '/login?redirect=/donate'}>
            Login
          </Button>
        )
      });
      return;
    }
    
    setSelectedNeed(need);
    setIsDonateDialogOpen(true);
  };
  
  const submitDonation = async () => {
    if (!selectedNeed) return;
    
    const amount = customDonationAmount ? parseInt(customDonationAmount) : selectedDonationAmount;
    
    if (!amount || amount < 10) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid donation amount (minimum ₹10)',
        variant: 'destructive'
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await DonationService.donateToNeed(selectedNeed.id, {
        amount,
        needId: selectedNeed.id,
        donationType: 'oneTime',
        paymentMethod: 'card' // Default payment method, would be selected in a real implementation
      });
      
      setIsDonateDialogOpen(false);
      toast({
        title: 'Donation Successful',
        description: `Thank you for your donation of ₹${amount} to support this need!`
      });
      
      // Refresh needs list
      fetchNeeds();
    } catch (error) {
      console.error('Error making donation:', error);
      toast({
        title: 'Donation Failed',
        description: 'There was an error processing your donation. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setSelectedDonationAmount(0);
      setCustomDonationAmount('');
    }
  };
  
  // Calculate pagination
  const indexOfLastNeed = currentPage * needsPerPage;
  const indexOfFirstNeed = indexOfLastNeed - needsPerPage;
  const currentNeeds = filteredNeeds.slice(indexOfFirstNeed, indexOfLastNeed);
  const totalPages = Math.ceil(filteredNeeds.length / needsPerPage);
  
  // Get unique locations from needs data
  const locations = [...new Set(needs.map(need => need.location).filter(Boolean))]
    .sort()
    .map(location => ({ value: location as string, label: location as string }));
  
  // Calculate progress percentage
  const getProgressPercentage = (need: DonationNeed) => {
    return Math.min(Math.round((need.amountRaised / need.amount) * 100), 100);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 bg-theuyir-darkgrey text-white overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-20">
            <img
              src="/images/backgrounds/page-header-bg.png"
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <p className="inline-block bg-theuyir-yellow/20 text-theuyir-yellow px-4 py-1 rounded-full text-sm font-medium mb-4">
                NEED-BASED GIVING
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Support <span className="yellow-highlight">Specific Needs</span>
              </h1>
              <p className="text-white/80 text-lg mb-8">
                Make a direct impact by donating to specific needs identified by our beneficiaries and partner NGOs.
                See exactly how your contribution helps.
              </p>
            </div>
          </div>
        </section>
        
        {/* Search & Filter Section */}
        <section className="py-8 bg-white border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="relative flex-grow max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder="Search needs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex flex-wrap gap-3 items-center">
                <div className="flex items-center gap-2">
                  <Select
                    value={filters.category}
                    onValueChange={(value) => setFilters({ ...filters, category: value })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="shelter">Shelter</SelectItem>
                      <SelectItem value="livelihood">Livelihood</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Select
                    value={filters.beneficiaryType}
                    onValueChange={(value) => setFilters({ ...filters, beneficiaryType: value })}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Beneficiaries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Beneficiaries</SelectItem>
                      <SelectItem value="individual">Individual</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {locations.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Select
                      value={filters.location}
                      onValueChange={(value) => setFilters({ ...filters, location: value })}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="All Locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Locations</SelectItem>
                        {locations.map(loc => (
                          <SelectItem key={loc.value} value={loc.value}>{loc.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <Button variant="outline" onClick={resetFilters}>
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Needs Grid */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            {filteredNeeds.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                  <Search className="text-gray-400" size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-700 mb-2">No matching needs found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters</p>
                <Button variant="outline" onClick={resetFilters}>
                  Reset All Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentNeeds.map((need) => (
                    <Card key={need.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      {need.images && need.images.length > 0 && (
                        <div className="h-52 overflow-hidden">
                          <img
                            src={need.images[0]}
                            alt={need.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                          />
                        </div>
                      )}
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <Badge className="mb-2">
                            {categoryIcons[need.category as keyof typeof categoryIcons]} {need.category.charAt(0).toUpperCase() + need.category.slice(1)}
                          </Badge>
                          {need.deadline && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Calendar size={14} /> 
                              {new Date(need.deadline) > new Date() 
                                ? formatDistanceToNow(new Date(need.deadline), { addSuffix: true }) 
                                : 'Deadline passed'}
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg font-bold mt-2">{need.title}</CardTitle>
                        <CardDescription className="line-clamp-2 mt-1">
                          {need.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">₹{need.amountRaised.toLocaleString()}</span>
                            <span className="text-gray-500">of ₹{need.amount.toLocaleString()}</span>
                          </div>
                          <Progress value={getProgressPercentage(need)} className="h-2" />
                          <p className="text-xs text-right mt-1 text-gray-500">
                            {need.donors.length} donor{need.donors.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex gap-1 items-center text-gray-600">
                            <Users size={16} />
                            <span>For: {need.beneficiaryType.charAt(0).toUpperCase() + need.beneficiaryType.slice(1)}</span>
                          </div>
                          {need.location && (
                            <div className="flex gap-1 items-center text-gray-600">
                              <MapPin size={16} />
                              <span>{need.location}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-2">
                        <Button variant="outline" size="sm" onClick={() => openNeedDetail(need)}>
                          View Details
                        </Button>
                        <Button size="sm" onClick={() => handleDonate(need)}>
                          Donate Now
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>
      
      {/* Need Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          {selectedNeed && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedNeed.title}</DialogTitle>
                <DialogDescription>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge>
                      {categoryIcons[selectedNeed.category as keyof typeof categoryIcons]} {selectedNeed.category.charAt(0).toUpperCase() + selectedNeed.category.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Users size={14} /> 
                      {selectedNeed.beneficiaryType.charAt(0).toUpperCase() + selectedNeed.beneficiaryType.slice(1)}
                    </Badge>
                    {selectedNeed.location && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <MapPin size={14} /> 
                        {selectedNeed.location}
                      </Badge>
                    )}
                  </div>
                </DialogDescription>
              </DialogHeader>
              
              {selectedNeed.images && selectedNeed.images.length > 0 && (
                <div className="mb-6 mt-2">
                  <img
                    src={selectedNeed.images[0]}
                    alt={selectedNeed.title}
                    className="w-full h-64 object-cover rounded-md"
                  />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-lg mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">{selectedNeed.description}</p>
                  
                  {selectedNeed.impactMetrics && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-lg mb-2">Impact</h3>
                      <div className="p-4 bg-green-50 rounded-md">
                        <p className="text-gray-700">
                          <span className="font-medium">Beneficiaries helped:</span> {selectedNeed.impactMetrics.beneficiariesHelped}
                        </p>
                        {selectedNeed.impactMetrics.outcomeDescription && (
                          <p className="text-gray-700 mt-2">
                            <span className="font-medium">Outcome:</span> {selectedNeed.impactMetrics.outcomeDescription}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="p-4 bg-gray-50 rounded-md">
                    <h3 className="font-semibold text-lg mb-3">Funding</h3>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">₹{selectedNeed.amountRaised.toLocaleString()}</span>
                        <span className="text-gray-500">of ₹{selectedNeed.amount.toLocaleString()}</span>
                      </div>
                      <Progress value={getProgressPercentage(selectedNeed)} className="h-2" />
                      <p className="text-sm mt-1 text-gray-500">
                        {selectedNeed.donors.length} donor{selectedNeed.donors.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    
                    {selectedNeed.deadline && (
                      <div className="flex items-center gap-2 text-sm text-gray-700 mb-4">
                        <Calendar size={16} />
                        <div>
                          <p className="font-medium">Deadline</p>
                          <p>{new Date(selectedNeed.deadline).toLocaleDateString()}</p>
                        </div>
                      </div>
                    )}
                    
                    <Button className="w-full" onClick={() => handleDonate(selectedNeed)}>
                      Donate Now
                    </Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Donation Dialog */}
      <Dialog open={isDonateDialogOpen} onOpenChange={setIsDonateDialogOpen}>
        <DialogContent className="max-w-md">
          {selectedNeed && (
            <>
              <DialogHeader>
                <DialogTitle>Donate to: {selectedNeed.title}</DialogTitle>
                <DialogDescription>
                  Choose an amount to donate to this need
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-3 gap-3">
                  {[100, 500, 1000, 2000, 5000, 10000].map((amount) => (
                    <Button
                      key={amount}
                      variant={selectedDonationAmount === amount ? "default" : "outline"}
                      className="w-full"
                      onClick={() => {
                        setSelectedDonationAmount(amount);
                        setCustomDonationAmount('');
                      }}
                    >
                      ₹{amount.toLocaleString()}
                    </Button>
                  ))}
                </div>
                
                <div>
                  <label htmlFor="customAmount" className="block text-sm font-medium text-gray-700 mb-1">
                    Custom Amount (₹)
                  </label>
                  <Input
                    id="customAmount"
                    type="number"
                    placeholder="Enter amount"
                    value={customDonationAmount}
                    onChange={(e) => {
                      setCustomDonationAmount(e.target.value);
                      setSelectedDonationAmount(0);
                    }}
                    min="10"
                  />
                </div>
                
                <div className="text-sm text-gray-500">
                  <p>Remaining amount needed: ₹{(selectedNeed.amount - selectedNeed.amountRaised).toLocaleString()}</p>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDonateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitDonation}>
                  Proceed to Payment
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NeedsDonate; 