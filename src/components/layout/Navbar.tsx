import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Search, User, LogOut, ChevronDown, 
  LayoutDashboard, Settings, Heart, MessageSquare, Building2, Users, FileText
} from 'lucide-react';
import Button from '@/components/ui/button';
import { useLoading } from '@/contexts/LoadingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Chatbot from '@/components/chat/Chatbot';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const { setIsLoading, setLoadingText } = useLoading();
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    if (location.pathname !== path) {
      setIsLoading(true);
      setLoadingText('Loading page...');
      setTimeout(() => {
        setIsLoading(false);
        setLoadingText('Loading...');
      }, 800);
    }
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleChatbot = () => {
    setChatbotOpen(!chatbotOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase() || 'U';
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' : 'bg-transparent py-4'
        }`}
      >
        <div className="container mx-auto px-4 flex justify-between items-center max-w-[100vw] overflow-x-hidden">
          <Link 
            to="/" 
            className="flex items-center transition-transform duration-300 hover:scale-105"
            onClick={() => handleNavigation('/')}
          >
            <img 
              src="/images/logos/uyir-mei-logo.png" 
              alt="Uyir Mei" 
              className="h-12 md:h-16 w-auto transition-all duration-300"
            />
            <div className="ml-2 md:ml-3">
              <span className="block text-xl md:text-2xl font-bold text-theuyir-darkgrey tracking-wide">UYIR MEI</span>
              <span className="text-[10px] md:text-xs text-theuyir-pink tracking-wider font-medium">CONNECTING COMPASSION</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
            {[
              { path: '/about', label: 'ABOUT US' },
              { path: '/services', label: 'WHAT WE DO' },
              { path: '/get-involved', label: 'GET INVOLVED' },
              { path: '/give', label: 'WAYS TO GIVE' },
              { path: '/needs-donate', label: 'DONATE TO NEEDS' },
              { path: '/impact-tracker', label: 'IMPACT' },
              { path: '/stories', label: 'STORIES' }
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path} 
                className={`nav-link relative overflow-hidden group text-sm lg:text-base flex items-center ${location.pathname === path ? 'text-theuyir-pink' : ''}`}
                onClick={() => handleNavigation(path)}
              >
                <span className="relative z-10">{label}</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-theuyir-yellow transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              </Link>
            ))}
            
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center space-x-2 focus:outline-none transition-all duration-300 hover:scale-105">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                      <AvatarFallback className="bg-theuyir-yellow text-theuyir-darkgrey text-xs">
                        {getInitials(user?.name || 'User')}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="h-4 w-4 text-theuyir-darkgrey" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5 text-sm font-medium text-theuyir-darkgrey">
                    {user?.name}
                  </div>
                  <div className="px-2 pb-1.5 text-xs text-gray-500">
                    {user?.email}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/dashboard" 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleNavigation('/dashboard')}
                    >
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link 
                      to="/profile" 
                      className="flex items-center cursor-pointer"
                      onClick={() => handleNavigation('/profile')}
                    >
                      <User className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  
                  {/* NGO-specific menu items */}
                  {user?.role === 'ngo' && (
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>NGO Tools</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link 
                          to="/ngo-dashboard" 
                          className="flex items-center cursor-pointer"
                          onClick={() => handleNavigation('/ngo-dashboard')}
                        >
                          <Building2 className="mr-2 h-4 w-4" />
                          NGO Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link 
                          to="/ngo-profile" 
                          className="flex items-center cursor-pointer"
                          onClick={() => handleNavigation('/ngo-profile')}
                        >
                          <FileText className="mr-2 h-4 w-4" />
                          NGO Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link 
                          to="/ngo-directory" 
                          className="flex items-center cursor-pointer"
                          onClick={() => handleNavigation('/ngo-directory')}
                        >
                          <Users className="mr-2 h-4 w-4" />
                          NGO Directory
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="flex items-center cursor-pointer text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" onClick={() => handleNavigation('/login')}>
                  <Button 
                    variant="primary" 
                    size="sm" 
                    className="bg-theuyir-pink hover:bg-theuyir-pink-dark text-white animate-flicker transition-transform hover:scale-105 flex items-center"
                  >
                    <Heart size={16} className="mr-1" /> DONATE
                  </Button>
                </Link>
              </div>
            )}
            
            <button
              className="relative text-theuyir-darkgrey hover:text-theuyir-pink transition-all duration-300 transform hover:scale-110 flex items-center justify-center bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
              aria-label="AI Chatbot"
              onClick={toggleChatbot}
            >
              <MessageSquare size={18} className="text-theuyir-pink" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-theuyir-pink opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-theuyir-pink"></span>
              </span>
            </button>
          </nav>

          {/* Mobile menu button */}
          <button 
            className="md:hidden text-theuyir-darkgrey transition-colors duration-300 hover:text-theuyir-pink"
            onClick={toggleMobileMenu}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <div 
        className={`fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden pt-20 pb-6 px-6 overflow-y-auto`}
      >
        <nav className="flex flex-col space-y-6">
          {[
            { path: '/', label: 'Home' },
            { path: '/about', label: 'About Us' },
            { path: '/services', label: 'What We Do' },
            { path: '/get-involved', label: 'Get Involved' },
            { path: '/give', label: 'Ways to Give' },
            { path: '/needs-donate', label: 'Donate to Needs' },
            { path: '/impact-tracker', label: 'Impact' },
            { path: '/stories', label: 'Stories' }
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center text-lg font-medium ${
                location.pathname === path ? 'text-theuyir-pink' : 'text-theuyir-darkgrey'
              }`}
              onClick={() => handleNavigation(path)}
            >
              {label}
            </Link>
          ))}
          
          {isAuthenticated ? (
            <>
              <div className="w-full h-px bg-gray-200 my-2"></div>
              <Link
                to="/dashboard"
                className="flex items-center text-lg font-medium text-theuyir-darkgrey"
                onClick={() => handleNavigation('/dashboard')}
              >
                <LayoutDashboard className="mr-2" size={18} />
                Dashboard
              </Link>
              <Link
                to="/profile"
                className="flex items-center text-lg font-medium text-theuyir-darkgrey"
                onClick={() => handleNavigation('/profile')}
              >
                <User className="mr-2" size={18} />
                My Profile
              </Link>
              
              {/* NGO-specific mobile menu items */}
              {user?.role === 'ngo' && (
                <>
                  <div className="w-full h-px bg-gray-200 my-2"></div>
                  <div className="text-sm text-gray-500 mb-1">NGO Tools</div>
                  <Link
                    to="/ngo-dashboard"
                    className="flex items-center text-lg font-medium text-theuyir-darkgrey"
                    onClick={() => handleNavigation('/ngo-dashboard')}
                  >
                    <Building2 className="mr-2" size={18} />
                    NGO Dashboard
                  </Link>
                  <Link
                    to="/ngo-profile"
                    className="flex items-center text-lg font-medium text-theuyir-darkgrey"
                    onClick={() => handleNavigation('/ngo-profile')}
                  >
                    <FileText className="mr-2" size={18} />
                    NGO Profile
                  </Link>
                  <Link
                    to="/ngo-directory"
                    className="flex items-center text-lg font-medium text-theuyir-darkgrey"
                    onClick={() => handleNavigation('/ngo-directory')}
                  >
                    <Users className="mr-2" size={18} />
                    NGO Directory
                  </Link>
                </>
              )}
              
              <button
                className="flex items-center text-lg font-medium text-red-600 mt-4"
                onClick={handleLogout}
              >
                <LogOut className="mr-2" size={18} />
                Log Out
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-4 mt-4">
              <Link
                to="/login"
                className="w-full py-2 text-center text-lg font-medium text-theuyir-darkgrey border border-theuyir-darkgrey rounded-md"
                onClick={() => handleNavigation('/login')}
              >
                Login
              </Link>
              <Link
                to="/register"
                className="w-full py-2 text-center text-lg font-medium text-white bg-theuyir-pink rounded-md flex items-center justify-center"
                onClick={() => handleNavigation('/register')}
              >
                <Heart size={18} className="mr-2" />
                Donate & Register
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* Chatbot */}
      {chatbotOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <Chatbot isOpen={chatbotOpen} onClose={toggleChatbot} />
        </div>
      )}
    </>
  );
};

export default Navbar;
