import express from "express";
import morgan from "morgan";
import cors from "cors";

import cookieParser from "cookie-parser";
// import Stripe from "stripe";

import helmet from "helmet";
import MongoSanitize from "express-mongo-sanitize";
import sanitize from "mongo-sanitize";

/// stripe Configuration 
// export const stripe = new Stripe(process.env.STRIPE_API_SECRET)

const app = express();

app.use(cors({
  origin: "https://velvety-chebakia-09e19a.netlify.app", 
  credentials: true,
}));


//middlewares
app.use(MongoSanitize())
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.use(cookieParser());

//route

//routes imports
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js"
import orderRoutes from "./routes/orderRoutes.js";


app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use('/api/category', categoryRoutes)
app.use('/api/order', orderRoutes)



export default app 





