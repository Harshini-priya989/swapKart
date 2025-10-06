import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";
import Footer from "../components/Footer";

function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get("/api/categories/")
      .then((res) => {
        setCategories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load categories");
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
          <p className="mt-2">Loading categories...</p>
        </div>
      </div>
      <Footer />
    </div>
  );
  if (error) return (
    <div>
      <Header />
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
      </div>
      <Footer />
    </div>
  );

  return (
    <div>
      <Header />
      {/* Hero Section */}
      <div className="hero-section bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-3">Welcome to SnapKart</h1>
              <p className="lead mb-4">Discover amazing products across various categories. Shop with confidence and enjoy fast delivery.</p>
              <Link to="/cart" className="btn btn-light btn-lg me-3">Shop Now</Link>
              <Link to="/my-orders" className="btn btn-outline-light btn-lg">My Orders</Link>
            </div>
            <div className="col-lg-6">
              <div className="text-center">
                <i className="bi bi-cart-check display-1 text-white-50"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Shop by Category</h2>
          <p className="text-muted">Explore our wide range of product categories</p>
        </div>
        <div className="row">
          {categories.map((cat) => (
            <div key={cat.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className="card h-100 border-0 shadow-sm">
                {cat.image_url && (
                  <img src={cat.image_url} className="card-img-top" alt={cat.name} style={{ height: '150px', objectFit: 'cover' }} />
                )}
                <div className="card-body text-center d-flex flex-column">
                  {!cat.image_url && (
                    <div className="mb-3">
                      <i className="bi bi-tag-fill text-primary" style={{ fontSize: '3rem' }}></i>
                    </div>
                  )}
                  <h5 className="card-title fw-bold mb-3">{cat.name}</h5>
                  <p className="card-text text-muted flex-grow-1">Browse {cat.name.toLowerCase()} products</p>
                  <Link to={`/category/${cat.slug}`} className="btn btn-primary mt-auto">Browse Category</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
