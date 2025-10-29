import fs from "fs";

const products = JSON.parse(fs.readFileSync("./products.json"));

import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let cart = [];

// get all products
app.get("/api/products", (req, res) => {
  res.json(products);
});

// get cart
app.get("/api/cart", (req, res) => {
  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product.price * item.qty);
  }, 0);
  res.json({ cart, total });
});

// post add to cart
app.post("/api/cart", (req, res) => {
  const { productId, qty } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: "Product not found" });

  const existing = cart.find(item => item.productId === productId);
  if (existing) existing.qty += qty;
  else cart.push({ productId, qty });

  res.json({ message: "Added to cart", cart });
});

// delete remove from cart
app.delete("/api/cart/:id", (req, res) => {
  const productId = parseInt(req.params.id);
  cart = cart.filter(item => item.productId !== productId);
  res.json({ message: "Item removed", cart });
});

// post checkout 
app.post("/api/checkout", (req, res) => {
  const { cartItems } = req.body;
  const total = cartItems.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product.price * item.qty);
  }, 0);

  const receipt = {
    total,
    timestamp: new Date().toISOString()
  };

  cart = []; // empty cart after checkout
  res.json({ message: "Checkout successful", receipt });
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
