import { prisma } from "../../lib/prisma";
import {
  AddAvailabilityPayload,
  CreateTechnicianProfilePayload,
  IUpdateTechnicianProfile,
} from "./technician.interface";

const createProfile = async (
  userId: string,
  payload: CreateTechnicianProfilePayload,
) => {
  const { bio, experience, hourlyRate, location } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
  });

  if (user.role !== "TECHNICIAN") {
    throw new Error("Only technicians can create a technician profile.");
  }

  const existingProfile = await prisma.technicianProfile.findUnique({
    where: {
      userId,
    },
  });

  if (existingProfile) {
    throw new Error("Technician profile already exists.");
  }

  const technicianProfile = await prisma.technicianProfile.create({
    data: {
      userId,
      bio,
      experience,
      hourlyRate,
      location,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
    },
  });

  return technicianProfile;
};

const getMyProfile = async (userId: string) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
      availability: true,
      services: {
        include: {
          category: true,
        },
      },
      reviews: {
        include: {
          customer: {
            omit: {
              password: true,
            },
          },
        },
      },
      _count: {
        select: {
          services: true,
          bookings: true,
          reviews: true,
        },
      },
    },
  });

  return technicianProfile;
};

const updateProfile = async (
  userId: string,
  payload: IUpdateTechnicianProfile,
) => {
  const technicianProfile = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  const updatedProfile = await prisma.technicianProfile.update({
    where: {
      id: technicianProfile.id,
    },
    data: payload,
    include: {
      user: {
        omit: {
          password: true,
        },
      },
      availability: true,
      services: true,
    },
  });

  return updatedProfile;
};

const addAvailability = async (
  userId: string,
  payload: AddAvailabilityPayload,
) => {
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  if (new Date(payload.startTime) >= new Date(payload.endTime)) {
    throw new Error("Start time must be before end time.");
  }

  const availability = await prisma.availability.create({
    data: {
      technicianId: technician.id,
      day: payload.day,
      startTime: new Date(payload.startTime),
      endTime: new Date(payload.endTime),
    },
  });

  return availability;
};

export const technicianService = {
  createProfile,
  getMyProfile,
  updateProfile,
  addAvailability,
};
