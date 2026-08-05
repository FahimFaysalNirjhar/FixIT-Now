import { NextFunction, Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { sendResponse } from "../utils/sendResponse";
import HttpStatus from "http-status";
import { paymentService } from "./paymen.service";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId } = req.body;

    const result = await paymentService.createCheckoutSession(bookingId);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Checkout session created successfully",
      data: result,
    });
  },
);

// const handleWebhook = catchAsync(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const event = req.body as Buffer;
//     const signature = req.headers["stripe-signature"]!;

//     await paymentService.handleWebhook(event, signature as string);

//     sendResponse(res, {
//       success: true,
//       statusCode: HttpStatus.OK,
//       message: "Webhook tiggered successfully",
//       data: null,
//     });
//   },
// );

export const paymentController = { createCheckoutSession };
