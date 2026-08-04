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

const updateCategory = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const payload = req.body;

    const result = await adminService.updateCategory(id as string, payload);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Category updated successfully",
      data: result,
    });
  },
);

const getAllCategories = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await adminService.getAllCategories();

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Categories retrieved successfully",
      data: result,
    });
  },
);

export const adminController = {
  createCategory,
  updateCategory,
  getAllCategories,
};
