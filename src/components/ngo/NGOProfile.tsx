import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
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
  Cell 
} from 'recharts';
import { format } from 'date-fns';
import NGOService, { NGOProfile as NGOProfileType } from '@/api/services/ngo.service';
import { useToast } from '@/components/ui/use-toast';
import { MapPin, Phone, Mail, Globe, FileText, Calendar, BanknoteIcon, Edit2, CheckCircle, XCircle, Clock } from 'lucide-react';

const NGOProfile: React.FC = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<NGOProfileType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    fetchNGOProfile();
  }, []);
  
  const fetchNGOProfile = async () => {
    try {
      setLoading(true);
      const data = await NGOService.getNGOProfile();
      setProfile(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching NGO profile:', err);
      setError('Failed to load NGO profile. Please try again.');
      toast({
        title: 'Error',
        description: 'Failed to load NGO profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getVerificationBadge = () => {
    if (!profile) return null;
    
    switch (profile.verificationStatus) {
      case 'verified':
        return <Badge className="bg-green-600"><CheckCircle className="w-4 h-4 mr-1" /> Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-500"><Clock className="w-4 h-4 mr-1" /> Pending Verification</Badge>;
      case 'rejected':
        return <Badge className="bg-red-600"><XCircle className="w-4 h-4 mr-1" /> Verification Rejected</Badge>;
      default:
        return null;
    }
  };
  
  // Placeholder data for impact charts - would use real data from profile
  const getImpactData = () => {
    if (!profile?.impactMetrics) {
      return {
        timeline: [
          { month: 'Jan', beneficiaries: 0, volunteers: 0, donations: 0 },
          { month: 'Feb', beneficiaries: 0, volunteers: 0, donations: 0 },
          { month: 'Mar', beneficiaries: 0, volunteers: 0, donations: 0 },
        ],
        categories: [
          { name: 'Education', value: 0 },
          { name: 'Healthcare', value: 0 },
          { name: 'Food Security', value: 0 },
          { name: 'Housing', value: 0 },
        ]
      };
    }
    
    // In real implementation, this would use actual data from the API
    return {
      timeline: [
        { month: 'Jan', beneficiaries: 45, volunteers: 12, donations: 25000 },
        { month: 'Feb', beneficiaries: 52, volunteers: 15, donations: 30000 },
        { month: 'Mar', beneficiaries: 65, volunteers: 20, donations: 35000 },
        { month: 'Apr', beneficiaries: 70, volunteers: 25, donations: 40000 },
        { month: 'May', beneficiaries: 85, volunteers: 22, donations: 38000 },
        { month: 'Jun', beneficiaries: 95, volunteers: 28, donations: 42000 },
      ],
      categories: [
        { name: 'Education', value: 40 },
        { name: 'Healthcare', value: 25 },
        { name: 'Food Security', value: 20 },
        { name: 'Housing', value: 15 },
      ]
    };
  };
  
  const impactData = getImpactData();
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded-md"></div>
          <div className="h-64 bg-gray-200 rounded-md"></div>
          <div className="h-96 bg-gray-200 rounded-md"></div>
        </div>
      </div>
    );
  }
  
  if (error || !profile) {
    return (
      <div className="w-full max-w-6xl mx-auto p-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl text-red-600">Error Loading Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || 'Profile not found'}</p>
            <Button onClick={fetchNGOProfile} className="mt-4">Retry</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card className="w-full mb-6">
        <CardHeader className="relative">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl flex items-center">
                {profile.name} 
                <span className="ml-3">{getVerificationBadge()}</span>
              </CardTitle>
              <CardDescription className="mt-2">
                {profile.description}
              </CardDescription>
            </div>
            <div>
              {profile.logoUrl && (
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                  <img 
                    src={profile.logoUrl} 
                    alt={`${profile.name} logo`} 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="absolute top-4 right-4"
            onClick={() => setEditMode(!editMode)}
          >
            <Edit2 className="w-4 h-4 mr-1" /> Edit
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="registration">Registration</TabsTrigger>
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Focus Areas</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.focusAreas.map(area => (
                      <Badge key={area} variant="outline">{area}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Established</h3>
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{profile.establishedYear}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Key Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-500">Beneficiaries Served</p>
                      <p className="text-2xl font-bold">{profile.impactMetrics?.beneficiariesServed || 0}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-500">Projects Completed</p>
                      <p className="text-2xl font-bold">{profile.impactMetrics?.projectsCompleted || 0}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-500">Volunteers Engaged</p>
                      <p className="text-2xl font-bold">{profile.impactMetrics?.volunteersEngaged || 0}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-500">Donations Received</p>
                      <p className="text-2xl font-bold">₹{(profile.impactMetrics?.donationsReceived || 0).toLocaleString()}</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="registration" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Registration Details</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <FileText className="w-5 h-5 mr-2 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium">Registration Number</p>
                        <p className="text-gray-600">{profile.registrationNumber}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <FileText className="w-5 h-5 mr-2 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium">Registration Type</p>
                        <p className="text-gray-600">{profile.registrationType}</p>
                      </div>
                    </div>
                    {profile.taxExemptionNumber && (
                      <div className="flex items-start">
                        <FileText className="w-5 h-5 mr-2 text-gray-500 mt-1" />
                        <div>
                          <p className="font-medium">Tax Exemption Number</p>
                          <p className="text-gray-600">{profile.taxExemptionNumber}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Verification</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="mr-2">Status:</span>
                      {getVerificationBadge()}
                    </div>
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 mr-2 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium">Registered On</p>
                        <p className="text-gray-600">
                          {profile.createdAt ? format(new Date(profile.createdAt), 'PPP') : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="w-5 h-5 mr-2 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium">Last Updated</p>
                        <p className="text-gray-600">
                          {profile.updatedAt ? format(new Date(profile.updatedAt), 'PPP') : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" /> View Registration Document
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="contact" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Contact Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-gray-500" />
                      <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline">
                        {profile.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-gray-500" />
                      <a href={`tel:${profile.phone}`} className="text-blue-600 hover:underline">
                        {profile.phone}
                      </a>
                    </div>
                    {profile.website && (
                      <div className="flex items-center">
                        <Globe className="w-5 h-5 mr-2 text-gray-500" />
                        <a 
                          href={profile.website.startsWith('http') ? profile.website : `https://${profile.website}`} 
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {profile.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Contact Person</h3>
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <div>
                        <p className="font-medium">{profile.contactPerson.name}</p>
                        <p className="text-gray-600">{profile.contactPerson.position}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 mr-2 text-gray-500" />
                      <a href={`mailto:${profile.contactPerson.email}`} className="text-blue-600 hover:underline">
                        {profile.contactPerson.email}
                      </a>
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-5 h-5 mr-2 text-gray-500" />
                      <a href={`tel:${profile.contactPerson.phone}`} className="text-blue-600 hover:underline">
                        {profile.contactPerson.phone}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Address</h3>
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 mr-2 text-gray-500 mt-1" />
                  <div>
                    <p>{profile.address.street}</p>
                    <p>{profile.address.city}, {profile.address.state} {profile.address.postalCode}</p>
                    <p>{profile.address.country}</p>
                  </div>
                </div>
                <div className="mt-4 h-64 bg-gray-100 rounded-md">
                  {/* This would be replaced with an actual Google Maps component */}
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-gray-500">Map view would be displayed here</p>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="financial" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Banking Information</h3>
                {profile.bankVerified ? (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Badge className="bg-green-600"><CheckCircle className="w-4 h-4 mr-1" /> Bank Account Verified</Badge>
                    </div>
                    <div className="flex items-start">
                      <BanknoteIcon className="w-5 h-5 mr-2 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium">Bank Name</p>
                        <p className="text-gray-600">••••••••••</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <BanknoteIcon className="w-5 h-5 mr-2 text-gray-500 mt-1" />
                      <div>
                        <p className="font-medium">Account Number</p>
                        <p className="text-gray-600">••••••••••</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Badge className="bg-yellow-500"><Clock className="w-4 h-4 mr-1" /> Bank Account Not Verified</Badge>
                    <p className="mt-2 text-gray-600">Complete your banking information to start receiving donations.</p>
                    <Button className="mt-2">Add Banking Details</Button>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">Financial Transparency</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-500">Total Funds Received</p>
                      <p className="text-2xl font-bold">₹{(profile.impactMetrics?.donationsReceived || 0).toLocaleString()}</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <p className="text-sm text-gray-500">Program Efficiency</p>
                      <p className="text-2xl font-bold">88%</p>
                      <p className="text-xs text-gray-500">Funds directly to beneficiaries</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="impact" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Impact Timeline</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={impactData.timeline}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                      <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="beneficiaries" name="Beneficiaries" fill="#8884d8" />
                      <Bar yAxisId="left" dataKey="volunteers" name="Volunteers" fill="#82ca9d" />
                      <Bar yAxisId="right" dataKey="donations" name="Donations (₹)" fill="#ffc658" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Impact Categories</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={impactData.categories}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {impactData.categories.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Success Metrics</h3>
                  <div className="space-y-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Projects</p>
                          <Badge className="bg-blue-600">{profile.impactMetrics?.projectsCompleted || 0} Completed</Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Beneficiary Satisfaction</p>
                          <Badge className="bg-green-600">4.8/5.0</Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '96%' }}></div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <p className="font-medium">Resource Utilization</p>
                          <Badge className="bg-purple-600">92%</Badge>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                          <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: '92%' }}></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NGOProfile; 