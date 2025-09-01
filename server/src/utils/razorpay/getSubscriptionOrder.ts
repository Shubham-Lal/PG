import Razorpay from "razorpay";
import { AppError } from "../../middlewares/ErrorHandler";

interface PaymentOrderResponse {
    id: string;
}

export const getSubscriptionOrder = async (): Promise<PaymentOrderResponse> => {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID as string,
        key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    try {
        const order = await razorpay.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID as string,
            customer_notify: true,
            quantity: 1,
            total_count: 7,
            start_at: Math.floor(Date.now() / 1000) + 60
        });

        return {
            id: order.id,
        };
    }
    catch (error: any) {
        throw new AppError(
            error?.error?.description || error?.message || "Payment initiation failed. Try again.",
            400
        );
    }
};