import { useState } from "react";
import type { PayPalScriptOptions } from "@paypal/paypal-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Checkout = () => {
    const initialOptions: PayPalScriptOptions = {
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        components: "buttons"
    };

    const [message, setMessage] = useState("");

    return (
        <div>
            <PayPalScriptProvider options={initialOptions}>
                <PayPalButtons
                    style={{
                        shape: "rect",
                        layout: "vertical",
                        color: "gold",
                        label: "paypal",
                    }}
                    createOrder={async () => {
                        try {
                            const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/paypal/checkout/orders`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                }
                            });

                            const orderData = await response.json();

                            if (orderData.id) {
                                return orderData.id;
                            }
                            else {
                                const errorDetail = orderData?.details?.[0];
                                const errorMessage = errorDetail
                                    ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                                    : JSON.stringify(orderData);

                                throw new Error(errorMessage);
                            }
                        }
                        catch (error) {
                            setMessage(`Could not initiate PayPal Checkout...${error}`);
                        }
                    }}
                    onApprove={async (data, actions) => {
                        try {
                            const response = await fetch(
                                `${import.meta.env.VITE_SERVER_URL}/paypal/checkout/orders/${data.orderID}/capture`,
                                {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                    },
                                }
                            );

                            const orderData = await response.json();
                            const errorDetail = orderData?.details?.[0];

                            if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                                // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                                return actions.restart();
                            }
                            else if (errorDetail) {
                                // (2) Other non-recoverable errors -> Show a failure message
                                throw new Error(`${errorDetail.description} (${orderData.debug_id})`);
                            }
                            else {
                                // (3) Successful transaction -> Show confirmation or thank you message
                                // Or go to another URL:  actions.redirect('thank_you.html');
                                const transaction = orderData.purchase_units[0].payments.captures[0];
                                setMessage(`Transaction ${transaction.status}: ${transaction.id}`);
                            }
                        }
                        catch (error) {
                            setMessage(`Sorry, your transaction could not be processed...${error}`);
                        }
                    }}
                />
            </PayPalScriptProvider>

            <p>{message}</p>
        </div>
    )
}

export default Checkout