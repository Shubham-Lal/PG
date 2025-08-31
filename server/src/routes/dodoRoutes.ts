import { Router } from "express";
import {
  createOrder,
  verifyOrder
} from "../controllers/dodoControllers";

const router = Router();

router.post("/order/create", createOrder);
router.get("/order/verify", verifyOrder);

export default router;