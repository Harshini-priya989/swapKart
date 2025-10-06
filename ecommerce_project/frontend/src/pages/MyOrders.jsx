import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/api/my-orders/")
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load orders");
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div>
      <Header />
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading orders...</p>
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
        <h1 className="mb-4">My Orders</h1>
        {orders.length > 0 ? (
          <div className="row">
            {orders.map((order) => (
              <div key={order.id} className="col-md-6 col-lg-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Order #{order.id}</h5>
                    <p className="card-text">
                      <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}<br />
                      <strong>Status:</strong> <span className={`badge ${order.status === 'Delivered' ? 'bg-success' : order.status === 'Pending' ? 'bg-warning' : 'bg-secondary'}`}>{order.status}</span><br />
                      <strong>Total:</strong> ₹{order.total}
                    </p>
                    <Link to={`/order/${order.id}`} className="btn btn-primary">View Details</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-info">You have no orders yet.</div>
        )}
        <div className="mt-4">
          <Link to="/" className="btn btn-secondary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
