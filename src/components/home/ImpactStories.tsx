import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Heart, MapPin, Calendar } from 'lucide-react';
import Button from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useLoading } from '@/contexts/LoadingContext';

interface Story {
  id: number;
  title: string;
  quote: string;
  name: string;
  location: string;
  image: string;
  category: string;
  date: string;
  link: string;
}

const stories: Story[] = [
  {
    id: 1,
    title: "Access to Critical Medical Care",
    quote: "Lakshmi was able to receive life-saving treatment for her chronic condition thanks to donors who covered her medical expenses.",
    name: "Lakshmi Devi",
    location: "Chennai, Tamil Nadu",
    image: "/images/stories/healthcare.png",
    category: "Healthcare",
    date: "March 2025",
    link: "/stories/healthcare-hope"
  },
  {
    id: 2,
    title: "From Unemployment to Tech Career",
    quote: "After completing our free coding bootcamp, Ramesh secured a well-paying job as a web developer, transforming his family's future.",
    name: "Ramesh Kumar",
    location: "Mumbai, Maharashtra",
    image: "/images/stories/skill-development.png",
    category: "Skill Development",
    date: "February 2025",
    link: "/stories/skills-success"
  },
  {
    id: 3,
    title: "First in Family to Attend College",
    quote: "With a scholarship arranged through our platform, Priya became the first person in her family to pursue higher education.",
    name: "Priya Sharma",
    location: "Delhi",
    image: "/images/stories/education.png",
    category: "Education",
    date: "January 2025",
    link: "/stories/education-dreams"
  },
  {
    id: 4,
    title: "A Safe Home After Disaster",
    quote: "When floods destroyed their home, our emergency response team provided immediate shelter and helped rebuild their house.",
    name: "Rajesh and Family",
    location: "Kerala",
    image: "/images/stories/housing.png",
    category: "Shelter",
    date: "December 2024",
    link: "/stories/shelter-hope"
  }
];

const ImpactStories = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const slideRef = useRef<HTMLDivElement>(null);
  const { setIsLoading, setLoadingText } = useLoading();
  const storiesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.1 }
    );

    const storiesElement = storiesRef.current;
    if (storiesElement) {
      observer.observe(storiesElement);
    }

    return () => {
      if (storiesElement) {
        observer.unobserve(storiesElement);
      }
    };
  }, []);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };

  const handleNavigation = (path: string) => {
    setIsLoading(true);
    setLoadingText('Loading story...');
    setTimeout(() => {
      setIsLoading(false);
      setLoadingText('Loading...');
    }, 800);
  };

  return (
    <section ref={storiesRef} className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white opacity-0 translate-y-10 transition-all duration-1000">
      <div className="container mx-auto px-4 max-w-[100vw] overflow-x-hidden">
        <div className="text-center mb-8 md:mb-16">
          <div 
            className="bg-theuyir-yellow/10 text-theuyir-darkgrey text-sm font-semibold px-4 py-2 rounded-full inline-flex items-center mb-4 md:mb-6 animate-fade-in opacity-0" 
            style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
          >
            <Heart className="w-4 h-4 mr-2" />
            Stories of Hope
          </div>
          <h2 
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-theuyir-darkgrey mb-4 md:mb-6 animate-fade-in opacity-0" 
            style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
          >
            Real Stories, Real Impact
          </h2>
          <p 
            className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in opacity-0" 
            style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}
          >
            Every story represents a life transformed through the power of community support. These are real people, real struggles, and real victories that inspire us to keep making a difference.
          </p>
        </div>

        <div 
          ref={slideRef}
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {stories.map((story, index) => (
                <div 
                  key={story.id}
                  className="w-full flex-shrink-0"
                >
                  <div className="relative">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="w-full h-[300px] md:h-[400px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 text-white">
                      <div className="flex flex-wrap items-center gap-2 md:gap-4 mb-2 md:mb-4">
                        <span className="bg-theuyir-yellow text-black text-xs md:text-sm font-semibold px-2 md:px-3 py-1 rounded-full">
                          {story.category}
                        </span>
                        <div className="flex items-center text-white/80 text-xs md:text-sm">
                          <MapPin className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                          {story.location}
                        </div>
                        <div className="flex items-center text-white/80 text-xs md:text-sm">
                          <Calendar className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                          {story.date}
                        </div>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">{story.title}</h3>
                      <blockquote className="text-base md:text-lg mb-4 md:mb-6 italic">"{story.quote}"</blockquote>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm md:text-base">- {story.name}</p>
                        <Link 
                          to={story.link}
                          onClick={() => handleNavigation(story.link)}
                          className="inline-flex items-center text-theuyir-yellow hover:text-theuyir-yellow/80 transition-colors duration-300 text-sm md:text-base"
                        >
                          Read Full Story
                          <ArrowRight 
                            size={14} 
                            className="ml-1 transition-transform duration-300 group-hover:translate-x-1" 
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-1.5 md:p-2 rounded-full hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isAnimating}
            aria-label="Previous story"
          >
            <ChevronLeft size={20} className="md:w-6 md:h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-1.5 md:p-2 rounded-full hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isAnimating}
            aria-label="Next story"
          >
            <ChevronRight size={20} className="md:w-6 md:h-6" />
          </button>

          <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (isAnimating) return;
                  setIsAnimating(true);
                  setActiveIndex(index);
                  setTimeout(() => setIsAnimating(false), 500);
                }}
                className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-theuyir-yellow w-3 md:w-4' : 'bg-white/50 hover:bg-white/80'
                }`}
                aria-label={`Go to story ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImpactStories;
