import { Request, Response, NextFunction } from "express";
import {
  Client,
  Environment,
  OrderRequest,
  OrdersController,
  CheckoutPaymentIntent
} from "@paypal/paypal-server-sdk";

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: process.env.PAYPAL_CLIENT_ID as string,
    oAuthClientSecret: process.env.PAYPAL_CLIENT_SECRET as string,
  },
  timeout: 0,
  environment: Environment.Production
});

const ordersController = new OrdersController(client);

export const createOrder = async (req: Request, res: Response, next: NextFunction) => {
  const collect: { body: OrderRequest; prefer: string } = {
    body: {
      intent: "CAPTURE" as CheckoutPaymentIntent,
      purchaseUnits: [
        {
          amount: {
            currencyCode: "USD",
            value: "0.1",
            breakdown: {
              itemTotal: {
                currencyCode: "USD",
                value: "0.1",
              },
            },
          },
          items: [
            {
              name: "Test",
              unitAmount: {
                currencyCode: "USD",
                value: "0.1",
              },
              quantity: "1",
              description: "This is test description.",
              sku: "sku01",
            },
          ],
        },
      ],
    },
    prefer: "return=minimal",
  };

  try {
    const { body, ...httpResponse } = await ordersController.createOrder(collect);

    const bodyString = typeof body === "string" ? body : await (body as Blob).text();
    const jsonResponse = JSON.parse(bodyString);

    return res.status(httpResponse.statusCode).json(jsonResponse);
  }
  catch (error) {
    console.log(error)
    next(error);
  }
};

export const captureOrder = async (req: Request, res: Response, next: NextFunction) => {
  const { orderID } = req.params;

  const collect = {
    id: orderID,
    prefer: "return=minimal",
  };

  try {
    const { body, ...httpResponse } = await ordersController.captureOrder(collect);
    const bodyString = typeof body === "string" ? body : await (body as Blob).text();
    const jsonResponse = JSON.parse(bodyString);

    return res.status(httpResponse.statusCode).json(jsonResponse);
  }
  catch (error) {
    next(error);
  }
};