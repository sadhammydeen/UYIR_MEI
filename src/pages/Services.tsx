import React, { useEffect } from 'react';
import { ArrowRight, BookOpen, Utensils, Home, Stethoscope, GraduationCap, LifeBuoy } from 'lucide-react';
import Button from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { Link } from 'react-router-dom';

const ServiceCard = ({ icon, title, description, color }: { icon: React.ReactNode, title: string, description: string, color: string }) => {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group fade-in-section opacity-0">
      <div className={`p-6 rounded-t-xl ${color}`}>
        <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 transform transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-white/90">{description}</p>
      </div>
      <div className="p-6 border-t border-gray-100">
        <h4 className="font-semibold mb-3 text-theuyir-darkgrey">Services provided:</h4>
        <ul className="space-y-2">
          <li className="flex items-start">
            <ArrowRight size={16} className="mr-2 mt-1 text-theuyir-pink flex-shrink-0" />
            <span className="text-gray-600">Direct assistance to those in need</span>
          </li>
          <li className="flex items-start">
            <ArrowRight size={16} className="mr-2 mt-1 text-theuyir-pink flex-shrink-0" />
            <span className="text-gray-600">Collaborative NGO partnerships</span>
          </li>
          <li className="flex items-start">
            <ArrowRight size={16} className="mr-2 mt-1 text-theuyir-pink flex-shrink-0" />
            <span className="text-gray-600">Skilled volunteer coordination</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const Services = () => {
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
    <div>
      <main className="flex-grow">
        {/* Header with 3D effects */}
        <Header 
          title="Our Services and Programs"
          description="We provide comprehensive solutions addressing critical community needs, connecting resources directly with those who need them most."
          badge="WHAT WE DO"
          backgroundImage="/images/backgrounds/page-header-bg.png"
        />
        
        {/* Services Grid */}
        <section className="py-20 bg-theuyir-lightgrey">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 fade-in-section opacity-0">
              <p className="inline-block bg-theuyir-pink/10 text-theuyir-pink px-4 py-1 rounded-full text-sm font-medium mb-4">
                OUR FOCUS AREAS
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-4">
                Making a <span className="yellow-highlight">Difference</span> Together
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our integrated platform connects those in need with resources, empowering donors, volunteers, and organizations to create meaningful impact.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ServiceCard 
                icon={<Utensils size={32} className="text-white" />}
                title="Food Security"
                description="Ensuring reliable access to nutritious meals for children, elderly, and vulnerable populations."
                color="bg-gradient-to-br from-amber-500 to-amber-600"
              />
              
              <ServiceCard 
                icon={<Home size={32} className="text-white" />}
                title="Shelter & Housing"
                description="Creating safe, dignified housing solutions for those experiencing homelessness or displacement."
                color="bg-gradient-to-br from-emerald-500 to-emerald-600"
              />
              
              <ServiceCard 
                icon={<GraduationCap size={32} className="text-white" />}
                title="Education Support"
                description="Providing scholarships, supplies, and resources to help students reach their full potential."
                color="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              
              <ServiceCard 
                icon={<Stethoscope size={32} className="text-white" />}
                title="Healthcare Access"
                description="Facilitating medical care, medications, and health education for underserved communities."
                color="bg-gradient-to-br from-red-500 to-red-600"
              />
              
              <ServiceCard 
                icon={<BookOpen size={32} className="text-white" />}
                title="Skill Development"
                description="Building employable skills through training programs to create pathways to self-sufficiency."
                color="bg-gradient-to-br from-purple-500 to-purple-600"
              />
              
              <ServiceCard 
                icon={<LifeBuoy size={32} className="text-white" />}
                title="Emergency Relief"
                description="Delivering rapid response during natural disasters, health crises, and other urgent situations."
                color="bg-gradient-to-br from-theuyir-pink to-pink-600"
              />
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 fade-in-section opacity-0">
              <p className="inline-block bg-theuyir-yellow/20 text-theuyir-darkgrey px-4 py-1 rounded-full text-sm font-medium mb-4">
                OUR PROCESS
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-4">
                How It <span className="yellow-highlight">Works</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our streamlined four-step approach ensures help reaches those who need it most, efficiently and transparently.
              </p>
            </div>
            
            <div className="relative">
              {/* Process Timeline */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-theuyir-pink/20 transform -translate-x-1/2"></div>
              
              <div className="space-y-20">
                {/* Step 1 */}
                <div className="relative fade-in-section opacity-0">
                  <div className="hidden md:block absolute left-1/2 top-0 w-8 h-8 bg-theuyir-pink rounded-full transform -translate-x-1/2 z-10 shadow-lg"></div>
                  <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                    <div className="md:text-right mb-8 md:mb-0">
                      <p className="inline-block bg-theuyir-pink/10 text-theuyir-pink px-4 py-1 rounded-full text-sm font-medium mb-4">
                        STEP 1
                      </p>
                      <h3 className="text-2xl font-bold mb-4 text-theuyir-darkgrey">Registration & Verification</h3>
                      <p className="text-gray-600">
                        Sign up as a beneficiary, donor, volunteer, or NGO. Our team verifies all accounts to ensure security and trust in the platform.
                      </p>
                    </div>
                    <div className="bg-theuyir-lightgrey rounded-xl overflow-hidden shadow-md">
                      <img 
                        src="https://images.unsplash.com/photo-1556155092-490a1ba16284?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                        alt="Registration Process" 
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="relative fade-in-section opacity-0">
                  <div className="hidden md:block absolute left-1/2 top-0 w-8 h-8 bg-theuyir-pink rounded-full transform -translate-x-1/2 z-10 shadow-lg"></div>
                  <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                    <div className="order-last md:order-first mb-8 md:mb-0">
                      <div className="bg-theuyir-lightgrey rounded-xl overflow-hidden shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1531545514256-b1400bc00f31?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                          alt="Needs Assessment" 
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="inline-block bg-theuyir-pink/10 text-theuyir-pink px-4 py-1 rounded-full text-sm font-medium mb-4">
                        STEP 2
                      </p>
                      <h3 className="text-2xl font-bold mb-4 text-theuyir-darkgrey">Needs Assessment & Posting</h3>
                      <p className="text-gray-600">
                        Verified beneficiaries and NGOs post specific needs for food, shelter, education, or healthcare with clear details and requirements.
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="relative fade-in-section opacity-0">
                  <div className="hidden md:block absolute left-1/2 top-0 w-8 h-8 bg-theuyir-pink rounded-full transform -translate-x-1/2 z-10 shadow-lg"></div>
                  <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                    <div className="md:text-right mb-8 md:mb-0">
                      <p className="inline-block bg-theuyir-pink/10 text-theuyir-pink px-4 py-1 rounded-full text-sm font-medium mb-4">
                        STEP 3
                      </p>
                      <h3 className="text-2xl font-bold mb-4 text-theuyir-darkgrey">Matching & Fulfillment</h3>
                      <p className="text-gray-600">
                        Donors and volunteers browse available needs and contribute funds, goods, or time based on their preferences and capabilities.
                      </p>
                    </div>
                    <div className="bg-theuyir-lightgrey rounded-xl overflow-hidden shadow-md">
                      <img 
                        src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                        alt="Matching Process" 
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Step 4 */}
                <div className="relative fade-in-section opacity-0">
                  <div className="hidden md:block absolute left-1/2 top-0 w-8 h-8 bg-theuyir-pink rounded-full transform -translate-x-1/2 z-10 shadow-lg"></div>
                  <div className="md:grid md:grid-cols-2 md:gap-12 items-center">
                    <div className="order-last md:order-first mb-8 md:mb-0">
                      <div className="bg-theuyir-lightgrey rounded-xl overflow-hidden shadow-md">
                        <img 
                          src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                          alt="Impact Tracking" 
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="inline-block bg-theuyir-pink/10 text-theuyir-pink px-4 py-1 rounded-full text-sm font-medium mb-4">
                        STEP 4
                      </p>
                      <h3 className="text-2xl font-bold mb-4 text-theuyir-darkgrey">Tracking & Reporting</h3>
                      <p className="text-gray-600">
                        Receive real-time updates on donation delivery and project implementation, ensuring complete transparency and accountability.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Partner with Us */}
        <section className="py-20 bg-theuyir-pink text-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="fade-in-section opacity-0">
                <p className="inline-block bg-white/10 text-white px-4 py-1 rounded-full text-sm font-medium mb-4">
                  PARTNER WITH US
                </p>
                <h2 className="text-3xl md:text-4xl font-bold mb-6">
                  Join Our Network of <span className="yellow-highlight">Change-Makers</span>
                </h2>
                <p className="text-white/80 mb-8 leading-relaxed">
                  Whether you're an NGO expanding your reach, a corporation implementing CSR initiatives, or a community organization seeking collaboration, our platform amplifies your impact.
                </p>
                
                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <div className="mr-3 p-2 bg-white/10 rounded-full flex-shrink-0">
                      <ArrowRight size={20} className="text-theuyir-yellow" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">NGO Partnerships</h3>
                      <p className="text-white/80">Register your organization to list services and connect with our network of donors and volunteers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-3 p-2 bg-white/10 rounded-full flex-shrink-0">
                      <ArrowRight size={20} className="text-theuyir-yellow" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">Corporate Collaborations</h3>
                      <p className="text-white/80">Engage your employees and fulfill CSR objectives through targeted giving and volunteer programs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-3 p-2 bg-white/10 rounded-full flex-shrink-0">
                      <ArrowRight size={20} className="text-theuyir-yellow" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2 text-lg">Community Initiatives</h3>
                      <p className="text-white/80">Develop focused solutions for specific local needs with our platform's technology and support</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative rounded-xl overflow-hidden shadow-xl fade-in-section opacity-0">
                <img 
                  src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Partnership" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <p className="font-semibold text-2xl mb-2">100+ Partners</p>
                    <p className="text-white/80">Creating lasting impact together</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Services;
