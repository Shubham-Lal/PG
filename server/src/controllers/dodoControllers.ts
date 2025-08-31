import { Request, Response, NextFunction } from "express";
import DodoPayments from 'dodopayments';
import { AppError } from "../middlewares/ErrorHandler";

const dodo = new DodoPayments({
    bearerToken: process.env.DODO_API_KEY,
    environment: "test_mode"
});

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const payment = await dodo.payments.create({
            billing: { city: 'city', country: 'IN', state: 'state', street: 'street', zipcode: 'zipcode' },
            customer: { customer_id: process.env.DODO_CUSTOMER_ID as string },
            product_cart: [{ product_id: process.env.DODO_PRODUCT_ID as string, quantity: 1 }],
            payment_link: true,
            return_url: process.env.CLIENT_URL
        });

        return res.status(200).json({
            payment_link: payment.payment_link
        });
    }
    catch (error) {
        next(error);
    }
};

export const verifyOrder = async (req: Request, res: Response, next: NextFunction) => {
    const { payment_id } = req.query;

    if (!payment_id || typeof payment_id !== "string") {
        return next(new AppError("Payment ID is required", 400));
    }

    try {
        const payment = await dodo.payments.retrieve(payment_id);

        return res.status(200).json({ payment });
    }
    catch (error) {
        next(error);
    }
};