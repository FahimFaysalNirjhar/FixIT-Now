import { prisma } from "../../lib/prisma";
import {
  AddAvailabilityPayload,
  CreateServicePayload,
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

// // availablity related services

const addAvailability = async (
  userId: string,
  payload: AddAvailabilityPayload,
) => {
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
    include: {
      user: true,
    },
  });

  if (technician.user.status === "BLOCKED") {
    throw new Error("Your account has been blocked. Please contact support.");
  }

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

const getMyAvailability = async (userId: string) => {
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  const availability = await prisma.availability.findMany({
    where: {
      technicianId: technician.id,
    },
    orderBy: [
      {
        day: "asc",
      },
      {
        startTime: "asc",
      },
    ],
    include: {
      technician: true,
    },
  });

  return availability;
};

const deleteAvailability = async (userId: string, availabilityId: string) => {
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  const availability = await prisma.availability.findUniqueOrThrow({
    where: {
      id: availabilityId,
    },
  });

  if (availability.technicianId !== technician.id) {
    throw new Error("You are not authorized to delete this availability slot.");
  }

  await prisma.availability.delete({
    where: {
      id: availabilityId,
    },
  });

  return null;
};

// service related services

// const createService = async (userId: string, payload: CreateServicePayload) => {
//   const technician = await prisma.technicianProfile.findUniqueOrThrow({
//     where: {
//       userId,
//     },
//     include: {
//       user: true,
//     },
//   });

//   if (technician.user.status === "BLOCKED") {
//     throw new Error("Your account has been blocked. Please contact support.");
//   }

//   const category = await prisma.category.findUniqueOrThrow({
//     where: {
//       id: payload.categoryId,
//     },
//   });

//   const service = await prisma.service.create({
//     data: {
//       title: payload.title,
//       description: payload.description,
//       price: payload.price,
//       categoryId: category.id,
//       technicianId: technician.id,
//     },
//     include: {
//       category: true,
//       technician: {
//         include: {
//           user: {
//             omit: {
//               password: true,
//             },
//           },
//         },
//       },
//     },
//   });

//   return service;
// };

export const technicianService = {
  createProfile,
  getMyProfile,
  updateProfile,
  addAvailability,
  getMyAvailability,
  deleteAvailability,
};
