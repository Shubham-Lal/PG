import Razorpay from "razorpay";
import { AppError } from "../../middlewares/ErrorHandler";

interface GetPaymentStatusParams {
    subscriptionId: string;
}

interface PaymentStatusResponse {
    status: string;
}

export const getSubscriptionStatus = async ({
    subscriptionId,
}: GetPaymentStatusParams): Promise<PaymentStatusResponse> => {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID as string,
        key_secret: process.env.RAZORPAY_KEY_SECRET as string,
    });

    try {
        const response = await razorpay.subscriptions.fetch(subscriptionId)

        return {
            status: response.status.toUpperCase(),

        };
    }
    catch (error: any) {
        throw new AppError(
            error?.error?.description || error?.message || "Failed to fetch payment status.",
            400
        );
    }
};