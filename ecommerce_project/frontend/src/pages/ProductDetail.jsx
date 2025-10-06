import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import Header from "../components/Header";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    api
      .get(`/api/product/${id}/`)
      .then((res) => {
        setProduct(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load product");
        setLoading(false);
      });
  }, [id]);

  const addToCart = () => {
    setAddingToCart(true);
    setMessage("");

    api
      .post(`/add-to-cart/${id}/`, { quantity: 1 })
      .then((res) => {
        setMessage(res.data.message || `${product.name} added to cart!`);
        setAddingToCart(false);
      })
      .catch((err) => {
        console.error(err.response);
        setMessage(err.response?.data?.error || "❌ Could not add to cart");
        setAddingToCart(false);
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
          <p className="mt-2">Loading product...</p>
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
  if (!product) return (
    <div>
      <Header />
      <div className="container mt-4">
        <div className="alert alert-warning">Product not found</div>
      </div>
    </div>
  );

  return (
    <div>
      <Header />
      <div className="container mt-4">
        <nav aria-label="breadcrumb">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item"><Link to={`/category/${product.category.slug}`}>{product.category.name}</Link></li>
            <li className="breadcrumb-item active" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <div className="row">
          <div className="col-md-6">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="img-fluid rounded shadow"
                style={{ maxHeight: '400px', objectFit: 'cover' }}
              />
            ) : (
              <div className="bg-light d-flex align-items-center justify-content-center rounded shadow" style={{ height: '400px' }}>
                <span className="text-muted">No image available</span>
              </div>
            )}
          </div>
          <div className="col-md-6">
            <h1 className="mb-3">{product.name}</h1>
            <h3 className="text-primary mb-3">₹{product.price}</h3>
            <p className="lead mb-4">{product.description}</p>
            <p className="text-muted mb-4">Category: <Link to={`/category/${product.category.slug}`} className="text-decoration-none">{product.category.name}</Link></p>

            <button
              onClick={addToCart}
              disabled={addingToCart}
              className="btn btn-primary btn-lg me-2"
            >
              {addingToCart ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Adding...
                </>
              ) : (
                "Add to Cart"
              )}
            </button>

            <Link to="/cart" className="btn btn-outline-secondary btn-lg">View Cart</Link>

            <div className="mt-3">
              <Link to={`/category/${product.category.slug}`} className="btn btn-outline-primary">
                ← Back to {product.category.name} Products
              </Link>
            </div>

            {message && (
              <div className={`alert mt-3 ${message.includes("❌") ? "alert-danger" : "alert-success"}`}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-5">
          <h3>Reviews</h3>
          {product.reviews && product.reviews.length > 0 ? (
            <div className="mb-4">
              {product.reviews.map((review) => (
                <div key={review.id} className="card mb-3">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <strong>{review.user}</strong>
                      <small className="text-muted">{new Date(review.created_at).toLocaleDateString()}</small>
                    </div>
                    <div className="mb-2">
                      {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                    </div>
                    <p className="mb-0">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted">No reviews yet.</p>
          )}

          {/* Add Review Form */}
          <div className="card">
            <div className="card-body">
              <h5>Add a Review</h5>
              <form onSubmit={(e) => {
                e.preventDefault();
                setSubmittingReview(true);
                api.post(`/api/product/${id}/`, {
                  rating: reviewRating,
                  comment: reviewComment
                })
                .then((res) => {
                  setMessage("Review added successfully!");
                  setReviewComment("");
                  setReviewRating(5);
                  // Refresh product to show new review
                  api.get(`/api/product/${id}/`).then((res) => setProduct(res.data));
                })
                .catch((err) => {
                  setMessage(err.response?.data?.error || "Failed to add review");
                })
                .finally(() => setSubmittingReview(false));
              }}>
                <div className="mb-3">
                  <label className="form-label">Rating</label>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        style={{
                          fontSize: '24px',
                          cursor: 'pointer',
                          color: star <= reviewRating ? '#ffc107' : '#e4e5e9'
                        }}
                        onClick={() => setReviewRating(star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label">Comment</label>
                  <textarea
                    className="form-control"
                    rows="3"
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary" disabled={submittingReview}>
                  {submittingReview ? "Submitting..." : "Submit Review"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
