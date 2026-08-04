import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import config from "./config";
import { userRouter } from "./modules/user/user.route";
import { authRouter } from "./modules/auth/auth.route";
import { globalErrorHandler } from "./modules/utils/globalErrorHandler";
import { serviceRouter } from "./modules/services/service.route";
import { technicianRouter } from "./modules/technician/technician.router";
import { adminRouter } from "./modules/admin/admin.route";
import { categoryRouter } from "./modules/categories/category.route";
import { customerRouter } from "./modules/customer/customer.route";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/services", serviceRouter);
app.use("/api/technician", technicianRouter);
app.use("/api/admin", adminRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/customer", customerRouter);

app.use(globalErrorHandler);

export default app;
