import dotenv from "dotenv";
import config from "../../config";
import { Transaction } from "@prisma/client";
import prisma from "../../config/prisma";
import axios from "axios";

dotenv.config();

export const generateTransactionId = (): string => {
  const timestamp = Date.now().toString(36); // Convert current timestamp to base-36 string
  const randomNum = Math.floor(Math.random() * 1e12).toString(36); // Generate a random number and convert to base-36
  const randomString = Math.random().toString(36).substring(2, 10); // Generate a random string

  return `TX-${timestamp}-${randomNum}-${randomString}`.toUpperCase(); // Combine parts and return in uppercase
};


export const initiatePayment = async (
  paymentData: Transaction,

) => {

  const { orderId, amount, transactionId } = paymentData;

  const order = await prisma.order.findFirstOrThrow({
    where: {
      id: orderId,
    }
  })
  const { name, email, phone, address, zipCode, city, country, state } = order || {}

  const response = await axios.post(process.env.PAYMENT_URL!, {
    store_id: process.env.STORE_ID,
    signature_key: process.env.SIGNATURE_KEY,
    tran_id: transactionId,
    success_url: `${config.server_url}/api/v1/payment/confirmation?transactionId=${transactionId}&orderId=${orderId}`,
    fail_url: `${config.server_url}/api/v1/payment/failed?transactionId=${transactionId}&orderId=${orderId}`,
    cancel_url: `${config.client_url}`,
    amount: amount,
    currency: "USD",
    desc: "Merchant Registration Payment",
    cus_name: name,
    cus_email: email,
    cus_add1: address,
    cus_add2: "N/A",
    cus_city: city,
    cus_state: state,
    cus_postcode: zipCode,
    cus_country: country,
    cus_phone: phone,
    type: "json",
  });
  return response.data;
};

export const verifyPayment = async (transactionId: string) => {
  const response = await axios.get(process.env.PAYMENT_VERIFY_URL!, {
    params: {
      store_id: process.env.STORE_ID,
      signature_key: process.env.SIGNATURE_KEY,
      request_id: transactionId,
      type: "json",
    },
  });

  return response.data;
};
