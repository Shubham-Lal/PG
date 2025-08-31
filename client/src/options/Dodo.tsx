import axios from "axios";
import { toast } from "sonner";
import { getErrorMessage } from "../utils/errorMessage";

const Dodo = () => {
    const handleCreateOrder = async () => {
        try {
            const purchaseRes = await axios.post(`${import.meta.env.VITE_SERVER_URL}/dodo/order/create`, {});

            window.location.href = purchaseRes.data.payment_link;
        }
        catch (error: unknown) {
            alert(getErrorMessage(error));
        }
    };

    const handleVerifyOrder = async () => {
        const toastId = toast.loading("Verifying payment...");

        try {
            await axios.get(`${import.meta.env.VITE_SERVER_URL}/dodo/order/verify?payment_id=${import.meta.env.VITE_DODO_PAYMENT_ID}`);
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
            <button onClick={handleVerifyOrder}>
                Verify
            </button>
        </div>
    )
}

export default Dodo