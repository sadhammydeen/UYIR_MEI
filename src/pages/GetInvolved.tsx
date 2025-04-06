import React, { useEffect, useState } from 'react';
import { 
  ArrowRight, Clock, Heart, Star, MapPin, Calendar, 
  Briefcase, GraduationCap, FileText, CheckCircle, User,
  Users, Mail, Phone, BookOpen, PenTool, Globe, ShieldCheck, Building2, LineChart, Info
} from 'lucide-react';
import Button from '@/components/ui/Button.tsx';
import { Link } from 'react-router-dom';

const GetInvolved = () => {
  const [activeTab, setActiveTab] = useState('volunteer');
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in-section').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 bg-theuyir-darkgrey text-white overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-20">
            <img
              src="/images/backgrounds/page-header-bg.png"
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center fade-in-section opacity-0">
              <p className="inline-block bg-theuyir-yellow/20 text-theuyir-yellow px-4 py-1 rounded-full text-sm font-medium mb-4">
                GET INVOLVED
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Make a <span className="yellow-highlight">Difference</span> Today
              </h1>
              <p className="text-white/80 text-lg mb-8">
                Join our community of change-makers and help create a positive impact in the lives of those who need it most.
              </p>
            </div>
          </div>
        </section>
        
        {/* Tabs Section */}
        <section className="py-12 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4 fade-in-section opacity-0">
              <button 
                className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-300 ${
                  activeTab === 'volunteer' 
                    ? 'bg-theuyir-yellow text-theuyir-darkgrey shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('volunteer')}
              >
                Volunteer Opportunities
              </button>
              <button 
                className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-300 ${
                  activeTab === 'register' 
                    ? 'bg-theuyir-yellow text-theuyir-darkgrey shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('register')}
              >
                Register as Beneficiary
              </button>
              <button 
                className={`px-6 py-3 rounded-full text-base font-medium transition-all duration-300 ${
                  activeTab === 'ngo' 
                    ? 'bg-theuyir-yellow text-theuyir-darkgrey shadow-md' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('ngo')}
              >
                NGO Partnership
              </button>
            </div>
          </div>
        </section>
        
        {/* Volunteer Opportunities */}
        {activeTab === 'volunteer' && (
          <section className="py-20 bg-theuyir-lightgrey">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16 fade-in-section opacity-0">
                <p className="inline-block bg-theuyir-pink/10 text-theuyir-pink px-4 py-1 rounded-full text-sm font-medium mb-4">
                  VOLUNTEER WITH US
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-4">
                  Share Your Time and <span className="yellow-highlight">Skills</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Whether you have a few hours or a regular commitment, your time and skills can make a significant difference in someone's life.
                </p>
              </div>
              
              <div className="mb-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-8 rounded-xl shadow-md text-center fade-in-section opacity-0">
                    <div className="bg-theuyir-yellow/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                      <Clock className="text-theuyir-darkgrey" size={36} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-theuyir-darkgrey">Flexible Hours</h3>
                    <p className="text-gray-600">
                      Volunteer according to your schedule and availability, whether it's a few hours a month or several days a week.
                    </p>
                  </div>
                  
                  <div className="bg-white p-8 rounded-xl shadow-md text-center fade-in-section opacity-0" style={{ animationDelay: '0.2s' }}>
                    <div className="bg-theuyir-yellow/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                      <Heart className="text-theuyir-darkgrey" size={36} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-theuyir-darkgrey">Meaningful Impact</h3>
                    <p className="text-gray-600">
                      Make a tangible difference in someone's life through direct service and support to those in need.
                    </p>
                  </div>
                  
                  <div className="bg-white p-8 rounded-xl shadow-md text-center fade-in-section opacity-0" style={{ animationDelay: '0.4s' }}>
                    <div className="bg-theuyir-yellow/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                      <Star className="text-theuyir-darkgrey" size={36} />
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-theuyir-darkgrey">Skill-Based Matching</h3>
                    <p className="text-gray-600">
                      Get matched with opportunities that leverage your unique skills and interests for maximum impact.
                    </p>
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mb-8 text-center text-theuyir-darkgrey fade-in-section opacity-0">
                Current Volunteer Opportunities
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {/* Opportunity 1 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 fade-in-section opacity-0">
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                      alt="Tutoring Program" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-0 left-0 bg-theuyir-yellow text-black font-medium px-3 py-1 m-3 rounded-md text-sm">
                      Education
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1 text-theuyir-pink" />
                        <span className="text-gray-600 text-sm">Chennai, Tamil Nadu</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1 text-theuyir-pink" />
                        <span className="text-gray-600 text-sm">4 hrs/week</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 text-theuyir-darkgrey">After-School Tutoring</h3>
                    <p className="text-gray-600 mb-4">Help underprivileged children with homework and educational support at our community center.</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Teaching</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Children</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Weekday Evenings</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mb-8">
                      <Button variant="primary" size="lg" className="flex items-center">
                        Apply Now
                        <ArrowRight className="ml-2" />
                      </Button>
                      <Button variant="outline" size="lg">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Opportunity 2 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 fade-in-section opacity-0" style={{ animationDelay: '0.2s' }}>
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1610563166150-b34df4f3bcd6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                      alt="Food Distribution" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-0 left-0 bg-theuyir-yellow text-black font-medium px-3 py-1 m-3 rounded-md text-sm">
                      Food
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1 text-theuyir-pink" />
                        <span className="text-gray-600 text-sm">Coimbatore, Tamil Nadu</span>
                      </div>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-1 text-theuyir-pink" />
                        <span className="text-gray-600 text-sm">Weekends</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 text-theuyir-darkgrey">Food Distribution Program</h3>
                    <p className="text-gray-600 mb-4">Help distribute meals to homeless individuals and food-insecure families in urban areas.</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Food Service</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Logistics</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Weekend Mornings</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mb-8">
                      <Button variant="primary" size="lg" className="flex items-center">
                        Apply Now
                        <ArrowRight className="ml-2" />
                      </Button>
                      <Button variant="outline" size="lg">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Opportunity 3 */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 fade-in-section opacity-0" style={{ animationDelay: '0.4s' }}>
                  <div className="relative">
                    <img 
                      src="https://images.unsplash.com/photo-1581056771107-24247a734e53?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                      alt="Health Camp" 
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-0 left-0 bg-theuyir-yellow text-black font-medium px-3 py-1 m-3 rounded-md text-sm">
                      Healthcare
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <MapPin size={16} className="mr-1 text-theuyir-pink" />
                        <span className="text-gray-600 text-sm">Madurai, Tamil Nadu</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar size={16} className="mr-1 text-theuyir-pink" />
                        <span className="text-gray-600 text-sm">July 15-20, 2023</span>
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold mb-2 text-theuyir-darkgrey">Rural Health Camp Support</h3>
                    <p className="text-gray-600 mb-4">Assist medical professionals in providing basic healthcare services to rural communities.</p>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Healthcare</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">Administration</span>
                      <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full">One-Week Commitment</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mb-8">
                      <Button variant="primary" size="lg" className="flex items-center">
                        Apply Now
                        <ArrowRight className="ml-2" />
                      </Button>
                      <Button variant="outline" size="lg">
                        Learn More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-center fade-in-section opacity-0">
                <Button variant="secondary" size="lg">
                  View All Opportunities <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </div>
          </section>
        )}
        
        {/* Beneficiary Registration */}
        {activeTab === 'register' && (
          <section className="py-20 bg-theuyir-lightgrey">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16 fade-in-section opacity-0">
                <p className="inline-block bg-theuyir-pink/10 text-theuyir-pink px-4 py-1 rounded-full text-sm font-medium mb-4">
                  BENEFICIARY REGISTRATION
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-4">
                  Register to <span className="yellow-highlight">Receive Support</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  If you're in need of assistance, our platform connects you with resources, donors, and services that can help.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                <div className="fade-in-section opacity-0">
                  <h3 className="text-2xl font-bold mb-6 text-theuyir-darkgrey">How It Works for Beneficiaries</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="mr-4 p-3 bg-theuyir-yellow/20 rounded-full text-theuyir-darkgrey">
                        <User size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">1. Create an Account</h4>
                        <p className="text-gray-600">Register with your basic information and verification documents like Aadhaar or other ID proof.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mr-4 p-3 bg-theuyir-yellow/20 rounded-full text-theuyir-darkgrey">
                        <FileText size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">2. Submit Your Needs</h4>
                        <p className="text-gray-600">Fill out a needs assessment form detailing what kind of assistance you require and why.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mr-4 p-3 bg-theuyir-yellow/20 rounded-full text-theuyir-darkgrey">
                        <CheckCircle size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">3. Verification Process</h4>
                        <p className="text-gray-600">Our team reviews your information and may contact you for additional details to verify your needs.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mr-4 p-3 bg-theuyir-yellow/20 rounded-full text-theuyir-darkgrey">
                        <Heart size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">4. Receive Support</h4>
                        <p className="text-gray-600">Once verified, you'll be connected with donors, volunteers, or NGOs who can provide the assistance you need.</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-8 rounded-xl shadow-lg fade-in-section opacity-0">
                  <h3 className="text-xl font-bold mb-6 text-theuyir-darkgrey">Registration Form</h3>
                  
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                        <input
                          type="text"
                          id="firstName"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                        <input
                          type="text"
                          id="lastName"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                        placeholder="Enter your email address"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        id="phone"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                        placeholder="Enter your phone number"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="aadhaar" className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                      <input
                        type="text"
                        id="aadhaar"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                        placeholder="Enter your Aadhaar number"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="assistance" className="block text-sm font-medium text-gray-700 mb-1">Type of Assistance Needed</label>
                      <select
                        id="assistance"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                      >
                        <option value="">Select type of assistance</option>
                        <option value="food">Food & Nutrition</option>
                        <option value="shelter">Shelter & Housing</option>
                        <option value="education">Education Support</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="skills">Skill Development</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">Details of Your Need</label>
                      <textarea
                        id="details"
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                        placeholder="Please describe your situation and what kind of help you need"
                      ></textarea>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="consent"
                        className="h-4 w-4 text-theuyir-pink focus:ring-theuyir-pink border-gray-300 rounded"
                      />
                      <label htmlFor="consent" className="ml-2 block text-sm text-gray-700">
                        I consent to the processing of my personal data in accordance with the Privacy Policy
                      </label>
                    </div>
                    
                    <div className="mt-8">
                      <Button 
                        variant="primary" 
                        size="lg" 
                        type="submit"
                        className="w-full"
                      >
                        Submit Registration
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* NGO Partnership */}
        {activeTab === 'ngo' && (
          <section className="py-20 bg-theuyir-lightgrey">
            <div className="container mx-auto px-4">
              <div className="text-center mb-16 fade-in-section opacity-0">
                <p className="inline-block bg-theuyir-pink/10 text-theuyir-pink px-4 py-1 rounded-full text-sm font-medium mb-4">
                  NGO PARTNERSHIP
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-4">
                  Partner With Us to <span className="yellow-highlight">Extend Your Impact</span>
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Join our network of NGOs to access more donors, volunteers, and resources for your programs.
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                <div className="order-2 lg:order-1 bg-white p-8 rounded-xl shadow-lg fade-in-section opacity-0">
                  <h3 className="text-xl font-bold mb-6 text-theuyir-darkgrey">Partnership Application</h3>
                  
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="ngoName" className="block text-sm font-medium text-gray-700 mb-1">Organization Name</label>
                      <input
                        type="text"
                        id="ngoName"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                        placeholder="Enter your organization's name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="regNumber" className="block text-sm font-medium text-gray-700 mb-1">Registration Number</label>
                      <input
                        type="text"
                        id="regNumber"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                        placeholder="Enter your registration number"
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-1">Contact Person</label>
                        <input
                          type="text"
                          id="contactPerson"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                        <input
                          type="text"
                          id="position"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                          placeholder="Your position"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="ngoEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          id="ngoEmail"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                          placeholder="Organization email"
                        />
                      </div>
                      <div>
                        <label htmlFor="ngoPhone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          id="ngoPhone"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                          placeholder="Organization phone"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="focusArea" className="block text-sm font-medium text-gray-700 mb-1">Primary Focus Area</label>
                      <select
                        id="focusArea"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                      >
                        <option value="">Select focus area</option>
                        <option value="education">Education</option>
                        <option value="healthcare">Healthcare</option>
                        <option value="foodNutrition">Food & Nutrition</option>
                        <option value="housing">Housing & Shelter</option>
                        <option value="environment">Environment</option>
                        <option value="womenEmpowerment">Women Empowerment</option>
                        <option value="childWelfare">Child Welfare</option>
                        <option value="elderCare">Elder Care</option>
                        <option value="disabilitySupport">Disability Support</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="ngoDescription" className="block text-sm font-medium text-gray-700 mb-1">Organization Description</label>
                      <textarea
                        id="ngoDescription"
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                        placeholder="Briefly describe your organization's mission and activities"
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Documents Required</label>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <span className="text-sm text-gray-700">Registration Certificate</span>
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors">Upload</button>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <span className="text-sm text-gray-700">80G Certificate (if applicable)</span>
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors">Upload</button>
                        </div>
                        <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                          <span className="text-sm text-gray-700">Annual Report</span>
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm transition-colors">Upload</button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="ngoConsent"
                        className="h-4 w-4 text-theuyir-pink focus:ring-theuyir-pink border-gray-300 rounded"
                      />
                      <label htmlFor="ngoConsent" className="ml-2 block text-sm text-gray-700">
                        I confirm that all information provided is accurate and agree to the terms of partnership
                      </label>
                    </div>
                    
                    <div className="mt-8">
                      <Button 
                        variant="primary" 
                        size="lg" 
                        type="submit"
                        className="w-full"
                      >
                        Submit Application
                      </Button>
                    </div>
                  </form>
                </div>
                
                <div className="order-1 lg:order-2 fade-in-section opacity-0">
                  <h3 className="text-2xl font-bold mb-6 text-theuyir-darkgrey">Benefits of Partnership</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="mr-4 p-3 bg-theuyir-yellow/20 rounded-full text-theuyir-darkgrey">
                        <Users size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Expanded Donor Network</h4>
                        <p className="text-gray-600">Access our broad network of donors looking to support causes like yours.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mr-4 p-3 bg-theuyir-yellow/20 rounded-full text-theuyir-darkgrey">
                        <Briefcase size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Skilled Volunteers</h4>
                        <p className="text-gray-600">Find qualified volunteers with specific skills needed for your programs.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mr-4 p-3 bg-theuyir-yellow/20 rounded-full text-theuyir-darkgrey">
                        <GraduationCap size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Training & Resources</h4>
                        <p className="text-gray-600">Access workshops, webinars, and resources to help strengthen your organizational capacity.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="mr-4 p-3 bg-theuyir-yellow/20 rounded-full text-theuyir-darkgrey">
                        <Heart size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold mb-2">Collaborative Opportunities</h4>
                        <p className="text-gray-600">Connect with other NGOs for collaborative projects and knowledge sharing.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-theuyir-pink/10 rounded-lg">
                    <p className="text-theuyir-pink font-medium">
                      Our verification process ensures that all partner NGOs maintain high standards of transparency and accountability, building trust with donors and beneficiaries alike.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* NGO Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-4">Partner as an NGO</h2>
              <p className="text-lg text-gray-600">
                Join our network of verified NGOs to collaborate, share resources, and create greater impact together.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Register Your NGO</h3>
                <p className="text-gray-600 mb-4">Complete our verification process to join our platform and access collaboration opportunities.</p>
                <Link to="/ngo-registration">
                  <Button variant="outline" className="w-full">Apply Now</Button>
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Collaborate With Others</h3>
                <p className="text-gray-600 mb-4">Connect with other NGOs to share resources, knowledge, and create joint initiatives.</p>
                <Link to="/ngo-directory">
                  <Button variant="outline" className="w-full">Explore NGOs</Button>
                </Link>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <LineChart className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Track Your Impact</h3>
                <p className="text-gray-600 mb-4">Measure and showcase your organization's contribution with our impact tracking tools.</p>
                <Button variant="outline" className="w-full">Learn More</Button>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto mt-12 bg-theuyir-yellow/10 p-6 rounded-lg border border-theuyir-yellow">
              <div className="flex flex-col md:flex-row items-center">
                <div className="mb-4 md:mb-0 md:mr-6">
                  <Info className="w-12 h-12 text-theuyir-yellow" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">Already Registered?</h4>
                  <p className="text-gray-600 mb-4">If your NGO is already registered with us, you can log in to access your dashboard and collaboration tools.</p>
                  <div className="flex space-x-4">
                    <Link to="/login">
                      <Button variant="primary">Login</Button>
                    </Link>
                    <Link to="/contact">
                      <Button variant="outline">Contact Support</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-theuyir-pink text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 fade-in-section opacity-0">
              Join Our <span className="yellow-highlight">Community</span> Today
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-10 fade-in-section opacity-0" style={{ animationDelay: '0.2s' }}>
              Whether you're looking to volunteer, receive assistance, or partner as an NGO, 
              together we can create meaningful change in our communities.
            </p>
            <div className="flex flex-wrap justify-center gap-4 fade-in-section opacity-0" style={{ animationDelay: '0.4s' }}>
              <Button variant="primary" size="lg">
                Get Started Now
              </Button>
              <Button size="lg" className="bg-white text-theuyir-pink hover:bg-white/90">
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default GetInvolved;
