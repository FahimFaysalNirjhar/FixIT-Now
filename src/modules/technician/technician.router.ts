import { Router } from "express";
import { auth } from "../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { technicianController } from "./technician.controller";

const router = Router();

router.post(
  "/profile",
  auth(Role.TECHNICIAN),
  technicianController.createProfile,
);

export const technicianRouter = router;
