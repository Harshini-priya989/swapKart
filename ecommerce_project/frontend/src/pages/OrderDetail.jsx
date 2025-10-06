import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";

function OrderDetail() {
  const { order_id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`/api/order/${order_id}/`)
      .then((res) => {
        setOrder(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load order details");
        setLoading(false);
      });
  }, [order_id]);

  if (loading) return (
    <div>
      <Header />
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2">Loading order details...</p>
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
  if (!order) return (
    <div>
      <Header />
      <div className="container mt-4">
        <div className="alert alert-warning">Order not found</div>
      </div>
    </div>
  );

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <h1 className="mb-4">Order Details</h1>
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">Order #{order.id}</h5>
            <p className="card-text">
              <strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}<br />
              <strong>Status:</strong> <span className={`badge ${order.status === 'Delivered' ? 'bg-success' : order.status === 'Pending' ? 'bg-warning' : 'bg-secondary'}`}>{order.status}</span>
            </p>
          </div>
        </div>
        <h2>Items</h2>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price (₹)</th>
                <th>Quantity</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td>{item.product.name}</td>
                  <td>{item.product.price}</td>
                  <td>{item.quantity}</td>
                  <td>{item.total_price}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end">
                  <strong>Grand Total</strong>
                </td>
                <td>
                  <strong>₹{order.total}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div className="mt-4">
          <Link to="/my-orders" className="btn btn-secondary me-2">Back to My Orders</Link>
          <Link to="/" className="btn btn-primary">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
