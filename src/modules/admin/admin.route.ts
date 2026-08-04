import { Router } from "express";
import { auth } from "../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";

const router = Router();

// category related
router.post("/categories", auth(Role.ADMIN), adminController.createCategory);

router.get("/categories", auth(Role.ADMIN), adminController.getAllCategories);

router.patch(
  "/categories/:id",
  auth(Role.ADMIN),
  adminController.updateCategory,
);

router.delete(
  "/categories/:id",
  auth(Role.ADMIN),
  adminController.deleteCategory,
);

// user related

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);

router.patch(
  "/users/:id/status",
  auth(Role.ADMIN),
  adminController.updateUserStatus,
);

export const adminRouter = router;
