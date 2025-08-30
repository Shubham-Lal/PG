import { Router } from "express";
import {
    createOrder,
    captureOrder
} from "../controllers/paypal/checkoutControllers";

const router = Router();

router.post("/checkout/orders", createOrder);
router.post("/checkout/orders/:orderID/capture", captureOrder);

export default router;