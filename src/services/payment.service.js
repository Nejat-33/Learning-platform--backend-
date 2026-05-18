import axios from "axios";
import Payment from "../models/payment.model.js";
import Enrollment from "../models/enrollment.model.js";


export const initializePayment = async (enrollmentId, user) => {

  const enrollment = await Enrollment.findById(enrollmentId).populate("batch");

  if (!enrollment) throw new Error("Enrollment not found");

  const amount = enrollment.batch.price;


  const tx_ref = `tx-${Date.now()}-${user._id}`;


  const payment = await Payment.create({
    student: user._id,
    enrollment: enrollmentId,
    amount,
    paymentMethod: "chapa",
    status: "pending",
    tx_ref
  });

  const response = await axios.post(
    "https://api.chapa.co/v1/transaction/initialize",
    {
      amount,
      currency: "ETB",
      email: user.email,
      first_name: user.firstname,
      last_name: user.lastname,
      tx_ref,

      callback_url: "http://localhost:5500/api/payment/verify",
      return_url: `http://localhost:5173/payment-success?tx_ref=${tx_ref}`
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`
      }
    }
  );

  return response.data.data.checkout_url;
};




export const verifyPayment = async (tx_ref) => {
  try{
  const response = await axios.get(
    `https://api.chapa.co/v1/transaction/verify/${tx_ref}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    }
  );
  console.log("Full Chapa Response:", JSON.stringify(response.data, null, 2));

  return response.data
 } catch (error) {
    console.error("Chapa Error Data:", error.response?.data);
    throw error;
}
};