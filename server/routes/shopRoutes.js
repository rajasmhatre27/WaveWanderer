import express from "express";
import Stripe from "stripe";
import pool from "../db.js";
import "dotenv/config";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 1. GET ALL PRODUCTS
// Frontend isey call karega products dikhane ke liye
router.get("/products", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM products ORDER BY product_id ASC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 2. CREATE CHECKOUT SESSION
// Frontend cart bhejea, hum Stripe ka payment page banayenge
router.post("/checkout", authMiddleware, async (req, res) => {
  const { cartItems } = req.body; // Array of { product_id, quantity }
  const userId = req.user.id;

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ message: "Cart is empty" });
  }

  try {
    // Security Step: Frontend ke price par bharosa mat karo. Database se price lo.
    let lineItems = [];
    let totalAmount = 0;

    for (const item of cartItems) {
      const productResult = await pool.query(
        "SELECT name, price FROM products WHERE product_id = $1",
        [item.product_id]
      );

      const product = productResult.rows[0];
      if (product) {
        lineItems.push({
          price_data: {
            currency: "inr",
            product_data: { name: product.name },
            unit_amount: Math.round(product.price * 100), // Stripe paise mein leta hai (₹1 = 100 paise)
          },
          quantity: item.quantity,
        });
        totalAmount += parseFloat(product.price) * item.quantity;
      }
    }

    // Stripe Session Create karo
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      // Payment ke baad user kahan jaayega:
      success_url: `${
        process.env.CLIENT_URL || "http://localhost:5173"
      }/shop/success`,
      cancel_url: `${
        process.env.CLIENT_URL || "http://localhost:5173"
      }/shop/cart`,
      metadata: {
        user_id: userId,
        total_amount: totalAmount,
      },
    });

    // Frontend ko payment link bhejo
    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Error:", error);
    res.status(500).json({ message: "Payment processing failed" });
  }
});

export default router;
