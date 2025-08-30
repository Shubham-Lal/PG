import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { getPaymentOrder } from "../utils/razorpay/getPaymentOrder";
import { getPaymentStatus } from "../utils/razorpay/getPaymentStatus";
import { getSubscriptionOrder } from "../utils/razorpay/getSubscriptionOrder";
import { getSubscriptionStatus } from "../utils/razorpay/getSubscriptionStatus";
import { AppError } from "../middlewares/ErrorHandler";

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
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
};

export const verifyOrder = async (req: Request, res: Response, next: NextFunction) => {
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
};

export const createSubscription = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const razorpayResponse = await getSubscriptionOrder();

        return res.status(200).json({
            subscription_id: razorpayResponse.id,
        });
    }
    catch (error) {
        next(error);
    }
};

export const verifySubscription = async (req: Request, res: Response, next: NextFunction) => {
    const { subscription_id } = req.query;

    if (!subscription_id || typeof subscription_id !== "string") {
        return next(new AppError("Subscription ID is required", 400));
    }

    try {
        const { status } = await getSubscriptionStatus({ subscriptionId: subscription_id });
        res.status(200).json({ status });
    } catch (error) {
        next(error);
    }
};