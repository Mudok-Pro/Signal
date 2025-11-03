
import type { Timestamp } from 'firebase/firestore';

export type Mechanic = {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  distance: number; // This will likely be calculated on the client-side
  available: boolean;
  avatarUrl: string;
  avatarHint: string;
  location: any; // Ideally a GeoPoint
};

export type JobRequest = {
  id: string;
  clientId: string;
  clientName?: string;
  mechanicId?: string;
  mechanicName?: string; // Added field
  carModel: string;
  issue: string;
  location: any; // Ideally a GeoPoint
  status: 'Pending' | 'Accepted' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: Timestamp;
};

export type UserProfile = {
  id: string;
  email: string;
  name?: string;
  role: 'client' | 'mechanic';
};
