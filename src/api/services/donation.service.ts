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
  needId?: string; // ID of the specific need if this is a need-based donation
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
  needId?: string; // Reference to the need if applicable
  receipt?: string;
}

export interface DonationNeed {
  id: string;
  title: string;
  description: string;
  category: 'education' | 'healthcare' | 'food' | 'shelter' | 'livelihood' | 'other';
  beneficiaryType: 'individual' | 'family' | 'community';
  beneficiaryId?: string; // Optional reference to a specific beneficiary
  ngoId?: string; // Optional reference to an NGO that identified this need
  amount: number;
  amountRaised: number;
  deadline?: string;
  status: 'active' | 'fulfilled' | 'expired';
  location?: string;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  donors: {
    userId: string;
    amount: number;
    createdAt: string;
    anonymous: boolean;
  }[];
  impactMetrics?: {
    beneficiariesHelped: number;
    completionDate?: string;
    successStory?: string;
    outcomeDescription?: string;
    images?: string[];
  };
}

export interface DonationStats {
  totalDonated: number;
  donationCount: number;
  campaigns: Array<{
    id: string;
    name: string;
    amount: number;
  }>;
  needsServed?: number;
  beneficiariesImpacted?: number;
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
  },

  // Need-based donation methods
  getActiveNeeds: async (filters?: {
    category?: string;
    location?: string;
    beneficiaryType?: string;
    ngoId?: string;
  }): Promise<DonationNeed[]> => {
    const { data } = await api.get('/needs', { params: filters });
    return data;
  },

  getNeedById: async (needId: string): Promise<DonationNeed> => {
    const { data } = await api.get(`/needs/${needId}`);
    return data;
  },

  donateToNeed: async (needId: string, donationData: DonationData): Promise<DonationResponse> => {
    const { data } = await api.post(`/needs/${needId}/donate`, donationData);
    return data;
  },

  createNeed: async (needData: Omit<DonationNeed, 'id' | 'amountRaised' | 'status' | 'donors' | 'createdAt' | 'updatedAt'>): Promise<DonationNeed> => {
    const { data } = await api.post('/needs', needData);
    return data;
  },

  updateNeedImpact: async (needId: string, impactData: DonationNeed['impactMetrics']): Promise<DonationNeed> => {
    const { data } = await api.put(`/needs/${needId}/impact`, impactData);
    return data;
  }
};

export default DonationService; 