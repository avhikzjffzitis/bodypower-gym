import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import membershipsRouter from "./memberships";
import bookingsRouter from "./bookings";
import paymentsRouter from "./payments";
import statsRouter from "./stats";
import adminRouter from "./admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/memberships", membershipsRouter);
router.use("/bookings", bookingsRouter);
router.use("/payments", paymentsRouter);
router.use("/stats", statsRouter);
router.use("/admin", adminRouter);

export default router;
