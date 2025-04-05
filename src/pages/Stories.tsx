import React, { useEffect, useState } from 'react';
import { ArrowRight, Search, Tag, Calendar, User, Heart, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/button';

const StoryCard = ({ 
  image, 
  category, 
  title, 
  excerpt, 
  date, 
  author, 
  likes, 
  comments,
  featured = false 
}: { 
  image: string; 
  category: string; 
  title: string; 
  excerpt: string; 
  date: string; 
  author: string; 
  likes: number; 
  comments: number;
  featured?: boolean;
}) => {
  return (
    <div className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 group ${featured ? 'md:col-span-2' : ''}`}>
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${featured ? 'h-80' : 'h-60'}`}
        />
        <div className="absolute top-0 left-0 bg-theuyir-yellow text-black font-medium px-3 py-1 m-3 rounded-md text-sm">
          {category}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className={`${featured ? 'text-2xl' : 'text-xl'} font-bold mb-2 text-theuyir-darkgrey group-hover:text-theuyir-pink transition-colors duration-300`}>
          {title}
        </h3>
        <p className="text-gray-600 mb-4">{excerpt}</p>
        
        <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
          <div className="flex items-center">
            <Calendar size={14} className="mr-1" />
            <span>{date}</span>
          </div>
          <div className="flex items-center">
            <User size={14} className="mr-1" />
            <span>{author}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Heart size={14} className="mr-1 text-theuyir-pink" />
              <span>{likes}</span>
            </div>
            <div className="flex items-center">
              <MessageSquare size={14} className="mr-1 text-theuyir-pink" />
              <span>{comments}</span>
            </div>
          </div>
          
          <Button variant="primary" size="sm" className="group-hover:bg-theuyir-pink group-hover:text-white group-hover:border-theuyir-pink transition-all duration-300">
            Read More <ArrowRight size={14} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </div>
  );
};

const Stories = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const categories = ['all', 'education', 'healthcare', 'food', 'shelter', 'success stories'];
  
  useEffect(() => {
    window.scrollTo(0, 0);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            entry.target.classList.remove('opacity-0');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.fade-in-section').forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 bg-theuyir-darkgrey text-white overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-20">
            <img
              src="/images/backgrounds/page-header-bg.png"
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center fade-in-section opacity-0">
              <p className="inline-block bg-theuyir-yellow/20 text-theuyir-yellow px-4 py-1 rounded-full text-sm font-medium mb-4">
                IMPACT STORIES
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Stories of <span className="yellow-highlight">Transformation</span>
              </h1>
              <p className="text-white/80 text-lg mb-8">
                Discover stories of resilience, hope, and positive change made possible through the collective efforts of our community.
              </p>
              
              <div className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  placeholder="Search stories..."
                  className="w-full py-3 pl-5 pr-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-theuyir-yellow"
                />
                <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-theuyir-yellow transition-colors">
                  <Search size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Categories Filter */}
        <section className="py-8 bg-white border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-2">
              <Tag size={18} className="mr-2 text-theuyir-pink" />
              <h3 className="font-semibold text-theuyir-darkgrey">Filter by Category:</h3>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all duration-300 ${
                    activeCategory === category 
                      ? 'bg-theuyir-pink text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>
        
        {/* Featured Story */}
        <section className="py-12 bg-theuyir-lightgrey">
          <div className="container mx-auto px-4">
            <div className="text-center mb-10 fade-in-section opacity-0">
              <p className="inline-block bg-theuyir-pink/10 text-theuyir-pink px-4 py-1 rounded-full text-sm font-medium mb-2">
                FEATURED STORY
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-theuyir-darkgrey">
                Stories That <span className="yellow-highlight">Inspire</span>
              </h2>
            </div>
            
            <div className="fade-in-section opacity-0">
              <StoryCard
                featured
                image="https://images.unsplash.com/photo-1594708767771-a5e9d3012f3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                category="Education"
                title="From Street Child to Scholar: Priya's Journey of Determination"
                excerpt="Abandoned at age 7, Priya lived on the streets of Chennai until an NGO connected through our platform took her in. Today, she's a top engineering student with dreams of giving back to her community."
                date="May 15, 2023"
                author="Ramesh Kumar"
                likes={145}
                comments={32}
              />
            </div>
          </div>
        </section>
        
        {/* All Stories */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 fade-in-section opacity-0">
              <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-4">
                All <span className="yellow-highlight">Stories</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Each story represents a life changed, a challenge overcome, and a future brightened through the power of community and compassion.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Story 1 */}
              <div className="fade-in-section opacity-0">
                <StoryCard
                  image="https://images.unsplash.com/photo-1536148935331-408321065b18?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  category="Healthcare"
                  title="A Village Transformed: How Mobile Health Clinics Changed Rural Lives"
                  excerpt="Thanks to donor support, mobile health clinics now reach 15 remote villages, providing essential healthcare to over 5,000 people who previously had no access to medical services."
                  date="June 3, 2023"
                  author="Dr. Anita Sharma"
                  likes={98}
                  comments={24}
                />
              </div>
              
              {/* Story 2 */}
              <div className="fade-in-section opacity-0" style={{ animationDelay: '0.2s' }}>
                <StoryCard
                  image="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  category="Food"
                  title="Feeding Families: Community Kitchen Initiative Fights Hunger"
                  excerpt="Our community kitchen program now serves 500 meals daily to families in need. Meet the volunteers making it happen and the families whose lives have been improved."
                  date="May 22, 2023"
                  author="Sunita Patel"
                  likes={87}
                  comments={19}
                />
              </div>
              
              {/* Story 3 */}
              <div className="fade-in-section opacity-0" style={{ animationDelay: '0.4s' }}>
                <StoryCard
                  image="https://images.unsplash.com/photo-1571624436279-b272aff752b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  category="Shelter"
                  title="Building Homes, Rebuilding Lives: Housing Project Success"
                  excerpt="After losing everything in severe floods, 25 families now have safe, permanent housing thanks to a collaborative effort between donors, volunteers, and local craftsmen."
                  date="April 17, 2023"
                  author="Vishnu Rajan"
                  likes={112}
                  comments={28}
                />
              </div>
              
              {/* Story 4 */}
              <div className="fade-in-section opacity-0" style={{ animationDelay: '0.6s' }}>
                <StoryCard
                  image="https://images.unsplash.com/photo-1544717305-996b815c338c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  category="Education"
                  title="Digital Divide Bridged: Computer Lab Opens Doors for Rural Students"
                  excerpt="A new computer lab funded by corporate donors is helping 200 rural students access digital education, preparing them for future careers in a technology-driven world."
                  date="March 30, 2023"
                  author="Kavita Mehta"
                  likes={76}
                  comments={15}
                />
              </div>
              
              {/* Story 5 */}
              <div className="fade-in-section opacity-0" style={{ animationDelay: '0.8s' }}>
                <StoryCard
                  image="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  category="Success Stories"
                  title="From Beneficiary to Benefactor: Raj's Full Circle Journey"
                  excerpt="Once homeless and struggling, Raj received support through our platform. Now a successful entrepreneur, he's giving back by employing other beneficiaries in his business."
                  date="February 12, 2023"
                  author="Meera Krishnan"
                  likes={154}
                  comments={37}
                />
              </div>
              
              {/* Story 6 */}
              <div className="fade-in-section opacity-0" style={{ animationDelay: '1s' }}>
                <StoryCard
                  image="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                  category="Skill Development"
                  title="Women's Cooperative Creates Economic Independence"
                  excerpt="A group of 30 women from marginalized communities completed our skill development program and formed a successful handicraft cooperative, transforming their economic reality."
                  date="January 25, 2023"
                  author="Aryan Singh"
                  likes={93}
                  comments={21}
                />
              </div>
            </div>
            
            {/* Pagination */}
            <div className="flex justify-center items-center space-x-2 fade-in-section opacity-0">
              <button className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors">
                <ChevronLeft size={18} />
              </button>
              <button className="w-10 h-10 rounded-full bg-theuyir-pink text-white font-medium">1</button>
              <button className="w-10 h-10 rounded-full text-gray-600 hover:bg-gray-100 font-medium">2</button>
              <button className="w-10 h-10 rounded-full text-gray-600 hover:bg-gray-100 font-medium">3</button>
              <button className="w-10 h-10 rounded-full text-gray-600 hover:bg-gray-100 font-medium">4</button>
              <button className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors">
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </section>
        
        {/* Share Your Story */}
        <section className="py-20 bg-theuyir-lightgrey">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="fade-in-section opacity-0">
                <p className="inline-block bg-theuyir-pink/10 text-theuyir-pink px-4 py-1 rounded-full text-sm font-medium mb-4">
                  SUBMIT YOUR STORY
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-6">
                  Share Your <span className="yellow-highlight">Experience</span>
                </h2>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Have you been impacted by our work, either as a beneficiary, donor, volunteer, or NGO partner? 
                  We'd love to hear your story and share it to inspire others.
                </p>
                
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                        <input
                          type="text"
                          id="name"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                          placeholder="Enter your email"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="storyType" className="block text-sm font-medium text-gray-700 mb-1">Story Type</label>
                      <select
                        id="storyType"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                      >
                        <option value="">Select story type</option>
                        <option value="beneficiary">Beneficiary Story</option>
                        <option value="donor">Donor Experience</option>
                        <option value="volunteer">Volunteer Journey</option>
                        <option value="ngo">NGO Partnership</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="storyTitle" className="block text-sm font-medium text-gray-700 mb-1">Story Title</label>
                      <input
                        type="text"
                        id="storyTitle"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                        placeholder="Give your story a title"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="storyContent" className="block text-sm font-medium text-gray-700 mb-1">Your Story</label>
                      <textarea
                        id="storyContent"
                        rows={5}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink"
                        placeholder="Share your experience and how you've been impacted..."
                      ></textarea>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Upload Images (Optional)</label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <svg className="w-8 h-8 mb-3 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                            </svg>
                            <p className="mb-1 text-sm text-gray-500">
                              <span className="font-medium">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-gray-500">PNG, JPG, or JPEG (MAX. 5MB)</p>
                          </div>
                          <input type="file" className="hidden" multiple />
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="consent"
                        className="h-4 w-4 text-theuyir-pink focus:ring-theuyir-pink border-gray-300 rounded"
                      />
                      <label htmlFor="consent" className="ml-2 block text-sm text-gray-700">
                        I consent to having my story and images shared on the website and social media
                      </label>
                    </div>
                    
                    <Button variant="primary" size="lg" type="submit" className="w-full">
                      Submit Your Story
                    </Button>
                  </form>
                </div>
              </div>
              
              <div className="relative fade-in-section opacity-0">
                <img 
                  src="https://images.unsplash.com/photo-1510936111840-65e151ad71bb?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Sharing Stories" 
                  className="rounded-xl shadow-lg"
                />
                <div className="absolute -top-6 -right-6 bg-white p-6 rounded-xl shadow-lg max-w-xs">
                  <div className="flex items-start mb-3">
                    <div className="mr-3 p-2 bg-theuyir-yellow/20 rounded-full text-theuyir-darkgrey">
                      <Heart size={18} />
                    </div>
                    <p className="text-gray-700 text-sm">
                      "Sharing my story helped me connect with others going through similar situations. It was healing and empowering."
                    </p>
                  </div>
                  <p className="text-right font-medium text-theuyir-pink">- Lakshmi, beneficiary</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-theuyir-pink text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 fade-in-section opacity-0">
              Be Part of More <span className="yellow-highlight">Success Stories</span>
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-10 fade-in-section opacity-0" style={{ animationDelay: '0.2s' }}>
              Your involvement, whether through donations, volunteering, or partnerships, 
              helps create more inspiring stories of hope and transformation.
            </p>
            <div className="flex flex-wrap justify-center gap-4 fade-in-section opacity-0" style={{ animationDelay: '0.4s' }}>
              <Button variant="primary" size="lg">
                Donate Now
              </Button>
              <Button size="lg" className="bg-white text-theuyir-pink hover:bg-white/90">
                Get Involved
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Stories;
