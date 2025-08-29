import Razorpay from "razorpay";
import { AppError } from "../middlewares/ErrorHandler";

interface GetPaymentStatusParams {
    orderId: string;
}

interface PaymentStatusResponse {
    status: "PENDING" | "COMPLETED" | "FAILED";
    payment_method?: string;
    amount?: number | string;
}

interface RazorpayPayment {
    id: string;
    status: string;
    method: string;
    amount: number | string;
    [key: string]: any;
}

export const getPaymentStatus = async ({
    orderId,
}: GetPaymentStatusParams): Promise<PaymentStatusResponse> => {
    const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY as string,
        key_secret: process.env.RAZORPAY_SECRET as string,
    });

    try {
        const response = await razorpay.orders.fetchPayments(orderId);
        const payments: RazorpayPayment[] = response.items;

        if (!Array.isArray(payments) || payments.length === 0) {
            return { status: "FAILED" };
        }

        const isPending = payments.some((payment) => payment.status === "created");
        if (isPending) {
            return { status: "PENDING" };
        }

        const capturedPayment = payments.find(
            (payment) => payment.status === "captured"
        );
        if (capturedPayment) {
            return {
                status: "COMPLETED",
                payment_method: capturedPayment.method,
                amount: capturedPayment.amount,
            };
        }

        const hasFailed = payments.some((payment) => payment.status === "failed");
        if (hasFailed) {
            return { status: "FAILED" };
        }

        return { status: "FAILED" };
    }
    catch (error: any) {
        throw new AppError(
            error?.error?.description || error?.message || "Failed to fetch payment status.",
            400
        );
    }
};