import express from "express";
import { errorHandling } from "./middlewares/errorHandling.middleware.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { handleStripeWebhook } from "./controllers/order.controller.js";

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
  "https://freshcart-snowy.vercel.app",
  "http://localhost:5173",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.post(
  "/api/v1/orders/webhook",
  express.raw({ type: "application/json" }),
  handleStripeWebhook
);

// Setting Up Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Setting Up Routes
import userRouter from "./routes/user.route.js";
app.use("/api/v1/users", userRouter);

import sellerRouter from "./routes/seller.route.js";
app.use("/api/v1/sellers", sellerRouter);

import adminRoute from "./routes/admin.route.js";
app.use("/api/v1/admin", adminRoute);

import categoryRoute from "./routes/category.route.js";
app.use("/api/v1/categories", categoryRoute);

import productRoute from "./routes/product.route.js";
app.use("/api/v1/products", productRoute);

import addressRoute from "./routes/address.route.js";
app.use("/api/v1/addresses", addressRoute);

import cartRoute from "./routes/cart.route.js";
app.use("/api/v1/cart", cartRoute);

import orderRoute from "./routes/order.route.js";
app.use("/api/v1/orders", orderRoute);

// Error Handling Middleware
app.use(errorHandling);

export default app;
