import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-dark text-light mt-5 py-4">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="fw-bold mb-3">SnapKart</h5>
            <p className="mb-3">Your one-stop shop for all your needs. Quality products, fast delivery, and excellent customer service.</p>
            <div>
              <a href="#" className="text-light me-3" aria-label="Facebook">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-light me-3" aria-label="Twitter">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-light me-3" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-light" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/cart" className="text-light text-decoration-none">Cart</Link>
              </li>
              <li className="mb-2">
                <Link to="/my-orders" className="text-light text-decoration-none">My Orders</Link>
              </li>
              <li className="mb-2">
                <Link to="/login" className="text-light text-decoration-none">Login</Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">Categories</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/category/electronics" className="text-light text-decoration-none">Electronics</Link>
              </li>
              <li className="mb-2">
                <Link to="/category/clothing" className="text-light text-decoration-none">Clothing</Link>
              </li>
              <li className="mb-2">
                <Link to="/category/books" className="text-light text-decoration-none">Books</Link>
              </li>
              <li className="mb-2">
                <Link to="/category/home" className="text-light text-decoration-none">Home & Garden</Link>
              </li>
            </ul>
          </div>
          <div className="col-lg-4 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">Contact Us</h6>
            <p className="mb-2">
              <i className="bi bi-geo-alt me-2"></i>
              123 Shopping Street, City, State 12345
            </p>
            <p className="mb-2">
              <i className="bi bi-telephone me-2"></i>
              +1 (555) 123-4567
            </p>
            <p className="mb-2">
              <i className="bi bi-envelope me-2"></i>
              support@snapkart.com
            </p>
            <p className="mb-0">
              <i className="bi bi-clock me-2"></i>
              Mon-Fri: 9AM-6PM, Sat: 10AM-4PM
            </p>
          </div>
        </div>
        <hr className="my-4" />
        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0">&copy; 2024 SnapKart. All rights reserved.</p>
          </div>
          <div className="col-md-6 text-md-end">
            <Link to="/privacy" className="text-light text-decoration-none me-3">Privacy Policy</Link>
            <Link to="/terms" className="text-light text-decoration-none">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
