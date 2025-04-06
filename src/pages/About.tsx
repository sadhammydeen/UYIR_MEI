import React, { useEffect } from 'react';
import { ArrowRight, Users, Award, Heart, Calendar } from 'lucide-react';
import Button from '@/components/ui/button.tsx';
import Header from '@/components/layout/Header';
import PageContainer from '@/components/layout/PageContainer';
import SectionContainer from '@/components/layout/SectionContainer';
import { Link } from 'react-router-dom';

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
    <>
      <Header 
        title="Our Mission and Vision"
        description="Since 2025, Uyir Mei has been working to create a more equitable society by connecting those in need with those who can help."
        badge="ABOUT US"
      />
      
      <PageContainer>
        {/* Story Section */}
        <SectionContainer className="fade-in-section opacity-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
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
            </div>
            
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1509099652299-30938b0aeb63?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80" 
                alt="Our Story" 
                className="rounded-lg shadow-xl w-full"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg">
                <p className="font-bold text-theuyir-darkgrey">Founded</p>
                <p className="text-3xl font-bold text-theuyir-pink">2025</p>
              </div>
            </div>
          </div>
        </SectionContainer>
        
        {/* Values Section */}
        <SectionContainer 
          title="Principles That Guide Us"
          description="These core values inform every decision we make and every action we take in our mission to create positive change."
          className="bg-gray-50 -mx-4 px-4"
        >
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
        </SectionContainer>
      </PageContainer>
    </>
  );
};

export default About;
