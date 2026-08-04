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

const getSingleService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const result = await serviceService.getSingleService(id as string);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Service retrieved successfully",
      data: result,
    });
  },
);

export const serviceController = { getAllServices, getSingleService };
