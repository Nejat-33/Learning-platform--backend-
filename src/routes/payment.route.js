
import express from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { checkout, verify } from "../controllers/payment.controller.js";

const paymentRoute = express.Router()

 paymentRoute.post('/checkout', authenticate, checkout)
 paymentRoute.get('/verify', authenticate, verify)
// paymentRoute.post('/payment/webhook')

export default paymentRoute