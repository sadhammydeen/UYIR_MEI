import api from '../index';

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
    position: string;
    email: string;
    phone: string;
  };
  focusAreas: string[]; // e.g., 'Education', 'Healthcare', 'Poverty Alleviation'
  establishedYear: number;
  logo?: File;
  bankDetails?: {
    accountName: string;
    accountNumber: string;
    bankName: string;
    branchName: string;
    ifscCode: string;
  };
}

export interface NGOProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  website?: string;
  description: string;
  registrationNumber: string;
  registrationType: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
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
    position: string;
    email: string;
    phone: string;
  };
  focusAreas: string[];
  establishedYear: number;
  logoUrl?: string;
  bankVerified: boolean;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  reviewCount?: number;
  impactMetrics?: {
    beneficiariesServed: number;
    projectsCompleted: number;
    volunteersEngaged: number;
    donationsReceived: number;
  };
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
    // For file uploads, use FormData
    const formData = new FormData();
    
    // Handle nested objects and arrays
    Object.entries(ngoData).forEach(([key, value]) => {
      if (key === 'registrationDocument' || key === 'logo') {
        formData.append(key, value as File);
      } else if (typeof value === 'object' && value !== null && !(value instanceof File)) {
        // Handle nested objects like address, contactPerson, bankDetails
        if (Array.isArray(value)) {
          // Handle arrays like focusAreas
          value.forEach((item, index) => {
            formData.append(`${key}[${index}]`, item);
          });
        } else {
          // Handle objects
          Object.entries(value).forEach(([nestedKey, nestedValue]) => {
            formData.append(`${key}.${nestedKey}`, nestedValue as string);
          });
        }
      } else {
        formData.append(key, value as string);
      }
    });
    
    const { data } = await api.post('/ngos/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data;
  },

  getNGOProfile: async (): Promise<NGOProfile> => {
    const { data } = await api.get('/ngos/profile');
    return data;
  },

  updateNGOProfile: async (profileData: Partial<NGOProfile>): Promise<NGOProfile> => {
    const { data } = await api.put('/ngos/profile', profileData);
    return data;
  },

  // NGO discovery and verification
  getAllNGOs: async (filters?: Record<string, any>): Promise<NGOProfile[]> => {
    const { data } = await api.get('/ngos', { params: filters });
    return data;
  },

  getNGOById: async (id: string): Promise<NGOProfile> => {
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
};

export default NGOService; 