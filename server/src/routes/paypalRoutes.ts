import { Router } from "express";
import { createOrder, captureOrder } from "../controllers/paypalControllers";

const router = Router();

router.post("/orders", createOrder);
router.post("/orders/:orderID/capture", captureOrder);

export default router;