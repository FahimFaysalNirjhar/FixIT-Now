import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { userService } from "./user.service";
import { sendResponse } from "../utils/sendResponse";
import HttpStatus from "http-status";

const checkPhone = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const phone = String(req.query.phone ?? "");
    const exists = await userService.isPhoneTaken(phone);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Phone number checked",
      data: { exists },
    });
  },
);

const registerUser = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const user = await userService.registerUser(payload);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "User registered successfully",
      data: { user },
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const profile = await userService.getMyProfile(req.user?.id as string);
    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "User Profile fetched successfully",
      data: { profile },
    });
  },
);

const updateMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const updatedProfile = await userService.updateMyProfile(userId, payload);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "User Profile updated successfully",
      data: { updatedProfile },
    });
  },
);

export const userController = {
  registerUser,
  getMyProfile,
  updateMyProfile,
  checkPhone,
};
