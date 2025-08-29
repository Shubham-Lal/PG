import Razorpay from "razorpay";
import { AppError } from "../middlewares/ErrorHandler";

interface PaymentOrderResponse {
    id: string;
}

export const getSubscriptionOrder = async (): Promise<PaymentOrderResponse> => {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID as string,
        key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    try {
        // await razorpay.plans.create({
        //     period: "daily",
        //     interval: 7,
        //     item: {
        //         name: "Test plan - Daily",
        //         amount: 100,
        //         currency: "INR",
        //         description: "Description for the test plan"
        //     }
        // });

        const order = await razorpay.subscriptions.create({
            plan_id: process.env.RAZORPAY_PLAN_ID as string,
            customer_notify: true,
            quantity: 1,
            total_count: 6,
            start_at: Math.floor(Date.now() / 1000) + 120
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