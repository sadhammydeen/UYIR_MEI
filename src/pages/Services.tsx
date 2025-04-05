import React, { useEffect } from 'react';
import { ArrowRight, BookOpen, Utensils, Home, Stethoscope, GraduationCap, LifeBuoy } from 'lucide-react';
import Button from '@/components/ui/button';

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
        <h4 className="font-semibold mb-3 text-theuyir-darkgrey">How we help:</h4>
        <ul className="space-y-2">
          <li className="flex items-start">
            <ArrowRight size={16} className="mr-2 mt-1 text-theuyir-pink" />
            <span className="text-gray-600">Direct aid to beneficiaries</span>
          </li>
          <li className="flex items-start">
            <ArrowRight size={16} className="mr-2 mt-1 text-theuyir-pink" />
            <span className="text-gray-600">NGO partnerships</span>
          </li>
          <li className="flex items-start">
            <ArrowRight size={16} className="mr-2 mt-1 text-theuyir-pink" />
            <span className="text-gray-600">Volunteer coordination</span>
          </li>
        </ul>
        <Button variant="primary" size="md" className="mt-6 w-full group">
          Learn More <ArrowRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
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
                WHAT WE DO
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Our <span className="yellow-highlight">Services</span> and Programs
              </h1>
              <p className="text-white/80 text-lg mb-8">
                We provide a comprehensive suite of services designed to address the most pressing needs in our communities, connecting resources with those who need them most.
              </p>
            </div>
          </div>
        </section>
        
        {/* Services Grid */}
        <section className="py-20 bg-theuyir-lightgrey">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 fade-in-section opacity-0">
              <p className="inline-block bg-theuyir-pink/10 text-theuyir-pink px-4 py-1 rounded-full text-sm font-medium mb-4">
                OUR FOCUS AREAS
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-4">
                How We're <span className="yellow-highlight">Making a Difference</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Through our integrated platform, we connect beneficiaries with the resources they need while empowering donors and volunteers to contribute meaningfully.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ServiceCard 
                icon={<Utensils size={32} className="text-white" />}
                title="Food Security"
                description="Ensuring access to nutritious meals for all, with a focus on children, elderly, and vulnerable populations."
                color="bg-gradient-to-br from-amber-500 to-amber-600"
              />
              
              <ServiceCard 
                icon={<Home size={32} className="text-white" />}
                title="Shelter & Housing"
                description="Providing safe, clean shelter solutions for the homeless and those displaced by poverty or disaster."
                color="bg-gradient-to-br from-emerald-500 to-emerald-600"
              />
              
              <ServiceCard 
                icon={<GraduationCap size={32} className="text-white" />}
                title="Education Support"
                description="Facilitating access to quality education through scholarships, supplies, and educational resources."
                color="bg-gradient-to-br from-blue-500 to-blue-600"
              />
              
              <ServiceCard 
                icon={<Stethoscope size={32} className="text-white" />}
                title="Healthcare Access"
                description="Connecting individuals with medical care, medications, and health education services."
                color="bg-gradient-to-br from-red-500 to-red-600"
              />
              
              <ServiceCard 
                icon={<BookOpen size={32} className="text-white" />}
                title="Skill Development"
                description="Offering training programs to build employable skills and create pathways to self-sufficiency."
                color="bg-gradient-to-br from-purple-500 to-purple-600"
              />
              
              <ServiceCard 
                icon={<LifeBuoy size={32} className="text-white" />}
                title="Emergency Relief"
                description="Providing rapid response aid during natural disasters, health crises, and other emergencies."
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
                THE PROCESS
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-4">
                How It <span className="yellow-highlight">Works</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our streamlined process ensures that help reaches those who need it efficiently and transparently.
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
                        Users register as beneficiaries, donors, volunteers, or NGOs. Our team verifies credentials to ensure trust and security.
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
                        Verified beneficiaries or NGOs post specific needs, from food and shelter to education and healthcare, with required details.
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
                        Donors and volunteers browse available needs and contribute funds, goods, or time according to their preferences and capabilities.
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
                        Our platform provides real-time updates on donation delivery and project implementation, ensuring complete transparency and accountability.
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
                <p className="text-white/80 mb-6 leading-relaxed">
                  Whether you're an NGO looking to expand your reach, a corporation interested in CSR initiatives, or a community organization seeking to collaborate, we welcome partnerships that amplify our collective impact.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="mr-3 p-2 bg-white/10 rounded-full">
                      <ArrowRight size={20} className="text-theuyir-yellow" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">NGO Partnerships</h3>
                      <p className="text-white/80">Register your organization to list services and access our network of donors and volunteers</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-3 p-2 bg-white/10 rounded-full">
                      <ArrowRight size={20} className="text-theuyir-yellow" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Corporate Collaborations</h3>
                      <p className="text-white/80">Engage your employees and fulfill CSR objectives through structured giving programs</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="mr-3 p-2 bg-white/10 rounded-full">
                      <ArrowRight size={20} className="text-theuyir-yellow" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Community Initiatives</h3>
                      <p className="text-white/80">Work with us to develop localized solutions for specific community needs</p>
                    </div>
                  </div>
                </div>
                
                <div className="text-center mt-12 fade-in-section opacity-0">
                  <p className="text-white/80 max-w-2xl mx-auto mb-10">
                    Combining our platform's reach with your organization's expertise, we can create a greater impact for beneficiaries across communities.
                  </p>
                  
                  <Button variant="primary" size="lg" className="group">
                    Become a Partner <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
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
                    <p className="text-white/80">Working together for a better future</p>
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
