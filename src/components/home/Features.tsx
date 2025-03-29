import React from 'react';
import { Link } from 'react-router-dom';
import { useLoading } from '@/contexts/LoadingContext';
import { Heart, Users, Building2, HandHeart, ArrowRight, GraduationCap, Home, Stethoscope } from 'lucide-react';

const Features = () => {
  const { setIsLoading, setLoadingText } = useLoading();

  const handleNavigation = (path: string) => {
    setIsLoading(true);
    setLoadingText('Loading page...');
    setTimeout(() => {
      setIsLoading(false);
      setLoadingText('Loading...');
    }, 800);
  };

  const features = [
    {
      icon: GraduationCap,
      title: "Education for All",
      description: "Every child deserves quality education. We provide scholarships, school supplies, and support to help children break free from the cycle of poverty.",
      link: "/services",
      action: "Support Education"
    },
    {
      icon: Stethoscope,
      title: "Healthcare Access",
      description: "Health is a fundamental right. We organize medical camps, provide essential medicines, and ensure healthcare reaches the most vulnerable.",
      link: "/services",
      action: "Support Healthcare"
    },
    {
      icon: Home,
      title: "Safe Shelter",
      description: "A safe home is the foundation of a better life. We help families rebuild their lives with dignity through our housing initiatives.",
      link: "/give",
      action: "Support Housing"
    },
    {
      icon: Users,
      title: "Community Development",
      description: "Strong communities create lasting change. Join us in building sustainable solutions that empower entire communities to thrive.",
      link: "/get-involved",
      action: "Join Our Mission"
    }
  ];

  return (
    <section className="relative bg-theuyir-darkgrey text-white py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.15]"></div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-theuyir-yellow via-theuyir-pink to-theuyir-yellow bg-clip-text text-transparent font-display">
            Our Impact Areas
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed font-sans">
            We believe in creating lasting change through comprehensive support systems. Our initiatives touch every aspect of life, from education to healthcare, ensuring no one is left behind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm rounded-lg p-6 transition-all duration-300 hover:bg-white/10 group"
            >
              <div className="mb-4">
                <feature.icon className="w-12 h-12 text-theuyir-yellow transition-transform duration-300 group-hover:scale-110" />
              </div>
              <h3 className="text-xl font-semibold mb-3 font-display">{feature.title}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed font-sans">{feature.description}</p>
              <Link
                to={feature.link}
                onClick={() => handleNavigation(feature.link)}
                className="inline-flex items-center text-theuyir-yellow hover:text-theuyir-pink transition-colors duration-300 font-medium group/link"
              >
                {feature.action}
                <ArrowRight className="ml-2 transition-transform duration-300 group-hover/link:translate-x-1" />
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <Link
            to="/about"
            onClick={() => handleNavigation('/about')}
            className="inline-flex items-center text-theuyir-yellow hover:text-theuyir-pink transition-colors duration-300 font-medium group"
          >
            Learn about our impact
            <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-theuyir-yellow via-theuyir-pink to-theuyir-yellow"></div>
    </section>
  );
};

export default Features;
