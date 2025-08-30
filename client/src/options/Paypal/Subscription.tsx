import type { PayPalScriptOptions } from "@paypal/paypal-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const Subscription = () => {
    const initialOptions: PayPalScriptOptions = {
        clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
        components: "buttons",
        intent: "subscription",
        vault: true
    };

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
                    createSubscription={async (data, actions) => {
                        console.log(data);

                        return actions.subscription.create({
                            plan_id: import.meta.env.VITE_PAYPAL_PLAN_ID
                        });
                    }}
                    onApprove={async (data, actions) => {
                        console.log(actions);

                        alert(data.subscriptionID);
                    }}
                />
            </PayPalScriptProvider>
        </div>
    )
}

export default Subscription