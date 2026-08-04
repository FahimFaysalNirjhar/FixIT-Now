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
router.get(
  "/profile",
  auth(Role.TECHNICIAN),
  technicianController.getMyProfile,
);

router.patch(
  "/profile",
  auth(Role.TECHNICIAN),
  technicianController.updateProfile,
);

// availability related rotues

router.post(
  "/availability",
  auth(Role.TECHNICIAN),
  technicianController.addAvailability,
);

router.get(
  "/availability",
  auth(Role.TECHNICIAN),
  technicianController.getMyAvailability,
);

router.delete(
  "/availability/:id",
  auth(Role.TECHNICIAN),
  technicianController.deleteAvailability,
);

// service related routes

router.post(
  "/services",
  auth(Role.TECHNICIAN),
  technicianController.createService,
);

export const technicianRouter = router;
