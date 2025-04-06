import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { CalendarIcon, CheckCircleIcon, Clock2Icon, ListTodoIcon, UsersIcon } from 'lucide-react';
import { format } from 'date-fns';
import NGOService, { CollaborationProject, NGOProfile } from '@/api/services/ngo.service';

const ProjectManagement: React.FC = () => {
  const [projects, setProjects] = useState<CollaborationProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<CollaborationProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<CollaborationProject | null>(null);
  const [isProjectDetailOpen, setIsProjectDetailOpen] = useState(false);
  const [ngoProfiles, setNgoProfiles] = useState<Record<string, NGOProfile>>({});
  const { toast } = useToast();

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const projectsData = await NGOService.getCollaborationProjects();
        setProjects(projectsData);
        setFilteredProjects(projectsData);
        
        // Fetch NGO profiles for all participants
        const uniqueNgoIds = [...new Set(projectsData.flatMap(p => p.participants))];
        const profiles: Record<string, NGOProfile> = {};
        
        for (const id of uniqueNgoIds) {
          try {
            const profile = await NGOService.getNGOById(id);
            profiles[id] = profile;
          } catch (error) {
            console.error(`Error fetching NGO profile for ID ${id}:`, error);
          }
        }
        
        setNgoProfiles(profiles);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          title: 'Error',
          description: 'Failed to load projects',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [toast]);

  // Handle filter change
  useEffect(() => {
    if (activeFilter === 'all') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(project => project.status === activeFilter));
    }
  }, [activeFilter, projects]);

  // View project details
  const handleViewProject = async (projectId: string) => {
    try {
      const projectDetails = await NGOService.getProjectById(projectId);
      setSelectedProject(projectDetails);
      setIsProjectDetailOpen(true);
    } catch (error) {
      console.error('Error fetching project details:', error);
      toast({
        title: 'Error',
        description: 'Failed to load project details',
        variant: 'destructive',
      });
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return format(new Date(dateString), 'PPP');
  };

  // Calculate project progress
  const calculateProgress = (project: CollaborationProject) => {
    if (!project.activities || project.activities.length === 0) return 0;
    
    const completedActivities = project.activities.filter(activity => activity.status === 'completed').length;
    return Math.round((completedActivities / project.activities.length) * 100);
  };

  // Get status badge
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'planning':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Planning</Badge>;
      case 'active':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Active</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Project card component
  const ProjectCard = ({ project }: { project: CollaborationProject }) => {
    const progress = calculateProgress(project);
    
    return (
      <Card className="mb-4 hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{project.title}</CardTitle>
              <CardDescription>
                Started: {formatDate(project.startDate)}
                {project.endDate && ` • Due: ${formatDate(project.endDate)}`}
              </CardDescription>
            </div>
            <StatusBadge status={project.status} />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
          
          <div className="flex items-center gap-1 mb-2">
            <UsersIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {project.participants.length} participating NGO{project.participants.length !== 1 && 's'}
            </span>
          </div>
          
          <div className="flex items-center gap-1 mb-4">
            <ListTodoIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              {project.activities.length} activit{project.activities.length !== 1 ? 'ies' : 'y'}
            </span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="default" 
            className="w-full"
            onClick={() => handleViewProject(project.id)}
          >
            View Details
          </Button>
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Project Management</h2>
      </div>

      <Tabs defaultValue="all" value={activeFilter} onValueChange={setActiveFilter}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="planning">Planning</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeFilter}>
          {loading ? (
            <div className="grid place-items-center p-8">
              <p>Loading projects...</p>
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <ListTodoIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No projects found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {activeFilter === 'all' 
                  ? "You don't have any projects yet." 
                  : `You don't have any ${activeFilter} projects.`}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Project Detail Dialog */}
      {selectedProject && (
        <Dialog open={isProjectDetailOpen} onOpenChange={setIsProjectDetailOpen}>
          <DialogContent className="sm:max-w-[900px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                {selectedProject.title}
                <StatusBadge status={selectedProject.status} />
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              {/* Project overview section */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Project Overview</h3>
                <p className="text-gray-700">{selectedProject.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Start Date</p>
                    <p className="text-sm font-semibold">{formatDate(selectedProject.startDate)}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">End Date</p>
                    <p className="text-sm font-semibold">{selectedProject.endDate ? formatDate(selectedProject.endDate) : 'Not specified'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Location</p>
                    <p className="text-sm font-semibold">{selectedProject.location || 'Not specified'}</p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500">Progress</p>
                    <div className="flex items-center gap-2">
                      <Progress value={calculateProgress(selectedProject)} className="h-2 w-24" />
                      <span className="text-sm font-semibold">{calculateProgress(selectedProject)}%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Participants section */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Participating NGOs</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedProject.participants.map((ngoId) => {
                    const ngo = ngoProfiles[ngoId];
                    return (
                      <Card key={ngoId} className="overflow-hidden">
                        <CardHeader className="py-3">
                          <CardTitle className="text-base">{ngo?.name || `NGO (ID: ${ngoId})`}</CardTitle>
                        </CardHeader>
                        {ngo && (
                          <CardContent className="py-2">
                            <p className="text-xs text-gray-600">{ngo.email}</p>
                            <p className="text-xs text-gray-600">{ngo.phone}</p>
                          </CardContent>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
              
              <Separator />
              
              {/* Resources section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Resources</h3>
                </div>
                
                {selectedProject.resources && selectedProject.resources.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 pl-2">Type</th>
                          <th className="text-left py-2">Description</th>
                          <th className="text-left py-2">Quantity</th>
                          <th className="text-left py-2">Provided By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProject.resources.map((resource, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-2 pl-2 font-medium">{resource.type}</td>
                            <td className="py-2">{resource.description}</td>
                            <td className="py-2">{resource.quantity} {resource.unit || ''}</td>
                            <td className="py-2">{ngoProfiles[resource.providedBy]?.name || resource.providedBy}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No resources have been added to this project yet.</p>
                )}
              </div>
              
              <Separator />
              
              {/* Activities section */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold">Activities</h3>
                </div>
                
                {selectedProject.activities && selectedProject.activities.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4">
                    {selectedProject.activities.map((activity) => (
                      <Card key={activity.id}>
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-base">{activity.title}</CardTitle>
                            <Badge 
                              variant="outline" 
                              className={
                                activity.status === 'completed' 
                                  ? "bg-green-100 text-green-800" 
                                  : activity.status === 'in-progress'
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }
                            >
                              {activity.status === 'in-progress' ? 'In Progress' : 
                               activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="py-2">
                          <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
                          <div className="flex justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <UsersIcon className="h-3 w-3" />
                              <span>{ngoProfiles[activity.assignedTo]?.name || activity.assignedTo}</span>
                            </div>
                            {activity.dueDate && (
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-3 w-3" />
                                <span>Due: {formatDate(activity.dueDate)}</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No activities have been added to this project yet.</p>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsProjectDetailOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProjectManagement; 