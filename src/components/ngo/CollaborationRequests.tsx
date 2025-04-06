import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Button from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon, ChevronDownIcon, CheckIcon, XIcon, ClockIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import NGOService, { CollaborationRequest, NgoProfile } from '@/api/services/ngo.service';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

// Form schema for collaboration request
const requestSchema = z.object({
  receiverId: z.string().min(1, { message: 'Please select an NGO' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
  projectDetails: z.object({
    title: z.string().min(3, { message: 'Title must be at least 3 characters' }),
    description: z.string().min(10, { message: 'Description must be at least 10 characters' }),
    startDate: z.date().optional(),
    endDate: z.date().optional(),
    location: z.string().optional(),
    resourcesNeeded: z.array(z.string()).optional(),
  }),
});

type RequestFormValues = z.infer<typeof requestSchema>;

const CollaborationRequests: React.FC = () => {
  const [activeTab, setActiveTab] = useState('incoming');
  const [incomingRequests, setIncomingRequests] = useState<CollaborationRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<CollaborationRequest[]>([]);
  const [pastCollaborations, setPastCollaborations] = useState<CollaborationRequest[]>([]);
  const [availableNGOs, setAvailableNGOs] = useState<NgoProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<CollaborationRequest | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isResponseOpen, setIsResponseOpen] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const form = useForm<RequestFormValues>({
    resolver: zodResolver(requestSchema),
    defaultValues: {
      receiverId: '',
      message: '',
      projectDetails: {
        title: '',
        description: '',
        resourcesNeeded: [],
      },
    },
  });

  // Fetch requests and NGOs
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const allRequests = await NGOService.getCollaborationRequests();
        
        // Get current NGO profile to filter requests
        const currentNGO = await NGOService.getNGOProfile();
        
        // Filter incoming, outgoing and past collaborations
        setIncomingRequests(allRequests.filter(req => 
          req.receiverId === currentNGO.id && req.status === 'pending'
        ));
        
        setOutgoingRequests(allRequests.filter(req => 
          req.senderId === currentNGO.id && req.status === 'pending'
        ));
        
        setPastCollaborations(allRequests.filter(req => 
          (req.senderId === currentNGO.id || req.receiverId === currentNGO.id) 
          && (req.status === 'accepted' || req.status === 'rejected')
        ));
        
        // Get all NGOs for the new request form
        const ngos = await NGOService.getAllNGOs();
        setAvailableNGOs(ngos.filter(ngo => ngo.id !== currentNGO.id));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching collaboration data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load collaboration requests',
          variant: 'destructive',
        });
        setLoading(false);
      }
    };
    
    fetchData();
  }, [toast]);

  // Handle form submission
  const onSubmit = async (values: RequestFormValues) => {
    setIsSubmitting(true);
    try {
      const request = {
        senderId: user?.id || '',
        receiverId: values.receiverId,
        message: values.message,
        projectDetails: {
          title: values.projectDetails.title,
          description: values.projectDetails.description,
          startDate: values.projectDetails.startDate ? values.projectDetails.startDate.toISOString() : undefined,
          endDate: values.projectDetails.endDate ? values.projectDetails.endDate.toISOString() : undefined,
          location: values.projectDetails.location,
          resourcesNeeded: values.projectDetails.resourcesNeeded
        }
      };
      
      await NGOService.sendCollaborationRequest(request);
      
      toast({
        title: 'Success',
        description: 'Collaboration request sent successfully',
      });
      
      // Refresh outgoing requests
      const allRequests = await NGOService.getCollaborationRequests();
      const currentNGO = await NGOService.getNGOProfile();
      
      setOutgoingRequests(allRequests.filter(req => 
        req.senderId === currentNGO.id && req.status === 'pending'
      ));
      
      setIsOpen(false);
      form.reset();
    } catch (error) {
      console.error('Error sending collaboration request:', error);
      toast({
        title: 'Error',
        description: 'Failed to send collaboration request',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle responding to a request
  const handleResponse = async (status: 'accepted' | 'rejected') => {
    if (!selectedRequest) return;
    
    try {
      await NGOService.respondToCollaborationRequest(
        selectedRequest.id!, 
        status, 
        responseMessage
      );
      
      toast({
        title: 'Success',
        description: `Collaboration request ${status}`,
      });
      
      // Refresh requests
      const allRequests = await NGOService.getCollaborationRequests();
      const currentNGO = await NGOService.getNGOProfile();
      
      setIncomingRequests(allRequests.filter(req => 
        req.receiverId === currentNGO.id && req.status === 'pending'
      ));
      
      setPastCollaborations(allRequests.filter(req => 
        (req.senderId === currentNGO.id || req.receiverId === currentNGO.id) 
        && (req.status === 'accepted' || req.status === 'rejected')
      ));
      
      setIsResponseOpen(false);
      setSelectedRequest(null);
      setResponseMessage('');
    } catch (error) {
      console.error('Error responding to collaboration request:', error);
      toast({
        title: 'Error',
        description: 'Failed to respond to collaboration request',
        variant: 'destructive',
      });
    }
  };

  // Format date
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not specified';
    return format(new Date(dateString), 'PPP');
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'accepted':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Accepted</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Request card component
  const RequestCard = ({ request, incoming = false }: { request: CollaborationRequest, incoming?: boolean }) => {
    const ngo = availableNGOs.find(n => incoming ? n.id === request.senderId : n.id === request.receiverId);
    
    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{request.projectDetails?.title || 'Collaboration Request'}</CardTitle>
              <CardDescription>
                {incoming ? 'From' : 'To'}: {ngo?.name || 'Unknown NGO'}
              </CardDescription>
            </div>
            <StatusBadge status={request.status} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="font-medium">Message:</p>
            <p className="text-sm text-gray-600">{request.message}</p>
            
            {request.projectDetails && (
              <>
                <p className="font-medium mt-4">Project Details:</p>
                <div className="pl-4">
                  <p className="text-sm"><span className="font-medium">Description:</span> {request.projectDetails.description}</p>
                  
                  {request.projectDetails.startDate && (
                    <p className="text-sm"><span className="font-medium">Start Date:</span> {formatDate(request.projectDetails.startDate)}</p>
                  )}
                  
                  {request.projectDetails.endDate && (
                    <p className="text-sm"><span className="font-medium">End Date:</span> {formatDate(request.projectDetails.endDate)}</p>
                  )}
                  
                  {request.projectDetails.location && (
                    <p className="text-sm"><span className="font-medium">Location:</span> {request.projectDetails.location}</p>
                  )}
                  
                  {request.projectDetails.resourcesNeeded && request.projectDetails.resourcesNeeded.length > 0 && (
                    <div>
                      <p className="text-sm font-medium">Resources Needed:</p>
                      <ul className="list-disc pl-5 text-sm">
                        {request.projectDetails.resourcesNeeded.map((resource, i) => (
                          <li key={i}>{resource}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </>
            )}
            
            <p className="text-xs text-gray-500 mt-2">Sent on: {formatDate(request.createdAt)}</p>
          </div>
        </CardContent>
        
        {incoming && request.status === 'pending' && (
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                setSelectedRequest(request);
                setIsResponseOpen(true);
              }}
            >
              Respond
            </Button>
          </CardFooter>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Collaboration Requests</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>New Collaboration Request</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create Collaboration Request</DialogTitle>
              <DialogDescription>
                Send a collaboration request to another NGO to work together on a project.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="receiverId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select NGO</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an NGO" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableNGOs.map((ngo) => (
                            <SelectItem key={ngo.id} value={ngo.id}>
                              {ngo.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Explain why you want to collaborate with this NGO" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="projectDetails.title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter project title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="projectDetails.description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the project in detail" 
                          className="resize-none" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="projectDetails.startDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date()
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="projectDetails.endDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>End Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date() || (form.getValues('projectDetails.startDate') && date < form.getValues('projectDetails.startDate'))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="projectDetails.location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Project location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button type="submit">Send Request</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger 
            value="incoming"
            className="flex gap-2 items-center"
          >
            Incoming Requests
            {incomingRequests.length > 0 && (
              <Badge className="ml-1">{incomingRequests.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger 
            value="outgoing"
            className="flex gap-2 items-center"
          >
            Outgoing Requests
            {outgoingRequests.length > 0 && (
              <Badge className="ml-1">{outgoingRequests.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="past">Past Collaborations</TabsTrigger>
        </TabsList>
        
        <TabsContent value="incoming" className="mt-6">
          {loading ? (
            <div className="flex justify-center">
              <p>Loading requests...</p>
            </div>
          ) : incomingRequests.length > 0 ? (
            <div className="space-y-4">
              {incomingRequests.map((request) => (
                <RequestCard key={request.id} request={request} incoming={true} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No incoming requests</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any pending collaboration requests from other NGOs.
              </p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="outgoing" className="mt-6">
          {loading ? (
            <div className="flex justify-center">
              <p>Loading requests...</p>
            </div>
          ) : outgoingRequests.length > 0 ? (
            <div className="space-y-4">
              {outgoingRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No outgoing requests</h3>
              <p className="mt-1 text-sm text-gray-500">
                You haven't sent any collaboration requests to other NGOs.
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => setIsOpen(true)}
                >
                  Create New Request
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="past" className="mt-6">
          {loading ? (
            <div className="flex justify-center">
              <p>Loading past collaborations...</p>
            </div>
          ) : pastCollaborations.length > 0 ? (
            <div className="space-y-4">
              {pastCollaborations.map((request) => (
                <RequestCard 
                  key={request.id} 
                  request={request} 
                  incoming={request.receiverId !== request.senderId} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <ClockIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold text-gray-900">No past collaborations</h3>
              <p className="mt-1 text-sm text-gray-500">
                You don't have any past collaboration requests.
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Response Dialog */}
      <Dialog open={isResponseOpen} onOpenChange={setIsResponseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Respond to Collaboration Request</DialogTitle>
            <DialogDescription>
              {selectedRequest?.projectDetails?.title || 'Collaboration Request'} from {availableNGOs.find(n => n.id === selectedRequest?.senderId)?.name || 'Unknown NGO'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Response Message (Optional)</label>
              <Textarea
                placeholder="Add a message with your response"
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                className="resize-none"
              />
            </div>
          </div>
          
          <DialogFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsResponseOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => handleResponse('rejected')}>
              <XIcon className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button variant="default" onClick={() => handleResponse('accepted')}>
              <CheckIcon className="mr-2 h-4 w-4" />
              Accept
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollaborationRequests; 