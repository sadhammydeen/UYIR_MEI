import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, ArrowRight, Loader2 } from 'lucide-react';
import { useLoading } from '@/contexts/LoadingContext';
import PaymentMethodLogos from '@/components/shared/PaymentMethodLogos';

const Footer = () => {
  const { setIsLoading, setLoadingText } = useLoading();
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [email, setEmail] = useState('');

  const handleNavigation = (path: string) => {
    setIsLoading(true);
    setLoadingText('Loading page...');
    setTimeout(() => {
      setIsLoading(false);
      setLoadingText('Loading...');
    }, 800);
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubscribing(false);
    setEmail('');
  };

  const quickLinks = [
    { path: '/about', label: 'About Us' },
    { path: '/services', label: 'What We Do' },
    { path: '/get-involved', label: 'Get Involved' },
    { path: '/give', label: 'Ways to Give' },
    { path: '/stories', label: 'Impact Stories' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' }
  ];

  const paymentMethods = [
    { name: 'Visa', logo: '/images/payment-methods/visa.png' },
    { name: 'Mastercard', logo: '/images/payment-methods/mastercard.png' },
    { name: 'UPI', logo: '/images/payment-methods/upi.png' },
    { name: 'Google Pay', logo: '/images/payment-methods/gpay.png' }
  ];

  return (
    <footer className="bg-theuyir-darkgrey text-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-theuyir-yellow via-theuyir-pink to-theuyir-yellow"></div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div className="relative z-10">
            <div className="flex items-center mb-6 group">
              <img 
                src="/images/logos/uyir-mei-logo.png"
                alt="Uyir Mei"
                className="h-16 w-auto transition-transform duration-300 group-hover:scale-105"
              />
              <div className="ml-3">
                <h3 className="text-xl font-semibold font-display">UYIR MEI</h3>
                <p className="text-xs text-theuyir-yellow tracking-wider font-medium">CONNECTING EMPATHY</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed font-sans">
              Since 2010, we've been working tirelessly to create lasting change in communities across India. Every donation, every volunteer hour, and every story of hope brings us closer to our vision of a more equitable society.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="bg-white/10 p-2 rounded-full text-white hover:bg-theuyir-yellow hover:text-theuyir-darkgrey transition-all duration-300 transform hover:scale-110"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-theuyir-yellow pb-2 font-display">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path} 
                    onClick={() => handleNavigation(path)}
                    className="text-gray-300 hover:text-theuyir-yellow transition-colors duration-300 flex items-center group font-sans"
                  >
                    <ArrowRight size={14} className="mr-2 transition-transform duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-theuyir-yellow pb-2 font-display">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <MapPin size={18} className="mr-3 mt-1 text-theuyir-yellow group-hover:animate-pulse" />
                <span className="text-gray-300 leading-tight font-sans">123 NGO Street, Chennai, Tamil Nadu, India - 600001</span>
              </li>
              <li className="flex items-center group">
                <Phone size={18} className="mr-3 text-theuyir-yellow group-hover:animate-pulse" />
                <a href="tel:+919876543210" className="text-gray-300 hover:text-theuyir-yellow transition-colors duration-300 font-sans">
                  +91 9876543210
                </a>
              </li>
              <li className="flex items-center group">
                <Mail size={18} className="mr-3 text-theuyir-yellow group-hover:animate-pulse" />
                <a href="mailto:contact@uyirmei.org" className="text-gray-300 hover:text-theuyir-yellow transition-colors duration-300 font-sans">
                  contact@uyirmei.org
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-theuyir-yellow pb-2 font-display">Stay Connected</h3>
            <p className="text-gray-300 mb-4 leading-relaxed font-sans">Subscribe to our newsletter for updates on our initiatives and impact stories.</p>
            <form onSubmit={handleSubscribe} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="px-4 py-3 w-full rounded-l-lg focus:outline-none text-black bg-white focus:ring-2 focus:ring-theuyir-yellow font-sans"
                required
                aria-label="Email address"
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="bg-theuyir-yellow text-black px-4 py-3 rounded-r-lg hover:brightness-95 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px] font-sans"
              >
                {isSubscribing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  'Subscribe'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mt-12 pt-8 border-t border-gray-700/50">
          <h3 className="text-lg font-semibold mb-4 text-center font-display">Secure Payment Methods</h3>
          <PaymentMethodLogos showBorder={false} title="" logoSize="sm" />
        </div>

        <div className="border-t border-gray-700/50 mt-8 pt-8 text-center text-gray-400">
          <p className="text-sm font-sans">© 2025 Uyir Mei. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
