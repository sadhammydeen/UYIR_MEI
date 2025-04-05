import React, { useEffect, useState } from 'react';
import { 
  BarChart, PieChart, DollarSign, CreditCard, Wallet, 
  ArrowRight, CalendarRange, Receipt, Download
} from 'lucide-react';
import Button from '@/components/ui/button';

interface DonationRecord {
  id: string;
  date: string;
  amount: number;
  campaign: string;
  status: 'completed' | 'processing' | 'failed';
}

const DonorDashboard: React.FC = () => {
  const [donations, setDonations] = useState<DonationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call
    const fetchDonations = () => {
      setIsLoading(true);
      
      // Mock data
      const mockDonations: DonationRecord[] = [
        { 
          id: '123456', 
          date: '2023-10-15', 
          amount: 1000, 
          campaign: 'Education Support', 
          status: 'completed' 
        },
        { 
          id: '123457', 
          date: '2023-09-10', 
          amount: 500, 
          campaign: 'Meal Program', 
          status: 'completed' 
        },
        { 
          id: '123458', 
          date: '2023-08-05', 
          amount: 2000, 
          campaign: 'Medical Camp', 
          status: 'completed' 
        },
      ];
      
      setTimeout(() => {
        setDonations(mockDonations);
        setIsLoading(false);
      }, 500);
    };
    
    fetchDonations();
  }, []);
  
  const totalDonated = donations.reduce((sum, donation) => 
    donation.status === 'completed' ? sum + donation.amount : sum, 0);
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center mb-3">
            <div className="bg-theuyir-pink/10 p-3 rounded-full mr-3">
              <DollarSign size={24} className="text-theuyir-pink" />
            </div>
            <h3 className="font-semibold text-lg text-theuyir-darkgrey">Total Donations</h3>
          </div>
          <p className="text-3xl font-bold text-theuyir-darkgrey mb-1">₹{totalDonated.toLocaleString()}</p>
          <p className="text-sm text-gray-600">Your lifetime contribution</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center mb-3">
            <div className="bg-theuyir-pink/10 p-3 rounded-full mr-3">
              <Receipt size={24} className="text-theuyir-pink" />
            </div>
            <h3 className="font-semibold text-lg text-theuyir-darkgrey">Donation Count</h3>
          </div>
          <p className="text-3xl font-bold text-theuyir-darkgrey mb-1">{donations.length}</p>
          <p className="text-sm text-gray-600">Total donations made</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <div className="flex items-center mb-3">
            <div className="bg-theuyir-pink/10 p-3 rounded-full mr-3">
              <Wallet size={24} className="text-theuyir-pink" />
            </div>
            <h3 className="font-semibold text-lg text-theuyir-darkgrey">Tax Benefits</h3>
          </div>
          <p className="text-3xl font-bold text-theuyir-darkgrey mb-1">₹{Math.round(totalDonated * 0.5).toLocaleString()}</p>
          <p className="text-sm text-gray-600">Estimated tax deduction</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-bold text-theuyir-darkgrey mb-6">Recent Donations</h3>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-theuyir-yellow border-t-theuyir-pink rounded-full animate-spin"></div>
          </div>
        ) : donations.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-left font-semibold text-gray-600">Date</th>
                  <th className="pb-3 text-left font-semibold text-gray-600">Amount</th>
                  <th className="pb-3 text-left font-semibold text-gray-600">Campaign</th>
                  <th className="pb-3 text-left font-semibold text-gray-600">Status</th>
                  <th className="pb-3 text-left font-semibold text-gray-600">Receipt</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 text-theuyir-darkgrey">
                      {new Date(donation.date).toLocaleDateString()}
                    </td>
                    <td className="py-4 text-theuyir-darkgrey font-medium">
                      ₹{donation.amount.toLocaleString()}
                    </td>
                    <td className="py-4 text-theuyir-darkgrey">
                      {donation.campaign}
                    </td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        donation.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : donation.status === 'processing'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {donation.status.charAt(0).toUpperCase() + donation.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4">
                      <button className="flex items-center text-theuyir-pink hover:text-theuyir-pink-dark transition-colors">
                        <Download size={16} className="mr-1" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't made any donations yet.</p>
            <Button variant="default" asChild>
              <a href="/give">Make Your First Donation</a>
            </Button>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold text-theuyir-darkgrey mb-6">Donation Impact</h3>
          <div className="flex items-center justify-center h-64">
            <PieChart size={200} className="text-gray-300" />
            {/* In a real app, this would be a real chart showing the impact of donations */}
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-bold text-theuyir-darkgrey mb-6">Donation History</h3>
          <div className="flex items-center justify-center h-64">
            <BarChart size={200} className="text-gray-300" />
            {/* In a real app, this would be a real chart showing donation history */}
          </div>
        </div>
      </div>
      
      <div className="bg-theuyir-lightgrey p-6 rounded-xl">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-theuyir-darkgrey mb-2">Make Another Donation</h3>
            <p className="text-gray-600">Your continued support helps us create lasting impact.</p>
          </div>
          <Button variant="default" asChild className="flex items-center group">
            <a href="/give">
              Donate Now
              <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard; 