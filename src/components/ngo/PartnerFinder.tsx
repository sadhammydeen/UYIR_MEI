import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/Button.tsx';
import { Search, Filter, MapPin, Users, Briefcase, BarChart, Clock, Star, MessageSquare, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample data structure for NGO partners
interface NgoPartner {
  id: string;
  name: string;
  logoUrl: string;
  location: string;
  distance: number;  // in km
  focus: string[];
  size: 'small' | 'medium' | 'large';
  rating: number;
  verified: boolean;
  projectsCompleted: number;
  collaborationTypes: ('funding' | 'resources' | 'expertise' | 'volunteers' | 'events')[];
  description: string;
  matchScore: number;  // 0-100
}

const PartnerFinder: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [focusFilter, setFocusFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [collaborationFilter, setCollaborationFilter] = useState('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('matchScore');
  const [partnerRequests, setPartnerRequests] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState('grid');

  // Sample data
  const ngoPartners: NgoPartner[] = [
    {
      id: 'ngo1',
      name: 'Sunrise Foundation',
      logoUrl: 'https://placehold.co/80',
      location: 'Chennai',
      distance: 0,
      focus: ['Education', 'Child Welfare'],
      size: 'medium',
      rating: 4.8,
      verified: true,
      projectsCompleted: 24,
      collaborationTypes: ['funding', 'expertise', 'events'],
      description: 'Dedicated to improving educational outcomes for underprivileged children across Tamil Nadu.',
      matchScore: 92
    },
    {
      id: 'ngo2',
      name: 'Green Earth Initiative',
      logoUrl: 'https://placehold.co/80',
      location: 'Coimbatore',
      distance: 25,
      focus: ['Environment', 'Sustainability'],
      size: 'large',
      rating: 4.6,
      verified: true,
      projectsCompleted: 38,
      collaborationTypes: ['resources', 'volunteers', 'events'],
      description: 'Working to protect natural resources and promote sustainable living practices in urban areas.',
      matchScore: 85
    },
    {
      id: 'ngo3',
      name: 'Medical Outreach Trust',
      logoUrl: 'https://placehold.co/80',
      location: 'Madurai',
      distance: 12,
      focus: ['Healthcare', 'Rural Development'],
      size: 'large',
      rating: 4.9,
      verified: true,
      projectsCompleted: 42,
      collaborationTypes: ['funding', 'expertise', 'resources'],
      description: 'Providing essential healthcare services to remote and underserved communities.',
      matchScore: 78
    },
    {
      id: 'ngo4',
      name: 'Skill Development Initiative',
      logoUrl: 'https://placehold.co/80',
      location: 'Chennai',
      distance: 5,
      focus: ['Employment', 'Education'],
      size: 'medium',
      rating: 4.5,
      verified: true,
      projectsCompleted: 19,
      collaborationTypes: ['expertise', 'volunteers'],
      description: 'Empowering youth through vocational training and workforce development programs.',
      matchScore: 90
    },
    {
      id: 'ngo5',
      name: 'Women Empowerment Collective',
      logoUrl: 'https://placehold.co/80',
      location: 'Trichy',
      distance: 30,
      focus: ['Women Empowerment', 'Microfinance'],
      size: 'small',
      rating: 4.7,
      verified: true,
      projectsCompleted: 15,
      collaborationTypes: ['funding', 'expertise', 'events'],
      description: 'Supporting women through financial independence, education, and entrepreneurship opportunities.',
      matchScore: 82
    },
    {
      id: 'ngo6',
      name: 'Elder Care Association',
      logoUrl: 'https://placehold.co/80',
      location: 'Chennai',
      distance: 8,
      focus: ['Elder Care', 'Healthcare'],
      size: 'medium',
      rating: 4.4,
      verified: false,
      projectsCompleted: 12,
      collaborationTypes: ['volunteers', 'resources', 'events'],
      description: 'Dedicated to improving the quality of life for the elderly through care programs and community engagement.',
      matchScore: 75
    },
  ];

  // Apply filters
  const filteredPartners = ngoPartners.filter(partner => {
    // Search query filter
    if (searchQuery && !partner.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !partner.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Focus area filter
    if (focusFilter !== 'all' && !partner.focus.some(f => f.toLowerCase().includes(focusFilter.toLowerCase()))) {
      return false;
    }
    
    // Location filter
    if (locationFilter !== 'all' && partner.location !== locationFilter) {
      return false;
    }
    
    // Size filter
    if (sizeFilter !== 'all' && partner.size !== sizeFilter) {
      return false;
    }
    
    // Collaboration type filter
    if (collaborationFilter !== 'all' && !partner.collaborationTypes.includes(collaborationFilter as any)) {
      return false;
    }
    
    // Verified filter
    if (verifiedOnly && !partner.verified) {
      return false;
    }
    
    return true;
  });
  
  // Sort partners
  const sortedPartners = [...filteredPartners].sort((a, b) => {
    if (sortBy === 'matchScore') {
      return b.matchScore - a.matchScore;
    } else if (sortBy === 'rating') {
      return b.rating - a.rating;
    } else if (sortBy === 'distance') {
      return a.distance - b.distance;
    } else if (sortBy === 'projects') {
      return b.projectsCompleted - a.projectsCompleted;
    }
    return 0;
  });

  // Handle partner request
  const handlePartnerRequest = (id: string) => {
    if (partnerRequests.includes(id)) {
      setPartnerRequests(partnerRequests.filter(partnerId => partnerId !== id));
    } else {
      setPartnerRequests([...partnerRequests, id]);
    }
  };

  // Get match score color
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 80) return 'text-emerald-600 bg-emerald-50';
    if (score >= 70) return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Partner Finder</h2>
        <p className="text-gray-500 mt-1">
          Find the perfect NGO partners for collaboration, joint initiatives, and resource sharing
        </p>
      </div>

      {/* Search and filter section */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, focus area, or description..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Select value={focusFilter} onValueChange={setFocusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Focus Area" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Focus Areas</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="environment">Environment</SelectItem>
                  <SelectItem value="women">Women Empowerment</SelectItem>
                  <SelectItem value="child">Child Welfare</SelectItem>
                  <SelectItem value="elder">Elder Care</SelectItem>
                  <SelectItem value="employment">Employment</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                  <SelectItem value="Coimbatore">Coimbatore</SelectItem>
                  <SelectItem value="Madurai">Madurai</SelectItem>
                  <SelectItem value="Trichy">Trichy</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={sizeFilter} onValueChange={setSizeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Organization Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sizes</SelectItem>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={collaborationFilter} onValueChange={setCollaborationFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Collaboration Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="funding">Funding</SelectItem>
                  <SelectItem value="resources">Resources</SelectItem>
                  <SelectItem value="expertise">Expertise</SelectItem>
                  <SelectItem value="volunteers">Volunteers</SelectItem>
                  <SelectItem value="events">Events</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="verified" 
                    checked={verifiedOnly}
                    onCheckedChange={setVerifiedOnly}
                  />
                  <Label htmlFor="verified">Verified NGOs only</Label>
                </div>
              </div>
              
              <div className="flex space-x-4">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="matchScore">Match Score</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                    <SelectItem value="projects">Projects Completed</SelectItem>
                  </SelectContent>
                </Select>
                
                <div className="flex border rounded-md">
                  <button
                    className={`px-2 py-1 rounded-l-md ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-grid-2x2"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 12h18"/><path d="M12 3v18"/></svg>
                  </button>
                  <button
                    className={`px-2 py-1 rounded-r-md ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partner listing section */}
      <div>
        <h3 className="text-lg font-medium mb-4">
          {filteredPartners.length} potential partners found
        </h3>
        
        {filteredPartners.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center">
              <p className="text-gray-500">No partner NGOs match your current filters. Try adjusting your search criteria.</p>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPartners.map(partner => (
              <Card key={partner.id} className="overflow-hidden">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gray-200 rounded-full mr-3 flex-shrink-0">
                        <img 
                          src={partner.logoUrl} 
                          alt={`${partner.name} logo`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <CardTitle className="text-lg flex items-center">
                          {partner.name}
                          {partner.verified && (
                            <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Verified</Badge>
                          )}
                        </CardTitle>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {partner.location} {partner.distance > 0 && `(${partner.distance} km)`}
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm font-medium rounded-full px-2 py-1 ${getMatchScoreColor(partner.matchScore)}`}>
                      {partner.matchScore}% Match
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {partner.focus.map((focus, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">{focus}</Badge>
                      ))}
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{partner.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-amber-500 mr-1" />
                      <span>{partner.rating.toFixed(1)} Rating</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-blue-500 mr-1" />
                      <span>{partner.projectsCompleted} Projects</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-purple-500 mr-1" />
                      <span>{partner.size.charAt(0).toUpperCase() + partner.size.slice(1)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 pt-3 pb-3 flex justify-between">
                  <div className="flex flex-wrap gap-1">
                    {partner.collaborationTypes.map((type, index) => {
                      const typeLabels: Record<string, string> = {
                        funding: 'Funding',
                        resources: 'Resources',
                        expertise: 'Expertise',
                        volunteers: 'Volunteers',
                        events: 'Events'
                      };
                      
                      return (
                        <Badge key={index} variant="outline" className="bg-gray-100 text-xs">
                          {typeLabels[type]}
                        </Badge>
                      );
                    })}
                  </div>
                  <Button
                    variant={partnerRequests.includes(partner.id) ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => handlePartnerRequest(partner.id)}
                  >
                    {partnerRequests.includes(partner.id) ? 'Requested' : 'Connect'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="divide-y">
              {sortedPartners.map(partner => (
                <div key={partner.id} className="p-4 flex">
                  <div className="w-14 h-14 bg-gray-200 rounded-full mr-4 flex-shrink-0">
                    <img 
                      src={partner.logoUrl} 
                      alt={`${partner.name} logo`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium flex items-center">
                          {partner.name}
                          {partner.verified && (
                            <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Verified</Badge>
                          )}
                        </h3>
                        <div className="flex items-center mt-1 text-sm text-gray-500">
                          <MapPin className="h-3 w-3 mr-1" />
                          {partner.location} {partner.distance > 0 && `(${partner.distance} km)`}
                        </div>
                      </div>
                      <div className={`text-sm font-medium rounded-full px-2 py-1 ${getMatchScoreColor(partner.matchScore)}`}>
                        {partner.matchScore}% Match
                      </div>
                    </div>
                    
                    <div className="mt-2 mb-2">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {partner.focus.map((focus, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-50">{focus}</Badge>
                        ))}
                      </div>
                      <p className="text-gray-600 text-sm">{partner.description}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-6 mt-3 text-sm">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-amber-500 mr-1" />
                        <span>{partner.rating.toFixed(1)} Rating</span>
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 text-blue-500 mr-1" />
                        <span>{partner.projectsCompleted} Projects</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-purple-500 mr-1" />
                        <span>{partner.size.charAt(0).toUpperCase() + partner.size.slice(1)}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1">
                        {partner.collaborationTypes.map((type, index) => {
                          const typeLabels: Record<string, string> = {
                            funding: 'Funding',
                            resources: 'Resources',
                            expertise: 'Expertise',
                            volunteers: 'Volunteers',
                            events: 'Events'
                          };
                          
                          return (
                            <Badge key={index} variant="outline" className="bg-gray-100 text-xs">
                              {typeLabels[type]}
                            </Badge>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4 flex items-center">
                    <Button
                      variant={partnerRequests.includes(partner.id) ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => handlePartnerRequest(partner.id)}
                    >
                      {partnerRequests.includes(partner.id) ? 'Requested' : 'Connect'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Recommended collaborations */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <MessageSquare className="h-5 w-5 text-blue-500 mr-2" />
                Collaboration Opportunities
              </div>
            </CardTitle>
            <CardDescription>
              Based on your organization's profile and needs, here are suggested collaboration opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="resources">Resource Sharing</TabsTrigger>
                <TabsTrigger value="funding">Joint Funding</TabsTrigger>
              </TabsList>
              
              <TabsContent value="upcoming">
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">NGO Collaboration Summit 2023</CardTitle>
                      <CardDescription>
                        August 15-16, 2023 • Chennai International Convention Center
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-600">Network with over 50 NGOs and explore collaboration opportunities for joint projects, resource sharing, and more.</p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0 text-sm">
                      <div className="text-gray-500">15 NGOs from your network attending</div>
                      <Button variant="outline" size="sm" className="flex items-center">
                        View Details <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Rural Development Workshop</CardTitle>
                      <CardDescription>
                        September 5, 2023 • Virtual Event
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-600">Join forces with rural development focused NGOs to share expertise, resources, and create joint initiatives.</p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0 text-sm">
                      <div className="text-gray-500">8 matched NGOs participating</div>
                      <Button variant="outline" size="sm" className="flex items-center">
                        View Details <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="resources">
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Educational Materials Exchange</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-600">5 NGOs in your area are coordinating to share educational materials and resources. Join the initiative to contribute and benefit.</p>
                    </CardContent>
                    <CardFooter className="pt-0 text-sm">
                      <Button variant="outline" size="sm" className="flex items-center">
                        Join Initiative <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Medical Equipment Sharing Pool</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-600">Healthcare NGOs are pooling specialized medical equipment for shared usage. Optimize resource utilization through this initiative.</p>
                    </CardContent>
                    <CardFooter className="pt-0 text-sm">
                      <Button variant="outline" size="sm" className="flex items-center">
                        Learn More <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="funding">
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Multi-NGO Grant Opportunity</CardTitle>
                      <CardDescription>
                        Application Deadline: October 10, 2023
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-600">The Tamil Nadu Foundation is accepting proposals for collaborative projects involving multiple NGOs. Grants range from ₹5-15 lakhs.</p>
                    </CardContent>
                    <CardFooter className="flex justify-between pt-0 text-sm">
                      <div className="text-gray-500">3 NGOs looking for partners</div>
                      <Button variant="outline" size="sm" className="flex items-center">
                        Explore <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Corporate CSR Joint Initiative</CardTitle>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <p className="text-sm text-gray-600">Sunrise Tech is seeking multiple NGO partners for their annual CSR program focusing on digital literacy in rural areas.</p>
                    </CardContent>
                    <CardFooter className="pt-0 text-sm">
                      <Button variant="outline" size="sm" className="flex items-center">
                        Express Interest <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnerFinder; 