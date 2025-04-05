import React, { useEffect, useState } from 'react';
import { 
  ArrowRight, 
  Heart, 
  Users, 
  Building2, 
  Home, 
  BookOpen, 
  Activity,
  Check,
  BarChart3,
  Map,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useLoading } from '@/contexts/LoadingContext';
import { useToast } from '@/components/ui/use-toast';
import DonationService, { DonationNeed } from '@/api/services/donation.service';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Success stories data for development
const DUMMY_SUCCESS_STORIES = [
  {
    id: '1',
    title: 'Education for Rural Children',
    description: 'Thanks to generous donations, 25 children from rural Tamil Nadu received educational supplies and school fees for an entire year.',
    category: 'education',
    beneficiaryType: 'individual',
    location: 'Tamil Nadu',
    impactMetrics: {
      beneficiariesHelped: 25,
      outcomeDescription: 'All 25 children have shown improved academic performance, with 15 ranking in the top 10% of their class.',
      images: ['/images/success-stories/education-1.jpg']
    }
  },
  {
    id: '2',
    title: 'Medical Camp in Underserved Community',
    description: 'A two-day medical camp was organized in a remote village, providing free health check-ups, medicines, and referrals for specialized care.',
    category: 'healthcare',
    beneficiaryType: 'community',
    location: 'Kerala',
    impactMetrics: {
      beneficiariesHelped: 250,
      outcomeDescription: '250 villagers received free health check-ups, 45 were referred for specialized treatment, and all received essential medicines.',
      images: ['/images/success-stories/healthcare-1.jpg']
    }
  },
  {
    id: '3',
    title: 'Clean Water Project',
    description: 'A clean water well was established in a drought-prone area, providing sustainable access to clean water for the entire community.',
    category: 'food',
    beneficiaryType: 'community',
    location: 'Karnataka',
    impactMetrics: {
      beneficiariesHelped: 500,
      outcomeDescription: 'Water-borne diseases have reduced by 65% in the community, and women save an average of 2 hours daily previously spent collecting water.',
      images: ['/images/success-stories/water-1.jpg']
    }
  }
];

// Category icons mapping
const categoryIcons = {
  education: <BookOpen className="h-5 w-5" />,
  healthcare: <Activity className="h-5 w-5" />,
  food: <Heart className="h-5 w-5" />,
  shelter: <Home className="h-5 w-5" />,
  livelihood: <Building2 className="h-5 w-5" />,
  other: <Target className="h-5 w-5" />
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const ImpactTracker = () => {
  const { setIsLoading } = useLoading();
  const { toast } = useToast();
  
  const [donationStats, setDonationStats] = useState<any>(null);
  const [completedNeeds, setCompletedNeeds] = useState<DonationNeed[]>([]);
  const [successStories, setSuccessStories] = useState<any[]>(DUMMY_SUCCESS_STORIES); // Use dummy data for development
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchImpactData();
    window.scrollTo(0, 0);
  }, []);
  
  const fetchImpactData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch donation statistics
      const stats = await DonationService.getDonationStats();
      setDonationStats(stats);
      
      // In a real implementation, fetch completed needs with impact data
      // For now, we'll use dummy data
      // const needs = await DonationService.getActiveNeeds({ status: 'fulfilled' });
      // setCompletedNeeds(needs);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching impact data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load impact data. Please try again later.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create chart data based on success stories categories
  const categoryData = [
    { name: 'Education', value: 128 },
    { name: 'Healthcare', value: 165 },
    { name: 'Food', value: 104 },
    { name: 'Shelter', value: 87 },
    { name: 'Livelihood', value: 56 },
    { name: 'Other', value: 32 }
  ];
  
  const locationData = [
    { name: 'Tamil Nadu', value: 156 },
    { name: 'Kerala', value: 112 },
    { name: 'Karnataka', value: 98 },
    { name: 'Andhra Pradesh', value: 75 },
    { name: 'Maharashtra', value: 64 },
    { name: 'Other States', value: 42 }
  ];
  
  const monthlyImpactData = [
    { name: 'Jan', beneficiaries: 126, donations: 250000 },
    { name: 'Feb', beneficiaries: 148, donations: 320000 },
    { name: 'Mar', beneficiaries: 187, donations: 380000 },
    { name: 'Apr', beneficiaries: 215, donations: 450000 },
    { name: 'May', beneficiaries: 198, donations: 420000 },
    { name: 'Jun', beneficiaries: 245, donations: 510000 }
  ];
  
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
                MEASURING IMPACT
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Your Donations <span className="yellow-highlight">Make a Difference</span>
              </h1>
              <p className="text-white/80 text-lg mb-8">
                See the real impact of your generosity. Every contribution transforms lives and creates lasting change in communities.
              </p>
            </div>
          </div>
        </section>
        
        {/* Impact Overview */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-theuyir-darkgrey mb-4">Our Collective Impact</h2>
              <p className="text-gray-600">
                Together, our donors, volunteers, NGOs and beneficiaries create meaningful change. 
                Here's a snapshot of what we've accomplished.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <Card className="text-center bg-blue-50 border-blue-100">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-theuyir-darkgrey">₹{loading ? '...' : donationStats?.totalDonated?.toLocaleString() || '15,425,000'}</h3>
                  <p className="text-gray-600 mt-1">Total Donations</p>
                </CardContent>
              </Card>
              
              <Card className="text-center bg-green-50 border-green-100">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-theuyir-darkgrey">{loading ? '...' : donationStats?.needsServed || '547'}</h3>
                  <p className="text-gray-600 mt-1">Needs Fulfilled</p>
                </CardContent>
              </Card>
              
              <Card className="text-center bg-amber-50 border-amber-100">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-theuyir-darkgrey">{loading ? '...' : donationStats?.beneficiariesImpacted || '12,548'}</h3>
                  <p className="text-gray-600 mt-1">Beneficiaries Impacted</p>
                </CardContent>
              </Card>
              
              <Card className="text-center bg-purple-50 border-purple-100">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Map className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-theuyir-darkgrey">{loading ? '...' : '36'}</h3>
                  <p className="text-gray-600 mt-1">Districts Reached</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="mr-2 h-5 w-5 text-theuyir-pink" />
                    Monthly Impact
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={monthlyImpactData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                        <Tooltip />
                        <Legend />
                        <Bar yAxisId="left" dataKey="beneficiaries" name="Beneficiaries Helped" fill="#8884d8" />
                        <Bar yAxisId="right" dataKey="donations" name="Donations (₹)" fill="#82ca9d" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="mr-2 h-5 w-5 text-theuyir-pink" />
                    Impact by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} beneficiaries`, 'Impact']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={locationData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {locationData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} beneficiaries`, 'Location']} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Success Stories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold text-theuyir-darkgrey mb-4">Success Stories</h2>
              <p className="text-gray-600">
                Behind every donation is a story of transformation. 
                See how your contributions have made a real difference in people's lives.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {successStories.map((story) => (
                <Card key={story.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {story.impactMetrics.images && story.impactMetrics.images.length > 0 && (
                    <div className="h-52 overflow-hidden">
                      <img
                        src={story.impactMetrics.images[0]}
                        alt={story.title}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="flex items-center gap-1">
                        {categoryIcons[story.category as keyof typeof categoryIcons]} 
                        {story.category.charAt(0).toUpperCase() + story.category.slice(1)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{story.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-gray-600 mb-4 line-clamp-3">{story.description}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                      <Users className="h-4 w-4" />
                      <span>{story.impactMetrics.beneficiariesHelped} beneficiaries helped</span>
                    </div>
                    {story.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Map className="h-4 w-4" />
                        <span>{story.location}</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="link" className="px-0">
                      Read Full Story <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                View All Success Stories
              </Button>
            </div>
          </div>
        </section>
        
        {/* Get Involved CTA */}
        <section className="py-16 bg-theuyir-pink text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">Join Us in Creating Impact</h2>
              <p className="text-white/80 mb-8">
                Your donations create real, measurable change. Whether it's through donating, volunteering, or spreading the word, 
                you can help us continue this impactful work.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="secondary" size="lg">
                  Donate Now
                </Button>
                <Button variant="outline" className="bg-transparent border-white hover:bg-white hover:text-theuyir-pink" size="lg">
                  See Open Needs
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ImpactTracker; 