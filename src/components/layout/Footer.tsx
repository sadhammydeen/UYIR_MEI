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
    { path: '/impact-tracker', label: 'Impact Tracker' },
    { path: '/stories', label: 'Impact Stories' }
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook', color: 'bg-blue-500 hover:bg-blue-600' },
    { icon: Twitter, href: '#', label: 'Twitter', color: 'bg-sky-500 hover:bg-sky-600' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 hover:from-pink-600 hover:via-red-600 hover:to-yellow-600' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'bg-blue-700 hover:bg-blue-800' }
  ];

  const paymentMethods = [
    { name: 'Visa', logo: '/images/payment-methods/visa.png' },
    { name: 'Mastercard', logo: '/images/payment-methods/mastercard.png' },
    { name: 'UPI', logo: '/images/payment-methods/upi.png' },
    { name: 'Google Pay', logo: '/images/payment-methods/gpay.png' }
  ];

  return (
    <footer className="bg-gradient-to-b from-theuyir-darkgrey to-black text-white relative overflow-hidden">
      {/* Container */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* About */}
          <div>
            <div className="flex items-center mb-6">
              <img 
                src="/images/logos/uyir-mei-logo.png"
                alt="Uyir Mei"
                className="h-14 w-auto"
              />
              <div className="ml-3">
                <h3 className="text-xl font-semibold font-display">UYIR MEI</h3>
                <p className="text-xs text-theuyir-pink tracking-wider font-medium">CONNECTING COMPASSION</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed font-sans">
              In a world where suffering often goes unnoticed, your compassion becomes the lifeline for those in need. Together, we restore dignity and kindle hope where darkness once prevailed.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="p-2.5 rounded-full bg-theuyir-pink/10 hover:bg-theuyir-pink/20 text-theuyir-pink transition-all duration-300"
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-theuyir-pink/20 pb-2 font-display bg-gradient-to-r from-theuyir-yellow via-theuyir-pink to-theuyir-yellow bg-clip-text text-transparent">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={path} 
                    className="text-gray-300 hover:text-theuyir-pink transition-colors duration-300 flex items-center group font-sans"
                  >
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-theuyir-pink/20 pb-2 font-display bg-gradient-to-r from-theuyir-yellow via-theuyir-pink to-theuyir-yellow bg-clip-text text-transparent">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={18} className="mr-3 mt-1" />
                <span className="text-gray-300 leading-tight font-sans">123 NGO Street, Chennai, Tamil Nadu, India - 600001</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="mr-3" />
                <a href="tel:+919876543210" className="text-gray-300 hover:text-theuyir-pink transition-colors duration-300 font-sans">
                  +91 9876543210
                </a>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="mr-3" />
                <a href="mailto:contact@uyirmei.org" className="text-gray-300 hover:text-theuyir-pink transition-colors duration-300 font-sans">
                  contact@uyirmei.org
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6 border-b border-theuyir-pink/20 pb-2 font-display bg-gradient-to-r from-theuyir-yellow via-theuyir-pink to-theuyir-yellow bg-clip-text text-transparent">Stay Connected</h3>
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
                className="bg-theuyir-pink text-white px-4 py-3 rounded-r-lg hover:brightness-95 font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px] font-sans"
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
          <h3 className="text-lg font-semibold mb-4 text-center font-display bg-gradient-to-r from-theuyir-yellow via-theuyir-pink to-theuyir-yellow bg-clip-text text-transparent">Secure Payment Methods</h3>
          <PaymentMethodLogos showBorder={false} title="" logoSize="sm" />
        </div>

        <div className="mt-8 pt-8 text-center text-gray-400">
          <p className="text-sm font-sans">© 2025 Uyir Mei. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
