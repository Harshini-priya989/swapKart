import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";

function CategoryProducts() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [addingToCart, setAddingToCart] = useState(null);

  // Filter states
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  const fetchProducts = () => {
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (minPrice) params.append("min_price", minPrice);
    if (maxPrice) params.append("max_price", maxPrice);
    if (sort) params.append("sort", sort);

    api
      .get(`/api/category/${slug}/?${params.toString()}`)
      .then((res) => {
        setCategory(res.data.category);
        setProducts(res.data.products);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load products");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchProducts();
  }, [slug, query, minPrice, maxPrice, sort]);

  const addToCart = (productId) => {
    const quantityInput = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantityInput.value) || 1;
    setAddingToCart(productId);
    setMessage("");

    api
      .post(`/add-to-cart/${productId}/`, { quantity })
      .then((res) => {
        setMessage(res.data.message || "Added to cart!");
        setAddingToCart(null);
      })
      .catch((err) => {
        console.error(err);
        setMessage(err.response?.data?.error || "❌ Could not add to cart");
        setAddingToCart(null);
      });
  };

  if (loading) return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
          <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
            <span className="visually-hidden">Loading products...</span>
          </div>
        </div>
      </div>
    </div>
  );
  if (error) return (
    <div>
      <Header />
      <div className="container mt-5">
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error:</strong> {error}
          <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Header />
      {message && (
        <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 1050 }}>
          <div className={`alert ${message.includes("❌") ? "alert-danger" : "alert-success"} alert-dismissible fade show`} role="alert">
            {message}
            <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
        </div>
      )}
      <div className="container mt-5">
        {category && category.image_url && (
          <div className="text-center mb-4">
            <img src={category.image_url} alt={category.name} className="img-fluid rounded" style={{ maxHeight: '200px', objectFit: 'cover' }} />
          </div>
        )}
        <h2 className="mb-4">Products in {category ? category.name : slug}</h2>

        {/* Filters */}
        <div className="row mb-4">
          <div className="col-md-3">
            <input
              type="text"
              className="form-control"
              placeholder="Search products..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <input
              type="number"
              className="form-control"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <div className="col-md-2">
            <select
              className="form-select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort by</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
          <div className="col-md-3">
            <button
              className="btn btn-outline-secondary me-2"
              onClick={() => {
                setQuery("");
                setMinPrice("");
                setMaxPrice("");
                setSort("");
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="row">
        {products.map((p) => (
          <div key={p.id} className="col-lg-3 col-md-4 col-sm-6 col-12 mb-4">
            <div className="card h-100 shadow-sm">
              {p.image_url ? (
                <img
                  src={p.image_url}
                  alt={p.name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              ) : (
                <img
                  src="https://via.placeholder.com/300x200?text=No+Image"
                  alt="No Image"
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                  <Link to={`/product/${p.id}`} className="text-decoration-none text-dark">
                    {p.name}
                  </Link>
                </h5>
                <p className="card-text fw-bold text-primary">₹{p.price}</p>
                <p className="card-text">
                  <span className={`badge ${p.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
                    {p.stock > 0 ? `In Stock: ${p.stock}` : 'Out of Stock'}
                  </span>
                </p>
                <p className="card-text text-muted" style={{ fontSize: '0.9rem' }}>
                  {p.description?.length > 120 ? `${p.description.substring(0, 120)}...` : p.description}
                </p>
                {p.stock > 0 ? (
                  <div className="d-flex flex-column gap-2 mt-auto">
                    <div className="d-flex align-items-center gap-2">
                      <label htmlFor={`quantity-${p.id}`} className="form-label mb-0" style={{ fontSize: '0.85rem' }}>Qty:</label>
                      <input
                        type="number"
                        id={`quantity-${p.id}`}
                        className="form-control"
                        min="1"
                        max={p.stock}
                        defaultValue="1"
                        style={{ width: "70px", fontSize: '0.85rem' }}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-success w-100"
                      onClick={() => addToCart(p.id)}
                      disabled={addingToCart === p.id}
                    >
                      {addingToCart === p.id ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                ) : (
                  <div className="mt-auto">
                    <span className="badge bg-danger w-100 py-2">Out of Stock</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-4">
        <Link to="/" className="btn btn-secondary">
          ← Back to Categories
        </Link>
      </div>
      </div>
    </div>
  );
}

export default CategoryProducts;
