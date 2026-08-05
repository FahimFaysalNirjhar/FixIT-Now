import { Router } from "express";
import { auth } from "../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { technicianController } from "./technician.controller";

const router = Router();

// booking related
router.get(
  "/bookings",
  auth(Role.TECHNICIAN),
  technicianController.getMyBookings,
);

// technician related without params
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

router.delete(
  "/profile",
  auth(Role.TECHNICIAN),
  technicianController.deleteProfile,
);

// availability related rotues without params
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

// service related
router.post(
  "/services",
  auth(Role.TECHNICIAN),
  technicianController.createService,
);

// public
router.get("/", technicianController.getAllTechnicians);
router.get("/:id", technicianController.getSingleTechnician);
router.get("/:id/availability", technicianController.getTechnicianAvailability);

// availability related rotues with params

router.delete(
  "/availability/:id",
  auth(Role.TECHNICIAN),
  technicianController.deleteAvailability,
);

// service related

router.patch(
  "/services/:serviceId",
  auth(Role.TECHNICIAN),
  technicianController.updateService,
);

router.delete(
  "/services/:serviceId",
  auth(Role.TECHNICIAN),
  technicianController.deleteService,
);

// bookings related with params
router.patch(
  "/bookings/:id/status",
  auth(Role.TECHNICIAN),
  technicianController.updateBookingStatus,
);

export const technicianRouter = router;
