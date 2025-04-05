import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Menu, X, Search, User, LogOut, ChevronDown, 
  LayoutDashboard, Settings, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLoading } from '@/contexts/LoadingContext';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
            <span className="text-[10px] md:text-xs text-theuyir-pink tracking-wider font-medium">CONNECTING EMPATHY</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-8">
          {[
            { path: '/about', label: 'ABOUT US' },
            { path: '/services', label: 'WHAT WE DO' },
            { path: '/get-involved', label: 'GET INVOLVED' },
            { path: '/give', label: 'WAYS TO GIVE' },
            { path: '/stories', label: 'STORIES' }
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path} 
              className={`nav-link relative overflow-hidden group text-sm lg:text-base ${location.pathname === path ? 'text-theuyir-pink' : ''}`}
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
                  variant="default" 
                  size="sm" 
                  className="bg-theuyir-pink hover:bg-theuyir-pink-dark text-white animate-flicker transition-transform hover:scale-105 flex items-center"
                >
                  <Heart size={16} className="mr-1" /> DONATE
                </Button>
              </Link>
            </div>
          )}
          
          <button
            className="text-theuyir-darkgrey hover:text-theuyir-pink transition-all duration-300 transform hover:scale-110"
            aria-label="Search"
          >
            <Search size={20} />
          </button>
        </nav>

        {/* Mobile menu button */}
        <button 
          className="md:hidden text-theuyir-darkgrey transition-colors duration-300 hover:text-theuyir-pink"
          onClick={toggleMobileMenu}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden bg-white/95 backdrop-blur-sm shadow-lg transition-all duration-300 ease-in-out fixed top-[72px] left-0 right-0 ${
          mobileMenuOpen ? 'max-h-[calc(100vh-72px)] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          {isAuthenticated && (
            <div className="flex items-center py-2 border-b border-gray-100 mb-2">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src={user?.avatar} alt={user?.name || 'User'} />
                <AvatarFallback className="bg-theuyir-yellow text-theuyir-darkgrey">
                  {getInitials(user?.name || 'User')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-theuyir-darkgrey">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            </div>
          )}

          {[
            { path: '/about', label: 'ABOUT US' },
            { path: '/services', label: 'WHAT WE DO' },
            { path: '/get-involved', label: 'GET INVOLVED' },
            { path: '/give', label: 'WAYS TO GIVE' },
            { path: '/stories', label: 'STORIES' }
          ].map(({ path, label }) => (
            <Link
              key={path}
              to={path} 
              className={`nav-link py-2 pl-2 border-l-4 transition-all duration-300 ${
                location.pathname === path ? 'border-theuyir-yellow text-theuyir-pink' : 'border-transparent'
              }`}
              onClick={() => handleNavigation(path)}
            >
              {label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className="flex items-center py-2 pl-2 border-l-4 border-transparent"
                onClick={() => handleNavigation('/dashboard')}
              >
                <LayoutDashboard className="mr-2 h-5 w-5" />
                DASHBOARD
              </Link>
              <Link 
                to="/profile" 
                className="flex items-center py-2 pl-2 border-l-4 border-transparent"
                onClick={() => handleNavigation('/profile')}
              >
                <User className="mr-2 h-5 w-5" />
                MY PROFILE
              </Link>
              <button 
                className="flex items-center py-2 pl-2 border-l-4 border-transparent text-red-600 w-full text-left"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-5 w-5" />
                LOG OUT
              </button>
            </>
          ) : (
            <div className="flex flex-col space-y-3 pt-2">
              <Link 
                to="/login" 
                className="w-full"
                onClick={() => handleNavigation('/login')}
              >
                <Button 
                  variant="default" 
                  className="w-full justify-center bg-theuyir-pink hover:bg-theuyir-pink-dark text-white animate-flicker flex items-center justify-center space-x-2"
                >
                  <Heart size={16} />
                  <span>DONATE</span>
                </Button>
              </Link>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <button 
              className="text-theuyir-darkgrey hover:text-theuyir-pink"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
