import { sendResponse } from "../utils/sendResponse";
import HttpStatus from "http-status";
import { catchAsync } from "../utils/catchAsync";
import { NextFunction, Request, Response } from "express";
import { adminService } from "./admin.service";

const createCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body;

    const result = await adminService.createCategory(payload);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "Category created successfully",
      data: result,
    });
  },
);

export const adminController = {
  createCategory,
};
