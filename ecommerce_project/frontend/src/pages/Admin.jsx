import React from "react";
import { Link } from "react-router-dom";

export default function Admin() {
  return (
    <div className="container mt-5">
      <h1>Admin Panel</h1>
      <p>Access the Django admin interface to manage the site.</p>
      <a
        href="http://127.0.0.1:8000/admin"
        target="_blank"
        rel="noopener noreferrer"
        className="btn btn-primary me-2"
      >
        Go to Django Admin
      </a>
      <Link to="/" className="btn btn-secondary">
        Back to Home
      </Link>
    </div>
  );
}
