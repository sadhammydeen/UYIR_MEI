import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { CheckCircle, Heart, ShieldCheck, Clock } from 'lucide-react';
import Button from '@/components/ui/button';
import BeneficiaryApplicationForm from '@/components/beneficiary/BeneficiaryApplicationForm';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';

const BeneficiaryApplication = () => {
  const { isAuthenticated, user } = useAuth();
  const { setIsLoading, setLoadingText } = useLoading();
  const navigate = useNavigate();
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    if (isAuthenticated) {
      setIsLoading(true);
      setLoadingText('Loading application...');
      
      // Simulate checking if user already has an application
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [isAuthenticated]);
  
  const handleApplicationSuccess = () => {
    setApplicationSubmitted(true);
    window.scrollTo(0, 0);
  };
  
  if (!isAuthenticated) {
    return <Navigate to="/login?redirect=/apply-for-support" replace />;
  }
  
  return (
    <div className="flex flex-col">
      <div className="relative py-16 bg-theuyir-darkgrey text-white overflow-hidden">
        <div className="absolute inset-0 -z-10 opacity-20">
          <img
            src="/images/backgrounds/page-header-bg.png"
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <p className="inline-block bg-theuyir-yellow/20 text-theuyir-yellow px-4 py-1 rounded-full text-sm font-medium mb-4">
              APPLY FOR ASSISTANCE
            </p>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              We're Here to <span className="yellow-highlight">Support</span> You
            </h1>
            <p className="text-white/80 text-lg mb-8">
              Our mission is to provide assistance to those in need. Please complete the application form below to request support.
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        {applicationSubmitted ? (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-lg text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-theuyir-darkgrey mb-4">Application Submitted Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for submitting your application for assistance. Our team will review your application and contact you within 5-7 business days regarding the next steps.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-theuyir-darkgrey mb-3">What happens next?</h3>
              <ol className="text-left text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="bg-theuyir-yellow/20 text-theuyir-darkgrey w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0">1</span>
                  <span>Our team will review your application and supporting documents</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-theuyir-yellow/20 text-theuyir-darkgrey w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0">2</span>
                  <span>You will receive an email confirmation with your application reference number</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-theuyir-yellow/20 text-theuyir-darkgrey w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0">3</span>
                  <span>A representative may contact you for additional information if needed</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-theuyir-yellow/20 text-theuyir-darkgrey w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0">4</span>
                  <span>You will be notified of the decision and next steps</span>
                </li>
              </ol>
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Button variant="primary" onClick={() => navigate('/dashboard')}>
                Go to Dashboard
              </Button>
              <Button variant="outline" onClick={() => navigate('/services')}>
                Explore Our Services
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="max-w-4xl mx-auto mb-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                  <div className="w-12 h-12 bg-theuyir-pink/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="text-theuyir-pink" size={24} />
                  </div>
                  <h3 className="font-semibold text-theuyir-darkgrey mb-2">Compassionate Support</h3>
                  <p className="text-gray-600 text-sm">
                    We provide assistance with dignity, respect, and understanding of your unique situation.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                  <div className="w-12 h-12 bg-theuyir-pink/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShieldCheck className="text-theuyir-pink" size={24} />
                  </div>
                  <h3 className="font-semibold text-theuyir-darkgrey mb-2">Confidentiality</h3>
                  <p className="text-gray-600 text-sm">
                    Your personal information is kept strictly confidential and used only for processing your application.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md text-center">
                  <div className="w-12 h-12 bg-theuyir-pink/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="text-theuyir-pink" size={24} />
                  </div>
                  <h3 className="font-semibold text-theuyir-darkgrey mb-2">Prompt Response</h3>
                  <p className="text-gray-600 text-sm">
                    We aim to process all applications within 5-7 business days and provide timely assistance.
                  </p>
                </div>
              </div>
              
              <div className="bg-theuyir-lightgrey p-6 rounded-lg mb-8">
                <h3 className="text-lg font-semibold text-theuyir-darkgrey mb-3">Important Information</h3>
                <ul className="list-disc list-inside text-gray-600 space-y-2">
                  <li>Please ensure all information provided is accurate and complete</li>
                  <li>Upload clear, legible copies of all required documents</li>
                  <li>Applications with incomplete information may take longer to process</li>
                  <li>Our team may contact you for additional information if needed</li>
                  <li>Priority is given based on urgency of need and available resources</li>
                </ul>
              </div>
            </div>
            
            <BeneficiaryApplicationForm onSuccess={handleApplicationSuccess} />
          </>
        )}
      </div>
      
      <div className="bg-theuyir-lightgrey py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-theuyir-darkgrey mb-4">Need Help With Your Application?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            If you need assistance with your application or have questions about our support programs, our team is here to help.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Button variant="primary" asChild>
              <a href="tel:+919876543210" className="flex items-center">
                <span>Call Us: +91 98765 43210</span>
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href="mailto:support@uyirmei.org">
                Email: support@uyirmei.org
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BeneficiaryApplication; 