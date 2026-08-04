import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import {
  AddAvailabilityPayload,
  CreateServicePayload,
  CreateTechnicianProfilePayload,
  ITechnicianQuery,
  IUpdateTechnicianProfile,
  UpdateServicePayload,
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

// public

const getAllTechnicians = async (query: ITechnicianQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andConditions: Prisma.TechnicianProfileWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      OR: [
        {
          user: {
            name: {
              contains: query.searchTerm,
              mode: "insensitive",
            },
          },
        },
        {
          location: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
        {
          bio: {
            contains: query.searchTerm,
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (query.location) {
    andConditions.push({
      location: {
        contains: query.location,
        mode: "insensitive",
      },
    });
  }

  if (query.isAvailable !== undefined) {
    andConditions.push({
      isAvailable: query.isAvailable === "true",
    });
  }

  if (query.minRating) {
    andConditions.push({
      averageRating: {
        gte: Number(query.minRating),
      },
    });
  }

  const technicians = await prisma.technicianProfile.findMany({
    where: {
      AND: andConditions,
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
      services: {
        where: {
          isActive: true,
        },
        include: {
          category: true,
        },
      },
    },
  });

  const totalTechnicians = await prisma.technicianProfile.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: technicians,
    meta: {
      page,
      limit,
      total: totalTechnicians,
      totalPage: Math.ceil(totalTechnicians / limit),
    },
  };
};

const getSingleTechnician = async (technicianId: string) => {
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      id: technicianId,
    },
    include: {
      user: {
        omit: {
          password: true,
        },
      },
      services: {
        where: {
          isActive: true,
        },
        include: {
          category: true,
        },
      },
      availability: {
        orderBy: {
          day: "asc",
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
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  return technician;
};

// technician related

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

const deleteProfile = async (userId: string) => {
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
    include: {
      _count: {
        select: {
          services: true,
          bookings: true,
        },
      },
    },
  });

  if (technician._count.bookings > 0) {
    throw new Error(
      "Cannot delete profile because there are associated bookings.",
    );
  }

  await prisma.technicianProfile.delete({
    where: {
      userId,
    },
  });

  return null;
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

// service related

const createService = async (userId: string, payload: CreateServicePayload) => {
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

  const category = await prisma.category.findUniqueOrThrow({
    where: {
      id: payload.categoryId,
    },
  });

  const service = await prisma.service.create({
    data: {
      title: payload.title,
      description: payload.description,
      price: payload.price,
      location: payload.location,
      categoryId: payload.categoryId,
      technicianId: technician.id,
    },
    include: {
      category: true,
      technician: {
        include: {
          user: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
  });

  return service;
};

const updateService = async (
  userId: string,
  serviceId: string,
  payload: UpdateServicePayload,
) => {
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  const service = await prisma.service.findUniqueOrThrow({
    where: {
      id: serviceId,
    },
  });

  if (service.technicianId !== technician.id) {
    throw new Error("You are not authorized to update this service.");
  }

  if (payload.categoryId) {
    await prisma.category.findUniqueOrThrow({
      where: {
        id: payload.categoryId,
      },
    });
  }

  const updatedService = await prisma.service.update({
    where: {
      id: serviceId,
    },
    data: payload,
    include: {
      category: true,
      technician: {
        include: {
          user: {
            omit: {
              password: true,
            },
          },
        },
      },
    },
  });

  return updatedService;
};

const deleteService = async (userId: string, serviceId: string) => {
  const technician = await prisma.technicianProfile.findUniqueOrThrow({
    where: {
      userId,
    },
  });

  const service = await prisma.service.findUniqueOrThrow({
    where: {
      id: serviceId,
    },
  });

  if (service.technicianId !== technician.id) {
    throw new Error("You are not authorized to delete this service.");
  }

  await prisma.service.delete({
    where: {
      id: serviceId,
    },
  });
};

export const technicianService = {
  createProfile,
  getMyProfile,
  updateProfile,
  addAvailability,
  getMyAvailability,
  deleteAvailability,
  createService,
  updateService,
  deleteService,
  deleteProfile,
  getAllTechnicians,
  getSingleTechnician,
};
