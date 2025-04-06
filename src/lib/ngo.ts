import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
  serverTimestamp,
  addDoc,
  deleteDoc,
  increment,
  arrayUnion,
  arrayRemove,
  Timestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { UserData } from './auth';

// NGO Types
export interface NgoProfile {
  id: string;
  userId: string;
  name: string;
  description: string;
  mission: string;
  vision?: string;
  logoUrl?: string;
  foundedYear: number;
  registrationNumber: string;
  registrationType: string;
  taxExemptionStatus?: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  website?: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  focusAreas: string[];
  size: 'small' | 'medium' | 'large';
  staff: {
    fullTime: number;
    partTime: number;
    volunteers: number;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  metrics?: {
    beneficiariesHelped?: number;
    volunteerHours?: number;
    projectsCompleted?: number;
    donationsReceived?: number;
    eventsOrganized?: number;
    collaborationsFormed?: number;
    rating?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface NgoProject {
  id: string;
  ngoId: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  focusAreas: string[];
  sdgGoals?: number[];
  location: {
    city: string;
    state: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    }
  };
  startDate: Timestamp;
  endDate?: Timestamp;
  status: 'planning' | 'active' | 'completed' | 'cancelled';
  budget: number;
  fundsRaised: number;
  beneficiariesTarget: number;
  beneficiariesReached: number;
  successMetrics?: Record<string, number>;
  collaborators: string[];  // NGO IDs
  volunteers: string[];  // User IDs
  mediaGallery?: string[];  // URLs
  updates: {
    id: string;
    date: Timestamp;
    content: string;
    mediaUrl?: string;
  }[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CollaborationRequest {
  id: string;
  senderId: string;  // NGO ID
  receiverId: string;  // NGO ID
  projectId?: string;  // Optional, for project-specific collaborations
  type: 'partnership' | 'resource' | 'expertise' | 'funding' | 'volunteers' | 'event';
  status: 'pending' | 'accepted' | 'rejected';
  message: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Badge {
  id: string;
  type: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  name: string;
  description: string;
  iconUrl: string;
  criteria: string[];
  issuedBy: string;
}

// Firebase collection paths
const NGO_COLLECTION = 'ngos';
const NGO_PROJECTS_COLLECTION = 'projects';
const COLLABORATION_REQUESTS_COLLECTION = 'collaborationRequests';
const BADGES_COLLECTION = 'badges';

// Create or update NGO profile
export const saveNgoProfile = async (
  ngoData: Partial<NgoProfile>,
  userId: string
): Promise<string> => {
  try {
    // Check if NGO already exists for this user
    const existingNgo = await getNgoByUserId(userId);
    const ngoId = existingNgo?.id || doc(collection(db, 'ngos')).id;
    
    const now = new Date();
    
    // Prepare data for Firestore
    const ngoProfile: Partial<NgoProfile> = {
      ...ngoData,
      id: ngoId,
      userId,
      verificationStatus: existingNgo?.verificationStatus || 'pending',
      updatedAt: now,
      ...(existingNgo ? {} : { createdAt: now }) // Only set createdAt for new NGOs
    };
    
    // Save to Firestore
    await setDoc(doc(db, 'ngos', ngoId), ngoProfile, { merge: true });
    
    return ngoId;
  } catch (error) {
    console.error('Error saving NGO profile:', error);
    throw error;
  }
};

// Upload NGO logo
export const uploadNgoLogo = async (
  ngoId: string,
  logoFile: File
): Promise<string> => {
  try {
    // Create storage reference
    const storageRef = ref(storage, `ngo-logos/${ngoId}/${Date.now()}-${logoFile.name}`);
    
    // Upload file
    await uploadBytes(storageRef, logoFile);
    
    // Get download URL
    const downloadUrl = await getDownloadURL(storageRef);
    
    // Update NGO profile with logo URL
    await setDoc(
      doc(db, 'ngos', ngoId),
      { logoUrl: downloadUrl, updatedAt: new Date() },
      { merge: true }
    );
    
    return downloadUrl;
  } catch (error) {
    console.error('Error uploading NGO logo:', error);
    throw error;
  }
};

// Get NGO profile by ID
export const getNgoById = async (ngoId: string): Promise<NgoProfile | null> => {
  try {
    const ngoRef = doc(db, NGO_COLLECTION, ngoId);
    const ngoSnapshot = await getDoc(ngoRef);
    
    if (ngoSnapshot.exists()) {
      return ngoSnapshot.data() as NgoProfile;
    }
    
    return null;
  } catch (error: any) {
    console.error('Error getting NGO:', error);
    throw new Error(error.message);
  }
};

// Get NGO profile by user ID
export const getNgoByUserId = async (userId: string): Promise<NgoProfile | null> => {
  try {
    const ngoQuery = query(
      collection(db, NGO_COLLECTION),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(ngoQuery);
    
    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data() as NgoProfile;
    }
    
    return null;
  } catch (error: any) {
    console.error('Error getting NGO by user ID:', error);
    throw new Error(error.message);
  }
};

// Search NGOs with pagination
export interface SearchNgosOptions {
  focusArea?: string;
  location?: string;
  verificationStatus?: 'verified' | 'pending' | 'all';
  size?: 'small' | 'medium' | 'large' | 'all';
  sortBy?: 'rating' | 'beneficiariesServed' | 'createdAt';
  sortDirection?: 'asc' | 'desc';
  lastVisible?: DocumentSnapshot;
  limit?: number;
}

export const searchNgos = async (
  searchTerm: string,
  options: SearchNgosOptions = {}
): Promise<{ ngos: NgoProfile[]; lastVisible: DocumentSnapshot | null }> => {
  try {
    let ngosQuery = query(collection(db, NGO_COLLECTION), where('isActive', '==', true));
    
    // Apply filters
    if (options.focusArea) {
      ngosQuery = query(ngosQuery, where('focusAreas', 'array-contains', options.focusArea));
    }
    
    if (options.location) {
      ngosQuery = query(ngosQuery, where('address.city', '==', options.location));
    }
    
    if (options.verificationStatus && options.verificationStatus !== 'all') {
      ngosQuery = query(ngosQuery, where('verificationStatus', '==', options.verificationStatus));
    }
    
    if (options.size && options.size !== 'all') {
      ngosQuery = query(ngosQuery, where('size', '==', options.size));
    }
    
    // Apply sorting
    const sortField = options.sortBy || 'rating';
    const sortDir = options.sortDirection || 'desc';
    ngosQuery = query(ngosQuery, orderBy(sortField, sortDir));
    
    // Apply pagination
    const pageSize = options.limit || 10;
    ngosQuery = query(ngosQuery, limit(pageSize));
    
    // Apply start after for pagination
    if (options.lastVisible) {
      ngosQuery = query(ngosQuery, startAfter(options.lastVisible));
    }
    
    const querySnapshot = await getDocs(ngosQuery);
    const ngos: NgoProfile[] = [];
    
    querySnapshot.forEach((doc) => {
      const ngoData = doc.data() as NgoProfile;
      
      // Filter by search term if provided
      if (!searchTerm || 
          ngoData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ngoData.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        ngos.push(ngoData);
      }
    });
    
    const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;
    
    return { ngos, lastVisible };
  } catch (error: any) {
    console.error('Error searching NGOs:', error);
    throw new Error(error.message);
  }
};

// Create or update NGO project
export const saveNgoProject = async (projectData: Partial<NgoProject>, ngoId: string): Promise<string> => {
  try {
    const isNewProject = !projectData.id;
    const projectId = projectData.id || doc(collection(db, NGO_PROJECTS_COLLECTION)).id;
    
    const projectRef = doc(db, NGO_PROJECTS_COLLECTION, projectId);
    
    if (isNewProject) {
      // Create new project
      await setDoc(projectRef, {
        ...projectData,
        id: projectId,
        ngoId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        fundsRaised: 0,
        beneficiariesReached: 0,
        collaborators: [],
        volunteers: [],
        updates: []
      });
      
      // Update NGO document to increment projects count
      const ngoRef = doc(db, NGO_COLLECTION, ngoId);
      await updateDoc(ngoRef, {
        'impactMetrics.projectsCompleted': increment(1),
        updatedAt: serverTimestamp()
      });
    } else {
      // Update existing project
      const { id, createdAt, ngoId: projectNgoId, ...updateData } = projectData as NgoProject;
      await updateDoc(projectRef, {
        ...updateData,
        updatedAt: serverTimestamp()
      });
    }
    
    return projectId;
  } catch (error: any) {
    console.error('Error saving NGO project:', error);
    throw new Error(error.message);
  }
};

// Get projects by NGO ID
export const getProjectsByNgoId = async (ngoId: string): Promise<NgoProject[]> => {
  try {
    const projectsQuery = query(
      collection(db, NGO_PROJECTS_COLLECTION),
      where('ngoId', '==', ngoId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(projectsQuery);
    const projects: NgoProject[] = [];
    
    querySnapshot.forEach((doc) => {
      projects.push(doc.data() as NgoProject);
    });
    
    return projects;
  } catch (error: any) {
    console.error('Error getting NGO projects:', error);
    throw new Error(error.message);
  }
};

// Add project update
export const addProjectUpdate = async (projectId: string, content: string, mediaUrl?: string): Promise<void> => {
  try {
    const projectRef = doc(db, NGO_PROJECTS_COLLECTION, projectId);
    const updateId = doc(collection(db, 'temp')).id;
    
    await updateDoc(projectRef, {
      updates: arrayUnion({
        id: updateId,
        date: serverTimestamp(),
        content,
        mediaUrl
      }),
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    console.error('Error adding project update:', error);
    throw new Error(error.message);
  }
};

// Create collaboration request
export const createCollaborationRequest = async (
  senderId: string,
  receiverId: string,
  type: CollaborationRequest['type'],
  message: string,
  projectId?: string
): Promise<string> => {
  try {
    const requestRef = doc(collection(db, COLLABORATION_REQUESTS_COLLECTION));
    
    await setDoc(requestRef, {
      id: requestRef.id,
      senderId,
      receiverId,
      projectId,
      type,
      status: 'pending',
      message,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return requestRef.id;
  } catch (error: any) {
    console.error('Error creating collaboration request:', error);
    throw new Error(error.message);
  }
};

// Get collaboration requests for an NGO
export const getCollaborationRequests = async (ngoId: string, status?: 'pending' | 'accepted' | 'rejected'): Promise<CollaborationRequest[]> => {
  try {
    let requestsQuery = query(
      collection(db, COLLABORATION_REQUESTS_COLLECTION),
      where('receiverId', '==', ngoId)
    );
    
    if (status) {
      requestsQuery = query(requestsQuery, where('status', '==', status));
    }
    
    requestsQuery = query(requestsQuery, orderBy('createdAt', 'desc'));
    
    const querySnapshot = await getDocs(requestsQuery);
    const requests: CollaborationRequest[] = [];
    
    querySnapshot.forEach((doc) => {
      requests.push(doc.data() as CollaborationRequest);
    });
    
    return requests;
  } catch (error: any) {
    console.error('Error getting collaboration requests:', error);
    throw new Error(error.message);
  }
};

// Update collaboration request status
export const updateCollaborationRequestStatus = async (
  requestId: string,
  status: 'accepted' | 'rejected'
): Promise<void> => {
  try {
    const requestRef = doc(db, COLLABORATION_REQUESTS_COLLECTION, requestId);
    
    await updateDoc(requestRef, {
      status,
      updatedAt: serverTimestamp()
    });
    
    // If accepted and has a project, update project collaborators
    if (status === 'accepted') {
      const requestSnapshot = await getDoc(requestRef);
      const requestData = requestSnapshot.data() as CollaborationRequest;
      
      if (requestData.projectId) {
        const projectRef = doc(db, NGO_PROJECTS_COLLECTION, requestData.projectId);
        await updateDoc(projectRef, {
          collaborators: arrayUnion(requestData.senderId),
          updatedAt: serverTimestamp()
        });
      }
    }
  } catch (error: any) {
    console.error('Error updating collaboration request status:', error);
    throw new Error(error.message);
  }
};

// Get all available badges
export const getAllBadges = async (): Promise<Badge[]> => {
  try {
    const badgesQuery = query(collection(db, BADGES_COLLECTION));
    const querySnapshot = await getDocs(badgesQuery);
    const badges: Badge[] = [];
    
    querySnapshot.forEach((doc) => {
      badges.push(doc.data() as Badge);
    });
    
    return badges;
  } catch (error: any) {
    console.error('Error getting badges:', error);
    throw new Error(error.message);
  }
};

// Update NGO impact metrics
export const updateNgoImpactMetrics = async (
  ngoId: string,
  metrics: Partial<NgoProfile['metrics']>
): Promise<void> => {
  try {
    const ngoRef = doc(db, NGO_COLLECTION, ngoId);
    
    await updateDoc(ngoRef, {
      metrics,
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    console.error('Error updating NGO impact metrics:', error);
    throw new Error(error.message);
  }
};

// Get top NGOs by impact
export const getTopNgosByImpact = async (
  metric: string = 'beneficiariesHelped',
  limitCount: number = 10
): Promise<NgoProfile[]> => {
  try {
    const ngoQuery = query(
      collection(db, NGO_COLLECTION),
      where('verificationStatus', '==', 'verified'),
      orderBy(`metrics.${metric}`, 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(ngoQuery);
    
    return querySnapshot.docs.map(doc => doc.data() as NgoProfile);
  } catch (error: any) {
    console.error('Error getting top NGOs by impact:', error);
    throw new Error(error.message);
  }
};

// Get NGOs by Focus Area
export const getNgosByFocusArea = async (
  focusArea: string,
  limitCount: number = 20
): Promise<NgoProfile[]> => {
  try {
    const ngoQuery = query(
      collection(db, NGO_COLLECTION),
      where('focusAreas', 'array-contains', focusArea),
      where('verificationStatus', '==', 'verified'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(ngoQuery);
    
    return querySnapshot.docs.map(doc => doc.data() as NgoProfile);
  } catch (error: any) {
    console.error('Error getting NGOs by focus area:', error);
    throw new Error(error.message);
  }
};

// Get NGOs by Location
export const getNgosByLocation = async (
  state: string,
  city?: string,
  limitCount: number = 20
): Promise<NgoProfile[]> => {
  try {
    let ngoQuery;
    
    if (city) {
      ngoQuery = query(
        collection(db, NGO_COLLECTION),
        where('address.state', '==', state),
        where('address.city', '==', city),
        where('verificationStatus', '==', 'verified'),
        limit(limitCount)
      );
    } else {
      ngoQuery = query(
        collection(db, NGO_COLLECTION),
        where('address.state', '==', state),
        where('verificationStatus', '==', 'verified'),
        limit(limitCount)
      );
    }
    
    const querySnapshot = await getDocs(ngoQuery);
    
    return querySnapshot.docs.map(doc => doc.data() as NgoProfile);
  } catch (error: any) {
    console.error('Error getting NGOs by location:', error);
    throw new Error(error.message);
  }
}; 