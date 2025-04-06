import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Users, GraduationCap, Home } from 'lucide-react';
import Button from '@/components/ui/button.tsx';

const Hero = () => {
  const [imageError, setImageError] = useState(false);

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
    <div className="relative min-h-[85vh] flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 z-0 overflow-hidden"
        style={{ 
          backgroundImage: `url('/images/heroes/children-background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-20">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight font-display drop-shadow-lg">
            Every Child Deserves <span className="text-theuyir-yellow">A Brighter Tomorrow</span>
          </h1>
          <p className="text-base md:text-lg text-gray-200 mb-6 leading-relaxed font-sans drop-shadow-md">
            In the heart of India, countless children like these await a chance for a better future. Through education, healthcare, and community support, we can transform their lives from uncertainty to opportunity. Join us in making their dreams possible.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/give">
              <Button 
                variant="primary" 
                size="lg" 
                className="bg-theuyir-yellow text-black flex items-center group shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Make a Difference Today
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/services">
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white text-white flex items-center group shadow-lg"
              >
                Learn How We Help
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="bg-black/30 backdrop-blur-sm p-4 rounded-lg text-center group hover:bg-black/40 transition-all duration-300 border border-white/10">
              <Icon className="w-7 h-7 text-theuyir-yellow mx-auto mb-2 group-hover:scale-110 transition-transform duration-300" />
              <div className="text-xl font-bold text-white mb-1 font-display">{value}</div>
              <div className="text-xs text-gray-300 font-sans">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-theuyir-darkgrey to-transparent"></div>
    </div>
  );
};

export default Hero;
