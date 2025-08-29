import axios, { type AxiosResponse } from "axios";
import { toast } from "sonner";
import { getErrorMessage } from "./utils/errorMessage";

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
}

export default function App() {
  const handlePurchase = async () => {
    try {
      const purchaseRes = await axios.get(`${import.meta.env.VITE_SERVER_URL}/order`);
      const { order_id, order_amount } = purchaseRes.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order_amount,
        currency: "INR",
        order_id,
        description: "",
        handler: async function (response: RazorpayResponse) {
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
        `${import.meta.env.VITE_SERVER_URL}/verify?order_id=${orderId}`
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
    <button onClick={handlePurchase}>
      Purchase
    </button>
  )
}