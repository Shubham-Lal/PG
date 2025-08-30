import { useState } from "react";
import Paypal from "./options/Paypal";
import Razorpay from "./options/Razorpay";

export default function App() {
  const [tab, setTab] = useState(0);

  return (
    <main>
      <button onClick={() => setTab(0)}>
        Paypal
      </button>
      <button onClick={() => setTab(1)}>
        Razorpay
      </button>

      {tab === 0 ? <Paypal /> : <Razorpay />}
    </main>
  )
}