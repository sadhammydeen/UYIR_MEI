import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, Building2, ArrowRight, GraduationCap, Home, Stethoscope } from 'lucide-react';
import SectionContainer from '@/components/layout/SectionContainer';

const Features = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Education for All",
      description: "Every child deserves quality education. We provide scholarships, school supplies, and support to help children break free from the cycle of poverty.",
      link: "/services",
      action: "Support Education",
      color: "bg-gradient-to-br from-blue-500 to-purple-600",
      iconColor: "text-blue-300"
    },
    {
      icon: Stethoscope,
      title: "Healthcare Access",
      description: "Health is a fundamental right. We organize medical camps, provide essential medicines, and ensure healthcare reaches the most vulnerable.",
      link: "/services",
      action: "Support Healthcare",
      color: "bg-gradient-to-br from-green-500 to-teal-600",
      iconColor: "text-green-300"
    },
    {
      icon: Home,
      title: "Safe Shelter",
      description: "A safe home is the foundation of a better life. We help families rebuild their lives with dignity through our housing initiatives.",
      link: "/give",
      action: "Support Housing",
      color: "bg-gradient-to-br from-orange-500 to-amber-600",
      iconColor: "text-orange-300"
    },
    {
      icon: Users,
      title: "Community Development",
      description: "Strong communities create lasting change. Join us in building sustainable solutions that empower entire communities to thrive.",
      link: "/get-involved",
      action: "Join Our Mission",
      color: "bg-gradient-to-br from-pink-500 to-rose-600",
      iconColor: "text-pink-300"
    }
  ];

  return (
    <section className="relative bg-gradient-to-b from-theuyir-darkgrey to-black text-white py-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.15]"></div>
      
      {/* Colorful circles decorations */}
      <div className="absolute top-10 left-10 w-32 h-32 rounded-full bg-blue-600/20 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 rounded-full bg-pink-600/20 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 rounded-full bg-purple-600/10 blur-3xl"></div>

      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-theuyir-yellow via-theuyir-pink to-theuyir-yellow bg-clip-text text-transparent font-display">
            Our Impact Areas
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed font-sans">
            We believe in creating lasting change through comprehensive support systems. Our initiatives touch every aspect of life, from education to healthcare, ensuring no one is left behind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`${feature.color} rounded-lg p-5 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-lg group relative overflow-hidden`}
            >
              <div className="absolute inset-0 opacity-10 bg-pattern-dots"></div>
              <div className="relative z-10">
                <div className="mb-3 bg-white/20 p-3 rounded-full w-fit">
                  <feature.icon className={`w-10 h-10 ${feature.iconColor} transition-transform duration-300 group-hover:scale-110`} />
                </div>
                <h3 className="text-lg font-semibold mb-2 font-display text-white">{feature.title}</h3>
                <p className="text-white/90 mb-4 leading-relaxed font-sans text-sm">{feature.description}</p>
                <Link
                  to={feature.link}
                  className="inline-flex items-center text-white hover:text-white/80 transition-colors duration-300 font-medium group/link text-sm bg-black/30 px-3 py-1.5 rounded-full"
                >
                  {feature.action}
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-theuyir-yellow via-theuyir-pink to-theuyir-yellow"></div>
    </section>
  );
};

export default Features;
