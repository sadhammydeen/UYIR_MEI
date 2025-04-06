import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface SectionContainerProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  contentClassName?: string;
  id?: string;
  withDivider?: boolean;
  animate?: boolean;
  compact?: boolean;
}

const SectionContainer = ({
  children,
  title,
  description,
  className = "",
  titleClassName = "",
  descriptionClassName = "",
  contentClassName = "",
  id,
  withDivider = false,
  animate = true,
  compact = false
}: SectionContainerProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!animate) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const sectionElement = sectionRef.current;
    if (sectionElement) {
      const elementsToAnimate = sectionElement.querySelectorAll('.animate-on-scroll');
      elementsToAnimate.forEach((el) => {
        observer.observe(el);
      });
      observer.observe(sectionElement);
    }

    return () => {
      if (sectionElement) {
        const elementsToAnimate = sectionElement.querySelectorAll('.animate-on-scroll');
        elementsToAnimate.forEach((el) => {
          observer.unobserve(el);
        });
        observer.unobserve(sectionElement);
      }
    };
  }, [animate]);

  // Track mouse movement for subtle parallax effect
  useEffect(() => {
    if (!animate) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      
      // Only track mouse if section is in view
      if (
        rect.top < window.innerHeight &&
        rect.bottom > 0
      ) {
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [animate]);

  return (
    <section 
      ref={sectionRef}
      id={id}
      className={cn(
        compact ? "py-8 md:py-12" : "py-12 md:py-16", 
        className,
        { "page-header": title || description }
      )}
    >
      {withDivider && <div className="w-full h-px bg-gray-200 mb-8"></div>}
      
      {/* Decorative elements when there's a title */}
      {(title || description) && (
        <>
          <div className="absolute -top-10 right-[20%] w-32 h-32 border-2 border-theuyir-yellow/10 rotate-12 rounded-xl shadow-3d floating-element-slow opacity-40"></div>
          <div className="absolute bottom-[30%] left-[10%] w-20 h-20 bg-gradient-to-tr from-theuyir-pink/10 to-theuyir-yellow/10 rounded-full shadow-3d floating-element-fast opacity-40"></div>
        </>
      )}
      
      {(title || description) && (
        <div 
          className="max-w-4xl mx-auto text-center mb-8"
          style={{
            transform: isVisible ? `translate3d(${mousePosition.x * -5}px, ${mousePosition.y * -5}px, 0)` : 'none',
            transition: 'transform 0.3s ease-out'
          }}
        >
          {title && (
            <h2 className={cn(
              "text-3xl md:text-4xl font-bold mb-4 text-theuyir-darkgrey animate-on-scroll relative inline-block",
              titleClassName
            )}>
              <span className="text-shadow-3d">{title}</span>
              <span className="absolute -bottom-2 left-0 w-full h-2 bg-theuyir-yellow/30 rounded-lg -skew-x-6 -z-10"></span>
            </h2>
          )}
          {description && (
            <p className={cn(
              "text-xl text-gray-600 leading-relaxed animate-on-scroll",
              descriptionClassName
            )}>
              {description}
            </p>
          )}
        </div>
      )}
      
      <div 
        className={cn("container mx-auto px-4", contentClassName)}
        style={{
          transform: isVisible ? `translate3d(${mousePosition.x * -2}px, ${mousePosition.y * -2}px, 0)` : 'none',
          transition: 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>
    </section>
  );
};

export default SectionContainer; 