import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import crypto from "crypto";
import { getPaymentOrder } from "./utils/get-payment-order";
import { getPaymentStatus } from "./utils/get-payment-status";
import { AppError, errorHandler } from "./middlewares/ErrorHandler";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server is running" });
});

app.get("/order", async (req: Request, res: Response, next: NextFunction) => {
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

app.get("/verify", async (req: Request, res: Response, next: NextFunction) => {
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

app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});