import api from '../index';

export interface BeneficiaryApplication {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  familySize: number;
  incomeLevel: string;
  needs: string[];
  currentSituation: string;
  supportRequested: string[];
  documents?: File[];
  referredBy?: string;
}

export interface ServiceRequest {
  id: string;
  beneficiaryId: string;
  serviceType: string;
  description: string;
  status: 'pending' | 'approved' | 'in-progress' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  completedAt?: string;
}

export interface AvailableService {
  id: string;
  name: string;
  category: string;
  description: string;
  eligibility: string[];
  documentation: string[];
  process: string;
  timeline: string;
  imageUrl?: string;
}

const BeneficiaryService = {
  applyForBeneficiary: async (application: BeneficiaryApplication): Promise<{ success: boolean; applicationId: string }> => {
    // For file uploads, you would use FormData
    const formData = new FormData();
    
    // Add all application data to formData
    Object.entries(application).forEach(([key, value]) => {
      if (key === 'documents') {
        if (application.documents) {
          application.documents.forEach((doc, index) => {
            formData.append(`documents[${index}]`, doc);
          });
        }
      } else if (key === 'needs' || key === 'supportRequested') {
        // Handle arrays
        (value as string[]).forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        formData.append(key, value as string | Blob);
      }
    });
    
    const { data } = await api.post('/beneficiaries/apply', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return data;
  },

  getMyProfile: async (): Promise<any> => {
    const { data } = await api.get('/beneficiaries/profile');
    return data;
  },

  requestService: async (request: Omit<ServiceRequest, 'id' | 'beneficiaryId' | 'status' | 'createdAt' | 'updatedAt'>): 
    Promise<ServiceRequest> => {
    const { data } = await api.post('/service-requests', request);
    return data;
  },

  getMyServiceRequests: async (): Promise<ServiceRequest[]> => {
    const { data } = await api.get('/service-requests/mine');
    return data;
  },

  getAvailableServices: async (): Promise<AvailableService[]> => {
    const { data } = await api.get('/services');
    return data;
  },

  getServiceById: async (id: string): Promise<AvailableService> => {
    const { data } = await api.get(`/services/${id}`);
    return data;
  },
  
  checkEligibility: async (serviceId: string): Promise<{ eligible: boolean; reasons?: string[] }> => {
    const { data } = await api.get(`/services/${serviceId}/eligibility-check`);
    return data;
  },
};

export default BeneficiaryService; 