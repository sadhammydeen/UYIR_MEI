import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Button from '@/components/ui/Button.tsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Loader2, Upload, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { toast } from 'sonner';
import BeneficiaryService from '@/api/services/beneficiary.service';
import { useAuth } from '@/contexts/AuthContext';

const needsOptions = [
  { id: 'food', label: 'Food Assistance', category: 'basic', urgencyLevels: true },
  { id: 'education', label: 'Education Support', category: 'development', urgencyLevels: true },
  { id: 'healthcare', label: 'Healthcare Services', category: 'basic', urgencyLevels: true },
  { id: 'housing', label: 'Housing Support', category: 'basic', urgencyLevels: true },
  { id: 'vocational', label: 'Vocational Training', category: 'development', urgencyLevels: false },
  { id: 'financial', label: 'Financial Aid', category: 'basic', urgencyLevels: true },
  { id: 'counseling', label: 'Counseling Services', category: 'wellbeing', urgencyLevels: false },
  { id: 'childcare', label: 'Childcare Support', category: 'wellbeing', urgencyLevels: false },
  { id: 'employment', label: 'Employment Assistance', category: 'development', urgencyLevels: false }
];

const supportOptions = [
  { id: 'groceries', label: 'Monthly Grocery Kits' },
  { id: 'meals', label: 'Prepared Meals' },
  { id: 'schoolsupplies', label: 'School Supplies' },
  { id: 'tuition', label: 'Tuition Support' },
  { id: 'medicalcare', label: 'Medical Care' },
  { id: 'medicines', label: 'Medicines' },
  { id: 'rentassistance', label: 'Rent Assistance' },
  { id: 'utilitybills', label: 'Utility Bills Support' },
  { id: 'jobtraining', label: 'Job Training' },
  { id: 'mentalhealth', label: 'Mental Health Services' },
  { id: 'transportation', label: 'Transportation Support' }
];

const incomeLevels = [
  { value: "below25k", label: "Below ₹25,000 per year" },
  { value: "25k-50k", label: "₹25,000 - ₹50,000 per year" },
  { value: "50k-1L", label: "₹50,000 - ₹1,00,000 per year" },
  { value: "1L-2L", label: "₹1,00,000 - ₹2,00,000 per year" },
  { value: "above2L", label: "Above ₹2,00,000 per year" }
];

const urgencyLevels = [
  { value: 'critical', label: 'Critical - Need immediate assistance (within 24-48 hours)' },
  { value: 'high', label: 'High - Need assistance within 1 week' },
  { value: 'medium', label: 'Medium - Need assistance within 2-4 weeks' },
  { value: 'low', label: 'Low - Need is not time-sensitive' }
];

const ngoMatchingPreferences = [
  { value: 'automatic', label: 'Automatic Matching (system will find the best NGO based on your needs)' },
  { value: 'preferred', label: 'Preferred NGOs (select from a list)' },
  { value: 'recommended', label: 'Recommended NGO (if someone referred you to a specific NGO)' }
];

const applicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postalCode: z.string().regex(/^\d{6}$/, "Postal code must be 6 digits"),
  location: z.object({
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    accuracy: z.number().optional()
  }).optional(),
  aadhaarNumber: z.string().regex(/^\d{12}$/, "Aadhaar number must be 12 digits"),
  aadhaarVerified: z.boolean().optional(),
  familySize: z.number().min(1, "Family size must be at least 1").max(20, "Family size cannot exceed 20"),
  incomeLevel: z.string().min(1, "Please select an income level"),
  needs: z.array(z.string()).min(1, "Please select at least one need"),
  needDetails: z.array(z.object({
    needType: z.string(),
    urgencyLevel: z.string().optional(),
    description: z.string().optional(),
    estimatedCost: z.number().optional(),
  })).optional(),
  currentSituation: z.string().min(20, "Please provide more details about your current situation"),
  supportRequested: z.array(z.string()).min(1, "Please select at least one type of support"),
  ngoPreference: z.string().min(1, "Please select an NGO matching preference"),
  preferredNGOs: z.array(z.string()).optional(),
  referredNGO: z.string().optional(),
  referredBy: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions"
  })
});

type ApplicationFormValues = z.infer<typeof applicationSchema>;

interface BeneficiaryApplicationFormProps {
  onSuccess?: () => void;
}

const BeneficiaryApplicationForm: React.FC<BeneficiaryApplicationFormProps> = ({ onSuccess }) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const [availableNGOs, setAvailableNGOs] = useState<{id: string, name: string, focusAreas: string[]}[]>([]);
  const [ngoMatchingType, setNgoMatchingType] = useState('automatic');
  const [needDetails, setNeedDetails] = useState<any[]>([]);
  const [aadhaarVerificationStep, setAadhaarVerificationStep] = useState<'initial' | 'otp_sent' | 'verified' | 'failed'>('initial');
  const [aadhaarOtp, setAadhaarOtp] = useState('');
  const [locationStatus, setLocationStatus] = useState<'detecting' | 'detected' | 'error' | 'pending'>('pending');
  
  const { 
    register, 
    handleSubmit, 
    setValue, 
    control,
    watch,
    getValues,
    formState: { errors } 
  } = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      aadhaarNumber: '',
      aadhaarVerified: false,
      familySize: 1,
      incomeLevel: '',
      needs: [],
      needDetails: [],
      currentSituation: '',
      supportRequested: [],
      ngoPreference: 'automatic',
      preferredNGOs: [],
      referredNGO: '',
      referredBy: '',
      termsAccepted: false
    }
  });
  
  const watchedNeeds = watch('needs');
  const watchedNgoPreference = watch('ngoPreference');
  
  // Fetch available NGOs
  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        // In real implementation, this would fetch from the API
        // For now, simulating with sample data
        setTimeout(() => {
          setAvailableNGOs([
            { id: 'ngo1', name: 'Helping Hands Trust', focusAreas: ['food', 'housing'] },
            { id: 'ngo2', name: 'Education First Foundation', focusAreas: ['education', 'vocational'] },
            { id: 'ngo3', name: 'Healthcare for All', focusAreas: ['healthcare', 'counseling'] },
            { id: 'ngo4', name: 'New Life Support', focusAreas: ['financial', 'employment'] },
            { id: 'ngo5', name: 'Child Care Initiative', focusAreas: ['childcare', 'education'] },
          ]);
        }, 1000);
      } catch (error) {
        console.error('Error fetching NGOs:', error);
      }
    };
    
    fetchNGOs();
  }, []);
  
  // Update need details when needs change
  useEffect(() => {
    if (watchedNeeds && watchedNeeds.length > 0) {
      // Keep existing details for needs that are still selected
      const updatedDetails = needDetails.filter(detail => 
        watchedNeeds.includes(detail.needType)
      );
      
      // Add new entries for newly selected needs
      watchedNeeds.forEach(need => {
        if (!updatedDetails.some(detail => detail.needType === need)) {
          updatedDetails.push({
            needType: need,
            urgencyLevel: 'medium',
            description: '',
            estimatedCost: 0
          });
        }
      });
      
      setNeedDetails(updatedDetails);
      setValue('needDetails', updatedDetails);
    }
  }, [watchedNeeds, setValue]);
  
  // Handle NGO preference change
  useEffect(() => {
    if (watchedNgoPreference === 'automatic') {
      setValue('preferredNGOs', []);
      setValue('referredNGO', '');
    }
  }, [watchedNgoPreference, setValue]);
  
  const handleNeedsChange = (checkedItems: string[]) => {
    setValue('needs', checkedItems);
  };
  
  const handleSupportChange = (checkedItems: string[]) => {
    setValue('supportRequested', checkedItems);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };
  
  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };
  
  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };
  
  const handleNeedDetailChange = (index: number, field: string, value: any) => {
    const updatedDetails = [...needDetails];
    updatedDetails[index] = { ...updatedDetails[index], [field]: value };
    setNeedDetails(updatedDetails);
    setValue('needDetails', updatedDetails);
  };
  
  // Handle Aadhaar verification
  const initiateAadhaarVerification = async () => {
    const aadhaarNumber = getValues('aadhaarNumber');
    
    if (!/^\d{12}$/.test(aadhaarNumber)) {
      toast({
        title: "Invalid Aadhaar Number",
        description: "Please enter a valid 12-digit Aadhaar number",
        variant: "destructive"
      });
      return;
    }
    
    // In a real implementation, this would call the Aadhaar API
    // For demo, we'll simulate the OTP process
    try {
      // Simulate API call
      setTimeout(() => {
        setAadhaarVerificationStep('otp_sent');
        toast({
          title: "OTP Sent",
          description: "A verification code has been sent to your registered mobile number"
        });
      }, 1500);
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Unable to initiate Aadhaar verification. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const verifyAadhaarOtp = () => {
    if (aadhaarOtp.length !== 6) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit OTP",
        variant: "destructive"
      });
      return;
    }
    
    // Simulate verification
    setTimeout(() => {
      // For demo, we'll consider OTP "123456" as valid
      if (aadhaarOtp === "123456") {
        setAadhaarVerificationStep('verified');
        setValue('aadhaarVerified', true);
        toast({
          title: "Verification Successful",
          description: "Your Aadhaar has been successfully verified"
        });
      } else {
        setAadhaarVerificationStep('failed');
        toast({
          title: "Verification Failed",
          description: "The OTP you entered is incorrect. Please try again.",
          variant: "destructive"
        });
      }
    }, 1500);
  };
  
  // Get user location
  const detectLocation = () => {
    setLocationStatus('detecting');
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setValue('location', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
          setLocationStatus('detected');
          toast({
            title: "Location Detected",
            description: "Your location has been successfully captured"
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationStatus('error');
          toast({
            title: "Location Detection Failed",
            description: "Unable to detect your location. Please check your browser settings.",
            variant: "destructive"
          });
        }
      );
    } else {
      setLocationStatus('error');
      toast({
        title: "Location Not Supported",
        description: "Geolocation is not supported by your browser",
        variant: "destructive"
      });
    }
  };
  
  const onSubmit = async (data: ApplicationFormValues) => {
    setIsSubmitting(true);
    
    try {
      const formData: any = {
        ...data,
        familySize: Number(data.familySize),
        documents: uploadedFiles
      };
      
      await BeneficiaryService.applyForBeneficiary(formData);
      
      toast({
        title: "Application Submitted Successfully",
        description: "We have received your application and will review it shortly. You will be notified of the status via email.",
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Application Submission Failed",
        description: "There was an error processing your application. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-theuyir-darkgrey mb-2">Beneficiary Application</h2>
        <p className="text-gray-600">
          Please complete this form to apply for assistance from Uyir Mei. 
          All information provided will be kept confidential.
        </p>
      </div>
      
      {/* Step indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <React.Fragment key={idx}>
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                  currentStep > idx + 1 
                    ? 'bg-theuyir-pink border-theuyir-pink text-white' 
                    : currentStep === idx + 1
                      ? 'border-theuyir-pink text-theuyir-pink'
                      : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > idx + 1 ? <CheckCircle size={16} /> : idx + 1}
                </div>
                <span className={`text-xs mt-1 ${
                  currentStep >= idx + 1 ? 'text-theuyir-darkgrey' : 'text-gray-400'
                }`}>
                  {idx === 0 ? 'Personal Info' : 
                   idx === 1 ? 'Verification' : 
                   idx === 2 ? 'Needs Assessment' :
                   'Documents'}
                </span>
              </div>
              {idx < totalSteps - 1 && (
                <div className={`flex-1 h-1 mx-2 ${
                  currentStep > idx + 1 ? 'bg-theuyir-pink' : 'bg-gray-200'
                }`}></div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-theuyir-darkgrey mb-4">Personal Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Your full name"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  placeholder="your.email@example.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                <Input
                  id="phone"
                  {...register('phone')}
                  placeholder="+91 98765 43210"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="familySize">Family Size <span className="text-red-500">*</span></Label>
                <Input
                  id="familySize"
                  type="number"
                  min="1"
                  max="20"
                  {...register('familySize', { valueAsNumber: true })}
                  placeholder="Number of family members"
                  className={errors.familySize ? 'border-red-500' : ''}
                />
                {errors.familySize && (
                  <p className="text-red-500 text-sm">{errors.familySize.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Residential Address <span className="text-red-500">*</span></Label>
              <Input
                id="address"
                {...register('address')}
                placeholder="Street address"
                className={errors.address ? 'border-red-500' : ''}
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                <Input
                  id="city"
                  {...register('city')}
                  placeholder="City"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && (
                  <p className="text-red-500 text-sm">{errors.city.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="state">State <span className="text-red-500">*</span></Label>
                <Input
                  id="state"
                  {...register('state')}
                  placeholder="State"
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && (
                  <p className="text-red-500 text-sm">{errors.state.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code <span className="text-red-500">*</span></Label>
                <Input
                  id="postalCode"
                  {...register('postalCode')}
                  placeholder="6-digit postal code"
                  className={errors.postalCode ? 'border-red-500' : ''}
                />
                {errors.postalCode && (
                  <p className="text-red-500 text-sm">{errors.postalCode.message}</p>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="incomeLevel">Monthly Household Income <span className="text-red-500">*</span></Label>
              <Select 
                onValueChange={(value) => setValue('incomeLevel', value)}
                defaultValue={watch('incomeLevel')}
              >
                <SelectTrigger id="incomeLevel" className={errors.incomeLevel ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select your monthly income range" />
                </SelectTrigger>
                <SelectContent>
                  {incomeLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.incomeLevel && (
                <p className="text-red-500 text-sm">{errors.incomeLevel.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="referredBy">Referred By (Optional)</Label>
              <Input
                id="referredBy"
                {...register('referredBy')}
                placeholder="Name of person or organization that referred you"
              />
            </div>
          </div>
        )}
        
        {/* Step 2: Verification (new step) */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-theuyir-darkgrey mb-4">Identity Verification</h3>
            
            {/* Aadhaar Verification Section */}
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h4 className="font-semibold text-theuyir-darkgrey mb-3">Aadhaar Verification</h4>
              <p className="text-sm text-gray-600 mb-4">
                Verify your identity using your Aadhaar number. This helps us ensure the authenticity of applications 
                and improves our ability to provide appropriate assistance.
              </p>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaarNumber">Aadhaar Number <span className="text-red-500">*</span></Label>
                  <div className="flex space-x-2">
                    <Input
                      id="aadhaarNumber"
                      {...register('aadhaarNumber')}
                      placeholder="Enter your 12-digit Aadhaar number"
                      className={`flex-1 ${errors.aadhaarNumber ? 'border-red-500' : ''}`}
                      disabled={aadhaarVerificationStep === 'otp_sent' || aadhaarVerificationStep === 'verified'}
                    />
                    {aadhaarVerificationStep === 'initial' || aadhaarVerificationStep === 'failed' ? (
                      <Button 
                        type="button" 
                        onClick={initiateAadhaarVerification}
                        className="bg-theuyir-pink hover:bg-theuyir-pink/90 text-white"
                      >
                        Verify
                      </Button>
                    ) : aadhaarVerificationStep === 'verified' ? (
                      <div className="flex items-center px-3 text-green-600">
                        <CheckCircle size={18} className="mr-1" /> Verified
                      </div>
                    ) : null}
                  </div>
                  {errors.aadhaarNumber && (
                    <p className="text-red-500 text-sm">{errors.aadhaarNumber.message}</p>
                  )}
                </div>
                
                {aadhaarVerificationStep === 'otp_sent' && (
                  <div className="space-y-2">
                    <Label htmlFor="aadhaarOtp">Enter OTP</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="aadhaarOtp"
                        value={aadhaarOtp}
                        onChange={(e) => setAadhaarOtp(e.target.value)}
                        placeholder="Enter the 6-digit OTP sent to your registered mobile"
                        className="flex-1"
                        maxLength={6}
                      />
                      <Button 
                        type="button" 
                        onClick={verifyAadhaarOtp}
                        className="bg-theuyir-pink hover:bg-theuyir-pink/90 text-white"
                      >
                        Submit OTP
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      For this demo, use OTP: 123456
                    </p>
                  </div>
                )}
                
                {aadhaarVerificationStep === 'failed' && (
                  <p className="text-red-500 text-sm">
                    Verification failed. Please check your Aadhaar number and try again.
                  </p>
                )}
              </div>
            </div>
            
            {/* Location Services Section */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h4 className="font-semibold text-theuyir-darkgrey mb-3">Location Services</h4>
              <p className="text-sm text-gray-600 mb-4">
                Sharing your precise location helps us match you with nearby NGOs and services.
                This improves the efficiency of support delivery.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Your Current Location</span>
                  
                  {locationStatus === 'pending' || locationStatus === 'error' ? (
                    <Button 
                      type="button" 
                      onClick={detectLocation}
                      className="bg-theuyir-pink hover:bg-theuyir-pink/90 text-white"
                      size="sm"
                    >
                      {locationStatus === 'detecting' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Detecting...
                        </>
                      ) : 'Detect Location'}
                    </Button>
                  ) : locationStatus === 'detected' ? (
                    <span className="text-green-600 text-sm flex items-center">
                      <CheckCircle size={16} className="mr-1" /> Location detected
                    </span>
                  ) : null}
                </div>
                
                {locationStatus === 'detected' && (
                  <div className="p-2 bg-gray-100 rounded text-sm">
                    <p>Your location has been successfully captured.</p>
                  </div>
                )}
                
                {locationStatus === 'error' && (
                  <p className="text-amber-600 text-sm">
                    We couldn't detect your location. You can still continue with your application,
                    but providing your location would help us match you with nearby services.
                  </p>
                )}
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
              <Button 
                type="button" 
                onClick={nextStep}
                disabled={!getValues('aadhaarVerified')}
              >
                Next
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 3: Needs Assessment (modified existing Step 2) */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-theuyir-darkgrey mb-4">Needs Assessment</h3>
            
            {/* Need Selection */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>What type of assistance do you need? <span className="text-red-500">*</span></Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <CheckboxGroup
                    value={watchedNeeds || []}
                    onValueChange={handleNeedsChange}
                  >
                    {needsOptions.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox id={option.id} value={option.id} />
                        <Label htmlFor={option.id} className="text-sm font-normal">
                          {option.label}
                        </Label>
                      </div>
                    ))}
                  </CheckboxGroup>
                </div>
                {errors.needs && (
                  <p className="text-red-500 text-sm">{errors.needs.message}</p>
                )}
              </div>
              
              {/* Detailed Need Information */}
              {watchedNeeds && watchedNeeds.length > 0 && (
                <div className="space-y-4 mt-6">
                  <h4 className="font-semibold text-theuyir-darkgrey">Need Details</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Please provide more specific information about each need to help us match you with the most appropriate services.
                  </p>
                  
                  {needDetails.map((detail, index) => {
                    const needOption = needsOptions.find(opt => opt.id === detail.needType);
                    return (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg">
                        <h5 className="font-medium mb-3">{needOption?.label || detail.needType}</h5>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Urgency Level */}
                          {needOption?.urgencyLevels && (
                            <div className="space-y-2">
                              <Label htmlFor={`urgency-${index}`}>Urgency Level</Label>
                              <Select
                                value={detail.urgencyLevel}
                                onValueChange={(value) => handleNeedDetailChange(index, 'urgencyLevel', value)}
                              >
                                <SelectTrigger id={`urgency-${index}`}>
                                  <SelectValue placeholder="Select urgency level" />
                                </SelectTrigger>
                                <SelectContent>
                                  {urgencyLevels.map((level) => (
                                    <SelectItem key={level.value} value={level.value}>
                                      {level.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}
                          
                          {/* Estimated Cost */}
                          <div className="space-y-2">
                            <Label htmlFor={`cost-${index}`}>Estimated Cost (₹)</Label>
                            <Input
                              id={`cost-${index}`}
                              type="number"
                              min="0"
                              value={detail.estimatedCost || ''}
                              onChange={(e) => handleNeedDetailChange(index, 'estimatedCost', Number(e.target.value))}
                              placeholder="Approximate cost if known"
                            />
                          </div>
                        </div>
                        
                        {/* Detailed Description */}
                        <div className="space-y-2 mt-4">
                          <Label htmlFor={`description-${index}`}>Detailed Description</Label>
                          <Textarea
                            id={`description-${index}`}
                            value={detail.description || ''}
                            onChange={(e) => handleNeedDetailChange(index, 'description', e.target.value)}
                            placeholder="Please describe your specific needs in detail"
                            className="resize-none"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {/* NGO Preference Selection */}
              <div className="space-y-4 mt-8">
                <h4 className="font-semibold text-theuyir-darkgrey">NGO Preferences</h4>
                <p className="text-sm text-gray-600 mb-4">
                  You can choose how you'd like to be connected with NGOs that can help you.
                </p>
                
                <div className="space-y-2">
                  <Label htmlFor="ngo-preference">How would you like to be matched with NGOs? <span className="text-red-500">*</span></Label>
                  <Select
                    value={watchedNgoPreference}
                    onValueChange={(value) => {
                      setValue('ngoPreference', value);
                      setNgoMatchingType(value);
                    }}
                  >
                    <SelectTrigger id="ngo-preference">
                      <SelectValue placeholder="Select matching preference" />
                    </SelectTrigger>
                    <SelectContent>
                      {ngoMatchingPreferences.map((pref) => (
                        <SelectItem key={pref.value} value={pref.value}>
                          {pref.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.ngoPreference && (
                    <p className="text-red-500 text-sm">{errors.ngoPreference.message}</p>
                  )}
                </div>
                
                {watchedNgoPreference === 'preferred' && (
                  <div className="space-y-2 mt-4">
                    <Label>Select preferred NGOs (up to 3)</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <CheckboxGroup
                        value={watch('preferredNGOs') || []}
                        onValueChange={(value) => setValue('preferredNGOs', value)}
                      >
                        {availableNGOs.map((ngo) => (
                          <div key={ngo.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={`ngo-${ngo.id}`} 
                              value={ngo.id}
                              disabled={
                                (watch('preferredNGOs')?.length || 0) >= 3 && 
                                !(watch('preferredNGOs') || []).includes(ngo.id)
                              }
                            />
                            <Label htmlFor={`ngo-${ngo.id}`} className="text-sm font-normal">
                              {ngo.name}
                              <span className="text-xs text-gray-500 block">
                                Focus: {ngo.focusAreas.map(area => {
                                  const option = needsOptions.find(opt => opt.id === area);
                                  return option?.label || area;
                                }).join(', ')}
                              </span>
                            </Label>
                          </div>
                        ))}
                      </CheckboxGroup>
                    </div>
                  </div>
                )}
                
                {watchedNgoPreference === 'recommended' && (
                  <div className="space-y-2 mt-4">
                    <Label htmlFor="referred-ngo">Recommended NGO</Label>
                    <Select
                      value={watch('referredNGO') || ''}
                      onValueChange={(value) => setValue('referredNGO', value)}
                    >
                      <SelectTrigger id="referred-ngo">
                        <SelectValue placeholder="Select the NGO that was recommended to you" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableNGOs.map((ngo) => (
                          <SelectItem key={ngo.id} value={ngo.id}>
                            {ngo.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex justify-between mt-8">
              <Button type="button" variant="outline" onClick={prevStep}>
                Previous
              </Button>
              <Button type="button" onClick={nextStep}>
                Next
              </Button>
            </div>
          </div>
        )}
        
        {/* Step 4: Documents (previously Step 3) - keep existing code for document uploads */}
        
        {/* Navigation buttons */}
        <div className="flex justify-between pt-4 border-t border-gray-200">
          {currentStep > 1 ? (
            <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting}>
              Previous
            </Button>
          ) : (
            <div></div>
          )}
          
          {currentStep < totalSteps ? (
            <Button type="button" onClick={nextStep} disabled={isSubmitting}>
              Next
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting} className="ml-auto">
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Application'
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default BeneficiaryApplicationForm; 