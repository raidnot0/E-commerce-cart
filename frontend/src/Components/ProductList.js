import React, { useState } from "react";
import "./ProductList.css"; 

function ProductList({ products = [], addToCart }) {
  const [openSpecId, setOpenSpecId] = useState(null);

  const toggleSpecs = (id) => {
    setOpenSpecId(openSpecId === id ? null : id);
  };

  return (
    <div className="product-list">
      <h2>📦 Products</h2>
      <div className="product-grid">
        {products.map((p) => (
          <div key={p.id} className="product-card">
            <img
              src={p.image}
              alt={p.name}
              onClick={() => toggleSpecs(p.id)}
              className="product-image"
            />
            <h3>{p.name}</h3>
            <p>₹{p.price}</p>

            {openSpecId === p.id && p.specs && (
              <div className="spec-list">
                {p.specs.map((s, i) => (
                  <div key={i} className="spec-item">
                    {s}
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => addToCart(p.id)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;
