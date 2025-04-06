import React, { useEffect } from 'react';
import { Heart, ArrowRight, Calendar, Target, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import ImpactStories from '@/components/home/ImpactStories';
import Button from '@/components/ui/Button.tsx';
import { useLoading } from '@/contexts/LoadingContext';

const Index = () => {
  const { setIsLoading, setLoadingText } = useLoading();

  useEffect(() => {
    // Fade in elements as they come into view
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

  const handleNavigation = (path: string) => {
    setIsLoading(true);
    setLoadingText('Loading page...');
    setTimeout(() => {
      setIsLoading(false);
      setLoadingText('Loading...');
    }, 800);
  };

  const needsCards = [
    {
      category: 'Education',
      title: 'School Supplies for Children',
      description: 'Help provide school supplies for 50 underprivileged children in Chennai.',
      image: 'https://images.unsplash.com/photo-1594708767771-a5e9d3012f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      alt: 'Education Support',
      current: 25000,
      target: 50000,
      delay: 0
    },
    {
      category: 'Food',
      title: 'Daily Meals for Elderly',
      description: 'Support our daily meal program for 100 elderly people without families.',
      image: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      alt: 'Food Distribution',
      current: 35000,
      target: 80000,
      delay: 0.2
    },
    {
      category: 'Healthcare',
      title: 'Medical Camp in Rural Areas',
      description: 'Help us organize a medical camp to serve 5 rural villages in Tamil Nadu.',
      image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
      alt: 'Medical Camp',
      current: 75000,
      target: 100000,
      delay: 0.4
    }
  ];

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
    <div className="flex flex-col">
      <main>
        <Hero />
        <Features />
        
        {/* Needs Section 
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 fade-in-section opacity-0">
              <p className="inline-block bg-theuyir-yellow/10 text-theuyir-darkgrey px-4 py-1 rounded-full text-sm font-medium mb-4">
                CURRENT NEEDS
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-4">
                Help Make a <span className="yellow-highlight">Difference</span> Today
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Browse through the current needs and find meaningful ways to contribute, 
                whether through donations, volunteering, or fulfilling specific requests.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {needsCards.map((card, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 transition-all duration-300 hover:shadow-lg fade-in-section opacity-0 hover:scale-[1.02]"
                  style={{ animationDelay: `${card.delay}s` }}
                >
                  <div className="relative">
                    <img 
                      src={card.image}
                      alt={card.alt}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-0 left-0 bg-theuyir-yellow text-black font-medium px-3 py-1 m-3 rounded-md text-sm">
                      {card.category}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2 text-theuyir-darkgrey">{card.title}</h3>
                    <p className="text-gray-600 mb-4">{card.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">Progress</span>
                        <span className="text-theuyir-pink font-medium">
                          ₹{card.current.toLocaleString()} / ₹{card.target.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-theuyir-pink h-2 rounded-full transition-all duration-1000" 
                          style={{ width: `${(card.current / card.target) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <Button variant="primary" size="md" className="w-full">
                      Donate Now
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12 fade-in-section opacity-0">
              <Link to="/give" onClick={() => handleNavigation('/give')}>
                <Button variant="secondary" size="lg" className="group">
                  View All Needs 
                  <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>*/}

        {/* Help Make a Difference Section */}
        <section className="py-24 bg-gray-50 text-center fade-in-section">
          <h2 className="text-3xl font-bold mb-4">Help Make a Difference</h2>
          <p className="max-w-2xl mx-auto mb-8">
            We believe every small act can transform lives. Join us in creating meaningful change for our communities.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/get-involved">
              <button className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition-colors">
                Get Involved
              </button>
            </Link>
            <Link to="/give">
              <button className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition-colors">
                Give Support
              </button>
            </Link>
            <Link to="/needs-donate">
              <button className="bg-amber-600 text-white px-6 py-2 rounded shadow hover:bg-amber-700 transition-colors">
                Donate to Needs
              </button>
            </Link>
            <Link to="/impact-tracker">
              <button className="bg-purple-600 text-white px-6 py-2 rounded shadow hover:bg-purple-700 transition-colors">
                See Our Impact
              </button>
            </Link>
          </div>
        </section>
        
        <ImpactStories />
        
        {/* Volunteer Section */}
        <section className="py-20 bg-theuyir-lightgrey">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="fade-in-section opacity-0">
                <p className="inline-block bg-theuyir-pink/10 text-theuyir-pink px-4 py-1 rounded-full text-sm font-medium mb-4">
                  VOLUNTEER WITH US
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-6">
                  Share Your Time and <span className="yellow-highlight">Skills</span>
                </h2>
                <p className="text-gray-600 mb-6">
                  Whether you have a few hours or a regular commitment, your time and skills can make 
                  a significant difference in someone's life. Join our volunteer network and help us 
                  create a more equitable society.
                </p>
                
                <div className="space-y-4 mb-8">
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
                
                <Link to="/get-involved" onClick={() => handleNavigation('/get-involved')}>
                  <Button variant="primary" size="lg" className="group">
                    Join as Volunteer
                    <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
              
              <div className="relative fade-in-section opacity-0">
                <img 
                  src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Volunteers working together"
                  className="rounded-xl shadow-lg"
                />
                <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg">
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
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
