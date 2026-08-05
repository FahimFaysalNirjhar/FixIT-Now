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

// public
const getAllTechnicians = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const filters = req.query;

    const result = await technicianService.getAllTechnicians(filters);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Technicians retrieved successfully",
      data: result,
    });
  },
);

const getTechnicianAvailability = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const result = await technicianService.getTechnicianAvailability(
      id as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Technician availability retrieved successfully",
      data: result,
    });
  },
);

const getSingleTechnician = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    const result = await technicianService.getSingleTechnician(id as string);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Technician retrieved successfully",
      data: result,
    });
  },
);

// technician related
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

const deleteProfile = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    await technicianService.deleteProfile(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Technician profile deleted successfully",
      data: null,
    });
  },
);

// availablity related controller

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

const deleteAvailability = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const availabilityId = req.params.id;

  await technicianService.deleteAvailability(
    userId as string,
    availabilityId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: HttpStatus.OK,
    message: "Availability slot deleted successfully",
    data: null,
  });
});

// service related

const createService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const payload = req.body;

    const result = await technicianService.createService(
      userId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.CREATED,
      message: "Service created successfully",
      data: result,
    });
  },
);

const updateService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const serviceId = req.params.serviceId;
    const payload = req.body;

    const result = await technicianService.updateService(
      userId as string,
      serviceId as string,
      payload,
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Service updated successfully",
      data: result,
    });
  },
);

const deleteService = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const serviceId = req.params.serviceId;

    await technicianService.deleteService(
      userId as string,
      serviceId as string,
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Service deleted successfully",
      data: null,
    });
  },
);

// booking related

const getMyBookings = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;

    const result = await technicianService.getMyBookings(userId as string);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Bookings retrieved successfully",
      data: result,
    });
  },
);

const updateBookingStatus = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id;
    const id = req.params.id;

    const result = await technicianService.updateBookingStatus(
      userId as string,
      id as string,
      req.body.status,
    );

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Booking status updated successfully",
      data: result,
    });
  },
);

export const technicianController = {
  createProfile,
  getMyProfile,
  updateProfile,
  addAvailability,
  getMyAvailability,
  deleteAvailability,
  createService,
  updateService,
  deleteService,
  deleteProfile,
  getAllTechnicians,
  getSingleTechnician,
  getTechnicianAvailability,
  getMyBookings,
  updateBookingStatus,
};
