import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";

function Cart() {
  const [cart, setCart] = useState({ items: [], grand_total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  const fetchCart = () => {
    api
      .get("/api/cart/")
      .then((res) => {
        setCart(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load cart");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateCart = (itemId, action) => {
    setMessage("");
    api
      .post(`/api/cart/update/${itemId}/`, { action })
      .then((res) => {
        setMessage(res.data.message);
        fetchCart(); // Refetch cart after update
      })
      .catch((err) => {
        console.error(err);
        setMessage(err.response?.data?.error || "Failed to update cart");
      });
  };

  const handleCheckout = () => {
    setMessage("");
    api
      .post("/api/checkout/")
      .then((res) => {
        setMessage(res.data.message);
        setCart({ items: [], grand_total: 0 }); // Clear cart after successful checkout
      })
      .catch((err) => {
        console.error(err);
        setMessage(err.response?.data?.error || "Checkout failed");
      });
  };

  if (loading) return (
    <div>
      <Header />
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading cart...</p>
        </div>
      </div>
    </div>
  );
  if (error) return (
    <div>
      <Header />
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    </div>
  );

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h1 className="mb-4">Your Cart</h1>
        {message && (
          <div className={`alert ${message.includes("Failed") ? "alert-danger" : "alert-success"}`}>
            {message}
          </div>
        )}
        {cart.items.length > 0 ? (
          <>
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Price (₹)</th>
                    <th>Quantity</th>
                    <th>Total (₹)</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.items.map((item) => (
                    <tr key={item.id}>
                      <td>{item.product.name}</td>
                      <td>{item.product.price}</td>
                      <td>{item.quantity}</td>
                      <td>{item.total_price}</td>
                      <td>
                        {item.quantity < item.product.stock && (
                          <button className="btn btn-sm btn-outline-primary me-1" onClick={() => updateCart(item.id, "increase")}>
                            +
                          </button>
                        )}
                        <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => updateCart(item.id, "decrease")}>
                          -
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => updateCart(item.id, "remove")}>
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end">
                      <strong>Grand Total</strong>
                    </td>
                    <td colSpan="2">
                      <strong>₹{cart.grand_total}</strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="mt-4">
              <button className="btn btn-success me-2" onClick={handleCheckout}>Checkout</button>
              <Link to="/" className="btn btn-secondary">Continue Shopping</Link>
            </div>
          </>
        ) : (
          <div className="alert alert-info">Your cart is empty.</div>
        )}
      </div>
    </div>
  );
}

export default Cart;
