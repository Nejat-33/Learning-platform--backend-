import Enrollment from "../models/enrollment.model.js";
import Payment from "../models/payment.model.js";
import { updateEnrollmentAnalytics, updateRvenuAnalytics } from "../services/analytics.service.js";
import { initializePayment, verifyPayment } from "../services/payment.service.js";
import axios from 'axios'


export const checkout = async (req, res) => {
  try{
  const { enrollmentId } = req.body;

console.log("Checkout Triggered for Enrollment:", enrollmentId);
    console.log("User initiating checkout:", req.user);

if (!req.user) {
      return res.status(401).json({ status: "fail", message: "User context missing from request" });
    }
  const url = await initializePayment(enrollmentId, req.user);

  res.status(200).json({
    status: "success",
    url
  });
} catch (error) {
    console.error("CRITICAL CHECKOUT ERROR:", error.message);
    if (error.response) {
      console.error("Chapa API Rejection Payload:", error.response.data);
    }
    
    return res.status(500).json({
      status: "error",
      message: error.message || "Internal server billing failure"
    });
};
}



export const verify = async (req, res) => {

  const { tx_ref } = req.query;
  
  if (!tx_ref) {
    return res.status(400).json({ message: "tx_ref required" });
  }

  let result = await verifyPayment(tx_ref);

  if (result.data?.status === "failed/cancelled") {
      console.log("Status was failed/cancelled, retrying in 2 seconds...");
      await new Promise(resolve => setTimeout(resolve, 2000)); 
      result = await verifyPayment(tx_ref);
    }

  if (result.status === "success" && result.data.status === "success") {
      
    const payment = await Payment.findOne({ tx_ref });

    if (!payment) throw new Error("Payment not found");

    payment.status = "paid";
    payment.transactionId = result.data.reference;

    await payment.save();


    const enrollment = await Enrollment.findById(payment.enrollment)
           .populate({
      path: 'batch',
      populate: { path: 'course' }
    });

    enrollment.paymentStatus = "paid";

    await enrollment.save();

    try {
        await updateRvenuAnalytics(enrollment.batch.course, enrollment.batch._id, result.data.amount);
        await updateEnrollmentAnalytics(enrollment.batch.course, enrollment.batch._id, payment.student);
    } catch (analyticsError) {
        console.error("Analytics failed to update, but payment was successful:", analyticsError);
    }

    return res.json({
      status: "success",
      message: "Payment verified"
    });
  }

  res.status(400).json({
    status: "fail",
    message: "Payment not successful"
  });
}


