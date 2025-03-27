import React from 'react';
import { Link } from 'react-router-dom';
import { useLoading } from '@/contexts/LoadingContext';
import { Heart, Users, Building2, HandHeart, ArrowRight } from 'lucide-react';

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
      icon: Heart,
      title: "For Those in Need",
      description: "Find support and resources through our network of verified NGOs and volunteers.",
      link: "/services",
      action: "Get Help"
    },
    {
      icon: Building2,
      title: "For NGOs",
      description: "Join our platform to expand your reach and connect with donors and volunteers.",
      link: "/services",
      action: "Partner With Us"
    },
    {
      icon: HandHeart,
      title: "For Donors",
      description: "Make transparent and impactful donations to verified causes and organizations.",
      link: "/give",
      action: "Make a Difference"
    },
    {
      icon: Users,
      title: "For Volunteers",
      description: "Contribute your time and skills to meaningful projects in your community.",
      link: "/get-involved",
      action: "Join Our Team"
    }
  ];

  return (
    <section className="relative bg-theuyir-darkgrey text-white py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.15]"></div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-theuyir-yellow via-theuyir-pink to-theuyir-yellow bg-clip-text text-transparent">
            How We Make a Difference
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Our platform connects different stakeholders in the social impact ecosystem, making it easier for everyone to contribute to positive change.
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
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-300 mb-6 leading-relaxed">{feature.description}</p>
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
            Learn more about our approach
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
