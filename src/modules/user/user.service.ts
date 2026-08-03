import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import config from "../../config";
import { RegisterUserPayload } from "./user.interface";

const registerUser = async (payload: RegisterUserPayload) => {
  const { name, email, password, profilePhoto, role, phone, address } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new Error("User with this email already exists");
  }
  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );
  const createdUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      profilePhoto,
      phone,
      address,
    },
  });

  //   await prisma.profile.create({
  //     data: {
  //       userId: createdUser.id,
  //       profilePhoto,
  //     },
  //   });

  const user = await prisma.user.findUnique({
    where: {
      email: createdUser.email,
    },
    omit: {
      password: true,
    },
    include: {
      technicianProfile: true,
    },
  });

  return user;
};

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    omit: {
      password: true,
    },
    include: {
      technicianProfile: true,
    },
  });

  return user;
};

const updateMyProfile = async (
  userId: string,
  payload: Partial<RegisterUserPayload>,
) => {
  const { name, email, profilePhoto, phone, address } = payload;

  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      name,
      email,
      profilePhoto,
      phone,
      address,
    },
    omit: {
      password: true,
    },
    include: {
      technicianProfile: true,
    },
  });

  return updatedUser;
};
export const userService = {
  registerUser,
  getMyProfile,
  updateMyProfile,
};
