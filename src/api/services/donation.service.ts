import api from '../index';

export interface DonationData {
  amount: number;
  currency?: string;
  donationType: 'oneTime' | 'monthly';
  campaign?: string;
  paymentMethod: string;
  anonymous?: boolean;
  dedicationType?: 'inHonor' | 'inMemory';
  dedicatedTo?: string;
  notes?: string;
}

export interface DonationResponse {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  paymentMethod: string;
  paymentId?: string;
  createdAt: string;
  campaign?: string;
  receipt?: string;
}

export interface DonationStats {
  totalDonated: number;
  donationCount: number;
  campaigns: Array<{
    id: string;
    name: string;
    amount: number;
  }>;
}

const DonationService = {
  createDonation: async (donationData: DonationData): Promise<DonationResponse> => {
    const { data } = await api.post<DonationResponse>('/donations', donationData);
    return data;
  },

  getDonationHistory: async (): Promise<DonationResponse[]> => {
    const { data } = await api.get<DonationResponse[]>('/donations/history');
    return data;
  },

  getDonationStats: async (): Promise<DonationStats> => {
    const { data } = await api.get<DonationStats>('/donations/stats');
    return data;
  },

  getDonationReceipt: async (donationId: string): Promise<string> => {
    const { data } = await api.get<{ receiptUrl: string }>(`/donations/${donationId}/receipt`);
    return data.receiptUrl;
  },
  
  cancelRecurringDonation: async (subscriptionId: string): Promise<void> => {
    await api.post(`/donations/recurring/${subscriptionId}/cancel`);
  },
  
  getCampaigns: async (): Promise<any[]> => {
    const { data } = await api.get('/campaigns');
    return data;
  }
};

export default DonationService; 