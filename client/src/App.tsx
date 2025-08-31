import { useState } from "react";
import Paypal from "./options/Paypal";
import Razorpay from "./options/Razorpay";
import Dodo from "./options/Dodo";

export default function App() {
  const [tab, setTab] = useState(0);

  return (
    <main>
      <button onClick={() => setTab(1)}>
        Paypal
      </button>
      <button onClick={() => setTab(2)}>
        Razorpay
      </button>
      <button onClick={() => setTab(3)}>
        Dodo
      </button>

      {tab === 1 ? <Paypal /> : tab === 2 ? <Razorpay /> : tab === 3 ? <Dodo /> : null}
    </main>
  )
}