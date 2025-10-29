import React from "react";

function Cart({ cart, removeFromCart, checkout, products }) {
  const total = cart.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.qty : 0);
  }, 0);

  if (!cart || cart.length === 0) {
    return (
      <div className="cart-container">
        <h2>🛒 Cart</h2>
        <p>Cart is empty</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>🛒 Cart</h2>

      {cart.map((item) => {
        const product = products.find(p => p.id === item.productId);
        const name = product ? product.name : "Unknown Product";
        const price = product ? product.price : 0;

        return (
          <div key={item.productId} className="cart-item">
            <div className="cart-item-info">
              <span className="cart-item-name">{name}</span>
              <span className="cart-item-price">₹{price}</span>
              <span className="cart-item-qty">Qty: {item.qty}</span>
            </div>
            <button
              className="remove-btn"
              onClick={() => removeFromCart(item.productId)}
            >
              Remove
            </button>
          </div>
        );
      })}

      <hr />
      <h3 className="cart-total">Total: ₹{total}</h3>

      <div className="checkout-section">
        <button className="checkout-btn" onClick={checkout}>
          Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;
