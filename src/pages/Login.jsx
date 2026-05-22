import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const message = error.response?.data?.message || "Invalid email or password";
      setErr(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="apple-container-mini" style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh" }}>
      <div className="apple-card" style={{ padding: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <span style={{ fontSize: "36px" }}>📋</span>
          <h3 className="apple-title" style={{ fontSize: "28px", marginTop: "15px", marginBottom: "5px" }}>Welcome Back</h3>
          <p className="apple-subtitle" style={{ fontSize: "14px", marginBottom: 0 }}>Sign in to manage your forms</p>
        </div>

        {err && (
          <div className="apple-alert apple-alert-danger" style={{ marginBottom: "20px" }}>
            {err}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="apple-form-group">
            <label className="apple-label">Email Address</label>
            <input
              className="apple-input"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="apple-form-group" style={{ marginBottom: "28px" }}>
            <label className="apple-label">Password</label>
            <input
              className="apple-input"
              type="password"
              placeholder="Enter password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            className="apple-btn apple-btn-primary apple-btn-full"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <span style={{ fontSize: "14px", color: "var(--apple-text-secondary)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--apple-blue)", fontWeight: "500", textDecoration: "none" }}>
              Sign up now
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
