import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode = 400, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

export const errorHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error("🔥 Error caught:", err);

    // Default values
    let statusCode = 500;
    let message = "Something went wrong. Please try again.";

    // Handle our own AppError
    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // Handle MongoDB (Mongoose) validation errors
    else if (
        typeof err === "object" &&
        err !== null &&
        (err as any).name === "ValidationError"
    ) {
        statusCode = 400;
        message = Object.values((err as any).errors)
            .map((val: any) => val.message)
            .join(", ");
    }

    // Handle MongoDB duplicate key errors
    else if (
        typeof err === "object" &&
        err !== null &&
        (err as any).code === 11000
    ) {
        statusCode = 400;
        const key = Object.keys((err as any).keyValue)[0];
        message = `${key} already exists`;
    }

    // Handle Razorpay errors
    else if (
        typeof err === "object" &&
        err !== null &&
        "error" in err &&
        (err as any).error?.description
    ) {
        statusCode = (err as any).statusCode || 400;
        message = (err as any).error.description;
    }

    // Handle native JS Errors
    else if (err instanceof Error) {
        message = err.message;
    }

    return res.status(statusCode).json({
        success: false,
        message
    });
};