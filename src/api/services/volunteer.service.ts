import api from '../index';

export interface VolunteerApplication {
  name: string;
  email: string;
  phone: string;
  address?: string;
  city: string;
  state: string;
  postalCode?: string;
  interests: string[];
  skills: string[];
  availability: {
    weekdays?: boolean;
    weekends?: boolean;
    mornings?: boolean;
    afternoons?: boolean;
    evenings?: boolean;
  };
  experience?: string;
  motivation: string;
  references?: {
    name: string;
    relation: string;
    contact: string;
  }[];
}

export interface VolunteerOpportunity {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  timeCommitment: string;
  skills: string[];
  startDate: string;
  endDate?: string;
  slots: number;
  filledSlots: number;
  status: 'open' | 'filled' | 'completed' | 'cancelled';
  imageUrl?: string;
}

export interface VolunteerHour {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  date: string;
  hours: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

const VolunteerService = {
  applyForVolunteer: async (application: VolunteerApplication): Promise<{ success: boolean; applicationId: string }> => {
    const { data } = await api.post('/volunteers/apply', application);
    return data;
  },

  getOpportunities: async (filters?: Record<string, any>): Promise<VolunteerOpportunity[]> => {
    const { data } = await api.get('/volunteer-opportunities', { params: filters });
    return data;
  },

  getOpportunityById: async (id: string): Promise<VolunteerOpportunity> => {
    const { data } = await api.get(`/volunteer-opportunities/${id}`);
    return data;
  },

  applyToOpportunity: async (opportunityId: string): Promise<{ success: boolean }> => {
    const { data } = await api.post(`/volunteer-opportunities/${opportunityId}/apply`);
    return data;
  },

  getMyApplications: async (): Promise<any[]> => {
    const { data } = await api.get('/volunteers/my-applications');
    return data;
  },

  logHours: async (hours: Omit<VolunteerHour, 'id' | 'status' | 'submittedAt'>): Promise<VolunteerHour> => {
    const { data } = await api.post('/volunteers/hours', hours);
    return data;
  },

  getMyHours: async (): Promise<VolunteerHour[]> => {
    const { data } = await api.get('/volunteers/my-hours');
    return data;
  },

  getVolunteerStats: async (): Promise<{ totalHours: number; totalOpportunities: number }> => {
    const { data } = await api.get('/volunteers/stats');
    return data;
  },
};

export default VolunteerService; 