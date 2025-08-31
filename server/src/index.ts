import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import paypalRoutes from "./routes/paypalRoutes";
import razorpayRoutes from "./routes/razorpayRoutes";
import dodoRoutes from "./routes/dodoRoutes";
import { errorHandler } from "./middlewares/ErrorHandler";

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/", async (req: Request, res: Response) => {
  res.json({ message: "Server is running" });
});

app.use("/paypal", paypalRoutes);
app.use("/razorpay", razorpayRoutes);
app.use("/dodo", dodoRoutes);

app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`🚀 Server is running on http://localhost:${port}`);
});