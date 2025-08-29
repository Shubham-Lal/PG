import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import crypto from "crypto";
import { getPaymentOrder } from "./utils/get-payment-order";
import { getPaymentStatus } from "./utils/get-payment-status";
import { getSubscriptionOrder } from "./utils/get-subscription-order";
import { AppError, errorHandler } from "./middlewares/ErrorHandler";
import { getSubscriptionStatus } from "./utils/get-subscription-status";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", async (req: Request, res: Response) => {
  res.json({ message: "Server is running" });
});

app.get("/order/create", async (req: Request, res: Response, next: NextFunction) => {
  const merchantOrderId = crypto.randomUUID();

  try {
    const razorpayResponse = await getPaymentOrder({
      merchantOrderId,
      amount: 100,
    });

    return res.status(200).json({
      order_id: razorpayResponse.id,
      order_amount: razorpayResponse.amount,
    });
  }
  catch (error) {
    next(error);
  }
});

app.get("/order/verify", async (req: Request, res: Response, next: NextFunction) => {
  const { order_id } = req.query;

  if (!order_id || typeof order_id !== "string") {
    return next(new AppError("Order ID is required", 400));
  }

  try {
    const { status, payment_method, amount } = await getPaymentStatus({ orderId: order_id });

    res.status(200).json({ status, payment_method, amount });
  }
  catch (error) {
    next(error);
  }
});

app.get("/subscription/create", async (req: Request, res: Response, next: NextFunction) => {
  try {
    try {
      const razorpayResponse = await getSubscriptionOrder();

      return res.status(200).json({
        subscription_id: razorpayResponse.id
      });
    }
    catch (error) {
      next(error);
    }
  }
  catch (error) {
    next(error);
  }
});

app.get("/subscription/verify", async (req: Request, res: Response, next: NextFunction) => {
  const { subscription_id } = req.query;

  if (!subscription_id || typeof subscription_id !== "string") {
    return next(new AppError("Subscription ID is required", 400));
  }

  try {
    const { status } = await getSubscriptionStatus({ subscriptionId: subscription_id });

    res.status(200).json({ status });
  }
  catch (error) {
    next(error);
  }
});

app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});