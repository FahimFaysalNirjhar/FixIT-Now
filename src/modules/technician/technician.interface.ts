export interface CreateTechnicianProfilePayload {
  bio?: string;
  experience: number;
  hourlyRate: number;
  location: string;
}

export interface IUpdateTechnicianProfile {
  bio?: string;
  experience?: number;
  hourlyRate?: number;
  location?: string;
  isAvailable?: boolean;
}
