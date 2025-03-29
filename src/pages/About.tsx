import React, { useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { ArrowRight, Users, Award, Heart, Calendar, Twitter, Linkedin, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
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
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative py-20 bg-theuyir-darkgrey text-white overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-20">
            <img
              src="/lovable-uploads/6baa9d06-e666-4b58-be83-ef94e87d1ddb.png"
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center fade-in-section opacity-0">
              <p className="inline-block bg-theuyir-yellow/20 text-theuyir-yellow px-4 py-1 rounded-full text-sm font-medium mb-4">
                ABOUT US
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Our <span className="yellow-highlight">Mission</span> and Vision
              </h1>
              <p className="text-white/80 text-lg mb-8">
                Since 2023, Uyir Mei has been working to create a more equitable society by connecting those in need with those who can help, through innovative technology and compassionate action.
              </p>
            </div>
          </div>
        </section>
        
        {/* Story Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="fade-in-section opacity-0">
                <p className="inline-block bg-theuyir-pink/10 text-theuyir-pink px-4 py-1 rounded-full text-sm font-medium mb-4">
                  OUR STORY
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-6">
                  How We <span className="yellow-highlight">Started</span>
                </h2>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Uyir Mei began with a simple observation: in a world of abundance, many still lack access to basic necessities. Despite numerous charitable organizations, there was a significant gap in coordinating resources efficiently.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our founder, witnessing both the struggles of underprivileged communities and the willingness of people to help, envisioned a platform that could bridge this divide. Thus, Uyir Mei was born—a technology-driven solution that connects beneficiaries directly with donors, volunteers, and NGOs.
                </p>
                <Button variant="secondary" size="lg" className="group">
                  Meet Our Team <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
              
              <div className="relative fade-in-section opacity-0">
                <img 
                  src="https://images.unsplash.com/photo-1509099652299-30938b0aeb63?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
                  alt="Our Story" 
                  className="rounded-lg shadow-xl w-full"
                />
                <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                  <p className="font-bold text-theuyir-darkgrey">Founded</p>
                  <p className="text-3xl font-bold text-theuyir-pink">2023</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-20 bg-theuyir-lightgrey">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 fade-in-section opacity-0">
              <p className="inline-block bg-theuyir-yellow/20 text-theuyir-darkgrey px-4 py-1 rounded-full text-sm font-medium mb-4">
                OUR VALUES
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-4">
                Principles That <span className="yellow-highlight">Guide</span> Us
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                These core values inform every decision we make and every action we take in our mission to create positive change.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 fade-in-section opacity-0">
                <div className="bg-theuyir-yellow/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <Heart className="text-theuyir-darkgrey" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-theuyir-darkgrey">Compassion</h3>
                <p className="text-gray-600">We approach our work with empathy and understanding, recognizing the dignity of every individual we serve.</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 fade-in-section opacity-0" style={{ animationDelay: '0.2s' }}>
                <div className="bg-theuyir-yellow/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <Award className="text-theuyir-darkgrey" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-theuyir-darkgrey">Integrity</h3>
                <p className="text-gray-600">We operate with complete transparency, accountability, and honesty in all our actions and communications.</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 fade-in-section opacity-0" style={{ animationDelay: '0.4s' }}>
                <div className="bg-theuyir-yellow/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <Users className="text-theuyir-darkgrey" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-theuyir-darkgrey">Collaboration</h3>
                <p className="text-gray-600">We believe in the power of partnership and work together with communities, NGOs, and individuals.</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 fade-in-section opacity-0" style={{ animationDelay: '0.6s' }}>
                <div className="bg-theuyir-yellow/10 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-6">
                  <Calendar className="text-theuyir-darkgrey" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-theuyir-darkgrey">Sustainability</h3>
                <p className="text-gray-600">We design our programs and interventions to create lasting change and self-sufficiency in communities.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 fade-in-section opacity-0">
              <p className="inline-block bg-theuyir-pink/10 text-theuyir-pink px-4 py-1 rounded-full text-sm font-medium mb-4">
                OUR TEAM
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-4">
                Meet The <span className="yellow-highlight">Team</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our dedicated team brings diverse expertise and a shared passion for creating positive social impact.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md group hover:shadow-lg transition-all duration-300 fade-in-section opacity-0">
                <div className="relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Team Member" 
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex space-x-3">
                      <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-theuyir-yellow hover:text-theuyir-darkgrey transition-colors duration-300">
                        <Twitter size={16} />
                      </a>
                      <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-theuyir-yellow hover:text-theuyir-darkgrey transition-colors duration-300">
                        <Linkedin size={16} />
                      </a>
                      <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-theuyir-yellow hover:text-theuyir-darkgrey transition-colors duration-300">
                        <Mail size={16} />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-theuyir-darkgrey">Rajesh Kumar</h3>
                  <p className="text-theuyir-pink font-medium mb-3">Founder & CEO</p>
                  <p className="text-gray-600">Former tech executive with 15+ years of experience, dedicated to leveraging technology for social good.</p>
                </div>
              </div>
              
              {/* Team Member 2 */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md group hover:shadow-lg transition-all duration-300 fade-in-section opacity-0" style={{ animationDelay: '0.2s' }}>
                <div className="relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Team Member" 
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex space-x-3">
                      <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-theuyir-yellow hover:text-theuyir-darkgrey transition-colors duration-300">
                        <Twitter size={16} />
                      </a>
                      <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-theuyir-yellow hover:text-theuyir-darkgrey transition-colors duration-300">
                        <Linkedin size={16} />
                      </a>
                      <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-theuyir-yellow hover:text-theuyir-darkgrey transition-colors duration-300">
                        <Mail size={16} />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-theuyir-darkgrey">Priya Sharma</h3>
                  <p className="text-theuyir-pink font-medium mb-3">Operations Director</p>
                  <p className="text-gray-600">NGO management specialist with expertise in program development and community engagement.</p>
                </div>
              </div>
              
              {/* Team Member 3 */}
              <div className="bg-white rounded-xl overflow-hidden shadow-md group hover:shadow-lg transition-all duration-300 fade-in-section opacity-0" style={{ animationDelay: '0.4s' }}>
                <div className="relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Team Member" 
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="flex space-x-3">
                      <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-theuyir-yellow hover:text-theuyir-darkgrey transition-colors duration-300">
                        <Twitter size={16} />
                      </a>
                      <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-theuyir-yellow hover:text-theuyir-darkgrey transition-colors duration-300">
                        <Linkedin size={16} />
                      </a>
                      <a href="#" className="bg-white/20 p-2 rounded-full hover:bg-theuyir-yellow hover:text-theuyir-darkgrey transition-colors duration-300">
                        <Mail size={16} />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1 text-theuyir-darkgrey">Arjun Nair</h3>
                  <p className="text-theuyir-pink font-medium mb-3">Technology Lead</p>
                  <p className="text-gray-600">Full-stack developer with a passion for creating intuitive, accessible digital platforms for social impact.</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12 fade-in-section opacity-0">
              <Button variant="outline" size="lg" className="border-theuyir-darkgrey text-theuyir-darkgrey">
                View Full Team
              </Button>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-theuyir-pink text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 fade-in-section opacity-0">
              Ready to Join Our <span className="yellow-highlight">Mission</span>?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-10 fade-in-section opacity-0" style={{ animationDelay: '0.2s' }}>
              Whether you want to volunteer, donate, or partner with us as an NGO, there are many ways to get involved and make a difference.
            </p>
            <div className="flex flex-wrap justify-center gap-4 fade-in-section opacity-0" style={{ animationDelay: '0.4s' }}>
              <Button variant="default" size="lg">
                Get Involved
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

export default About;
