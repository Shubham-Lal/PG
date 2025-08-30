import { Router } from "express";
import {
  createOrder,
  verifyOrder,
  createSubscription,
  verifySubscription
} from "../controllers/razorpayControllers";

const router = Router();

router.get("/order/create", createOrder);
router.get("/order/verify", verifyOrder);
router.get("/subscription/create", createSubscription);
router.get("/subscription/verify", verifySubscription);

export default router;