import Razorpay from "razorpay";
import { AppError } from "../middlewares/ErrorHandler";

interface GetPaymentOrderParams {
    merchantOrderId: string;
    amount: number;
}

interface PaymentOrderResponse {
    id: string;
    amount: number | string;
}

export const getPaymentOrder = async ({
    merchantOrderId,
    amount,
}: GetPaymentOrderParams): Promise<PaymentOrderResponse> => {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY as string,
        key_secret: process.env.RAZORPAY_SECRET as string,
    });

    try {
        const order = await razorpay.orders.create({
            amount,
            currency: "INR",
            receipt: merchantOrderId,
        });

        return {
            id: order.id,
            amount: order.amount,
        };
    }
    catch (error: any) {
        throw new AppError(
            error?.error?.description || error?.message || "Payment initiation failed. Try again.",
            400
        );
    }
};