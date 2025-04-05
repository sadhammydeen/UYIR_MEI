import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, GraduationCap, Home } from 'lucide-react';
import { useLoading } from '@/contexts/LoadingContext';

const Hero = () => {
  const { setIsLoading, setLoadingText } = useLoading();
  const [imageError, setImageError] = useState(false);

  const handleNavigation = (path: string) => {
    setIsLoading(true);
    setLoadingText('Loading page...');
    setTimeout(() => {
      setIsLoading(false);
      setLoadingText('Loading...');
    }, 800);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('Image failed to load:', e);
    setImageError(true);
  };

  const stats = [
    { icon: Users, value: '50,000+', label: 'Lives Transformed' },
    { icon: GraduationCap, value: '15,000+', label: 'Children Educated' },
    { icon: Home, value: '1,000+', label: 'Families Supported' },
    { icon: Heart, value: '25+', label: 'Communities Served' }
  ];

  return (
    <div className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        {!imageError ? (
          <div className="absolute inset-0">
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(src/resources/bg.jpeg)`,
                filter: 'brightness(0.8) contrast(1.1)',
              }}
            ></div>
            {/* Gradient overlays for better text contrast */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-theuyir-darkgrey to-theuyir-yellow/20"></div>
        )}
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight font-display drop-shadow-lg">
            Every Child Deserves <span className="text-theuyir-yellow">A Brighter Tomorrow</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 leading-relaxed font-sans drop-shadow-md">
            In the heart of India, countless children like these await a chance for a better future. Through education, healthcare, and community support, we can transform their lives from uncertainty to opportunity. Join us in making their dreams possible.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/give"
              onClick={() => handleNavigation('/give')}
              className="bg-theuyir-yellow text-black px-8 py-4 rounded-lg font-semibold hover:brightness-110 transition-all duration-300 flex items-center group font-sans shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Make a Difference Today
              <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
            <Link
              to="/about"
              onClick={() => handleNavigation('/about')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 flex items-center group font-sans shadow-lg"
            >
              Learn How We Help
              <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-black/30 backdrop-blur-sm p-6 rounded-lg text-center group hover:bg-black/40 transition-all duration-300 border border-white/10">
              <Icon className="w-8 h-8 text-theuyir-yellow mx-auto mb-3 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-2xl font-bold text-white mb-1 font-display">{value}</div>
              <div className="text-sm text-gray-300 font-sans">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-theuyir-darkgrey to-transparent"></div>
    </div>
  );
};

export default Hero;
