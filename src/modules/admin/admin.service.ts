import { prisma } from "../../lib/prisma";
import {
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "./admin.interface";

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

const updateCategory = async (
  categoryId: string,
  payload: UpdateCategoryPayload,
) => {
  const category = await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
  });

  if (payload.name) {
    const existingCategory = await prisma.category.findFirst({
      where: {
        name: {
          equals: payload.name,
          mode: "insensitive",
        },
      },
    });

    if (existingCategory) {
      throw new Error("Category name already exists.");
    }
  }

  const updatedCategory = await prisma.category.update({
    where: {
      id: category.id,
    },
    data: payload,
  });

  return updatedCategory;
};

const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return categories;
};

const deleteCategory = async (categoryId: string) => {
  await prisma.category.findUniqueOrThrow({
    where: {
      id: categoryId,
    },
  });

  await prisma.category.delete({
    where: {
      id: categoryId,
    },
  });
};

// user related

const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    omit: {
      password: true,
    },
    include: {
      technicianProfile: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users;
};

export const adminService = {
  createCategory,
  updateCategory,
  getAllCategories,
  deleteCategory,
  getAllUsers,
};
