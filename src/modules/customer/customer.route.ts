import { Router } from "express";
import { auth } from "../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { customerController } from "./customer.controller";

const router = Router();

router.patch("/profile", auth(Role.CUSTOMER), customerController.updateProfile);
router.post("/bookings", auth(Role.CUSTOMER), customerController.createBooking);

export const customerRouter = router;
