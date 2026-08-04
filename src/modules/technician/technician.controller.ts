import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import HttpStatus from "http-status";
import { technicianService } from "./technician.service";

const createProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await technicianService.createProfile(
      userId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "Technician profile created successfully",
      data: result,
    });
  },
);

const getMyProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await technicianService.getMyProfile(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Technician profile retrieved successfully",
      data: result,
    });
  },
);

const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await technicianService.updateProfile(
      userId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Technician profile updated successfully",
      data: result,
    });
  },
);

const addAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await technicianService.addAvailability(
      userId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "Availability slot added successfully",
      data: result,
    });
  },
);

const getMyAvailability = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  const result = await technicianService.getMyAvailability(userId as string);

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "Availability retrieved successfully",
    data: result,
  });
});

export const technicianController = {
  createProfile,
  getMyProfile,
  updateProfile,
  addAvailability,
  getMyAvailability,
};
