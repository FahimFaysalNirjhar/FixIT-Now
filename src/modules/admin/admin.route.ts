import { Router } from "express";
import { auth } from "../middleware/auth";
import { Role } from "../../../generated/prisma/enums";
import { adminController } from "./admin.controller";

const router = Router();

router.post("/categories", auth(Role.ADMIN), adminController.createCategory);

router.get("/categories", auth(Role.ADMIN), adminController.getAllCategories);

router.patch(
  "/categories/:id",
  auth(Role.ADMIN),
  adminController.updateCategory,
);

export const adminRouter = router;
