import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";
import { IServiceQuery } from "./service.interface";

const getAllServices = async (query: IServiceQuery) => {
  const limit = query.limit ? Number(query.limit) : 10;
  const page = query.page ? Number(query.page) : 1;
  const skip = (page - 1) * limit;

  const sortBy = query.sortBy || "createdAt";
  const sortOrder = query.sortOrder || "desc";

  const andConditions: Prisma.ServiceWhereInput[] = [];

  if (query.searchTerm) {
    andConditions.push({
      title: {
        contains: query.searchTerm,
        mode: "insensitive",
      },
    });
  }

  if (query.categoryId) {
    andConditions.push({
      categoryId: query.categoryId,
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

  if (query.minPrice || query.maxPrice) {
    andConditions.push({
      price: {
        ...(query.minPrice && {
          gte: Number(query.minPrice),
        }),
        ...(query.maxPrice && {
          lte: Number(query.maxPrice),
        }),
      },
    });
  }

  // Only active services from active (non-blocked) technicians
  andConditions.push({
    isActive: true,
    technician: { user: { status: "ACTIVE" } },
  });

  const services = await prisma.service.findMany({
    where: {
      AND: andConditions,
    },
    take: limit,
    skip,
    orderBy: {
      [sortBy]: sortOrder,
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

  const total = await prisma.service.count({
    where: {
      AND: andConditions,
    },
  });

  return {
    data: services,
    meta: {
      page,
      limit,
      total,
      totalPage: Math.ceil(total / limit),
    },
  };
};

const getSingleService = async (serviceId: string) => {
  const service = await prisma.service.findUniqueOrThrow({
    where: {
      id: serviceId,
      isActive: true,
      technician: { user: { status: "ACTIVE" } },
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
          availability: {
            orderBy: [
              {
                day: "asc",
              },
              {
                startTime: "asc",
              },
            ],
          },
        },
      },
    },
  });

  return service;
};

export const serviceService = {
  getAllServices,
  getSingleService,
};
