import Stripe from "stripe";
import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(express.static("public"));

// Payment succeeds
// 4242 4242 4242 4242

// Payment requires authentication
// 4000 0025 0000 3155

// Payment is declined
// 4000 0000 0000 9995

app.post("/create-checkout-session", async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price: process.env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:8080/success.html",
    cancel_url: "http://localhost:8080/cancel.html",
  });
  res.redirect(303, session.url);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});
