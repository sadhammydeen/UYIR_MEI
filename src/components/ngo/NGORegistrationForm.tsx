import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import NGOService, { NGORegistrationData } from '@/api/services/ngo.service';
import { useToast } from '@/components/ui/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Registration schema for validation
const registrationSchema = z.object({
  // Step 1: Basic Information
  name: z.string().min(3, { message: 'Organization name must be at least 3 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  website: z.string().url({ message: 'Please enter a valid URL' }).optional(),
  description: z.string().min(50, { message: 'Description must be at least 50 characters' }),
  
  // Step 2: Registration Details
  registrationNumber: z.string().min(5, { message: 'Registration number is required' }),
  registrationType: z.string().min(1, { message: 'Please select a registration type' }),
  taxExemptionNumber: z.string().optional(),
  
  // Step 3: Address
  address: z.object({
    street: z.string().min(3, { message: 'Street address is required' }),
    city: z.string().min(1, { message: 'City is required' }),
    state: z.string().min(1, { message: 'State is required' }),
    postalCode: z.string().min(5, { message: 'Postal code is required' }),
    country: z.string().min(1, { message: 'Country is required' }),
  }),
  
  // Step 4: Contact Person
  contactPerson: z.object({
    name: z.string().min(3, { message: 'Contact person name is required' }),
    position: z.string().min(1, { message: 'Position is required' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  }),
  
  // Step 5: Organization Information
  focusAreas: z.array(z.string()).min(1, { message: 'Select at least one focus area' }),
  establishedYear: z.number().min(1800, { message: 'Please enter a valid year' }).max(new Date().getFullYear()),
  
  // Step 6: Bank Details (optional)
  bankDetails: z.object({
    accountName: z.string().min(3, { message: 'Account name is required' }),
    accountNumber: z.string().min(9, { message: 'Account number is required' }),
    bankName: z.string().min(3, { message: 'Bank name is required' }),
    branchName: z.string().min(3, { message: 'Branch name is required' }),
    ifscCode: z.string().min(11, { message: 'IFSC code is required' }),
  }).optional(),
});

type RegistrationInput = z.infer<typeof registrationSchema>;

const NGORegistrationForm: React.FC = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [registrationDocument, setRegistrationDocument] = useState<File | null>(null);
  const [logo, setLogo] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      focusAreas: [],
      address: {
        street: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India',
      },
      contactPerson: {
        name: '',
        position: '',
        email: '',
        phone: '',
      },
      establishedYear: 2000,
    },
  });

  const focusAreaOptions = [
    { value: 'Education', label: 'Education' },
    { value: 'Healthcare', label: 'Healthcare' },
    { value: 'Poverty Alleviation', label: 'Poverty Alleviation' },
    { value: 'Environment', label: 'Environment' },
    { value: 'Women Empowerment', label: 'Women Empowerment' },
    { value: 'Child Welfare', label: 'Child Welfare' },
    { value: 'Elderly Care', label: 'Elderly Care' },
    { value: 'Disability Support', label: 'Disability Support' },
    { value: 'Rural Development', label: 'Rural Development' },
    { value: 'Disaster Relief', label: 'Disaster Relief' },
  ];

  const registrationTypeOptions = [
    { value: 'NGO', label: 'NGO' },
    { value: 'Trust', label: 'Trust' },
    { value: 'Society', label: 'Society' },
    { value: 'Section 8', label: 'Section 8 Company' },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'registrationDocument' | 'logo') => {
    if (e.target.files && e.target.files[0]) {
      if (type === 'registrationDocument') {
        setRegistrationDocument(e.target.files[0]);
      } else {
        setLogo(e.target.files[0]);
      }
    }
  };

  const nextStep = () => {
    // Validate current step fields
    let fieldsToValidate: string[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['name', 'email', 'phone', 'description'];
        break;
      case 2:
        fieldsToValidate = ['registrationNumber', 'registrationType'];
        if (!registrationDocument) {
          toast({
            title: "Registration document required",
            description: "Please upload your registration document",
            variant: "destructive",
          });
          return;
        }
        break;
      case 3:
        fieldsToValidate = ['address.street', 'address.city', 'address.state', 'address.postalCode', 'address.country'];
        break;
      case 4:
        fieldsToValidate = ['contactPerson.name', 'contactPerson.position', 'contactPerson.email', 'contactPerson.phone'];
        break;
      case 5:
        fieldsToValidate = ['focusAreas', 'establishedYear'];
        break;
      default:
        break;
    }
    
    const isValid = fieldsToValidate.every(field => {
      const fieldResult = form.trigger(field as any);
      return fieldResult;
    });
    
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const onSubmit = async (data: RegistrationInput) => {
    if (!registrationDocument) {
      toast({
        title: "Registration document required",
        description: "Please upload your registration document",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Prepare the full registration data
      const ngoData: NGORegistrationData = {
        ...data,
        registrationDocument: registrationDocument,
        logo: logo || undefined,
      };
      
      const response = await NGOService.registerNGO(ngoData);
      
      toast({
        title: "Registration Successful",
        description: `Your application has been submitted with ID: ${response.applicationId}`,
      });
      
      // Optional: Redirect to a thank you page or dashboard
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Failed",
        description: "There was an error submitting your registration. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render steps based on current step
  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter organization name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address*</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter email address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter phone number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.example.org" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Description*</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your organization's mission, goals, and activities" 
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
        
      case 2:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="registrationNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Number*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter registration number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="registrationType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Registration Type*</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value}
                      onValueChange={field.onChange}
                      options={registrationTypeOptions}
                      placeholder="Select registration type"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel htmlFor="registrationDocument">Registration Document*</FormLabel>
              <Input
                id="registrationDocument"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, 'registrationDocument')}
              />
              {registrationDocument && (
                <p className="text-sm text-green-600">
                  File selected: {registrationDocument.name}
                </p>
              )}
            </div>
            
            <FormField
              control={form.control}
              name="taxExemptionNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tax Exemption Number (if applicable)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter tax exemption number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
        
      case 3:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="address.street"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter street address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address.city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter city" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address.state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>State*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter state" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address.postalCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Postal Code*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter postal code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="address.country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter country" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
        
      case 4:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="contactPerson.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person Name*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact person name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactPerson.position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter position" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactPerson.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person Email*</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Enter contact email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="contactPerson.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Person Phone*</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter contact phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
        
      case 5:
        return (
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="focusAreas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Focus Areas*</FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-2">
                      {focusAreaOptions.map(option => (
                        <div key={option.value} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`focus-${option.value}`}
                            checked={field.value.includes(option.value)}
                            onChange={(e) => {
                              const newValue = [...field.value];
                              if (e.target.checked) {
                                newValue.push(option.value);
                              } else {
                                const index = newValue.indexOf(option.value);
                                if (index > -1) {
                                  newValue.splice(index, 1);
                                }
                              }
                              field.onChange(newValue);
                            }}
                            className="mr-2"
                          />
                          <label htmlFor={`focus-${option.value}`}>{option.label}</label>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="establishedYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year Established*</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1800}
                      max={new Date().getFullYear()}
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <FormLabel htmlFor="logo">Organization Logo</FormLabel>
              <Input
                id="logo"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={(e) => handleFileChange(e, 'logo')}
              />
              {logo && (
                <div className="mt-2">
                  <p className="text-sm text-green-600">File selected: {logo.name}</p>
                  <div className="w-24 h-24 mt-2 border rounded overflow-hidden">
                    <img
                      src={URL.createObjectURL(logo)}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bank Details (Optional)</h3>
            <p className="text-sm text-gray-500">
              These details will be used for receiving donations. You can also add this information later.
            </p>
            
            <FormField
              control={form.control}
              name="bankDetails.accountName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Holder Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account holder name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bankDetails.accountNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter account number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bankDetails.bankName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bank Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bank name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bankDetails.branchName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Branch Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter branch name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="bankDetails.ifscCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>IFSC Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter IFSC code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">NGO Registration</CardTitle>
          <div className="w-full mt-4">
            <div className="flex justify-between items-center">
              {[1, 2, 3, 4, 5, 6].map((step) => (
                <div 
                  key={step}
                  className={`flex flex-col items-center ${step <= currentStep ? 'text-primary' : 'text-gray-400'}`}
                >
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 
                               ${step < currentStep ? 'bg-primary text-white' : 
                                 step === currentStep ? 'border-2 border-primary text-primary' : 
                                 'border-2 border-gray-300 text-gray-400'}`}
                  >
                    {step}
                  </div>
                  <span className="text-xs">
                    {step === 1 && 'Basics'}
                    {step === 2 && 'Registration'}
                    {step === 3 && 'Address'}
                    {step === 4 && 'Contact'}
                    {step === 5 && 'Organization'}
                    {step === 6 && 'Banking'}
                  </span>
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 h-1 mt-2">
              <div 
                className="bg-primary h-1 transition-all duration-300" 
                style={{ width: `${((currentStep - 1) / 5) * 100}%` }}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {renderStep()}
              
              <div className="flex justify-between mt-8">
                {currentStep > 1 && (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                )}
                
                {currentStep < 6 ? (
                  <Button type="button" onClick={nextStep} className="ml-auto">
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting} className="ml-auto">
                    {isSubmitting ? 'Submitting...' : 'Submit Registration'}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NGORegistrationForm; 