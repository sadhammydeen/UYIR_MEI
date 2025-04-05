import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { 
  Users, 
  Heart, 
  ArrowUpRight, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Calendar, 
  Briefcase, 
  ArrowRight,
  BarChart3,
  Activity
} from 'lucide-react';

import NGOService, { 
  NGOProfile, 
  CollaborationRequest, 
  CollaborationProject 
} from '@/api/services/ngo.service';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

const NGODashboard: React.FC = () => {
  const { toast } = useToast();
  const [profile, setProfile] = useState<NGOProfile | null>(null);
  const [collaborationRequests, setCollaborationRequests] = useState<CollaborationRequest[]>([]);
  const [projects, setProjects] = useState<CollaborationProject[]>([]);
  const [loading, setLoading] = useState({
    profile: true,
    requests: true,
    projects: true
  });
  
  useEffect(() => {
    fetchNGOData();
  }, []);
  
  const fetchNGOData = async () => {
    try {
      // Fetch profile
      setLoading(prev => ({ ...prev, profile: true }));
      const profileData = await NGOService.getNGOProfile();
      setProfile(profileData);
      setLoading(prev => ({ ...prev, profile: false }));
      
      // Fetch collaboration requests
      setLoading(prev => ({ ...prev, requests: true }));
      const requestsData = await NGOService.getCollaborationRequests();
      setCollaborationRequests(requestsData);
      setLoading(prev => ({ ...prev, requests: false }));
      
      // Fetch projects
      setLoading(prev => ({ ...prev, projects: true }));
      const projectsData = await NGOService.getCollaborationProjects();
      setProjects(projectsData);
      setLoading(prev => ({ ...prev, projects: false }));
    } catch (error) {
      console.error('Error fetching NGO data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data. Please try again.',
        variant: 'destructive',
      });
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
  
  // Filter pending requests
  const pendingRequests = collaborationRequests.filter(req => req.status === 'pending');
  
  // Filter active projects
  const activeProjects = projects.filter(project => project.status === 'active' || project.status === 'planning');
  
  // Mock data for charts
  const impactData = [
    { name: 'Jan', beneficiaries: 45, volunteers: 12, donations: 25000 },
    { name: 'Feb', beneficiaries: 52, volunteers: 15, donations: 30000 },
    { name: 'Mar', beneficiaries: 65, volunteers: 20, donations: 35000 },
    { name: 'Apr', beneficiaries: 70, volunteers: 25, donations: 40000 },
    { name: 'May', beneficiaries: 85, volunteers: 22, donations: 38000 },
    { name: 'Jun', beneficiaries: 95, volunteers: 28, donations: 42000 },
  ];
  
  const focusAreaData = [
    { name: 'Education', value: 40 },
    { name: 'Healthcare', value: 25 },
    { name: 'Food Security', value: 20 },
    { name: 'Housing', value: 15 },
  ];
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-3xl font-bold mb-6">NGO Dashboard</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile overview */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Organization Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {loading.profile ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-3/4" />
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : profile ? (
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-semibold">{profile.name}</h2>
                      {getVerificationBadge()}
                    </div>
                    <p className="text-gray-600 mb-4">{profile.description.substring(0, 180)}...</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {profile.focusAreas.map(area => (
                        <Badge key={area} variant="outline">{area}</Badge>
                      ))}
                    </div>
                    <Link to="/ngo-profile">
                      <Button variant="outline" size="sm">
                        View Complete Profile <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                  <div className="shrink-0">
                    {profile.logoUrl ? (
                      <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-gray-200">
                        <img 
                          src={profile.logoUrl} 
                          alt={`${profile.name} logo`} 
                          className="h-full w-full object-cover" 
                        />
                      </div>
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <Briefcase className="h-10 w-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <p>Failed to load profile. <Button variant="link" onClick={fetchNGOData}>Retry</Button></p>
              )}
            </CardContent>
          </Card>
          
          {/* Metrics dashboard */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Impact Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              {loading.profile ? (
                <div className="space-y-4">
                  <Skeleton className="h-40 w-full" />
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                  </div>
                </div>
              ) : profile ? (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <span className="text-sm text-blue-600 font-medium">Beneficiaries</span>
                      </div>
                      <p className="text-2xl font-bold mt-2">{profile.impactMetrics?.beneficiariesServed || 0}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Briefcase className="h-5 w-5 text-green-600" />
                        <span className="text-sm text-green-600 font-medium">Projects</span>
                      </div>
                      <p className="text-2xl font-bold mt-2">{profile.impactMetrics?.projectsCompleted || 0}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-600" />
                        <span className="text-sm text-purple-600 font-medium">Volunteers</span>
                      </div>
                      <p className="text-2xl font-bold mt-2">{profile.impactMetrics?.volunteersEngaged || 0}</p>
                    </div>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-amber-600" />
                        <span className="text-sm text-amber-600 font-medium">Donations</span>
                      </div>
                      <p className="text-2xl font-bold mt-2">₹{(profile.impactMetrics?.donationsReceived || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <Tabs defaultValue="timeline">
                    <TabsList className="mb-4">
                      <TabsTrigger value="timeline">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Timeline
                      </TabsTrigger>
                      <TabsTrigger value="focus">
                        <Activity className="h-4 w-4 mr-2" />
                        Focus Areas
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="timeline">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={impactData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <RechartsTooltip />
                            <Legend />
                            <Bar dataKey="beneficiaries" fill="#8884d8" name="Beneficiaries" />
                            <Bar dataKey="volunteers" fill="#82ca9d" name="Volunteers" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="focus">
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={focusAreaData}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {focusAreaData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Legend />
                            <RechartsTooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                  </Tabs>
                </>
              ) : (
                <p>Failed to load metrics. <Button variant="link" onClick={fetchNGOData}>Retry</Button></p>
              )}
            </CardContent>
          </Card>
          
          {/* Active projects */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>Your ongoing collaborative initiatives</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.projects ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : activeProjects.length > 0 ? (
                <div className="space-y-4">
                  {activeProjects.slice(0, 3).map(project => (
                    <Card key={project.id}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{project.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">
                              {project.participants.length} Participants • Started {format(new Date(project.startDate), 'MMM d, yyyy')}
                            </p>
                            <div className="mt-2">
                              <Badge className={
                                project.status === 'active' ? 'bg-green-600' : 
                                project.status === 'planning' ? 'bg-blue-600' : 
                                'bg-gray-600'
                              }>
                                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                              </Badge>
                            </div>
                          </div>
                          <div>
                            <Button variant="outline" size="sm">View Details</Button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{
                              Math.round(
                                (project.activities.filter(a => a.status === 'completed').length / project.activities.length) * 100
                              )}%
                            </span>
                          </div>
                          <Progress value={
                            Math.round(
                              (project.activities.filter(a => a.status === 'completed').length / project.activities.length) * 100
                            )
                          } className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium">No Active Projects</h3>
                  <p className="text-gray-500 mb-4">Start collaborating with other NGOs to create impact together</p>
                  <Button>Create New Project</Button>
                </div>
              )}
            </CardContent>
            {activeProjects.length > 3 && (
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Projects <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            )}
          </Card>
        </div>
        
        {/* Right column */}
        <div className="space-y-6">
          {/* Collaboration requests */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Collaboration Requests</CardTitle>
              <CardDescription>Pending requests and invitations</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.requests ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.slice(0, 5).map(request => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">
                            {request.senderId === (profile?.id || '') ? 'Sent to' : 'Request from'} NGO-{request.senderId === (profile?.id || '') ? request.receiverId : request.senderId}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {request.createdAt ? format(new Date(request.createdAt), 'MMM d, yyyy') : 'Date unavailable'}
                          </p>
                          <p className="text-sm mt-2">{request.message.substring(0, 60)}...</p>
                        </div>
                        <Badge className="bg-yellow-500"><Clock className="w-4 h-4 mr-1" /> Pending</Badge>
                      </div>
                      
                      {request.senderId !== (profile?.id || '') && (
                        <div className="flex gap-2 mt-4">
                          <Button 
                            size="sm" 
                            onClick={() => NGOService.respondToCollaborationRequest(request.id || '', 'accepted')}
                          >
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => NGOService.respondToCollaborationRequest(request.id || '', 'rejected')}
                          >
                            Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium">No Pending Requests</h3>
                  <p className="text-gray-500 mb-4">You don't have any pending collaboration requests</p>
                  <Button>Send New Request</Button>
                </div>
              )}
            </CardContent>
            {pendingRequests.length > 5 && (
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Requests <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            )}
          </Card>
          
          {/* Upcoming activities */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Upcoming Activities</CardTitle>
              <CardDescription>Tasks and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.projects ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {activeProjects.length > 0 ? (
                    activeProjects.flatMap(project => 
                      project.activities
                        .filter(activity => activity.status !== 'completed' && activity.dueDate)
                        .map(activity => ({
                          id: activity.id,
                          title: activity.title,
                          project: project.title,
                          dueDate: activity.dueDate,
                          status: activity.status
                        }))
                    )
                    .sort((a, b) => new Date(a.dueDate || '').getTime() - new Date(b.dueDate || '').getTime())
                    .slice(0, 5)
                    .map(activity => (
                      <div key={activity.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{activity.title}</h3>
                            <p className="text-sm text-gray-500">Project: {activity.project}</p>
                          </div>
                          <Badge className={
                            activity.status === 'in-progress' ? 'bg-blue-600' : 'bg-yellow-500'
                          }>
                            {activity.status === 'in-progress' ? 'In Progress' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="flex items-center mt-2 text-sm">
                          <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                          <span>Due: {format(new Date(activity.dueDate || ''), 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                      <h3 className="text-lg font-medium">No Upcoming Activities</h3>
                      <p className="text-gray-500">You don't have any pending activities</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Quick actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button className="justify-start">
                  <Heart className="mr-2 h-4 w-4" />
                  Create Project
                </Button>
                <Button className="justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Send Request
                </Button>
                <Button className="justify-start" variant="outline">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Find NGOs
                </Button>
                <Button className="justify-start" variant="outline">
                  <Users className="mr-2 h-4 w-4" />
                  Manage Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard; 