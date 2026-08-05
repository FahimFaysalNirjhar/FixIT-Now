import { Router } from "express";
import { auth } from "../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/checkout",
  auth(Role.CUSTOMER),
  paymentController.createCheckoutSession,
);

router.post("/webhook", paymentController.handleWebhook);

router.get(
  "/history",
  auth(Role.CUSTOMER),
  paymentController.getPaymentHistory,
);

export const paymentRouter = router;
