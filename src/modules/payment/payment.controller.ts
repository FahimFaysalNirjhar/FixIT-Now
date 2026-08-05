import { NextFunction, Request, Response } from "express";
import HttpStatus from "http-status";
import { catchAsync } from "../utils/catchAsync";
import { paymentService } from "./paymen.service";
import { sendResponse } from "../utils/sendResponse";

const createCheckoutSession = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId } = req.body;

    console.log(req.body);
    console.log(req.body.bookingId);

    const result = await paymentService.createCheckoutSession(bookingId);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Checkout session created successfully",
      data: result,
    });
  },
);

const handleWebhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const payload = req.body as Buffer;
    const signature = req.headers["stripe-signature"]!;
    console.log("Webhook reached");
    console.log(signature);

    console.log(Buffer.isBuffer(req.body));
    console.log(typeof req.body);
    console.log(req.body.constructor.name);

    await paymentService.handleWebhook(payload, signature as string);

    sendResponse(res, {
      success: true,
      statusCode: HttpStatus.OK,
      message: "Webhook triggered successfully",
      data: null,
    });
  },
);

export const paymentController = {
  createCheckoutSession,
  handleWebhook,
};
