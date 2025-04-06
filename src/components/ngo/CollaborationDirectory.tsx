import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import Button from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { CheckCircle, Clock, XCircle, MapPin, Search, Filter, Building2 } from 'lucide-react';
import NGOService, { NGOProfile } from '@/api/services/ngo.service';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination } from '@/components/ui/pagination';
import { useToast } from '@/components/ui/use-toast';
import { 
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose
} from '@/components/ui/sheet';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const CollaborationDirectory: React.FC = () => {
  const { toast } = useToast();
  const [ngos, setNgos] = useState<NGOProfile[]>([]);
  const [filteredNgos, setFilteredNgos] = useState<NGOProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNGO, setSelectedNGO] = useState<NGOProfile | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [filters, setFilters] = useState({
    focusAreas: [] as string[],
    verificationStatus: [] as ('verified' | 'pending' | 'rejected')[],
    states: [] as string[],
  });
  
  const ngoPerPage = 9;
  const focusAreaOptions = [
    'Education', 
    'Healthcare', 
    'Poverty Alleviation', 
    'Environment', 
    'Women Empowerment',
    'Child Welfare',
    'Elderly Care',
    'Disability Support',
    'Rural Development',
    'Disaster Relief'
  ];
  
  useEffect(() => {
    fetchNGOs();
  }, []);
  
  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters, ngos]);
  
  const fetchNGOs = async () => {
    try {
      setLoading(true);
      const data = await NGOService.getAllNGOs();
      setNgos(data);
      setFilteredNgos(data);
    } catch (error) {
      console.error('Error fetching NGOs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load NGO directory. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const applyFilters = () => {
    let filtered = [...ngos];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(ngo => 
        ngo.name.toLowerCase().includes(term) || 
        ngo.description.toLowerCase().includes(term) ||
        ngo.focusAreas.some(area => area.toLowerCase().includes(term))
      );
    }
    
    // Apply focus areas filter
    if (filters.focusAreas.length > 0) {
      filtered = filtered.filter(ngo => 
        ngo.focusAreas.some(area => filters.focusAreas.includes(area))
      );
    }
    
    // Apply verification status filter
    if (filters.verificationStatus.length > 0) {
      filtered = filtered.filter(ngo => 
        filters.verificationStatus.includes(ngo.verificationStatus)
      );
    }
    
    // Apply state filter
    if (filters.states.length > 0) {
      filtered = filtered.filter(ngo => 
        filters.states.includes(ngo.address.state)
      );
    }
    
    setFilteredNgos(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };
  
  const resetFilters = () => {
    setFilters({
      focusAreas: [],
      verificationStatus: [],
      states: [],
    });
    setSearchTerm('');
  };
  
  const getVerificationBadge = (status: 'verified' | 'pending' | 'rejected') => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-600"><CheckCircle className="w-4 h-4 mr-1" /> Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500"><Clock className="w-4 h-4 mr-1" /> Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600"><XCircle className="w-4 h-4 mr-1" /> Rejected</Badge>;
      default:
        return null;
    }
  };
  
  // Get unique states for filter
  const uniqueStates = Array.from(new Set(ngos.map(ngo => ngo.address.state)));
  
  // Paginate results
  const indexOfLastNGO = currentPage * ngoPerPage;
  const indexOfFirstNGO = indexOfLastNGO - ngoPerPage;
  const currentNGOs = filteredNgos.slice(indexOfFirstNGO, indexOfLastNGO);
  const totalPages = Math.ceil(filteredNgos.length / ngoPerPage);
  
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  const viewNGODetails = (ngo: NGOProfile) => {
    setSelectedNGO(ngo);
    setIsDetailOpen(true);
  };
  
  const handleCollaborationRequest = (ngo: NGOProfile) => {
    // This would typically open a form to send a collaboration request
    toast({
      title: 'Collaboration Request',
      description: `You've initiated a collaboration request with ${ngo.name}`,
    });
  };
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">NGO Directory</h1>
          <p className="text-gray-600 mt-1">Discover and connect with other NGOs for collaboration</p>
        </div>
        
        <div className="flex mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative flex-grow md:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search NGOs by name, description, focus area..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="ml-2 flex items-center">
                <Filter size={18} className="mr-2" /> Filter
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filter NGOs</SheetTitle>
                <SheetDescription>
                  Narrow down the NGO directory based on your preferences
                </SheetDescription>
              </SheetHeader>
              
              <div className="py-4 space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium leading-none">Focus Areas</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {focusAreaOptions.map(area => (
                      <div key={area} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`focus-${area}`} 
                          checked={filters.focusAreas.includes(area)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters({
                                ...filters,
                                focusAreas: [...filters.focusAreas, area]
                              });
                            } else {
                              setFilters({
                                ...filters,
                                focusAreas: filters.focusAreas.filter(a => a !== area)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`focus-${area}`}>{area}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium leading-none">Verification Status</h3>
                  <div className="space-y-2">
                    {['verified', 'pending'].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`status-${status}`} 
                          checked={filters.verificationStatus.includes(status as 'verified' | 'pending')}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters({
                                ...filters,
                                verificationStatus: [...filters.verificationStatus, status as 'verified' | 'pending']
                              });
                            } else {
                              setFilters({
                                ...filters,
                                verificationStatus: filters.verificationStatus.filter(s => s !== status)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`status-${status}`} className="capitalize">{status}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-sm font-medium leading-none">Location</h3>
                  <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto">
                    {uniqueStates.map(state => (
                      <div key={state} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`state-${state}`} 
                          checked={filters.states.includes(state)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFilters({
                                ...filters,
                                states: [...filters.states, state]
                              });
                            } else {
                              setFilters({
                                ...filters,
                                states: filters.states.filter(s => s !== state)
                              });
                            }
                          }}
                        />
                        <Label htmlFor={`state-${state}`}>{state}</Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <SheetFooter>
                <Button variant="outline" onClick={resetFilters}>Reset Filters</Button>
                <SheetClose asChild>
                  <Button>Apply</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2 mt-2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-24 w-full" />
                <div className="flex flex-wrap gap-2 mt-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <>
          {filteredNgos.length === 0 ? (
            <div className="text-center py-10">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium">No NGOs Found</h3>
              <p className="mt-1 text-gray-500">Try adjusting your search or filters</p>
              <Button onClick={resetFilters} className="mt-4">Reset Filters</Button>
            </div>
          ) : (
            <>
              <p className="mb-4 text-gray-600">Showing {filteredNgos.length} NGOs</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentNGOs.map(ngo => (
                  <Card key={ngo.id} className="overflow-hidden h-full flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="line-clamp-1">{ngo.name}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <MapPin size={14} className="mr-1" />
                            {ngo.address.city}, {ngo.address.state}
                          </CardDescription>
                        </div>
                        {getVerificationBadge(ngo.verificationStatus)}
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                        {ngo.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mt-auto">
                        {ngo.focusAreas.slice(0, 3).map(area => (
                          <Badge key={area} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                        {ngo.focusAreas.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{ngo.focusAreas.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="pt-2 flex justify-between">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => viewNGODetails(ngo)}
                      >
                        View Profile
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => handleCollaborationRequest(ngo)}
                      >
                        Collaborate
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
      
      {/* NGO Detail Dialog */}
      {selectedNGO && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{selectedNGO.name}</span>
                {getVerificationBadge(selectedNGO.verificationStatus)}
              </DialogTitle>
              <DialogDescription>
                <div className="flex items-center text-sm">
                  <MapPin size={14} className="mr-1" />
                  {selectedNGO.address.city}, {selectedNGO.address.state}, {selectedNGO.address.country}
                </div>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{selectedNGO.description}</p>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Focus Areas</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedNGO.focusAreas.map(area => (
                    <Badge key={area} variant="outline">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
                  <ul className="mt-1 space-y-1">
                    <li>Email: {selectedNGO.email}</li>
                    <li>Phone: {selectedNGO.phone}</li>
                    {selectedNGO.website && <li>Website: {selectedNGO.website}</li>}
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Impact Summary</h3>
                  <ul className="mt-1 space-y-1">
                    <li>Beneficiaries Served: {selectedNGO.impactMetrics?.beneficiariesServed || 0}</li>
                    <li>Projects Completed: {selectedNGO.impactMetrics?.projectsCompleted || 0}</li>
                    <li>Volunteers Engaged: {selectedNGO.impactMetrics?.volunteersEngaged || 0}</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDetailOpen(false)}>Close</Button>
              <Button onClick={() => handleCollaborationRequest(selectedNGO)}>
                Request Collaboration
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default CollaborationDirectory; 