import React, { useEffect, useState, useRef } from 'react';

interface HeaderProps {
  title: string;
  description?: string;
  badge?: string;
  backgroundImage?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  description, 
  badge, 
  backgroundImage = '/images/backgrounds/page-header-bg.png' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  // Track mouse position for 3D effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      
      const rect = sectionRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="page-header relative py-28 bg-gradient-to-br from-theuyir-darkgrey via-gray-900 to-black text-white"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10 opacity-15">
        <img
          src={backgroundImage}
          alt="Background"
          className="w-full h-full object-cover"
          style={{
            transform: `scale(1.05) translate(${mousePosition.x * -10}px, ${mousePosition.y * -10}px)`,
            transition: 'transform 0.2s ease-out'
          }}
        />
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-theuyir-pink/15 to-theuyir-yellow/15 -z-10"></div>
      
      {/* Decorative Elements - 3D transformed */}
      <div 
        className="absolute top-10 left-10 w-40 h-40 rounded-full bg-theuyir-pink/15 blur-3xl floating-element-slow"
        style={{
          transform: `translate3d(${mousePosition.x * 20}px, ${mousePosition.y * 20}px, 0)`,
          transition: 'transform 0.3s ease-out'
        }}
      ></div>
      <div 
        className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-theuyir-yellow/15 blur-3xl floating-element"
        style={{
          transform: `translate3d(${mousePosition.x * -30}px, ${mousePosition.y * -30}px, 0)`,
          transition: 'transform 0.3s ease-out'
        }}
      ></div>
      
      {/* Geometric Shapes - 3D transformed */}
      <div 
        className="absolute -top-10 -left-10 w-40 h-40 border-2 border-theuyir-yellow/30 rotate-12 rounded-xl shadow-3d floating-element-fast"
        style={{
          transform: `translate3d(${mousePosition.x * -15}px, ${mousePosition.y * -15}px, 50px) rotate(${12 + mousePosition.x * 5}deg)`,
          transition: 'transform 0.3s ease-out'
        }}
      ></div>
      <div 
        className="absolute -bottom-20 -right-20 w-60 h-60 border-2 border-theuyir-pink/30 -rotate-12 rounded-xl shadow-3d floating-element"
        style={{
          transform: `translate3d(${mousePosition.x * 25}px, ${mousePosition.y * 25}px, 30px) rotate(${-12 + mousePosition.y * 5}deg)`,
          transition: 'transform 0.3s ease-out'
        }}
      ></div>
      
      {/* Additional floating elements for 3D depth */}
      <div 
        className="absolute top-1/4 right-1/4 w-16 h-16 bg-gradient-to-br from-theuyir-yellow/20 to-theuyir-pink/20 rounded-lg rotate-45 shadow-3d floating-element-fast"
        style={{
          transform: `translate3d(${mousePosition.x * 40}px, ${mousePosition.y * 40}px, 80px)`,
          transition: 'transform 0.4s ease-out'
        }}
      ></div>
      <div 
        className="absolute bottom-1/3 left-1/3 w-20 h-20 bg-gradient-to-tr from-theuyir-pink/20 to-theuyir-yellow/20 rounded-full shadow-3d floating-element-slow"
        style={{
          transform: `translate3d(${mousePosition.x * -35}px, ${mousePosition.y * -35}px, 60px)`,
          transition: 'transform 0.4s ease-out'
        }}
      ></div>
      
      {/* Dots Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03]"></div>
      
      <div 
        className="container mx-auto px-4 relative z-10"
        style={{
          transform: `translate3d(${mousePosition.x * -5}px, ${mousePosition.y * -5}px, 0)`,
          transition: 'transform 0.2s ease-out'
        }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Badge with enhanced 3D styling */}
          {badge && (
            <div className={`flex justify-center mb-8 transition-all duration-700 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
              <p 
                className="inline-block bg-gradient-to-r from-theuyir-yellow/30 to-theuyir-pink/30 text-white px-6 py-1.5 rounded-full text-sm font-medium backdrop-blur-sm border border-white/10 shadow-3d glow-effect"
                style={{
                  transform: `translateZ(20px) rotateX(${mousePosition.y * -5}deg) rotateY(${mousePosition.x * 5}deg)`,
                  transition: 'transform 0.3s ease-out'
                }}
              >
                {badge}
              </p>
            </div>
          )}
          
          {/* Title with 3D animated entrance */}
          <div 
            className={`perspective-[1000px] mb-8 text-center transition-all duration-700 delay-100 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
            style={{
              transform: `rotateX(${mousePosition.y * -2}deg) rotateY(${mousePosition.x * 2}deg)`,
              transition: 'transform 0.3s ease-out'
            }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-center bg-clip-text">
              {title.includes(' ') ? (
                <>
                  <span className="text-white text-shadow-3d">{title.split(' ').slice(0, -1).join(' ')}{' '}</span>
                  <span className="relative inline-block">
                    <span 
                      className="relative z-10 gradient-text"
                    >
                      {title.split(' ').slice(-1)}
                    </span>
                    <span className="text-highlight"></span>
                  </span>
                </>
              ) : (
                <span 
                  className="gradient-text"
                >
                  {title}
                </span>
              )}
            </h1>
          </div>
          
          {/* Description with 3D animated entrance */}
          {description && (
            <div 
              className={`perspective-[800px] transition-all duration-700 delay-200 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
              style={{
                transform: `rotateX(${mousePosition.y * -1}deg) rotateY(${mousePosition.x * 1}deg)`,
                transition: 'transform 0.3s ease-out'
              }}
            >
              <p 
                className="text-white/90 text-lg md:text-xl leading-relaxed mb-10 text-center max-w-3xl mx-auto text-shadow-3d"
              >
                {description}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Header; 