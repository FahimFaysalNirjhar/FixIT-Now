import { prisma } from "../../lib/prisma";
import { CreateTechnicianProfilePayload } from "./technician.interface";

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

export const technicianService = {
  createProfile,
};
