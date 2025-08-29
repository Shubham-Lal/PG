import axios, { type AxiosResponse } from "axios";
import { toast } from "sonner";
import { getErrorMessage } from "./utils/errorMessage";

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
}

interface RazorpaySubscriptionResponse {
  razorpay_payment_id: string;
  razorpay_subscription_id: string;
  razorpay_signature: string;
}

export default function App() {
  const handleCreateOrder = async () => {
    try {
      const purchaseRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/order/create`);
      const { order_id, order_amount } = purchaseRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order_amount,
        currency: "INR",
        order_id,
        description: "",
        handler: async function (response: RazorpayPaymentResponse) {
          await handleVerifyOrder(response.razorpay_order_id);
        },
        modal: {
          ondismiss: async function () {
            await handleVerifyOrder(order_id);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", async function () {
        await handleVerifyOrder(order_id);
      });
    }
    catch (error: unknown) {
      alert(getErrorMessage(error));
    }
  };

  const handleVerifyOrder = async (orderId: string): Promise<void> => {
    const toastId = toast.loading("Verifying payment...");

    try {
      const response: AxiosResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/order/verify?order_id=${orderId}`
      );
      console.log(response);
    }
    catch (error: unknown) {
      alert(getErrorMessage(error));
    }
    finally {
      toast.dismiss(toastId);
    }
  };

  const handleCreateSubscription = async () => {
    try {
      const purchaseRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/subscription/create`);
      const { subscription_id } = purchaseRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        subscription_id,
        subscription_card_change: true,
        handler: async function (response: RazorpaySubscriptionResponse) {
          await handleVerifySubscription(response.razorpay_subscription_id);
        },
        modal: {
          ondismiss: async function () {
            await handleVerifySubscription(subscription_id);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", async function () {
        await handleVerifySubscription(subscription_id);
      });
    }
    catch (error: unknown) {
      alert(getErrorMessage(error));
    }
  };

  const handleVerifySubscription = async (subscriptionId: string): Promise<void> => {
    const toastId = toast.loading("Verifying payment...");

    try {
      const response: AxiosResponse = await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/subscription/verify?subscription_id=${subscriptionId}`
      );
      console.log(response);
    }
    catch (error: unknown) {
      alert(getErrorMessage(error));
    }
    finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <div>
      <button onClick={handleCreateOrder}>
        Purchase ₹1
      </button>
      <button onClick={handleCreateSubscription}>
        Subscription ₹1
      </button>
    </div>
  )
}