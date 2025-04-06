import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Button from '@/components/ui/Button.tsx';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Award, ArrowUp, ArrowDown, Info, Sparkles, BellRing, Medal } from 'lucide-react';
import { getTopNgosByImpact, NgoProfile } from '@/lib/ngo';
import { Timestamp } from 'firebase/firestore';

// Sample NGO data structure for the leaderboard
interface NgoRanking {
  id: string;
  name: string;
  logoUrl: string;
  verificationStatus: 'verified' | 'pending';
  rating: number;
  focus: string[];
  region: string;
  size: 'small' | 'medium' | 'large';
  metrics: {
    beneficiariesServed: number;
    successRate: number;
    fundUtilization: number;
    volunteerEngagement: number;
    communityRating: number;
  };
  previousRank: number;
  currentRank: number;
  awards: string[];
}

const ImpactLeaderboard: React.FC = () => {
  const [ngos, setNgos] = useState<NgoRanking[]>([]);
  const [filteredNgos, setFilteredNgos] = useState<NgoRanking[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');
  const [timeFrame, setTimeFrame] = useState('month');
  const [rankBy, setRankBy] = useState('beneficiariesServed');
  const [error, setError] = useState<string | null>(null);

  // Transform Firebase NGO data to leaderboard format
  const transformNgoData = (ngoProfiles: NgoProfile[]): NgoRanking[] => {
    return ngoProfiles.map((ngo, index) => {
      const metrics = ngo.impactMetrics || {
        beneficiariesServed: 0,
        projectsCompleted: 0,
        successRate: 0,
        fundingUtilization: 0
      };
      
      // Previous rank is randomly assigned for demo
      // In a real implementation, this would come from historical data
      const previousRank = Math.floor(Math.random() * 7) + 1;
      
      return {
        id: ngo.id,
        name: ngo.name,
        logoUrl: ngo.logoUrl || 'https://placehold.co/80',
        verificationStatus: ngo.verificationStatus as 'verified' | 'pending',
        rating: ngo.rating,
        focus: ngo.focusAreas,
        region: ngo.address?.city || 'Unknown',
        size: ngo.size,
        metrics: {
          beneficiariesServed: metrics.beneficiariesServed || 0,
          successRate: metrics.successRate || 0,
          fundUtilization: metrics.fundingUtilization || 0,
          volunteerEngagement: ngo.staff?.volunteers || 0,
          communityRating: ngo.rating
        },
        previousRank: previousRank,
        currentRank: index + 1,
        awards: ngo.badges || []
      };
    });
  };

  // Load data from Firebase
  useEffect(() => {
    const loadNgoData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let metric: keyof NgoProfile['impactMetrics'] = 'beneficiariesServed';
        
        if (rankBy === 'successRate') {
          metric = 'successRate';
        } else if (rankBy === 'fundUtilization') {
          metric = 'fundingUtilization';
        }
        
        const topNgos = await getTopNgosByImpact(metric, 50);
        
        if (topNgos.length > 0) {
          const transformedData = transformNgoData(topNgos);
          setNgos(transformedData);
          setFilteredNgos(transformedData);
        } else {
          // If no data is available, use mock data
          setNgos(getMockData());
          setFilteredNgos(getMockData());
        }
      } catch (err) {
        console.error('Error loading NGO data:', err);
        setError('Failed to load leaderboard data. Using mock data instead.');
        
        // Fallback to mock data
        setNgos(getMockData());
        setFilteredNgos(getMockData());
      } finally {
        setLoading(false);
      }
    };
    
    loadNgoData();
  }, [rankBy]);

  // Apply filters
  useEffect(() => {
    let result = [...ngos];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(ngo => 
        ngo.focus.some(focus => focus.toLowerCase().includes(categoryFilter.toLowerCase()))
      );
    }
    
    // Apply region filter
    if (regionFilter !== 'all') {
      result = result.filter(ngo => ngo.region === regionFilter);
    }
    
    // Apply size filter
    if (sizeFilter !== 'all') {
      result = result.filter(ngo => ngo.size === sizeFilter);
    }
    
    // Apply sorting by selected metric
    result = result.sort((a, b) => {
      return b.metrics[rankBy as keyof typeof b.metrics] - a.metrics[rankBy as keyof typeof a.metrics];
    });
    
    setFilteredNgos(result);
  }, [ngos, categoryFilter, regionFilter, sizeFilter, rankBy]);

  // Render rank change indicator
  const renderRankChange = (current: number, previous: number) => {
    if (current === previous) {
      return <span className="text-gray-500">–</span>;
    }
    
    const change = previous - current; // Positive means improved (moved up)
    
    return (
      <div className={`flex items-center ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
        {change > 0 ? (
          <ArrowUp className="h-4 w-4 mr-1" />
        ) : (
          <ArrowDown className="h-4 w-4 mr-1" />
        )}
        <span>{Math.abs(change)}</span>
      </div>
    );
  };

  // Get metric display name
  const getMetricLabel = (metric: string) => {
    const labels: Record<string, string> = {
      'beneficiariesServed': 'Beneficiaries Served',
      'successRate': 'Success Rate',
      'fundUtilization': 'Fund Utilization',
      'volunteerEngagement': 'Volunteer Engagement',
      'communityRating': 'Community Rating'
    };
    
    return labels[metric] || metric;
  };

  // Get mock data for fallback
  const getMockData = (): NgoRanking[] => {
    return [
      {
        id: 'ngo1',
        name: 'Helping Hands Foundation',
        logoUrl: 'https://placehold.co/80',
        verificationStatus: 'verified',
        rating: 4.8,
        focus: ['Education', 'Healthcare'],
        region: 'Chennai',
        size: 'large',
        metrics: {
          beneficiariesServed: 2450,
          successRate: 92,
          fundUtilization: 94,
          volunteerEngagement: 156,
          communityRating: 4.7
        },
        previousRank: 2,
        currentRank: 1,
        awards: ['Most Efficient', 'Impact Champion']
      },
      {
        id: 'ngo2',
        name: 'Sunrise Trust',
        logoUrl: 'https://placehold.co/80',
        verificationStatus: 'verified',
        rating: 4.6,
        focus: ['Food Security', 'Education'],
        region: 'Madurai',
        size: 'medium',
        metrics: {
          beneficiariesServed: 1820,
          successRate: 88,
          fundUtilization: 96,
          volunteerEngagement: 104,
          communityRating: 4.5
        },
        previousRank: 1,
        currentRank: 2,
        awards: ['Volunteer Champion']
      },
      {
        id: 'ngo3',
        name: 'Hope Initiative',
        logoUrl: 'https://placehold.co/80',
        verificationStatus: 'verified',
        rating: 4.5,
        focus: ['Healthcare', 'Elderly Care'],
        region: 'Coimbatore',
        size: 'medium',
        metrics: {
          beneficiariesServed: 1650,
          successRate: 91,
          fundUtilization: 89,
          volunteerEngagement: 87,
          communityRating: 4.6
        },
        previousRank: 4,
        currentRank: 3,
        awards: ['Healthcare Excellence']
      },
      {
        id: 'ngo4',
        name: 'Better Tomorrow',
        logoUrl: 'https://placehold.co/80',
        verificationStatus: 'verified',
        rating: 4.3,
        focus: ['Environment', 'Education'],
        region: 'Trichy',
        size: 'small',
        metrics: {
          beneficiariesServed: 950,
          successRate: 85,
          fundUtilization: 92,
          volunteerEngagement: 65,
          communityRating: 4.4
        },
        previousRank: 3,
        currentRank: 4,
        awards: ['Environmental Impact']
      },
      {
        id: 'ngo5',
        name: 'New Life Foundation',
        logoUrl: 'https://placehold.co/80',
        verificationStatus: 'verified',
        rating: 4.2,
        focus: ['Women Empowerment', 'Skill Development'],
        region: 'Chennai',
        size: 'medium',
        metrics: {
          beneficiariesServed: 1120,
          successRate: 82,
          fundUtilization: 90,
          volunteerEngagement: 93,
          communityRating: 4.3
        },
        previousRank: 5,
        currentRank: 5,
        awards: ['Women Empowerment Award']
      },
      {
        id: 'ngo6',
        name: 'Rural Development Trust',
        logoUrl: 'https://placehold.co/80',
        verificationStatus: 'verified',
        rating: 4.1,
        focus: ['Agriculture', 'Rural Education'],
        region: 'Madurai',
        size: 'small',
        metrics: {
          beneficiariesServed: 870,
          successRate: 84,
          fundUtilization: 88,
          volunteerEngagement: 45,
          communityRating: 4.2
        },
        previousRank: 7,
        currentRank: 6,
        awards: ['Rural Impact']
      },
      {
        id: 'ngo7',
        name: 'Child First',
        logoUrl: 'https://placehold.co/80',
        verificationStatus: 'verified',
        rating: 4.0,
        focus: ['Child Welfare', 'Education'],
        region: 'Coimbatore',
        size: 'small',
        metrics: {
          beneficiariesServed: 765,
          successRate: 86,
          fundUtilization: 85,
          volunteerEngagement: 52,
          communityRating: 4.0
        },
        previousRank: 6,
        currentRank: 7,
        awards: []
      }
    ];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">NGO Impact Leaderboard</h2>
          <p className="text-gray-500 mt-1">Recognizing excellence in service and impact</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Select
            value={timeFrame}
            onValueChange={setTimeFrame}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Last Month</SelectItem>
              <SelectItem value="quarter">Last Quarter</SelectItem>
              <SelectItem value="year">Last Year</SelectItem>
              <SelectItem value="all">All Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          value={rankBy}
          onValueChange={setRankBy}
        >
          <SelectTrigger>
            <SelectValue placeholder="Rank by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="beneficiariesServed">Beneficiaries Served</SelectItem>
            <SelectItem value="successRate">Success Rate</SelectItem>
            <SelectItem value="fundUtilization">Fund Utilization</SelectItem>
            <SelectItem value="volunteerEngagement">Volunteer Engagement</SelectItem>
            <SelectItem value="communityRating">Community Rating</SelectItem>
          </SelectContent>
        </Select>
        
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
            <SelectItem value="environment">Environment</SelectItem>
            <SelectItem value="women">Women Empowerment</SelectItem>
            <SelectItem value="child">Child Welfare</SelectItem>
            <SelectItem value="rural">Rural Development</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={regionFilter}
          onValueChange={setRegionFilter}
        >
          <SelectTrigger>
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="Chennai">Chennai</SelectItem>
            <SelectItem value="Madurai">Madurai</SelectItem>
            <SelectItem value="Coimbatore">Coimbatore</SelectItem>
            <SelectItem value="Trichy">Trichy</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={sizeFilter}
          onValueChange={setSizeFilter}
        >
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
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <div className="grid grid-cols-12 text-sm font-medium text-gray-500">
              <div className="col-span-1 text-center">Rank</div>
              <div className="col-span-3">Organization</div>
              <div className="col-span-2">Focus Areas</div>
              <div className="col-span-2 text-center">{getMetricLabel(rankBy)}</div>
              <div className="col-span-1 text-center">Rating</div>
              <div className="col-span-1 text-center">Change</div>
              <div className="col-span-2 text-center">Recognition</div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="py-20 text-center">
                <p>Loading leaderboard data...</p>
              </div>
            ) : filteredNgos.length > 0 ? (
              <div>
                {filteredNgos.map((ngo, index) => (
                  <div 
                    key={ngo.id} 
                    className={`grid grid-cols-12 py-4 px-4 border-b items-center 
                      ${index === 0 ? 'bg-amber-50' : index === 1 ? 'bg-gray-50' : index === 2 ? 'bg-orange-50' : ''}`}
                  >
                    <div className="col-span-1 flex justify-center">
                      {index < 3 ? (
                        <div className={`
                          flex items-center justify-center rounded-full w-8 h-8 text-white font-bold
                          ${index === 0 ? 'bg-amber-500' : index === 1 ? 'bg-gray-500' : 'bg-orange-500'}
                        `}>
                          {index + 1}
                        </div>
                      ) : (
                        <div className="text-gray-700 font-medium">{index + 1}</div>
                      )}
                    </div>
                    
                    <div className="col-span-3 flex items-center">
                      <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex-shrink-0">
                        <img 
                          src={ngo.logoUrl} 
                          alt={`${ngo.name} logo`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 flex items-center">
                          {ngo.name}
                          {ngo.verificationStatus === 'verified' && (
                            <Badge className="ml-2 bg-green-100 text-green-800 text-xs">Verified</Badge>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">{ngo.region}</div>
                      </div>
                    </div>
                    
                    <div className="col-span-2">
                      <div className="flex flex-wrap gap-1">
                        {ngo.focus.slice(0, 2).map((area, i) => (
                          <Badge key={i} variant="outline" className="text-xs bg-blue-50">{area}</Badge>
                        ))}
                        {ngo.focus.length > 2 && (
                          <Badge variant="outline" className="text-xs">+{ngo.focus.length - 2}</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="col-span-2 text-center font-semibold">
                      {rankBy === 'communityRating' 
                        ? ngo.metrics[rankBy].toFixed(1)
                        : rankBy === 'successRate' || rankBy === 'fundUtilization'
                          ? `${ngo.metrics[rankBy]}%`
                          : ngo.metrics[rankBy].toLocaleString()}
                    </div>
                    
                    <div className="col-span-1 text-center">
                      <div className="flex items-center justify-center">
                        <Sparkles className="h-4 w-4 text-amber-500 mr-1" />
                        <span>{ngo.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="col-span-1 text-center">
                      {renderRankChange(ngo.currentRank, ngo.previousRank)}
                    </div>
                    
                    <div className="col-span-2 flex justify-center gap-1">
                      {ngo.awards.length > 0 ? (
                        <div className="flex flex-wrap gap-1 justify-center">
                          {ngo.awards.slice(0, 2).map((award, i) => (
                            <Badge key={i} className="bg-purple-100 text-purple-800 text-xs flex items-center">
                              <Award className="h-3 w-3 mr-1" />
                              {award}
                            </Badge>
                          ))}
                          {ngo.awards.length > 2 && (
                            <Badge className="bg-gray-100 text-gray-800 text-xs">+{ngo.awards.length - 2}</Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">-</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center">
                <p className="text-gray-500">No NGOs found matching your filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 text-amber-500 mr-2" />
              Most Beneficiaries Served
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ngos
                .sort((a, b) => b.metrics.beneficiariesServed - a.metrics.beneficiariesServed)
                .slice(0, 3)
                .map((ngo, index) => (
                  <div key={ngo.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex-shrink-0">
                        <img 
                          src={ngo.logoUrl} 
                          alt={`${ngo.name} logo`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <span className="font-medium">{ngo.name}</span>
                    </div>
                    <span className="font-semibold">{ngo.metrics.beneficiariesServed.toLocaleString()}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Medal className="h-5 w-5 text-green-500 mr-2" />
              Highest Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ngos
                .sort((a, b) => b.metrics.successRate - a.metrics.successRate)
                .slice(0, 3)
                .map((ngo, index) => (
                  <div key={ngo.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex-shrink-0">
                        <img 
                          src={ngo.logoUrl} 
                          alt={`${ngo.name} logo`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <span className="font-medium">{ngo.name}</span>
                    </div>
                    <span className="font-semibold">{ngo.metrics.successRate}%</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 text-blue-500 mr-2" />
              Best Volunteer Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ngos
                .sort((a, b) => b.metrics.volunteerEngagement - a.metrics.volunteerEngagement)
                .slice(0, 3)
                .map((ngo, index) => (
                  <div key={ngo.id} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-full mr-3 flex-shrink-0">
                        <img 
                          src={ngo.logoUrl} 
                          alt={`${ngo.name} logo`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <span className="font-medium">{ngo.name}</span>
                    </div>
                    <span className="font-semibold">{ngo.metrics.volunteerEngagement}</span>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImpactLeaderboard; 