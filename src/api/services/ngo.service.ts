import api from '../index';
import { API_URL } from "@/config";

export interface NGORegistrationData {
  name: string;
  email: string;
  phone: string;
  website?: string;
  description: string;
  registrationNumber: string;
  registrationType: string; // e.g., 'NGO', 'Trust', 'Society', 'Section 8'
  registrationDocument: File;
  taxExemptionNumber?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contactPerson: {
    name: string;
    role: string;
    email: string;
    phone: string;
  };
  focusAreas: string[]; // e.g., 'Education', 'Healthcare', 'Poverty Alleviation'
  establishedYear: number;
  logo?: File;
  bankDetails: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branchName: string;
    ifscCode: string;
  };
  organizationSize: string;
  fundingSources: string[];
  annualBudget?: number;
}

export interface NgoProfile {
  id: string;
  name: string;
  description: string;
  email: string;
  phone: string;
  logoUrl?: string;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  rating: number;
  focusAreas: string[];
  address?: {
    city?: string;
    state?: string;
  };
  size: 'small' | 'medium' | 'large';
  registrationNumber: string;
  establishedYear?: number;
  impactMetrics: {
    beneficiariesServed: number;
    projectsCompleted: number;
    successRate: number;
    fundingUtilization: number;
    volunteersEngaged?: number;
    donationsReceived?: number;
  };
  staff?: {
    volunteers: number;
  };
  badges?: string[];
}

export interface CollaborationRequest {
  id?: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  projectDetails?: {
    title: string;
    description: string;
    startDate?: string;
    endDate?: string;
    location?: string;
    resourcesNeeded?: string[];
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface CollaborationProject {
  id: string;
  title: string;
  description: string;
  participants: string[]; // NGO IDs
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  location?: string;
  resources: {
    type: string;
    description: string;
    providedBy: string; // NGO ID
    quantity: number;
    unit?: string;
  }[];
  activities: {
    id: string;
    title: string;
    description: string;
    assignedTo: string; // NGO ID
    status: 'pending' | 'in-progress' | 'completed';
    dueDate?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

const NGOService = {
  // Registration and profile management
  registerNGO: async (ngoData: NGORegistrationData): Promise<{ success: boolean; applicationId: string }> => {
    try {
      const formData = new FormData();
      
      // Append basic data
      Object.entries(ngoData).forEach(([key, value]) => {
        if (key !== 'registrationDocument' && key !== 'logo' && key !== 'address' && key !== 'bankDetails' && key !== 'contactPerson' && key !== 'focusAreas' && key !== 'fundingSources') {
          formData.append(key, String(value));
        }
      });
      
      // Append complex objects as JSON
      formData.append('address', JSON.stringify(ngoData.address));
      formData.append('bankDetails', JSON.stringify(ngoData.bankDetails));
      formData.append('contactPerson', JSON.stringify(ngoData.contactPerson));
      formData.append('focusAreas', JSON.stringify(ngoData.focusAreas));
      formData.append('fundingSources', JSON.stringify(ngoData.fundingSources));
      
      // Append files
      formData.append('registrationDocument', ngoData.registrationDocument);
      if (ngoData.logo) {
        formData.append('logo', ngoData.logo);
      }
      
      const { data } = await api.post('/ngos/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  getNGOProfile: async (): Promise<NgoProfile> => {
    try {
      const { data } = await api.get('/ngos/profile');
      return data;
    } catch (error) {
      console.error('Get NGO profile error:', error);
      throw error;
    }
  },

  updateNGOProfile: async (profileData: Partial<NgoProfile>): Promise<NgoProfile> => {
    const { data } = await api.put('/ngos/profile', profileData);
    return data;
  },

  // NGO discovery and verification
  getAllNGOs: async (filters?: Record<string, any>): Promise<NgoProfile[]> => {
    const { data } = await api.get('/ngos', { params: filters });
    return data;
  },

  getNGOById: async (id: string): Promise<NgoProfile> => {
    const { data } = await api.get(`/ngos/${id}`);
    return data;
  },

  verifyNGO: async (id: string, verificationStatus: 'verified' | 'rejected', notes?: string): Promise<{ success: boolean }> => {
    const { data } = await api.post(`/ngos/${id}/verify`, { verificationStatus, notes });
    return data;
  },

  // Collaboration
  sendCollaborationRequest: async (request: Omit<CollaborationRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<CollaborationRequest> => {
    const { data } = await api.post('/collaborations/requests', request);
    return data;
  },

  getCollaborationRequests: async (status?: 'pending' | 'accepted' | 'rejected'): Promise<CollaborationRequest[]> => {
    const { data } = await api.get('/collaborations/requests', { params: { status } });
    return data;
  },

  respondToCollaborationRequest: async (requestId: string, status: 'accepted' | 'rejected', message?: string): Promise<{ success: boolean }> => {
    const { data } = await api.post(`/collaborations/requests/${requestId}/respond`, { status, message });
    return data;
  },

  getCollaborationProjects: async (status?: string): Promise<CollaborationProject[]> => {
    const { data } = await api.get('/collaborations/projects', { params: { status } });
    return data;
  },

  getProjectById: async (id: string): Promise<CollaborationProject> => {
    const { data } = await api.get(`/collaborations/projects/${id}`);
    return data;
  },

  createCollaborationProject: async (project: Omit<CollaborationProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<CollaborationProject> => {
    const { data } = await api.post('/collaborations/projects', project);
    return data;
  },

  updateCollaborationProject: async (id: string, updates: Partial<CollaborationProject>): Promise<CollaborationProject> => {
    const { data } = await api.put(`/collaborations/projects/${id}`, updates);
    return data;
  },

  // Resource sharing
  shareResource: async (projectId: string, resource: CollaborationProject['resources'][0]): Promise<{ success: boolean }> => {
    const { data } = await api.post(`/collaborations/projects/${projectId}/resources`, resource);
    return data;
  },

  // Activity management
  createActivity: async (projectId: string, activity: Omit<CollaborationProject['activities'][0], 'id'>): Promise<CollaborationProject['activities'][0]> => {
    const { data } = await api.post(`/collaborations/projects/${projectId}/activities`, activity);
    return data;
  },

  updateActivityStatus: async (projectId: string, activityId: string, status: 'pending' | 'in-progress' | 'completed'): Promise<{ success: boolean }> => {
    const { data } = await api.put(`/collaborations/projects/${projectId}/activities/${activityId}`, { status });
    return data;
  },

  // Get top NGOs by impact
  getTopNGOs: async (metric: string, limit: number) => {
    try {
      // Use the existing getAllNGOs method with proper filters
      const allNgos = await NGOService.getAllNGOs();
      
      // Sort by the specified metric
      const sorted = [...allNgos].sort((a, b) => {
        if (metric === 'successRate') {
          return b.impactMetrics.successRate - a.impactMetrics.successRate;
        } else if (metric === 'fundingUtilization') {
          return b.impactMetrics.fundingUtilization - a.impactMetrics.fundingUtilization;
        } else {
          return b.impactMetrics.beneficiariesServed - a.impactMetrics.beneficiariesServed;
        }
      });
      
      // Return top n results
      return sorted.slice(0, limit);
    } catch (error) {
      console.error('Get top NGOs error:', error);
      throw error;
    }
  }
};

export default NGOService; 