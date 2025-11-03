
import type { Timestamp, GeoPoint } from 'firebase/firestore';

export type Mechanic = {
  id: string;
  name: string;
  email: string;
  rating: number;
  reviews: number;
  distance: number; // This will likely be calculated on the client-side
  available: boolean;
  avatarUrl: string;
  avatarHint: string;
  location: GeoPoint;
};

export type JobRequest = {
  id: string;
  clientId: string;
  clientName?: string;
  mechanicId?: string;
  mechanicName?: string; // Added field
  carModel: string;
  issue: string;
  location: GeoPoint | null;
  status: 'Pending' | 'Accepted' | 'In Progress' | 'Completed' | 'Cancelled';
  createdAt: Timestamp;
};

export type UserProfile = {
  id: string;
  email: string;
  name?: string;
  role: 'client' | 'mechanic';
};

    