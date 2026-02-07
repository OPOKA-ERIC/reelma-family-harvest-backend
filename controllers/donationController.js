import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const initiateDonation = async (req, res) => {
  const { amount, currency } = req.body;

  try {
    const tokenRes = await axios.post(
      `${process.env.PESAPAL_BASE_URL}/api/Auth/RequestToken`,
      {
        consumer_key: process.env.PESAPAL_CONSUMER_KEY,
        consumer_secret: process.env.PESAPAL_CONSUMER_SECRET,
      }
    );

    const token = tokenRes.data.token;

    const order = {
      id: uuidv4(),
      currency,
      amount,
      description: "Donation to Family Harvest Foundation",
      callback_url: "https://yourdomain.com/donation-success",
      notification_id: "YOUR_IPN_ID",
      billing_address: {
        email_address: "donor@familyharvest.org",
        phone_number: "",
        country_code: "UG",
      },
    };

    const orderRes = await axios.post(
      `${process.env.PESAPAL_BASE_URL}/api/Transactions/SubmitOrderRequest`,
      order,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(orderRes.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Payment initiation failed" });
  }
};
