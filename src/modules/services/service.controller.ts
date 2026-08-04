import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import HttpStatus from "http-status";
import { serviceService } from "./service.service";

const getAllServices = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await serviceService.getAllServices(req.query);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Services retrieved successfully",
      data: result.data,
      meta: result.meta,
    });
  },
);

export const serviceController = { getAllServices };
