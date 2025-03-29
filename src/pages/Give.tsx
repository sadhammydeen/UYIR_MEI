import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { 
  ArrowRight, Heart, CreditCard, Wallet, 
  DollarSign, Calendar, Gift, ShieldCheck, Clock 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Give = () => {
  const [donationAmount, setDonationAmount] = useState<number | string>('');
  const [donationType, setDonationType] = useState('oneTime');
  
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

  const handlePresetAmount = (amount: number) => {
    setDonationAmount(amount);
  };

  const handleCustomAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setDonationAmount(value);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="relative py-20 bg-theuyir-darkgrey text-white overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-20">
            <img
              src="/lovable-uploads/6baa9d06-e666-4b58-be83-ef94e87d1ddb.png"
              alt="Background"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center fade-in-section opacity-0">
              <p className="inline-block bg-theuyir-yellow/20 text-theuyir-yellow px-4 py-1 rounded-full text-sm font-medium mb-4">
                WAYS TO GIVE
              </p>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Your <span className="yellow-highlight">Generosity</span> Changes Lives
              </h1>
              <p className="text-white/80 text-lg mb-8">
                Every contribution, no matter the size, makes a meaningful difference in the lives of those we serve. 
                Choose how you'd like to give today.
              </p>
            </div>
          </div>
        </section>
        
        {/* Donation Form Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="fade-in-section opacity-0">
                <p className="inline-block bg-theuyir-pink/10 text-theuyir-pink px-4 py-1 rounded-full text-sm font-medium mb-4">
                  DONATE NOW
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-6">
                  Make a Direct <span className="yellow-highlight">Donation</span>
                </h2>
                <p className="text-gray-600 mb-8 leading-relaxed">
                  Your financial contribution goes directly to supporting our programs in food security, education, healthcare, and other essential services for the most vulnerable.
                </p>
                
                <div className="bg-theuyir-lightgrey p-6 rounded-lg shadow-inner mb-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block font-medium text-theuyir-darkgrey mb-3">Choose Amount</label>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {[500, 1000, 2000, 5000, 10000, 25000].map((amount) => (
                          <button
                            key={amount}
                            className={`py-3 px-4 rounded-lg text-center transition-all duration-300 ${
                              donationAmount === amount 
                                ? 'bg-theuyir-yellow text-theuyir-darkgrey font-medium shadow-md' 
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                            onClick={() => handlePresetAmount(amount)}
                          >
                            ₹{amount.toLocaleString()}
                          </button>
                        ))}
                      </div>
                      
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                          <span className="text-gray-500">₹</span>
                        </div>
                        <input
                          type="text"
                          className="pl-8 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-theuyir-pink focus:border-theuyir-pink text-gray-700"
                          placeholder="Custom amount"
                          value={donationAmount}
                          onChange={handleCustomAmount}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block font-medium text-theuyir-darkgrey mb-3">Donation Type</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          className={`py-3 px-4 rounded-lg text-center transition-all duration-300 flex items-center justify-center ${
                            donationType === 'oneTime' 
                              ? 'bg-theuyir-yellow text-theuyir-darkgrey font-medium shadow-md' 
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setDonationType('oneTime')}
                        >
                          <DollarSign size={18} className="mr-2" />
                          One-Time
                        </button>
                        <button
                          className={`py-3 px-4 rounded-lg text-center transition-all duration-300 flex items-center justify-center ${
                            donationType === 'monthly' 
                              ? 'bg-theuyir-yellow text-theuyir-darkgrey font-medium shadow-md' 
                              : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                          onClick={() => setDonationType('monthly')}
                        >
                          <Calendar size={18} className="mr-2" />
                          Monthly
                        </button>
                      </div>
                    </div>
                    
                    <Button variant="default" size="lg" className="w-full group">
                      Proceed to Payment <ArrowRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="flex-1 flex items-center p-4 bg-theuyir-lightgrey rounded-lg">
                    <ShieldCheck size={24} className="text-theuyir-darkgrey mr-3" />
                    <span className="text-gray-700 text-sm">Secure Payments</span>
                  </div>
                  <div className="flex-1 flex items-center p-4 bg-theuyir-lightgrey rounded-lg">
                    <Heart size={24} className="text-theuyir-darkgrey mr-3" />
                    <span className="text-gray-700 text-sm">Tax Benefits</span>
                  </div>
                  <div className="flex-1 flex items-center p-4 bg-theuyir-lightgrey rounded-lg">
                    <Clock size={24} className="text-theuyir-darkgrey mr-3" />
                    <span className="text-gray-700 text-sm">Regular Updates</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-6 gap-2 items-center">
                  <img src="https://via.placeholder.com/80x40?text=Visa" alt="Visa" className="h-8 w-auto" />
                  <img src="https://via.placeholder.com/80x40?text=Mastercard" alt="Mastercard" className="h-8 w-auto" />
                  <img src="https://via.placeholder.com/80x40?text=Amex" alt="Amex" className="h-8 w-auto" />
                  <img src="https://via.placeholder.com/80x40?text=Rupay" alt="Rupay" className="h-8 w-auto" />
                  <img src="https://via.placeholder.com/80x40?text=UPI" alt="UPI" className="h-8 w-auto" />
                  <img src="https://via.placeholder.com/80x40?text=Paytm" alt="Paytm" className="h-8 w-auto" />
                </div>
              </div>
              
              <div className="fade-in-section opacity-0">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1590312500142-42d9452a8270?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Impact" 
                    className="w-full h-60 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-4 text-theuyir-darkgrey">Your Impact</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="mr-3 p-2 bg-theuyir-yellow/20 rounded-full text-theuyir-darkgrey">
                          <DollarSign size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-theuyir-darkgrey">₹500</p>
                          <p className="text-gray-600 text-sm">Provides a week of nutritious meals for a child</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mr-3 p-2 bg-theuyir-yellow/20 rounded-full text-theuyir-darkgrey">
                          <DollarSign size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-theuyir-darkgrey">₹2,000</p>
                          <p className="text-gray-600 text-sm">Supplies educational materials for a student for a semester</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mr-3 p-2 bg-theuyir-yellow/20 rounded-full text-theuyir-darkgrey">
                          <DollarSign size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-theuyir-darkgrey">₹5,000</p>
                          <p className="text-gray-600 text-sm">Covers basic medical check-ups for 10 individuals</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="mr-3 p-2 bg-theuyir-yellow/20 rounded-full text-theuyir-darkgrey">
                          <DollarSign size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-theuyir-darkgrey">₹10,000</p>
                          <p className="text-gray-600 text-sm">Supports vocational training for a youth for a month</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-theuyir-lightgrey rounded-lg">
                      <p className="text-theuyir-darkgrey text-center">
                        <span className="font-semibold">100% of your donation</span> goes directly to the cause you choose to support.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Other Ways to Give */}
        <section className="py-20 bg-theuyir-lightgrey">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 fade-in-section opacity-0">
              <p className="inline-block bg-theuyir-yellow/20 text-theuyir-darkgrey px-4 py-1 rounded-full text-sm font-medium mb-4">
                ADDITIONAL OPTIONS
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-4">
                Other Ways to <span className="yellow-highlight">Support</span> Our Mission
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Beyond monetary donations, there are many ways you can contribute to our cause and make a meaningful impact.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {/* Option 1 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg group fade-in-section opacity-0">
                <div className="relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1593113630400-ea4288922497?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="In-Kind Donations" 
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-0 left-0 bg-theuyir-yellow text-black font-medium px-3 py-1 m-3 rounded-md text-sm">
                    Material Support
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-theuyir-darkgrey">In-Kind Donations</h3>
                  <p className="text-gray-600 mb-6">
                    Donate essential items such as food, clothing, books, medical supplies, or other goods that can 
                    directly benefit those in need.
                  </p>
                  <Button variant="primary" size="md" fullWidth className="group">
                    Learn More <ArrowRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
              
              {/* Option 2 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg group fade-in-section opacity-0" style={{ animationDelay: '0.2s' }}>
                <div className="relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1564939558297-fc396f18e5c7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Corporate Partnerships" 
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-0 left-0 bg-theuyir-yellow text-black font-medium px-3 py-1 m-3 rounded-md text-sm">
                    Organizational Support
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-theuyir-darkgrey">Corporate Partnerships</h3>
                  <p className="text-gray-600 mb-6">
                    Engage your company in CSR initiatives, sponsorships, or employee giving programs to create 
                    a larger collective impact.
                  </p>
                  <Button variant="primary" size="md" fullWidth className="group">
                    Partner With Us <ArrowRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
              
              {/* Option 3 */}
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg group fade-in-section opacity-0" style={{ animationDelay: '0.4s' }}>
                <div className="relative overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Legacy Giving" 
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-0 left-0 bg-theuyir-yellow text-black font-medium px-3 py-1 m-3 rounded-md text-sm">
                    Long-Term Impact
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-3 text-theuyir-darkgrey">Legacy Giving</h3>
                  <p className="text-gray-600 mb-6">
                    Create a lasting impact by including Uyir Mei in your will or estate plans, ensuring your 
                    values live on through your generosity.
                  </p>
                  <Button variant="primary" size="md" fullWidth className="group">
                    Explore Options <ArrowRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Payment Methods */}
            <div className="bg-white p-8 rounded-xl shadow-md mb-8 fade-in-section opacity-0">
              <h3 className="text-2xl font-bold mb-6 text-theuyir-darkgrey text-center">Convenient Payment Methods</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-theuyir-yellow/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="text-theuyir-darkgrey" size={32} />
                  </div>
                  <h4 className="font-semibold mb-2 text-theuyir-darkgrey">Credit/Debit Card</h4>
                  <p className="text-gray-600 text-sm">
                    Make secure donations using Visa, Mastercard, American Express, or RuPay cards.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-theuyir-yellow/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Wallet className="text-theuyir-darkgrey" size={32} />
                  </div>
                  <h4 className="font-semibold mb-2 text-theuyir-darkgrey">UPI/Digital Wallets</h4>
                  <p className="text-gray-600 text-sm">
                    Use Google Pay, PhonePe, Paytm, or other UPI apps for quick and easy transactions.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="bg-theuyir-yellow/10 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
                    <Gift className="text-theuyir-darkgrey" size={32} />
                  </div>
                  <h4 className="font-semibold mb-2 text-theuyir-darkgrey">Bank Transfer</h4>
                  <p className="text-gray-600 text-sm">
                    Set up one-time or recurring donations directly from your bank account.
                  </p>
                </div>
              </div>
            </div>
            
            {/* Tax Benefits */}
            <div className="bg-theuyir-pink/10 p-8 rounded-xl text-center fade-in-section opacity-0">
              <h3 className="text-xl font-bold mb-4 text-theuyir-pink">Tax Benefits</h3>
              <p className="text-gray-700 max-w-2xl mx-auto">
                All donations to Uyir Mei are eligible for tax benefits under Section 80G of the Income Tax Act. 
                You will receive an official receipt which can be used for tax deduction purposes.
              </p>
            </div>
          </div>
        </section>
        
        {/* Donation Stories */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 fade-in-section opacity-0">
              <p className="inline-block bg-theuyir-pink/10 text-theuyir-pink px-4 py-1 rounded-full text-sm font-medium mb-4">
                REAL IMPACT
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-4">
                Stories of <span className="yellow-highlight">Generosity</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                See how donations like yours have made a real difference in the lives of individuals and communities.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
              <div className="relative fade-in-section opacity-0">
                <img 
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                  alt="Education Impact" 
                  className="rounded-xl shadow-lg"
                />
                <div className="absolute -bottom-6 -right-6 bg-theuyir-yellow py-3 px-6 rounded-lg shadow-lg">
                  <p className="font-bold text-theuyir-darkgrey text-2xl">₹8.5 Lakhs</p>
                  <p className="text-theuyir-darkgrey text-sm">Raised for Education</p>
                </div>
              </div>
              
              <div className="fade-in-section opacity-0">
                <h3 className="text-2xl font-bold mb-4 text-theuyir-darkgrey">
                  Supporting 200 Children's Education
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Thanks to generous donors like you, we were able to provide educational support to 200 children 
                  from underprivileged backgrounds in rural Tamil Nadu. This included school supplies, uniforms, 
                  and after-school tutoring programs.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  "The educational support has transformed my daughter's life. She's now at the top of her class and 
                  dreams of becoming a doctor. We could never have afforded these resources on our own." 
                  <span className="font-medium">— Lakshmi, parent of a beneficiary</span>
                </p>
                <Button variant="secondary" size="md" className="group">
                  Read Full Story <ArrowRight size={16} className="ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
            
            <div className="text-center fade-in-section opacity-0">
              <Button variant="outline" size="lg" className="border-theuyir-darkgrey text-theuyir-darkgrey">
                View More Impact Stories
              </Button>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-20 bg-theuyir-lightgrey">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 fade-in-section opacity-0">
              <p className="inline-block bg-theuyir-yellow/20 text-theuyir-darkgrey px-4 py-1 rounded-full text-sm font-medium mb-4">
                FREQUENTLY ASKED QUESTIONS
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-theuyir-darkgrey mb-4">
                Common <span className="yellow-highlight">Questions</span> About Giving
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Find answers to frequently asked questions about donations, tax benefits, and how your contribution makes an impact.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-md fade-in-section opacity-0">
                  <h3 className="text-lg font-semibold mb-3 text-theuyir-darkgrey">How is my donation used?</h3>
                  <p className="text-gray-600">
                    100% of your donation goes directly to the cause you choose to support. We maintain complete transparency about 
                    fund allocation, and you can track the impact of your contribution through regular updates.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md fade-in-section opacity-0" style={{ animationDelay: '0.2s' }}>
                  <h3 className="text-lg font-semibold mb-3 text-theuyir-darkgrey">Are donations tax-deductible?</h3>
                  <p className="text-gray-600">
                    Yes, all donations to Uyir Mei are eligible for tax benefits under Section 80G of the Income Tax Act. 
                    You will receive an official receipt for tax deduction purposes.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md fade-in-section opacity-0" style={{ animationDelay: '0.4s' }}>
                  <h3 className="text-lg font-semibold mb-3 text-theuyir-darkgrey">Can I specify how my donation is used?</h3>
                  <p className="text-gray-600">
                    Absolutely! You can designate your donation for specific causes like education, healthcare, food security, 
                    or any of our other focus areas. You can also contribute to our general fund, which allows us to allocate 
                    resources where they're needed most.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md fade-in-section opacity-0" style={{ animationDelay: '0.6s' }}>
                  <h3 className="text-lg font-semibold mb-3 text-theuyir-darkgrey">How do I set up a recurring donation?</h3>
                  <p className="text-gray-600">
                    You can set up a monthly recurring donation by selecting the "Monthly" option on our donation form. 
                    Your card or account will be automatically charged each month, and you can modify or cancel your 
                    recurring donation at any time.
                  </p>
                </div>
                
                <div className="bg-white p-6 rounded-xl shadow-md fade-in-section opacity-0" style={{ animationDelay: '0.8s' }}>
                  <h3 className="text-lg font-semibold mb-3 text-theuyir-darkgrey">Is my payment information secure?</h3>
                  <p className="text-gray-600">
                    Yes, we use industry-standard encryption and secure payment processors to ensure your financial 
                    information is protected. We do not store your complete credit card details on our servers.
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-10 fade-in-section opacity-0">
                <p className="text-gray-600 mb-4">Still have questions about donating?</p>
                <Button variant="secondary" size="md">
                  Contact Our Donor Support Team
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 bg-theuyir-pink text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 fade-in-section opacity-0">
              Ready to Make a <span className="yellow-highlight">Difference</span>?
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-10 fade-in-section opacity-0" style={{ animationDelay: '0.2s' }}>
              Your generosity can transform lives and create lasting change in communities across India. 
              Every contribution, no matter the size, brings us one step closer to a more equitable society.
            </p>
            <div className="flex flex-wrap justify-center gap-4 fade-in-section opacity-0" style={{ animationDelay: '0.4s' }}>
              <Button variant="primary" size="lg">
                Donate Now
              </Button>
              <Button size="lg" className="bg-white text-theuyir-pink hover:bg-white/90">
                Explore Other Ways to Give
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Give;
