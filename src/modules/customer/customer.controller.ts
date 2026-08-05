import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import HttpStatus from "http-status";
import { customerService } from "./customer.service";

const updateProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await customerService.updateProfile(
      userId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Profile updated successfully",
      data: result,
    });
  },
);

const createBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await customerService.createBooking(
      userId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "Booking created successfully",
      data: result,
    });
  },
);

const getMyBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await customerService.getMyBookings(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Bookings retrieved successfully",
      data: result,
    });
  },
);

const getSingleBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const id = req.params.id;

    const result = await customerService.getSingleBooking(
      userId as string,
      id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Booking retrieved successfully",
      data: result,
    });
  },
);

const cancelBooking = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const id = req.params.id;

    const result = await customerService.cancelBooking(
      userId as string,
      id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Booking cancelled successfully",
      data: result,
    });
  },
);

export const customerController = {
  updateProfile,
  createBooking,
  getMyBookings,
  getSingleBooking,
  cancelBooking,
};
