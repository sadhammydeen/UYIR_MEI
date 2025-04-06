"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { saveNgoProfile, uploadNgoLogo, getNgoByUserId, NgoProfile } from '@/lib/ngo';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Button from '@/components/ui/Button.tsx';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MultiSelect } from '@/components/ui/multi-select';
import { Sparkles, Save, Upload, Building, MapPin, Users, Calendar, Phone, Mail, Globe, FileText } from 'lucide-react';

export default function NgoProfilePage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  
  // Form state
  const [ngoData, setNgoData] = useState<Partial<NgoProfile>>({
    name: '',
    description: '',
    mission: '',
    vision: '',
    foundedYear: new Date().getFullYear(),
    registrationNumber: '',
    registrationType: '',
    taxExemptionStatus: '',
    website: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'India'
    },
    focusAreas: [],
    size: 'small',
    staff: {
      fullTime: 0,
      partTime: 0,
      volunteers: 0
    },
    socialMedia: {
      facebook: '',
      twitter: '',
      instagram: '',
      linkedin: '',
      youtube: ''
    }
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  
  // Load existing profile data
  useEffect(() => {
    const loadNgoProfile = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const ngoProfile = await getNgoByUserId(user.uid);
        
        if (ngoProfile) {
          setNgoData(ngoProfile);
          if (ngoProfile.logoUrl) {
            setLogoPreview(ngoProfile.logoUrl);
          }
        }
      } catch (err: any) {
        console.error('Error loading NGO profile:', err);
        setError('Failed to load existing profile data.');
      } finally {
        setLoading(false);
      }
    };
    
    loadNgoProfile();
  }, [user]);
  
  // Focus area options
  const focusAreaOptions = [
    { label: 'Education', value: 'Education' },
    { label: 'Healthcare', value: 'Healthcare' },
    { label: 'Environment', value: 'Environment' },
    { label: 'Child Welfare', value: 'Child Welfare' },
    { label: 'Women Empowerment', value: 'Women Empowerment' },
    { label: 'Elderly Care', value: 'Elderly Care' },
    { label: 'Disability Services', value: 'Disability Services' },
    { label: 'Rural Development', value: 'Rural Development' },
    { label: 'Poverty Alleviation', value: 'Poverty Alleviation' },
    { label: 'Food Security', value: 'Food Security' },
    { label: 'Water & Sanitation', value: 'Water & Sanitation' },
    { label: 'Animal Welfare', value: 'Animal Welfare' },
    { label: 'Arts & Culture', value: 'Arts & Culture' },
    { label: 'Human Rights', value: 'Human Rights' },
    { label: 'Disaster Relief', value: 'Disaster Relief' },
    { label: 'Skill Development', value: 'Skill Development' }
  ];
  
  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNgoData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof NgoProfile] as any || {}),
          [child]: value
        }
      }));
    } else {
      setNgoData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle numeric input changes
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseInt(value) || 0;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setNgoData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof NgoProfile] as any || {}),
          [child]: numValue
        }
      }));
    } else {
      setNgoData(prev => ({
        ...prev,
        [name]: numValue
      }));
    }
  };
  
  // Handle focus areas change
  const handleFocusAreasChange = (selected: string[]) => {
    setNgoData(prev => ({
      ...prev,
      focusAreas: selected
    }));
  };
  
  // Handle logo file selection
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLogoFile(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to save profile data.');
      return;
    }
    
    // Basic validation
    if (!ngoData.name || !ngoData.description || !ngoData.mission || 
        !ngoData.registrationNumber || !ngoData.email || !ngoData.phone || 
        !ngoData.address?.city || !ngoData.address?.state || 
        ngoData.focusAreas.length === 0) {
      setError('Please fill out all required fields.');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      // Save NGO profile
      const ngoId = await saveNgoProfile(ngoData, user.uid);
      
      // Upload logo if selected
      if (logoFile) {
        await uploadNgoLogo(ngoId, logoFile);
      }
      
      setSuccess('Profile saved successfully!');
      
      // Navigate to dashboard after a delay
      setTimeout(() => {
        router.push('/ngo/dashboard');
      }, 2000);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">NGO Profile</h1>
        <p className="text-gray-600">
          Complete your organization profile to get verified and enhance visibility
        </p>
      </div>
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200 text-green-800">
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic">
          <TabsList className="mb-6">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="contact">Contact & Location</TabsTrigger>
            <TabsTrigger value="details">Organization Details</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Provide essential information about your organization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="name" className="text-base">
                        <Building className="h-4 w-4 inline mr-1" />
                        Organization Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        value={ngoData.name}
                        onChange={handleInputChange}
                        placeholder="Official registered name of the organization"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="registrationNumber" className="text-base">
                        <FileText className="h-4 w-4 inline mr-1" />
                        Registration Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="registrationNumber"
                        name="registrationNumber"
                        value={ngoData.registrationNumber}
                        onChange={handleInputChange}
                        placeholder="Government-issued registration number"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="registrationType" className="text-base">
                        Registration Type <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="registrationType"
                        name="registrationType"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={ngoData.registrationType}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select registration type</option>
                        <option value="Trust">Trust</option>
                        <option value="Society">Society</option>
                        <option value="Section 8 Company">Section 8 Company</option>
                        <option value="Section 25 Company">Section 25 Company</option>
                        <option value="Non-Profit Company">Non-Profit Company</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="taxExemptionStatus" className="text-base">
                        Tax Exemption Status
                      </Label>
                      <Input
                        id="taxExemptionStatus"
                        name="taxExemptionStatus"
                        value={ngoData.taxExemptionStatus || ''}
                        onChange={handleInputChange}
                        placeholder="E.g., 80G, 12A, FCRA, etc."
                      />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="foundedYear" className="text-base">
                        <Calendar className="h-4 w-4 inline mr-1" />
                        Year Founded <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="foundedYear"
                        name="foundedYear"
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={ngoData.foundedYear || ''}
                        onChange={handleNumericChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="logo" className="text-base">
                        Organization Logo
                      </Label>
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="w-24 h-24 border rounded-md flex items-center justify-center bg-gray-50">
                          {logoPreview ? (
                            <img 
                              src={logoPreview} 
                              alt="Logo preview" 
                              className="w-full h-full object-contain p-1"
                            />
                          ) : (
                            <Building className="h-10 w-10 text-gray-300" />
                          )}
                        </div>
                        
                        <div>
                          <Button 
                            type="button" 
                            variant="outline"
                            className="mb-2"
                            onClick={() => document.getElementById('logo-upload')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Logo
                          </Button>
                          <input
                            id="logo-upload"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleLogoChange}
                          />
                          <p className="text-xs text-gray-500">
                            Recommended: Square image, 500x500px or larger
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="size" className="text-base">
                        <Users className="h-4 w-4 inline mr-1" />
                        Organization Size <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="size"
                        name="size"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={ngoData.size}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="small">Small (1-10 staff)</option>
                        <option value="medium">Medium (11-50 staff)</option>
                        <option value="large">Large (50+ staff)</option>
                      </select>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <Label className="text-base">Staff Information</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label htmlFor="staff.fullTime" className="text-sm">Full-time</Label>
                          <Input
                            id="staff.fullTime"
                            name="staff.fullTime"
                            type="number"
                            min="0"
                            value={ngoData.staff?.fullTime || 0}
                            onChange={handleNumericChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="staff.partTime" className="text-sm">Part-time</Label>
                          <Input
                            id="staff.partTime"
                            name="staff.partTime"
                            type="number"
                            min="0"
                            value={ngoData.staff?.partTime || 0}
                            onChange={handleNumericChange}
                          />
                        </div>
                        <div>
                          <Label htmlFor="staff.volunteers" className="text-sm">Volunteers</Label>
                          <Input
                            id="staff.volunteers"
                            name="staff.volunteers"
                            type="number"
                            min="0"
                            value={ngoData.staff?.volunteers || 0}
                            onChange={handleNumericChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <Label htmlFor="focusAreas" className="text-base">
                    Focus Areas <span className="text-red-500">*</span>
                  </Label>
                  <MultiSelect
                    options={focusAreaOptions}
                    selected={ngoData.focusAreas || []}
                    onChange={handleFocusAreasChange}
                    placeholder="Select focus areas"
                  />
                  <p className="text-xs text-gray-500">
                    Select all areas your organization focuses on
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact & Location</CardTitle>
                <CardDescription>
                  How can beneficiaries and collaborators reach you?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="email" className="text-base">
                        <Mail className="h-4 w-4 inline mr-1" />
                        Email Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={ngoData.email}
                        onChange={handleInputChange}
                        placeholder="Official contact email"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="phone" className="text-base">
                        <Phone className="h-4 w-4 inline mr-1" />
                        Phone Number <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={ngoData.phone}
                        onChange={handleInputChange}
                        placeholder="Official contact number"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="website" className="text-base">
                        <Globe className="h-4 w-4 inline mr-1" />
                        Website
                      </Label>
                      <Input
                        id="website"
                        name="website"
                        value={ngoData.website || ''}
                        onChange={handleInputChange}
                        placeholder="https://www.example.org"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="address.street" className="text-base">
                        <MapPin className="h-4 w-4 inline mr-1" />
                        Address <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="address.street"
                        name="address.street"
                        value={ngoData.address?.street || ''}
                        onChange={handleInputChange}
                        placeholder="Street address"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 mb-4">
                        <Label htmlFor="address.city" className="text-base">
                          City <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="address.city"
                          name="address.city"
                          value={ngoData.address?.city || ''}
                          onChange={handleInputChange}
                          placeholder="City"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <Label htmlFor="address.state" className="text-base">
                          State <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="address.state"
                          name="address.state"
                          value={ngoData.address?.state || ''}
                          onChange={handleInputChange}
                          placeholder="State"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 mb-4">
                        <Label htmlFor="address.postalCode" className="text-base">
                          Postal Code <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="address.postalCode"
                          name="address.postalCode"
                          value={ngoData.address?.postalCode || ''}
                          onChange={handleInputChange}
                          placeholder="Postal Code"
                          required
                        />
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <Label htmlFor="address.country" className="text-base">
                          Country
                        </Label>
                        <Input
                          id="address.country"
                          name="address.country"
                          value={ngoData.address?.country || 'India'}
                          onChange={handleInputChange}
                          readOnly
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Organization Details</CardTitle>
                <CardDescription>
                  Tell us more about your mission and work
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 mb-4">
                  <Label htmlFor="description" className="text-base">
                    Organization Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={ngoData.description}
                    onChange={handleInputChange}
                    placeholder="Provide a concise overview of your organization"
                    rows={3}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    This will appear in search results and your profile page
                  </p>
                </div>
                
                <div className="space-y-2 mb-4">
                  <Label htmlFor="mission" className="text-base">
                    Mission Statement <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="mission"
                    name="mission"
                    value={ngoData.mission}
                    onChange={handleInputChange}
                    placeholder="What is your organization's mission?"
                    rows={3}
                    required
                  />
                </div>
                
                <div className="space-y-2 mb-4">
                  <Label htmlFor="vision" className="text-base">
                    Vision Statement
                  </Label>
                  <Textarea
                    id="vision"
                    name="vision"
                    value={ngoData.vision || ''}
                    onChange={handleInputChange}
                    placeholder="What is your organization's long-term vision?"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Social Media</CardTitle>
                <CardDescription>
                  Connect your social media accounts to increase visibility
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="socialMedia.facebook" className="text-base">
                      Facebook
                    </Label>
                    <Input
                      id="socialMedia.facebook"
                      name="socialMedia.facebook"
                      value={ngoData.socialMedia?.facebook || ''}
                      onChange={handleInputChange}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="socialMedia.twitter" className="text-base">
                      Twitter
                    </Label>
                    <Input
                      id="socialMedia.twitter"
                      name="socialMedia.twitter"
                      value={ngoData.socialMedia?.twitter || ''}
                      onChange={handleInputChange}
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="socialMedia.instagram" className="text-base">
                      Instagram
                    </Label>
                    <Input
                      id="socialMedia.instagram"
                      name="socialMedia.instagram"
                      value={ngoData.socialMedia?.instagram || ''}
                      onChange={handleInputChange}
                      placeholder="https://instagram.com/yourprofile"
                    />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="socialMedia.linkedin" className="text-base">
                      LinkedIn
                    </Label>
                    <Input
                      id="socialMedia.linkedin"
                      name="socialMedia.linkedin"
                      value={ngoData.socialMedia?.linkedin || ''}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/company/yourcompany"
                    />
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <Label htmlFor="socialMedia.youtube" className="text-base">
                      YouTube
                    </Label>
                    <Input
                      id="socialMedia.youtube"
                      name="socialMedia.youtube"
                      value={ngoData.socialMedia?.youtube || ''}
                      onChange={handleInputChange}
                      placeholder="https://youtube.com/c/yourchannel"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 flex justify-end">
          <Button 
            type="submit" 
            size="lg"
            disabled={loading}
            className="flex items-center"
          >
            {loading ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
} 