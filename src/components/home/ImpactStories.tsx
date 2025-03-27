import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight, Heart, MapPin, Calendar } from 'lucide-react';
import Button from '../ui/Button';
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
    title: "A New Home, A New Beginning",
    quote: "The support from Uyir Mei gave us more than just a roof over our heads. It gave us hope and a chance to rebuild our lives.",
    name: "Priya and Family",
    location: "Chennai",
    image: "/lovable-uploads/56f47960-da89-4cc6-b87e-03285fefc9a5.png",
    category: "Shelter",
    date: "March 2024",
    link: "/stories/shelter-hope"
  },
  {
    id: 2,
    title: "Education Opens Doors",
    quote: "Thanks to the scholarship program, I can now pursue my dream of becoming a doctor. Every child deserves this opportunity.",
    name: "Rajan",
    location: "Madurai",
    image: "https://images.unsplash.com/photo-1594708767771-a5e9d3012f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Education",
    date: "February 2024",
    link: "/stories/education-dreams"
  },
  {
    id: 3,
    title: "Healthcare for All",
    quote: "The free medical camp organized by Uyir Mei provided me with the medication I couldn't afford. They truly care about our well-being.",
    name: "Lakshmi",
    location: "Coimbatore",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Healthcare",
    date: "January 2024",
    link: "/stories/healthcare-hope"
  },
  {
    id: 4,
    title: "Skills for Success",
    quote: "Learning computer skills has opened up new opportunities for me. I now work remotely and support my family.",
    name: "Vikram",
    location: "Trichy",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    category: "Skill Development",
    date: "December 2023",
    link: "/stories/skills-success"
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
    <section ref={storiesRef} className="py-20 bg-gradient-to-b from-gray-50 to-white opacity-0 translate-y-10 transition-all duration-1000">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div 
            className="bg-theuyir-yellow/10 text-theuyir-darkgrey text-sm font-semibold px-4 py-2 rounded-full inline-flex items-center mb-6 animate-fade-in opacity-0" 
            style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
          >
            <Heart className="w-4 h-4 mr-2" />
            Impact Stories
          </div>
          <h2 
            className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-6 animate-fade-in opacity-0" 
            style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}
          >
            Real Stories, Real Impact
          </h2>
          <p 
            className="text-gray-600 max-w-2xl mx-auto text-lg animate-fade-in opacity-0" 
            style={{ animationDelay: '0.7s', animationFillMode: 'forwards' }}
          >
            Every day, lives are being transformed through the power of community support. Here are some of the stories that inspire us to keep making a difference.
          </p>
        </div>

        <div 
          ref={slideRef}
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
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
                      className="w-full h-[400px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                      <div className="flex items-center gap-4 mb-4">
                        <span className="bg-theuyir-yellow text-black text-sm font-semibold px-3 py-1 rounded-full">
                          {story.category}
                        </span>
                        <div className="flex items-center text-white/80 text-sm">
                          <MapPin className="w-4 h-4 mr-1" />
                          {story.location}
                        </div>
                        <div className="flex items-center text-white/80 text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {story.date}
                        </div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4">{story.title}</h3>
                      <blockquote className="text-lg mb-6 italic">"{story.quote}"</blockquote>
                      <div className="flex items-center justify-between">
                        <p className="font-semibold">- {story.name}</p>
                        <Link 
                          to={story.link}
                          onClick={() => handleNavigation(story.link)}
                          className="inline-flex items-center text-theuyir-yellow hover:text-theuyir-yellow/80 transition-colors duration-300"
                        >
                          Read Full Story
                          <ArrowRight 
                            size={16} 
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
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isAnimating}
            aria-label="Previous story"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isAnimating}
            aria-label="Next story"
          >
            <ChevronRight size={24} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {stories.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (isAnimating) return;
                  setIsAnimating(true);
                  setActiveIndex(index);
                  setTimeout(() => setIsAnimating(false), 500);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-theuyir-yellow w-4' : 'bg-white/50 hover:bg-white/80'
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
