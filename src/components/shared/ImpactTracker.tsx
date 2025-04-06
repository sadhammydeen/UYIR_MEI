import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Button from '@/components/ui/button.tsx';
import { ArrowUp, ArrowDown, Users, GraduationCap, BookOpen, Stethoscope, 
         Heart, Home, ShoppingBag, TrendingUp } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const ImpactTracker: React.FC = () => {
  const [timeRange, setTimeRange] = useState('year');
  const [impactCategory, setImpactCategory] = useState('overview');
  
  // Mock data for different impact categories
  const overviewData = [
    { name: 'Jan', beneficiaries: 345, projects: 12, volunteers: 78 },
    { name: 'Feb', beneficiaries: 380, projects: 14, volunteers: 82 },
    { name: 'Mar', beneficiaries: 430, projects: 15, volunteers: 91 },
    { name: 'Apr', beneficiaries: 470, projects: 16, volunteers: 103 },
    { name: 'May', beneficiaries: 520, projects: 18, volunteers: 110 },
    { name: 'Jun', beneficiaries: 580, projects: 20, volunteers: 128 },
  ];
  
  const educationData = [
    { name: 'School Enrollment', value: 87, previousValue: 72, unit: '%' },
    { name: 'Attendance Rate', value: 91, previousValue: 83, unit: '%' },
    { name: 'Graduation Rate', value: 78, previousValue: 65, unit: '%' },
    { name: 'Academic Performance', value: 76, previousValue: 70, unit: '%' },
  ];
  
  const healthData = [
    { name: 'Treatments Provided', value: 1245, previousValue: 980, unit: '' },
    { name: 'Preventive Checkups', value: 875, previousValue: 620, unit: '' },
    { name: 'Recovery Rate', value: 92, previousValue: 86, unit: '%' },
    { name: 'Vaccination Coverage', value: 89, previousValue: 75, unit: '%' },
  ];
  
  const livelihoodData = [
    { name: 'Employment Secured', value: 215, previousValue: 178, unit: '' },
    { name: 'Average Income Increase', value: 42, previousValue: 28, unit: '%' },
    { name: 'Skill Training Completion', value: 356, previousValue: 290, unit: '' },
    { name: 'Business Startups', value: 63, previousValue: 41, unit: '' },
  ];
  
  const welfareData = [
    { name: 'Housing Secured', value: 156, previousValue: 132, unit: '' },
    { name: 'Food Security Achieved', value: 81, previousValue: 72, unit: '%' },
    { name: 'Water Access Improved', value: 76, previousValue: 58, unit: '%' },
    { name: 'Community Safety Rating', value: 8.2, previousValue: 7.1, unit: '/10' },
  ];
  
  // Quarterly comparison data
  const quarterlyData = [
    { name: 'Q1', education: 34, health: 42, livelihood: 27, welfare: 33 },
    { name: 'Q2', education: 41, health: 48, livelihood: 31, welfare: 38 },
    { name: 'Q3', education: 47, health: 53, livelihood: 36, welfare: 43 },
    { name: 'Q4', education: 52, health: 59, livelihood: 42, welfare: 49 },
  ];
  
  // Success stories data
  const successStories = [
    {
      id: 1,
      title: "Education transformed my village",
      beneficiary: "Sunita Devi",
      location: "Madurai",
      category: "education",
      story: "With the help of educational programs, our village now has 98% literacy rate. Children who once had no access to education are now preparing for college.",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 2,
      title: "From illness to wellness",
      beneficiary: "Rahul Shah",
      location: "Chennai",
      category: "health",
      story: "After struggling with chronic illness for years without access to care, the medical camps brought specialists to our neighborhood. Today, I'm healthy and working again.",
      image: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    },
    {
      id: 3,
      title: "New skills, new life",
      beneficiary: "Vijay Prakash",
      location: "Coimbatore",
      category: "livelihood",
      story: "The vocational training in mobile repair gave me skills to start my own shop. I now employ two others from my community and can support my family.",
      image: "https://images.unsplash.com/photo-1529390079861-591de354faf5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
    }
  ];
  
  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F'];
  
  // Helper to calculate percentage change
  const calculateChange = (current: number, previous: number) => {
    return previous !== 0 ? Math.round(((current - previous) / previous) * 100) : 100;
  };
  
  // Helper to render the change indicator
  const renderChangeIndicator = (current: number, previous: number) => {
    const percentChange = calculateChange(current, previous);
    
    return (
      <div className={`flex items-center ${percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
        {percentChange >= 0 ? (
          <ArrowUp className="h-4 w-4 mr-1" />
        ) : (
          <ArrowDown className="h-4 w-4 mr-1" />
        )}
        <span>{Math.abs(percentChange)}%</span>
      </div>
    );
  };
  
  // Get icon for category
  const getCategoryIcon = (category: string, size = 18) => {
    switch(category) {
      case 'education':
        return <GraduationCap size={size} />;
      case 'health':
        return <Stethoscope size={size} />;
      case 'livelihood':
        return <ShoppingBag size={size} />;
      case 'welfare':
        return <Home size={size} />;
      case 'overview':
      default:
        return <TrendingUp size={size} />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Impact Tracker</h2>
        <div className="flex gap-2">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
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
      
      <Tabs defaultValue="overview" value={impactCategory} onValueChange={setImpactCategory}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4" /> Overview
          </TabsTrigger>
          <TabsTrigger value="education" className="flex items-center gap-1">
            <GraduationCap className="h-4 w-4" /> Education
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center gap-1">
            <Stethoscope className="h-4 w-4" /> Health
          </TabsTrigger>
          <TabsTrigger value="livelihood" className="flex items-center gap-1">
            <ShoppingBag className="h-4 w-4" /> Livelihood
          </TabsTrigger>
          <TabsTrigger value="welfare" className="flex items-center gap-1">
            <Home className="h-4 w-4" /> Welfare
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Beneficiaries Reached</CardTitle>
                <CardDescription>Total individuals served</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">2,725</div>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>18% from last period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Projects Completed</CardTitle>
                <CardDescription>Successful initiatives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">95</div>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>12% from last period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Volunteers Engaged</CardTitle>
                <CardDescription>Active contributors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">592</div>
                <div className="flex items-center text-green-600 text-sm mt-1">
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>24% from last period</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle>Progress Trends</CardTitle>
              <CardDescription>Growth across key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={overviewData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="beneficiaries" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line type="monotone" dataKey="projects" stroke="#82ca9d" />
                    <Line type="monotone" dataKey="volunteers" stroke="#ffc658" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quarterly Impact Comparison</CardTitle>
              <CardDescription>Performance across impact categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    width={500}
                    height={300}
                    data={quarterlyData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="education" fill="#8884d8" />
                    <Bar dataKey="health" fill="#82ca9d" />
                    <Bar dataKey="livelihood" fill="#ffc658" />
                    <Bar dataKey="welfare" fill="#ff8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {educationData.map((item, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {item.value}{item.unit}
                  </div>
                  <div className="flex items-center text-sm mt-1">
                    {renderChangeIndicator(item.value, item.previousValue)}
                    <span className="ml-1 text-gray-500">from previous period</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap /> Education Impact Stories
              </CardTitle>
              <CardDescription>Success stories from educational initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {successStories
                  .filter(story => story.category === 'education')
                  .map(story => (
                    <Card key={story.id} className="overflow-hidden">
                      <img 
                        src={story.image} 
                        alt={story.title} 
                        className="w-full h-40 object-cover"
                      />
                      <CardHeader className="p-4 pb-2">
                        <CardTitle className="text-base">{story.title}</CardTitle>
                        <CardDescription>{story.beneficiary} • {story.location}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <p className="text-sm text-gray-600 line-clamp-3">{story.story}</p>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" size="sm">Read Full Story</Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Health Tab */}
        <TabsContent value="health" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {healthData.map((item, index) => (
              <Card key={index}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {item.value}{item.unit}
                  </div>
                  <div className="flex items-center text-sm mt-1">
                    {renderChangeIndicator(item.value, item.previousValue)}
                    <span className="ml-1 text-gray-500">from previous period</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Health Services Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Checkups', value: 35 },
                          { name: 'Treatments', value: 25 },
                          { name: 'Surgeries', value: 15 },
                          { name: 'Vaccinations', value: 15 },
                          { name: 'Counseling', value: 10 }
                        ]}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {[0, 1, 2, 3, 4].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Treatment Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: 'Acute', rate: 94 },
                        { name: 'Chronic', rate: 86 },
                        { name: 'Preventive', rate: 98 },
                        { name: 'Maternity', rate: 92 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="rate" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Livelihood and Welfare Tab contents would go here with similar structure */}
        
      </Tabs>
    </div>
  );
};

export default ImpactTracker; 