import React, { useState, useEffect, useRef } from 'react';
// Import icons individually to avoid potential compatibility issues
import { 
  Send, 
  X, 
  Bot, 
  User, 
  ChevronDown, 
  Loader2, 
  HelpCircle, 
  ExternalLink, 
  Search, 
  ThumbsUp, 
  ThumbsDown, 
  Cpu, 
  MessageSquare,
  Mic,
  MicOff,
  Volume2,
  VolumeX
} from 'lucide-react';
// Import any additional icons we need
import { BarChart3, RefreshCw, Smile, Frown, Sparkles } from 'lucide-react';
// Use a custom Link icon to avoid name collision
import { Link as LinkIcon } from 'lucide-react';
import Button from '@/components/ui/Button.tsx';
import axios from 'axios';
import { useSession } from '@/contexts/SessionContext';

// Helper function to generate unique IDs
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  links?: WebResource[];
  feedback?: 'positive' | 'negative' | null;
  source?: 'ai' | 'kb' | 'web' | 'error' | 'openai' | 'fallback';
  sentiment?: 'positive' | 'negative' | 'neutral';
};

type SuggestedQuestion = {
  id: string;
  text: string;
};

type WebResource = {
  title: string;
  url: string;
  description: string;
};

type ChatStats = {
  messageCount: number;
  feedbackGiven: number;
  positiveResponses: number;
  positiveUserSentiment: number;
  negativeUserSentiment: number;
};

type ChatSettings = {
  theme: 'light' | 'dark' | 'system';
  soundEnabled: boolean;
  showTypingIndicator: boolean;
  showSourceIndicator: boolean;
  autoSuggest: boolean;
};

// API config
const API_URL = 'http://localhost:5001';

const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    text: 'Hi there! I\'m Chol (சொல்), your AI assistant. How can I help you today?',
    sender: 'bot',
    timestamp: new Date()
  }
];

const DEFAULT_SETTINGS: ChatSettings = {
  theme: 'light',
  soundEnabled: false,
  showTypingIndicator: true,
  showSourceIndicator: true,
  autoSuggest: true
};

const INITIAL_STATS: ChatStats = {
  messageCount: 0,
  feedbackGiven: 0,
  positiveResponses: 0,
  positiveUserSentiment: 0,
  negativeUserSentiment: 0
};

const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  { id: 'sq1', text: 'How can I donate?' },
  { id: 'sq2', text: 'What volunteer opportunities are available?' },
  { id: 'sq3', text: 'Tell me about your services' },
  { id: 'sq4', text: 'How can I contact Uyir Mei?' },
  { id: 'sq5', text: 'What communities do you serve?' }
];

// Knowledge base for the chatbot
const KNOWLEDGE_BASE: Record<string, { text: string, links?: WebResource[] }> = {
  "donate": {
    text: "You can donate by clicking the 'DONATE' button in the navigation bar or visiting our 'Ways to Give' page. We accept one-time and recurring donations through various payment methods including credit/debit cards, UPI, and bank transfers. Every contribution, no matter how small, makes a significant impact.",
    links: [
      {
        title: "Ways to Give - Uyir Mei",
        url: "/give",
        description: "Explore different ways to support our cause through donations."
      }
    ]
  },
  
  "volunteer": {
    text: "We'd love to have you as a volunteer! Please visit our 'Get Involved' page to see current volunteer opportunities. We need help with event organization, teaching, mentoring, administrative tasks, and skilled services like medical care and counseling. You can commit as little as 2 hours a week.",
    links: [
      {
        title: "Volunteer Opportunities - Uyir Mei",
        url: "/get-involved",
        description: "Find volunteer opportunities that match your skills and interests."
      }
    ]
  },
  
  "help": {
    text: "There are many ways to help - you can donate financially, volunteer your time and skills, spread awareness about our cause on social media, become a corporate partner, or donate goods and supplies. Every contribution makes a difference in the lives of those we serve.",
    links: [
      {
        title: "Get Involved - Uyir Mei",
        url: "/get-involved",
        description: "Discover how you can contribute to our mission."
      }
    ]
  },
  
  "contact": {
    text: "You can reach us at contact@uyirmei.org or call us at +91 9876543210. Our office is located at 123 NGO Street, Chennai, Tamil Nadu, India - 600001. Our office hours are Monday to Friday, 9 AM to 6 PM.",
    links: [
      {
        title: "Contact Us - Uyir Mei",
        url: "/contact",
        description: "Find our contact information and office locations."
      }
    ]
  },
  
  "about": {
    text: "Uyir Mei is a non-profit organization dedicated to connecting compassion with those in need. We've been working since 2010 to create lasting change in communities across India. Our mission is to empower vulnerable populations through education, healthcare, food security, and community development initiatives.",
    links: [
      {
        title: "About Us - Uyir Mei",
        url: "/about",
        description: "Learn more about our mission, vision, and history."
      }
    ]
  },
  
  "services": {
    text: "Our services include education support (scholarships, school supplies, tutoring), healthcare assistance (medical camps, treatment funding, mental health services), food security programs (daily meals, nutrition education), and community development initiatives (skills training, infrastructure projects).",
    links: [
      {
        title: "Our Services - Uyir Mei",
        url: "/services",
        description: "Explore the various services we offer to communities in need."
      }
    ]
  },
  
  "locations": {
    text: "We currently serve communities in Tamil Nadu, Karnataka, and Andhra Pradesh, with a focus on both urban slums and rural villages. Our headquarters is in Chennai, with field offices in Bangalore, Hyderabad, and five rural districts.",
    links: [
      {
        title: "Our Locations - Uyir Mei",
        url: "/about#locations",
        description: "See where we work across India."
      }
    ]
  },
  
  "stories": {
    text: "You can read inspiring stories about the impact of our work on our 'Stories' page. These include accounts of children accessing education, families receiving healthcare, and communities being transformed through our various programs.",
    links: [
      {
        title: "Success Stories - Uyir Mei",
        url: "/stories",
        description: "Read personal stories of transformation from our beneficiaries."
      }
    ]
  },
  
  "donate_items": {
    text: "Besides financial contributions, we accept donations of school supplies, clothes, books, toys, food items, and medical supplies. Please contact us before sending goods to ensure we can distribute them effectively.",
    links: [
      {
        title: "In-Kind Donations - Uyir Mei",
        url: "/give#in-kind",
        description: "Learn about donating goods and supplies."
      }
    ]
  },
  
  "events": {
    text: "We organize various events throughout the year including fundraisers, awareness campaigns, volunteer drives, and community service days. Check our website regularly or sign up for our newsletter to stay updated.",
    links: [
      {
        title: "Upcoming Events - Uyir Mei",
        url: "/events",
        description: "View our calendar of upcoming events and activities."
      }
    ]
  },
  
  "partner": {
    text: "We welcome partnerships with corporations, schools, other NGOs, and government agencies. Partners can contribute through CSR initiatives, employee volunteering, skill-sharing, and collaborative projects. Please email partnerships@uyirmei.org for more information.",
    links: [
      {
        title: "Partnership Opportunities - Uyir Mei",
        url: "/get-involved#partners",
        description: "Explore how your organization can partner with us."
      }
    ]
  }
};

const TOPIC_KEYWORDS: Record<string, string[]> = {
  "donate": ["donate", "donation", "give money", "contribute", "financial", "payment", "fund", "support financially"],
  "volunteer": ["volunteer", "help out", "give time", "volunteering", "service", "serve"],
  "contact": ["contact", "reach", "email", "phone", "call", "address", "location", "office"],
  "about": ["about", "history", "mission", "vision", "who are you", "organization", "background"],
  "services": ["services", "programs", "initiatives", "projects", "provide", "offering", "help"],
  "locations": ["where", "places", "regions", "areas", "communities", "serve", "location", "city"],
  "stories": ["stories", "testimonials", "impact", "success", "beneficiaries", "helped"],
  "donate_items": ["items", "goods", "supplies", "clothes", "books", "food"],
  "events": ["events", "happening", "calendar", "schedule", "upcoming", "participate"],
  "partner": ["partner", "corporate", "business", "collaboration", "csr", "company", "school"]
};

// Mock function to simulate fetching web resources
const fetchWebResources = async (query: string): Promise<WebResource[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // This would be replaced with actual API calls to search engines or custom web scrapers
  return [
    {
      title: "Uyir Mei - Connecting Compassion",
      url: "https://uyirmei.org",
      description: "Official website of Uyir Mei, a non-profit organization dedicated to connecting compassion with those in need."
    },
    {
      title: "Volunteer Opportunities - Uyir Mei",
      url: "https://uyirmei.org/volunteer",
      description: "Find volunteer opportunities that match your skills and interests at Uyir Mei."
    },
    {
      title: "Donation Impact - Uyir Mei Blog",
      url: "https://blog.uyirmei.org/impact",
      description: "Learn how your donations make a difference in the lives of our beneficiaries."
    }
  ].filter(resource => 
    resource.title.toLowerCase().includes(query.toLowerCase()) || 
    resource.description.toLowerCase().includes(query.toLowerCase())
  );
};

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

const Chatbot: React.FC<ChatbotProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>(SUGGESTED_QUESTIONS);
  const [isSearchingWeb, setIsSearchingWeb] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light');
  const [apiMode, setApiMode] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'testing'>('disconnected');
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [showApiStatus, setShowApiStatus] = useState<boolean>(false);
  const [settings, setSettings] = useState<ChatSettings>({
    ...DEFAULT_SETTINGS,
    soundEnabled: true
  });
  const [stats, setStats] = useState<ChatStats>(INITIAL_STATS);
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [userId] = useState<string>(localStorage.getItem('uyirmei_chat_userid') || generateId());
  const [lastTypedTime, setLastTypedTime] = useState<number>(0);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageSound = useRef<HTMLAudioElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Voice integration - simplified direct implementation
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { logActivity } = useSession();

  // Initialize speech recognition
  useEffect(() => {
    // Check if speech recognition is supported
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      const initRecognition = () => {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onstart = () => {
          setIsListening(true);
          logActivity('voice_recognition_started');
          console.log('Speech recognition started');
        };
        
        recognitionRef.current.onend = () => {
          setIsListening(false);
          logActivity('voice_recognition_ended');
          console.log('Speech recognition ended');
        };
        
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            finalTranscript += event.results[i][0].transcript;
          }
          
          console.log('Transcript:', finalTranscript);
          setTranscript(finalTranscript);
          setInputValue(finalTranscript);
        };
        
        recognitionRef.current.onerror = (event: any) => {
          console.error(`Speech recognition error: ${event.error}`);
          logActivity('voice_recognition_error', { error: event.error });
          setIsListening(false);
          
          // If we get an error, reinitialize after a delay
          setTimeout(initRecognition, 1000);
        };
      };
      
      initRecognition();
      setIsVoiceSupported(true);
      console.log('Speech recognition initialized');
    } else {
      console.log('Speech recognition not supported in this browser');
      setIsVoiceSupported(false);
    }
    
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {
          console.error('Error stopping speech recognition:', e);
        }
      }
    };
  }, [logActivity]);

  // Functions for voice control
  const startListening = () => {
    if (recognitionRef.current) {
      try {
        // Clear the input value first to get a fresh start
        setInputValue('');
        setTranscript('');
        
        recognitionRef.current.start();
        console.log('Starting speech recognition');
      } catch (err) {
        console.error('Error starting speech recognition:', err);
        
        // If already started, stop and restart
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            // Clear values again
            setInputValue('');
            setTranscript('');
            recognitionRef.current.start();
          }, 300);
        } catch (e) {
          console.error('Error restarting speech recognition:', e);
        }
      }
    }
  };
  
  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        console.log('Stopping speech recognition');
      } catch (err) {
        console.error('Error stopping speech recognition:', err);
      }
    }
  };
  
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
    logActivity('chatbot_voice_control_toggle', { isListening: !isListening });
  };

  useEffect(() => {
    // Save the userId to localStorage
    localStorage.setItem('uyirmei_chat_userid', userId);
    
    // Initialize message sound
    messageSound.current = new Audio('/message-sound.mp3');
    
    return () => {
      messageSound.current = null;
    };
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  useEffect(() => {
    // Check connection to the API
    checkApiConnection();
    
    // Periodically check connection
    const interval = setInterval(() => {
      if (isOpen) checkApiConnection();
    }, 60000); // Check every minute when chatbot is open
    
    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('uyirmei_chat_settings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings) as ChatSettings;
        setSettings(parsedSettings);
        
        // Apply theme setting
        setTheme(parsedSettings.theme);
        setSoundEnabled(parsedSettings.soundEnabled);
      } catch (e) {
        console.error('Error parsing saved settings:', e);
      }
    }
  }, []);

  // Handle typing indicator
  useEffect(() => {
    const currentTime = Date.now();
    
    if (inputValue && currentTime - lastTypedTime > 1000) {
      setIsUserTyping(true);
      setLastTypedTime(currentTime);
    }
    
    const typingTimer = setTimeout(() => {
      setIsUserTyping(false);
    }, 2000);
    
    return () => clearTimeout(typingTimer);
  }, [inputValue, lastTypedTime]);

  useEffect(() => {
    // Test the API connection on component mount
    const testApiConnection = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/status`, { timeout: 3000 });
        if (response.status === 200) {
          setApiConnected(true);
          console.log("API connected successfully");
        }
      } catch (error) {
        console.log("API connection failed:", error);
        setApiConnected(false);
      }
    };
    
    testApiConnection();
  }, []);

  const checkApiConnection = async () => {
    setConnectionStatus('testing');
    try {
      // Try to connect to the Python backend
      const response = await axios.get(`${API_URL}/api/status`, { timeout: 3000 });
      if (response.status === 200) {
        setConnectionStatus('connected');
        setApiMode(true);
        
        // Check if we're connected to the Pro version
        const isPro = response.data.service?.includes('Pro');
        if (isPro) {
          console.log('Connected to Pro AI backend');
        }
        
        console.log('API connection successful, using advanced AI mode');
      } else {
        throw new Error('API returned non-200 status code');
      }
    } catch (error) {
      console.warn('API connection failed, using fallback mode:', error);
      setConnectionStatus('disconnected');
      setApiMode(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  // Simple sentiment detection for user messages
  const detectUserSentiment = (text: string): 'positive' | 'negative' | 'neutral' => {
    const lowerText = text.toLowerCase();
    
    const positiveWords = ['thank', 'thanks', 'good', 'great', 'excellent', 'amazing', 'awesome', 'love', 'appreciate'];
    const negativeWords = ['bad', 'poor', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'disappointed', 'unhappy'];
    
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  };

  // Process the message locally (when API is not available)
  const processLocalResponse = (text: string): Message => {
    console.log("Processing local response for:", text);
    const lowercaseInput = text.toLowerCase().trim();
    
    // Check for common greetings first
    if (lowercaseInput.match(/^(hi|hello|hey|greetings)/i)) {
      return {
        id: generateId(),
        text: "Hello! I'm Chol, your AI assistant. How can I help you today?",
        sender: 'bot',
        timestamp: new Date(),
        source: 'fallback'
      };
    }
    
    if (lowercaseInput.match(/^(thank you|thanks)/i)) {
      return {
        id: generateId(),
        text: "You're welcome! Is there anything else I can help you with?",
        sender: 'bot',
        timestamp: new Date(),
        source: 'fallback'
      };
    }
    
    if (lowercaseInput.match(/^(bye|goodbye|see you)/i)) {
      return {
        id: generateId(),
        text: "Goodbye! Feel free to come back anytime you have questions.",
        sender: 'bot',
        timestamp: new Date(),
        source: 'fallback'
      };
    }
    
    // Simple keyword matching to find the most relevant knowledge base entry
    let bestMatch = {
      topic: '',
      score: 0
    };
    
    // Calculate match score based on keyword presence
    Object.entries(TOPIC_KEYWORDS).forEach(([topic, keywords]) => {
      const matchScore = keywords.reduce((score, keyword) => {
        if (lowercaseInput.includes(keyword.toLowerCase())) {
          return score + 1;
        }
        return score;
      }, 0);
      
      if (matchScore > bestMatch.score) {
        bestMatch = {
          topic,
          score: matchScore
        };
      }
    });
    
    console.log("Best match:", bestMatch);
    
    // If we have a reasonable match, use the knowledge base
    if (bestMatch.score > 0 && KNOWLEDGE_BASE[bestMatch.topic]) {
      const knowledgeItem = KNOWLEDGE_BASE[bestMatch.topic];
      
      return {
        id: generateId(),
        text: knowledgeItem.text,
        sender: 'bot',
        timestamp: new Date(),
        links: knowledgeItem.links,
        source: 'kb'
      };
    }
    
    // Default responses if no keyword match is found
    const defaultResponses = [
      "I'd be happy to help with that. Could you provide more details about what specific information you're looking for?",
      "I'm here to assist you with questions about Uyir Mei. You can ask about our services, donation methods, or volunteer opportunities.",
      "I'm not sure I understand completely. You can ask me about our donation process, volunteer opportunities, or services we provide.",
      "Let me help you with that. We offer various services including education support, healthcare assistance, and community development initiatives.",
      "I'm here to assist with any questions about Uyir Mei. What would you like to know about our organization?"
    ];
    
    // Select a random default response
    const randomResponse = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    
    // Fallback for when no match is found
    return {
      id: generateId(),
      text: randomResponse,
      sender: 'bot',
      timestamp: new Date(),
      source: 'fallback'
    };
  };

  // Update the generateLocalResponse function to include sentiment property
  const generateLocalResponse = (userInput: string): Promise<{ text: string, links?: WebResource[], source?: string, sentiment?: string }> => {
    // This is the fallback mode when the API is unavailable
    return new Promise((resolve) => {
      setTimeout(() => {
        const normalizedInput = userInput.toLowerCase();
        
        // Simple keyword matching
        if (normalizedInput.includes('donate') || normalizedInput.includes('give')) {
          resolve({
            text: "You can donate by clicking the 'DONATE' button in the navigation bar or visiting our 'Ways to Give' page. We accept various payment methods including credit/debit cards and UPI.",
            links: [
              {
                title: "Ways to Give - Uyir Mei",
                url: "/give",
                description: "Explore different ways to support our cause through donations."
              }
            ],
            source: 'kb',
            sentiment: detectUserSentiment(userInput)
          });
        } else if (normalizedInput.includes('volunteer')) {
          resolve({
            text: "We'd love to have you as a volunteer! Please visit our 'Get Involved' page to see current volunteer opportunities.",
            links: [
              {
                title: "Volunteer Opportunities - Uyir Mei",
                url: "/get-involved",
                description: "Find volunteer opportunities that match your skills and interests."
              }
            ],
            source: 'kb',
            sentiment: detectUserSentiment(userInput)
          });
        } else if (normalizedInput.includes('contact')) {
          resolve({
            text: "You can reach us at contact@uyirmei.org or call us at +91 9876543210. Our office is located in Chennai, Tamil Nadu, India.",
            links: [
              {
                title: "Contact Us - Uyir Mei",
                url: "/contact",
                description: "Find our contact information and office locations."
              }
            ],
            source: 'kb',
            sentiment: detectUserSentiment(userInput)
          });
        } else if (normalizedInput.includes('thank')) {
          resolve({ text: "You're welcome! Is there anything else I can help you with?", source: 'kb', sentiment: detectUserSentiment(userInput) });
        } else if (normalizedInput.includes('hello') || normalizedInput.includes('hi')) {
          resolve({ text: "Hello! How can I assist you with Uyir Mei's services today?", source: 'kb', sentiment: detectUserSentiment(userInput) });
        } else if (normalizedInput.includes('bye')) {
          resolve({ text: "Goodbye! Feel free to chat again if you have more questions.", source: 'kb', sentiment: detectUserSentiment(userInput) });
        } else if (normalizedInput.includes('who are you')) {
          resolve({ text: "I'm Chol (சொல்), an AI assistant for Uyir Mei, designed to help answer your questions about our organization and services.", source: 'kb', sentiment: detectUserSentiment(userInput) });
        } else {
          // Default fallback response
          resolve({ 
            text: "I'm not sure I understand completely. You can ask me about our donation process, volunteer opportunities, services we provide, or how to contact us.",
            source: 'kb',
            sentiment: detectUserSentiment(userInput)
          });
        }
      }, 1000);
    });
  };

  const generateApiResponse = async (userInput: string, chatHistory: Message[]): Promise<{ text: string, links?: WebResource[], source?: string, sentiment?: string }> => {
    try {
      setIsSearchingWeb(true);
      const response = await axios.post(`${API_URL}/api/chat`, {
        message: userInput,
        messages: chatHistory,
        user_id: userId
      });
      
      setIsSearchingWeb(false);
      
      // Play sound if enabled
      if (settings.soundEnabled && messageSound.current) {
        messageSound.current.play().catch(err => console.log('Error playing sound:', err));
      }
      
      // Update stats based on sentiment if available
      if (response.data.sentiment) {
        setStats(prev => ({
          ...prev,
          messageCount: prev.messageCount + 1,
          positiveResponses: response.data.sentiment === 'positive' ? prev.positiveResponses + 1 : prev.positiveResponses
        }));
      }
      
      return {
        text: response.data.text,
        links: response.data.links || [],
        source: response.data.source,
        sentiment: response.data.sentiment
      };
    } catch (error) {
      setIsSearchingWeb(false);
      console.error('Error calling API:', error);
      
      // Fall back to local response if API fails
      const fallbackResponse = await generateLocalResponse(userInput);
      return {
        ...fallbackResponse,
        source: 'error'
      };
    }
  };

  const updateSuggestedQuestions = (userInput: string) => {
    const normalizedInput = userInput.toLowerCase();
    let contextQuestions: SuggestedQuestion[] = [];
    
    if (normalizedInput.includes('donate') || normalizedInput.includes('money') || normalizedInput.includes('give')) {
      contextQuestions = [
        { id: 'cq1', text: 'What payment methods do you accept?' },
        { id: 'cq2', text: 'Can I make a monthly donation?' },
        { id: 'cq3', text: 'How are donations used?' }
      ];
    } else if (normalizedInput.includes('volunteer') || normalizedInput.includes('help')) {
      contextQuestions = [
        { id: 'cq4', text: 'What skills are needed for volunteers?' },
        { id: 'cq5', text: 'How much time do I need to commit?' },
        { id: 'cq6', text: 'Can I volunteer remotely?' }
      ];
    } else if (normalizedInput.includes('service') || normalizedInput.includes('program')) {
      contextQuestions = [
        { id: 'cq7', text: 'Tell me about your education programs' },
        { id: 'cq8', text: 'What healthcare services do you provide?' },
        { id: 'cq9', text: 'How can I benefit from your services?' }
      ];
    } else {
      // Default suggestions if no context is detected
      contextQuestions = SUGGESTED_QUESTIONS.slice(0, 3);
    }
    
    setSuggestedQuestions(contextQuestions);
  };

  // Handle the submission of a message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isTyping) return;
    
    // User message
    const userMessage: Message = {
      id: generateId(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    // Add user message to the chat
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Clear the input and transcript
    const userInput = inputValue;
    setInputValue('');
    setTranscript('');
    setIsTyping(true);
    
    // If user is using voice, stop listening when message is sent
    if (isListening) {
      stopListening();
    }
    
    // Update stats
    setStats(prevStats => ({
      ...prevStats,
      messageCount: prevStats.messageCount + 1
    }));

    try {
      // Process locally since API connection might be failing
      const response = processLocalResponse(userInput);
      
      // Add the bot's response to the messages
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, response]);
        setIsTyping(false);
        
        // Update suggested questions based on the conversation
        updateSuggestedQuestions(userInput);
        
        // Play sound if enabled
        if (settings.soundEnabled && messageSound.current) {
          messageSound.current.play().catch(e => console.log('Error playing sound:', e));
        }
      }, 1000); // Simulated delay for typing effect
    } catch (error) {
      console.error('Error processing message:', error);
      
      // Add fallback response in case of error
      const errorResponse: Message = {
        id: generateId(),
        text: "I'm sorry, I encountered an error while processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
        source: 'error'
      };
      
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, errorResponse]);
        setIsTyping(false);
      }, 1000);
    } finally {
      setIsSearchingWeb(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const handleSuggestedQuestionClick = (questionText: string) => {
    setInputValue(questionText);
    handleSendMessage();
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleApiMode = async () => {
    setApiMode(!apiMode);
    if (!apiMode) {
      await checkApiConnection();
    }
  };

  const saveSettings = (newSettings: ChatSettings) => {
    setSettings(newSettings);
    localStorage.setItem('uyirmei_chat_settings', JSON.stringify(newSettings));
    
    // Apply changes
    setTheme(newSettings.theme);
    setSoundEnabled(newSettings.soundEnabled);
  };

  const resetChat = () => {
    if (window.confirm('Are you sure you want to reset the chat? This will clear your conversation history.')) {
      setMessages(INITIAL_MESSAGES);
      setSuggestedQuestions(SUGGESTED_QUESTIONS);
      // Clear server-side conversation memory if connected
      if (apiMode && connectionStatus === 'connected') {
        axios.post(`${API_URL}/api/clear_memory`, { user_id: userId })
          .catch(err => console.error('Error clearing memory:', err));
      }
    }
  };

  const handleFeedback = (messageId: string, feedback: 'positive' | 'negative') => {
    setMessages(prev => prev.map(message => 
      message.id === messageId 
        ? { ...message, feedback } 
        : message
    ));
    
    // In a real app, you would send this feedback to your server
    console.log(`Feedback recorded for message ${messageId}: ${feedback}`);
  };

  // Get theme classes based on settings
  const getThemeClasses = () => {
    const selectedTheme = settings.theme === 'system' 
      ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
      : settings.theme;
    
    return selectedTheme === 'dark' 
      ? {
          container: 'bg-gray-900 border border-gray-700',
          header: 'bg-gray-800 text-white',
          messagesList: 'bg-gray-900',
          userMessage: 'bg-theuyir-pink text-white',
          botMessage: 'bg-gray-800 text-white',
          input: 'bg-gray-800 border-gray-700 text-white',
          suggestedQuestions: 'bg-gray-800 border-gray-700',
          questionButton: 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600',
          buttonIcon: 'text-gray-300'
        }
      : {
          container: 'bg-white',
          header: 'bg-theuyir-pink text-white',
          messagesList: 'bg-gray-50',
          userMessage: 'bg-theuyir-pink text-white',
          botMessage: 'bg-gray-200 text-gray-800',
          input: 'bg-white border-gray-300 text-gray-800',
          suggestedQuestions: 'bg-gray-100 border-gray-200',
          questionButton: 'bg-white border-gray-300 text-theuyir-darkgrey hover:bg-gray-50',
          buttonIcon: 'text-gray-600'
        };
  };

  const themeClasses = getThemeClasses();

  // Settings Panel Component
  const SettingsPanel: React.FC<{ settings: ChatSettings, saveSettings: (settings: ChatSettings) => void, resetChat: () => void, themeClasses: any }> = ({ settings, saveSettings, resetChat, themeClasses }) => (
    <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${themeClasses.messagesList}`}>
      <h3 className="font-medium mb-3">Chat Settings</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Theme</label>
          <select 
            className={`w-full p-2 rounded border ${themeClasses.input}`}
            value={settings.theme}
            onChange={(e) => saveSettings({...settings, theme: e.target.value as 'light' | 'dark' | 'system'})}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System Default</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm">Show Typing Indicator</label>
          <button 
            onClick={() => saveSettings({...settings, showTypingIndicator: !settings.showTypingIndicator})}
            className={`p-2 rounded-full ${settings.showTypingIndicator ? 'bg-theuyir-pink text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            {settings.showTypingIndicator ? <Smile size={16} /> : <Frown size={16} />}
          </button>
        </div>
        
        <div className="flex items-center justify-between">
          <label className="text-sm">Auto-suggest Questions</label>
          <button 
            onClick={() => saveSettings({...settings, autoSuggest: !settings.autoSuggest})}
            className={`p-2 rounded-full ${settings.autoSuggest ? 'bg-theuyir-pink text-white' : 'bg-gray-200 dark:bg-gray-700'}`}
          >
            {settings.autoSuggest ? <Sparkles size={16} /> : <X size={16} />}
          </button>
        </div>
        
        <button
          onClick={resetChat}
          className="w-full mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center justify-center"
        >
          <RefreshCw size={16} className="mr-2" /> Reset Conversation
        </button>
      </div>
    </div>
  );

  // Stats Panel Component
  const StatsPanel: React.FC<{ stats: ChatStats, connectionStatus: string, themeClasses: any }> = ({ stats, connectionStatus, themeClasses }) => (
    <div className={`p-4 border-t border-gray-200 dark:border-gray-700 ${themeClasses.messagesList}`}>
      <h3 className="font-medium mb-3">Chat Statistics</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-sm">Total Messages:</span>
          <span className="font-medium">{stats.messageCount}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm">Feedback Given:</span>
          <span className="font-medium">{stats.feedbackGiven}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm">Positive Responses:</span>
          <span className="font-medium">{stats.positiveResponses}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm">User Sentiment:</span>
          <div className="flex items-center">
            <Smile size={16} className="text-green-500 mr-1" /> 
            <span className="mr-2">{stats.positiveUserSentiment}</span>
            <Frown size={16} className="text-red-500 mr-1" /> 
            <span>{stats.negativeUserSentiment}</span>
          </div>
        </div>
        
        <div className="flex justify-between">
          <span className="text-sm">Connection Status:</span>
          <span className={`font-medium ${connectionStatus === 'connected' ? 'text-green-500' : 'text-yellow-500'}`}>
            {connectionStatus === 'connected' ? 'Connected' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed bottom-4 right-4 z-50 w-80 md:w-96 rounded-lg shadow-xl transition-all duration-300 flex flex-col ${
        minimized ? 'h-14' : 'h-[500px] max-h-[80vh]'
      } ${themeClasses.container}`}
    >
      {/* Header */}
      <div className={`${themeClasses.header} p-3 rounded-t-lg flex items-center justify-between cursor-pointer`} onClick={toggleMinimize}>
        <div className="flex items-center">
          <Bot size={20} className="mr-2" />
          <h3 className="font-medium">Chol (சொல்)</h3>
          <div 
            className={`ml-2 w-2 h-2 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' : 
              connectionStatus === 'testing' ? 'bg-yellow-400 animate-pulse' : 
              'bg-red-400'
            }`} 
            title={connectionStatus === 'connected' ? 'Using advanced AI' : 
                  connectionStatus === 'testing' ? 'Testing connection...' : 
                  'Using local responses'}
          ></div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={(e) => { e.stopPropagation(); setShowStats(!showStats); setShowSettings(false); }} 
            className="hover:bg-opacity-20 hover:bg-black rounded-full p-1"
            aria-label="Show Statistics"
            title="Show Statistics"
          >
            <BarChart3 size={16} className={showStats ? 'text-theuyir-pink' : themeClasses.buttonIcon} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setShowSettings(!showSettings); setShowStats(false); }} 
            className="hover:bg-opacity-20 hover:bg-black rounded-full p-1"
            aria-label="Settings"
            title="Settings"
          >
            <Sparkles size={16} className={showSettings ? 'text-theuyir-pink' : themeClasses.buttonIcon} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); toggleTheme(); }} 
            className="hover:bg-opacity-20 hover:bg-black rounded-full p-1"
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); toggleApiMode(); }} 
            className="hover:bg-opacity-20 hover:bg-black rounded-full p-1"
            aria-label="Toggle AI mode"
            title={apiMode ? 'Using advanced AI (click to switch to local mode)' : 'Using local responses (click to try advanced AI)'}
          >
            <Cpu size={16} className={apiMode ? 'text-green-400' : 'text-gray-400'} />
          </button>
          <ChevronDown size={18} className={`transition-transform duration-300 ${minimized ? 'rotate-180' : ''}`} />
          <button 
            onClick={(e) => { e.stopPropagation(); onClose(); }} 
            className="hover:bg-opacity-20 hover:bg-black rounded-full p-1"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {!minimized && (
        <>
          {/* Settings Panel */}
          {showSettings && <SettingsPanel settings={settings} saveSettings={saveSettings} resetChat={resetChat} themeClasses={themeClasses} />}
          
          {/* Stats Panel */}
          {showStats && <StatsPanel stats={stats} connectionStatus={connectionStatus} themeClasses={themeClasses} />}
          
          {/* Messages */}
          {!showSettings && !showStats && (
            <div className={`flex-1 p-4 overflow-y-auto ${themeClasses.messagesList}`}>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`rounded-lg px-4 py-2 max-w-[85%] ${
                      message.sender === 'user' 
                        ? themeClasses.userMessage
                        : themeClasses.botMessage
                    }`}
                  >
                    <div className="flex items-start mb-1">
                      {message.sender === 'bot' && (
                        <Bot size={16} className={`mr-1 mt-1 ${
                          message.source === 'openai' || message.source === 'ai' ? 'text-green-500' : 'text-theuyir-pink'
                        }`} />
                      )}
                      {message.sender === 'user' && (
                        <User size={16} className="mr-1 mt-1 text-white" />
                      )}
                      <p className="text-sm md:text-base">{message.text}</p>
                    </div>
                    
                    {/* Links section for bot messages */}
                    {message.sender === 'bot' && message.links && message.links.length > 0 && (
                      <div className="mt-2 border-t border-gray-300 pt-2">
                        <p className="text-xs font-medium flex items-center mb-1">
                          <LinkIcon size={12} className="mr-1" />
                          Related Resources:
                        </p>
                        <ul className="space-y-1">
                          {message.links.map((link, idx) => (
                            <li key={idx} className="text-xs">
                              <a 
                                href={link.url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-start hover:underline text-blue-600 dark:text-blue-400"
                              >
                                <ExternalLink size={10} className="mr-1 mt-1 flex-shrink-0" />
                                <span>
                                  <span className="font-medium">{link.title}</span>
                                  {link.description && (
                                    <p className="text-gray-600 dark:text-gray-400 mt-0.5">{link.description}</p>
                                  )}
                                </span>
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-1">
                      <div className="flex items-center">
                        <p className="text-right text-xs opacity-70">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                        
                        {/* Show sentiment indicator for bot messages */}
                        {message.sender === 'bot' && message.sentiment && settings.showSourceIndicator && (
                          <span 
                            className={`ml-2 w-2 h-2 rounded-full ${
                              message.sentiment === 'positive' ? 'bg-green-400' : 
                              message.sentiment === 'negative' ? 'bg-red-400' : 
                              'bg-gray-400'
                            }`}
                            title={`Sentiment: ${message.sentiment}`}
                          ></span>
                        )}
                      </div>
                      
                      {/* Feedback buttons for bot messages */}
                      {message.sender === 'bot' && (
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleFeedback(message.id, 'positive')}
                            className={`p-1 rounded-full hover:bg-opacity-20 hover:bg-black ${message.feedback === 'positive' ? 'text-green-500' : 'opacity-50'}`}
                            aria-label="Helpful"
                          >
                            <ThumbsUp size={12} />
                          </button>
                          <button 
                            onClick={() => handleFeedback(message.id, 'negative')}
                            className={`p-1 rounded-full hover:bg-opacity-20 hover:bg-black ${message.feedback === 'negative' ? 'text-red-500' : 'opacity-50'}`}
                            aria-label="Not helpful"
                          >
                            <ThumbsDown size={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && settings.showTypingIndicator && (
                <div className="flex justify-start mb-4">
                  <div className={`${themeClasses.botMessage} rounded-lg px-4 py-2`}>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {isSearchingWeb && (
                <div className="flex justify-center mb-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <Search size={12} className="mr-1 animate-pulse" />
                    <span>Searching for information...</span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Suggested Questions */}
          {!showSettings && !showStats && !isTyping && suggestedQuestions.length > 0 && settings.autoSuggest && (
            <div className={`p-3 ${themeClasses.suggestedQuestions} border-t`}>
              <div className="flex items-center mb-2 text-xs text-gray-500">
                <HelpCircle size={14} className="mr-1" />
                <span>Suggested questions:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((question) => (
                  <button
                    key={question.id}
                    onClick={() => handleSuggestedQuestionClick(question.text)}
                    className={`${themeClasses.questionButton} text-sm border rounded-full px-3 py-1 transition-colors truncate max-w-full`}
                  >
                    {question.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex">
              {isVoiceSupported && (
                <Button 
                  type="button"
                  variant={isListening ? "destructive" : "outline"}
                  className="rounded-l-lg"
                  onClick={toggleListening}
                >
                  {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </Button>
              )}
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? "Listening..." : "Type your message..."}
                className={`flex-1 border ${isVoiceSupported ? '' : 'rounded-l-lg'} px-4 py-2 focus:outline-none focus:ring-2 focus:ring-theuyir-pink focus:border-transparent ${themeClasses.input}`}
                ref={inputRef}
              />
              <Button 
                onClick={handleSendMessage}
                className="rounded-r-lg bg-theuyir-pink hover:bg-theuyir-pink-dark"
                disabled={isTyping || !inputValue.trim() || isSearchingWeb}
              >
                {isTyping || isSearchingWeb ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send size={18} />}
              </Button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              {apiMode 
                ? "Powered by Chol (சொல்) AI" 
                : "Using local responses (API not connected)"}
              {isListening && <span className="ml-2 animate-pulse text-theuyir-pink">● Voice Active</span>}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default Chatbot; 