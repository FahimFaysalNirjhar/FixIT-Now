import { Router } from "express";
import { categoryController } from "./caterory.controller";

const router = Router();

router.get("/", categoryController.getAllCategories);

export const categoryRouter = router;
