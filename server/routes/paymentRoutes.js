import express from "express";
import { isAuthenticated } from "../middlewares/auth.js";
import { createPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.post("/payment", isAuthenticated, createPayment);

export default router;