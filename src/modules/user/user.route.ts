import { NextFunction, Request, Response, Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../middleware/auth";
import { userController } from "./user.controller";

const router = Router();

router.get("/check-phone", userController.checkPhone);

router.post("/register", userController.registerUser);

router.get(
  "/me",
  auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),
  userController.getMyProfile,
);

router.put(
  "/my-profile",
  auth(Role.ADMIN, Role.CUSTOMER, Role.TECHNICIAN),
  userController.updateMyProfile,
);

export const userRouter = router;
