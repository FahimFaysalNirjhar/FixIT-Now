import { Day } from "../../../generated/prisma/enums";

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

export interface AddAvailabilityPayload {
  day: Day;
  startTime: Date;
  endTime: Date;
}

export interface CreateServicePayload {
  title: string;
  description?: string;
  price: number;
  location?: string;
  categoryId: string;
}

export interface UpdateServicePayload {
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  categoryId?: string;
  isActive?: boolean;
}

export interface ITechnicianQuery {
  page?: string;
  limit?: string;
  searchTerm?: string;
  location?: string;
  isAvailable?: string;
  minRating?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
