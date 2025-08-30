import { useState } from "react";
import Checkout from "./Checkout";
import Subscription from "./Subscription";

const Paypal = () => {
    const [tab, setTab] = useState(0);

    return (
        <div>
            <button onClick={() => setTab(0)}>
                Checkout
            </button>
            <button onClick={() => setTab(1)}>
                Subscription
            </button>

            {tab === 0 ? <Checkout /> : <Subscription />}

        </div>
    )
}

export default Paypal