import React, { useState, useEffect } from "react";
import "./App.css";
import ProductList from "./Components/ProductList";
import Cart from "./Components/Cart";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    // Load from localStorage 
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch products from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/cart");
      const data = await res.json();

      const detailedCart = data.cart.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        return { ...item, name: product?.name, price: product?.price };
      });

      setCart(detailedCart);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Add item to cart
  const addToCart = async (productId) => {
    await fetch("http://localhost:5000/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, qty: 1 }),
    });

    fetchCart();
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    await fetch(`http://localhost:5000/api/cart/${productId}`, {
      method: "DELETE",
    });

    fetchCart();
  };

  // Checkout and clear cart
  const checkout = async () => {
    const res = await fetch("http://localhost:5000/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartItems: cart }),
    });

    const data = await res.json();
    alert(`Checkout successful!\nTotal: ₹${data.receipt.total}`);

    setCart([]); // Clear local cart
    localStorage.removeItem("cart");
    fetchCart();
  };

  useEffect(() => {
    if (products.length > 0) fetchCart();
  }, [products]);

  return (
    <div className="app">
      <h1 className="app-title">🛍️ E-Commerce Cart</h1>
      <ProductList addToCart={addToCart} products={products} />

      <Cart
        cart={cart}
        removeFromCart={removeFromCart}
        checkout={checkout}
        products={products}
      />
    </div>
  );
}

export default App;
