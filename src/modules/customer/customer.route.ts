import { Router } from "express";
import { auth } from "../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { customerController } from "./customer.controller";

const router = Router();

router.patch("/profile", auth(Role.CUSTOMER), customerController.updateProfile);
router.post("/bookings", auth(Role.CUSTOMER), customerController.createBooking);
router.get("/bookings", auth(Role.CUSTOMER), customerController.getMyBookings);
router.get(
  "/bookings/:id",
  auth(Role.CUSTOMER),
  customerController.getSingleBooking,
);

router.patch(
  "/bookings/:id/cancel",
  auth(Role.CUSTOMER),
  customerController.cancelBooking,
);

export const customerRouter = router;
