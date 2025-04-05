import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
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
  { id: 'food', label: 'Food Assistance' },
  { id: 'education', label: 'Education Support' },
  { id: 'healthcare', label: 'Healthcare Services' },
  { id: 'housing', label: 'Housing Support' },
  { id: 'vocational', label: 'Vocational Training' },
  { id: 'financial', label: 'Financial Aid' },
  { id: 'counseling', label: 'Counseling Services' },
  { id: 'childcare', label: 'Childcare Support' }
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

const applicationSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postalCode: z.string().regex(/^\d{6}$/, "Postal code must be 6 digits"),
  familySize: z.number().min(1, "Family size must be at least 1").max(20, "Family size cannot exceed 20"),
  incomeLevel: z.string().min(1, "Please select an income level"),
  needs: z.array(z.string()).min(1, "Please select at least one need"),
  currentSituation: z.string().min(20, "Please provide more details about your current situation"),
  supportRequested: z.array(z.string()).min(1, "Please select at least one type of support"),
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
  const totalSteps = 3;
  
  const { 
    register, 
    handleSubmit, 
    setValue, 
    control,
    watch,
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
      familySize: 1,
      incomeLevel: '',
      needs: [],
      currentSituation: '',
      supportRequested: [],
      referredBy: '',
      termsAccepted: false
    }
  });
  
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
                  {idx === 0 ? 'Personal Info' : idx === 1 ? 'Needs Assessment' : 'Documents'}
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
        
        {/* Step 2: Needs Assessment */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-theuyir-darkgrey mb-4">Needs Assessment</h3>
            
            <div className="space-y-2">
              <Label>
                What are your current needs? <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 block mt-1">
                  Select all that apply
                </span>
              </Label>
              <CheckboxGroup 
                items={needsOptions}
                values={watch('needs')}
                onChange={handleNeedsChange}
              />
              {errors.needs && (
                <p className="text-red-500 text-sm">{errors.needs.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentSituation">
                Please describe your current situation <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 block mt-1">
                  This helps us understand how we can best support you
                </span>
              </Label>
              <Textarea
                id="currentSituation"
                {...register('currentSituation')}
                placeholder="Please provide details about your circumstances, challenges, and what kind of support would be most helpful..."
                rows={5}
                className={errors.currentSituation ? 'border-red-500' : ''}
              />
              {errors.currentSituation && (
                <p className="text-red-500 text-sm">{errors.currentSituation.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>
                What kind of support are you requesting? <span className="text-red-500">*</span>
                <span className="text-sm text-gray-500 block mt-1">
                  Select all that apply
                </span>
              </Label>
              <CheckboxGroup 
                items={supportOptions}
                values={watch('supportRequested')}
                onChange={handleSupportChange}
              />
              {errors.supportRequested && (
                <p className="text-red-500 text-sm">{errors.supportRequested.message}</p>
              )}
            </div>
          </div>
        )}
        
        {/* Step 3: Documents Upload */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-theuyir-darkgrey mb-4">Supporting Documents</h3>
            
            <div className="bg-theuyir-lightgrey p-4 rounded-lg">
              <h4 className="font-medium text-theuyir-darkgrey mb-2">Required Documents</h4>
              <p className="text-sm text-gray-600 mb-2">
                Please upload copies of the following documents to support your application:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
                <li>Proof of Identity (Aadhaar Card/Voter ID/PAN Card)</li>
                <li>Proof of Income (Salary slips/Income certificate/BPL card)</li>
                <li>Proof of Address (Utility bill/Rent agreement)</li>
                <li>Any medical records or certificates (if applying for medical assistance)</li>
              </ul>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <div className="mb-4">
                  <Upload className="mx-auto text-gray-400" size={36} />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Drag and drop files here, or click to browse
                </p>
                <input
                  type="file"
                  id="documents"
                  onChange={handleFileChange}
                  multiple
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => document.getElementById('documents')?.click()}
                >
                  Browse Files
                </Button>
              </div>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="space-y-2">
                <Label>Uploaded Documents</Label>
                <div className="space-y-2">
                  {uploadedFiles.map((file, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-200"
                    >
                      <div className="flex items-center">
                        <CheckCircle className="text-green-500 mr-2" size={18} />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-400 ml-2">({Math.round(file.size / 1024)} KB)</span>
                      </div>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2 pt-4">
              <Checkbox
                id="terms"
                checked={watch('termsAccepted')}
                onCheckedChange={(checked) => setValue('termsAccepted', checked === true)}
              />
              <Label 
                htmlFor="terms" 
                className={`text-sm leading-tight ${errors.termsAccepted ? 'text-red-500' : ''}`}
              >
                I certify that all information provided is true and accurate to the best of my knowledge.
                I understand that providing false information may result in the rejection of my application.
              </Label>
            </div>
            {errors.termsAccepted && (
              <p className="text-red-500 text-sm">{errors.termsAccepted.message}</p>
            )}
          </div>
        )}
        
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