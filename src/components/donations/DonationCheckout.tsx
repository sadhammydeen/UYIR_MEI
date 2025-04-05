import React, { useState } from 'react';
import Button from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowRight, ShieldCheck, CreditCard, Wallet, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PaymentMethodLogos from '@/components/shared/PaymentMethodLogos';
import DonationService from '@/api/services/donation.service';
import { useAuth } from '@/contexts/AuthContext';

interface DonationCheckoutProps {
  amount: number;
  donationType: 'oneTime' | 'monthly';
  onSuccess: () => void;
  onCancel: () => void;
}

const DonationCheckout: React.FC<DonationCheckoutProps> = ({
  amount,
  donationType,
  onSuccess,
  onCancel
}) => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCvc: '',
    upiId: '',
    campaign: '',
    anonymous: false,
    dedicationType: '',
    dedicatedTo: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData({
      ...formData,
      anonymous: checked
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validateStep1 = () => {
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return false;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return false;
    }
    
    // Basic phone validation
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number.",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const validateStep2 = () => {
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber || !formData.cardExpiry || !formData.cardCvc) {
        toast({
          title: "Missing Card Information",
          description: "Please fill in all card details.",
          variant: "destructive"
        });
        return false;
      }
      
      // Basic card validation
      const cardNumberRegex = /^[0-9]{16}$/;
      if (!cardNumberRegex.test(formData.cardNumber.replace(/\s/g, ''))) {
        toast({
          title: "Invalid Card Number",
          description: "Please enter a valid 16-digit card number.",
          variant: "destructive"
        });
        return false;
      }
      
      const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
      if (!expiryRegex.test(formData.cardExpiry)) {
        toast({
          title: "Invalid Expiry Date",
          description: "Please enter a valid expiry date (MM/YY).",
          variant: "destructive"
        });
        return false;
      }
      
      const cvcRegex = /^[0-9]{3,4}$/;
      if (!cvcRegex.test(formData.cardCvc)) {
        toast({
          title: "Invalid CVC",
          description: "Please enter a valid 3 or 4 digit CVC.",
          variant: "destructive"
        });
        return false;
      }
    } else if (formData.paymentMethod === 'upi') {
      if (!formData.upiId) {
        toast({
          title: "Missing UPI ID",
          description: "Please enter your UPI ID.",
          variant: "destructive"
        });
        return false;
      }
      
      // Basic UPI validation
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
      if (!upiRegex.test(formData.upiId)) {
        toast({
          title: "Invalid UPI ID",
          description: "Please enter a valid UPI ID (e.g. name@bank).",
          variant: "destructive"
        });
        return false;
      }
    }
    
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const processDonation = async () => {
    setIsProcessing(true);
    
    try {
      const donationData = {
        amount,
        currency: 'INR',
        donationType,
        campaign: formData.campaign || undefined,
        paymentMethod: formData.paymentMethod,
        anonymous: formData.anonymous,
        dedicationType: formData.dedicationType || undefined,
        dedicatedTo: formData.dedicatedTo || undefined,
        notes: formData.notes || undefined
      };
      
      // This would connect to a real payment processor in production
      const response = await DonationService.createDonation(donationData);
      
      toast({
        title: "Donation Successful!",
        description: "Thank you for your generous contribution.",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Donation processing error:", error);
      toast({
        title: "Donation Failed",
        description: "There was an error processing your donation. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-theuyir-darkgrey">Donation Checkout</h2>
        <div className="flex items-center">
          <ShieldCheck className="text-green-600 mr-2" size={18} />
          <span className="text-sm text-gray-600">Secure Payment</span>
        </div>
      </div>
      
      {/* Donation Summary */}
      <div className="bg-theuyir-lightgrey p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <span className="text-theuyir-darkgrey font-medium">Donation Amount:</span>
          <span className="text-xl font-bold text-theuyir-darkgrey">₹{amount.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-theuyir-darkgrey font-medium">Donation Type:</span>
          <span className="text-gray-600">{donationType === 'oneTime' ? 'One-time' : 'Monthly recurring'}</span>
        </div>
      </div>
      
      {/* Step Indicator */}
      <div className="flex mb-6">
        <div className={`flex-1 h-1 rounded-l-full ${step >= 1 ? 'bg-theuyir-pink' : 'bg-gray-200'}`}></div>
        <div className={`flex-1 h-1 ${step >= 2 ? 'bg-theuyir-pink' : 'bg-gray-200'}`}></div>
        <div className={`flex-1 h-1 rounded-r-full ${step >= 3 ? 'bg-theuyir-pink' : 'bg-gray-200'}`}></div>
      </div>
      
      {/* Step 1: Donor Information */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-theuyir-darkgrey mb-4">Donor Information</h3>
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Your Full Name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+91 98765 43210"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="campaign">Select Campaign (Optional)</Label>
            <Select
              value={formData.campaign}
              onValueChange={(value) => handleSelectChange('campaign', value)}
            >
              <SelectTrigger id="campaign">
                <SelectValue placeholder="Choose a specific campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">General Fund</SelectItem>
                <SelectItem value="education">Education Support</SelectItem>
                <SelectItem value="healthcare">Healthcare Initiatives</SelectItem>
                <SelectItem value="food">Food Security Program</SelectItem>
                <SelectItem value="vocational">Vocational Training</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={formData.anonymous}
              onCheckedChange={handleCheckboxChange}
            />
            <label
              htmlFor="anonymous"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Make this donation anonymous
            </label>
          </div>
        </div>
      )}
      
      {/* Step 2: Payment Information */}
      {step === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-theuyir-darkgrey mb-4">Payment Information</h3>
          
          <RadioGroup 
            value={formData.paymentMethod} 
            onValueChange={(value) => handleSelectChange('paymentMethod', value)}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-theuyir-pink">
              <RadioGroupItem value="card" id="payment-card" />
              <Label htmlFor="payment-card" className="flex items-center cursor-pointer">
                <CreditCard className="mr-2 text-theuyir-darkgrey" size={18} />
                <span>Credit / Debit Card</span>
              </Label>
            </div>
            
            <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-lg p-3 cursor-pointer hover:border-theuyir-pink">
              <RadioGroupItem value="upi" id="payment-upi" />
              <Label htmlFor="payment-upi" className="flex items-center cursor-pointer">
                <Wallet className="mr-2 text-theuyir-darkgrey" size={18} />
                <span>UPI</span>
              </Label>
            </div>
          </RadioGroup>
          
          {formData.paymentMethod === 'card' ? (
            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  name="cardNumber"
                  value={formData.cardNumber}
                  onChange={handleInputChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cardExpiry">Expiry Date</Label>
                  <Input
                    id="cardExpiry"
                    name="cardExpiry"
                    value={formData.cardExpiry}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardCvc">CVC</Label>
                  <Input
                    id="cardCvc"
                    name="cardCvc"
                    value={formData.cardCvc}
                    onChange={handleInputChange}
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <PaymentMethodLogos />
              </div>
            </div>
          ) : formData.paymentMethod === 'upi' && (
            <div className="space-y-2 pt-2">
              <Label htmlFor="upiId">UPI ID</Label>
              <Input
                id="upiId"
                name="upiId"
                value={formData.upiId}
                onChange={handleInputChange}
                placeholder="username@bank"
                required
              />
            </div>
          )}
        </div>
      )}
      
      {/* Step 3: Donation Details and Confirmation */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-theuyir-darkgrey mb-4">Donation Details</h3>
          
          <div className="space-y-2">
            <Label htmlFor="dedicationType">Dedicate This Donation (Optional)</Label>
            <Select
              value={formData.dedicationType}
              onValueChange={(value) => handleSelectChange('dedicationType', value)}
            >
              <SelectTrigger id="dedicationType">
                <SelectValue placeholder="Select dedication type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No dedication</SelectItem>
                <SelectItem value="inHonor">In Honor of Someone</SelectItem>
                <SelectItem value="inMemory">In Memory of Someone</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {formData.dedicationType && (
            <div className="space-y-2">
              <Label htmlFor="dedicatedTo">Dedicated To</Label>
              <Input
                id="dedicatedTo"
                name="dedicatedTo"
                value={formData.dedicatedTo}
                onChange={handleInputChange}
                placeholder="Name of the person"
                required={!!formData.dedicationType}
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any special instructions or comments"
              rows={3}
            />
          </div>
          
          <div className="bg-theuyir-lightgrey p-4 rounded-lg mt-6">
            <h4 className="text-theuyir-darkgrey font-semibold mb-2">Donation Summary</h4>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-medium text-theuyir-darkgrey">₹{amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium text-theuyir-darkgrey">{donationType === 'oneTime' ? 'One-time' : 'Monthly'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Campaign:</span>
                <span className="font-medium text-theuyir-darkgrey">
                  {formData.campaign ? 
                    formData.campaign.charAt(0).toUpperCase() + formData.campaign.slice(1) + ' Program' : 
                    'General Fund'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Method:</span>
                <span className="font-medium text-theuyir-darkgrey">
                  {formData.paymentMethod === 'card' ? 'Credit/Debit Card' : 'UPI'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 flex items-start">
            <ShieldCheck className="text-green-600 mr-2 mt-0.5 flex-shrink-0" size={18} />
            <p className="text-sm text-gray-700">
              By completing this donation, you agree to our Terms of Service and Privacy Policy. 
              Your payment information is securely processed.
            </p>
          </div>
        </div>
      )}
      
      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <Button variant="outline" onClick={prevStep} disabled={isProcessing}>
            Back
          </Button>
        ) : (
          <Button variant="outline" onClick={onCancel} disabled={isProcessing}>
            Cancel
          </Button>
        )}
        
        {step < 3 ? (
          <Button onClick={nextStep} disabled={isProcessing}>
            Continue <ArrowRight size={16} className="ml-1" />
          </Button>
        ) : (
          <Button onClick={processDonation} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Complete Donation
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DonationCheckout; 