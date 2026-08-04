import { prisma } from "../../lib/prisma";
import { CreateCategoryPayload } from "./admin.interface";

const createCategory = async (payload: CreateCategoryPayload) => {
  const { name } = payload;

  const existingCategory = await prisma.category.findFirst({
    where: {
      name: {
        equals: name,
        mode: "insensitive",
      },
    },
  });

  if (existingCategory) {
    throw new Error("Category already exists.");
  }

  const category = await prisma.category.create({
    data: {
      name,
    },
  });

  return category;
};

export const adminService = {
  createCategory,
};
