import React, { useEffect } from 'react';
import { Heart, ArrowRight, Calendar, Target, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import ImpactStories from '@/components/home/ImpactStories';
import Button from '@/components/ui/button.tsx';
import SectionContainer from '@/components/layout/SectionContainer';

// HelpSection component
const HelpSection = () => {
  return (
    <SectionContainer 
      className="bg-gray-50"
      title="Help Make a Difference"
      description="We believe every small act can transform lives. Join us in creating meaningful change for our communities."
      compact={true}
    >
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link to="/get-involved">
          <Button variant="primary" size="lg" className="flex items-center">
            Get Involved <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link to="/give">
          <Button variant="secondary" size="lg" className="flex items-center">
            Donate <Heart className="ml-2 h-4 w-4" />
          </Button>
        </Link>
        <Link to="/impact-tracker">
          <Button variant="outline" size="lg" className="flex items-center">
            See Our Impact <Target className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </SectionContainer>
  );
};

// VolunteerSection component
const VolunteerSection = () => {
  const volunteerFeatures = [
    {
      icon: Calendar,
      title: 'Flexible Scheduling',
      description: 'Choose when you volunteer based on your availability'
    },
    {
      icon: Users,
      title: 'Team Environment',
      description: 'Work with like-minded individuals who share your passion'
    },
    {
      icon: Award,
      title: 'Skill Development',
      description: 'Gain valuable experience while making a difference'
    }
  ];

  return (
    <SectionContainer className="bg-gray-50" compact={true}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="fade-in-section opacity-0">
          <p className="inline-block bg-theuyir-pink/10 text-theuyir-pink px-4 py-1 rounded-full text-sm font-medium mb-3">
            VOLUNTEER WITH US
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-4">
            Share Your Time and <span className="yellow-highlight">Skills</span>
          </h2>
          <p className="text-gray-600 mb-4">
            Whether you have a few hours or a regular commitment, your time and skills can make 
            a significant difference in someone's life. Join our volunteer network and help us 
            create a more equitable society.
          </p>
          
          <div className="space-y-3 mb-6">
            {volunteerFeatures.map((feature, index) => (
              <div key={index} className="flex items-start group">
                <div className="mr-3 p-2 bg-theuyir-yellow/20 rounded-full text-theuyir-darkgrey transition-all duration-300 group-hover:bg-theuyir-yellow">
                  <feature.icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <Link to="/get-involved">
            <Button variant="primary" size="lg" className="group flex items-center">
              Join as Volunteer
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
        
        <div className="relative fade-in-section opacity-0">
          <img 
            src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
            alt="Volunteers working together"
            className="rounded-xl shadow-lg"
          />
          <div className="absolute -bottom-4 -right-4 bg-white p-3 rounded-xl shadow-lg">
            <div className="flex items-center">
              <Heart className="text-theuyir-pink mr-2" />
              <div>
                <p className="font-semibold text-theuyir-darkgrey">500+ Volunteers</p>
                <p className="text-sm text-gray-600">Making a difference</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};

const Index = () => {
  useEffect(() => {
    // Animation observer
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
      <main>
        <Hero />
        <Features />
        <HelpSection />
        <ImpactStories />
        <VolunteerSection />
      </main>
    </div>
  );
};

export default Index;
