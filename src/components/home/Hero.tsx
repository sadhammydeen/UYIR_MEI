import React from 'react';
import { Link } from 'react-router-dom';
import { useLoading } from '@/contexts/LoadingContext';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  const { setIsLoading, setLoadingText } = useLoading();

  const handleNavigation = (path: string) => {
    setIsLoading(true);
    setLoadingText('Loading page...');
    setTimeout(() => {
      setIsLoading(false);
      setLoadingText('Loading...');
    }, 800);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="/lovable-uploads/child-poverty.jpg" 
          alt="Child in need" 
          className="w-full h-full object-cover filter grayscale"
        />
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-12">
            <img 
              src="/lovable-uploads/b490f380-ac02-47bc-999e-0cb3e0c34afc.png"
              alt="Uyir Mei"
              className="h-32 w-auto drop-shadow-2xl"
            />
          </div>

          <div className="text-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-8 text-white drop-shadow-2xl">
              <span className="bg-gradient-to-r from-theuyir-yellow via-theuyir-pink to-theuyir-yellow bg-clip-text text-transparent">
                Making a Real Difference
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-12 leading-relaxed max-w-3xl mx-auto drop-shadow-lg">
              Join us in our mission to bridge the gap between those who need help and those who can provide it. Together, we can create lasting change in communities across India.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
              <Link
                to="/get-involved"
                onClick={() => handleNavigation('/get-involved')}
                className="bg-theuyir-yellow text-black px-10 py-5 rounded-lg font-semibold hover:brightness-110 transition-all duration-300 flex items-center group shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Get Involved Now
                <ArrowRight className="ml-3 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/about"
                onClick={() => handleNavigation('/about')}
                className="bg-white/10 text-white border-2 border-white/20 px-10 py-5 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 backdrop-blur-sm"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full">
        <div className="h-1 bg-gradient-to-r from-theuyir-yellow via-theuyir-pink to-theuyir-yellow"></div>
        <div className="h-24 bg-gradient-to-t from-theuyir-darkgrey to-transparent"></div>
      </div>
    </section>
  );
};

export default Hero;
