import React, { useState, useEffect } from "react";
import API from "../api";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setSuccess("");

    // Client-side validation
    if (name.trim().length < 2) {
      setErr("Name must be at least 2 characters");
      return;
    }

    if (password.length < 6) {
      setErr("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setErr("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await API.post("/auth/register", { name, email, password });
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed. Try another email.";
      setErr(message);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return "";
    if (password.length < 6) return "weak";
    if (password.length < 10) return "medium";
    return "strong";
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="apple-container-mini" style={{ display: "flex", flexDirection: "column", justifyContent: "center", minHeight: "100vh" }}>
      <div className="apple-card" style={{ padding: "40px" }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <span style={{ fontSize: "36px" }}>📝</span>
          <h3 className="apple-title" style={{ fontSize: "28px", marginTop: "15px", marginBottom: "5px" }}>Create Account</h3>
          <p className="apple-subtitle" style={{ fontSize: "14px", marginBottom: 0 }}>Start building simple, clean forms</p>
        </div>

        {err && (
          <div className="apple-alert apple-alert-danger" style={{ marginBottom: "20px" }}>
            {err}
          </div>
        )}

        {success && (
          <div className="apple-alert apple-alert-success" style={{ marginBottom: "20px" }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="apple-form-group">
            <label className="apple-label">Full Name</label>
            <input
              className="apple-input"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
            />
          </div>

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

          <div className="apple-form-group">
            <label className="apple-label">Password</label>
            <input
              className="apple-input"
              type="password"
              placeholder="At least 6 characters..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            {password && (
              <div style={{ marginTop: "6px" }}>
                <small style={{
                  fontSize: "12px",
                  fontWeight: "600",
                  color: passwordStrength === 'weak' ? 'var(--apple-red)' :
                         passwordStrength === 'medium' ? '#ff9500' :
                         'var(--apple-green)'
                }}>
                  Password strength: {passwordStrength}
                </small>
              </div>
            )}
          </div>

          <div className="apple-form-group" style={{ marginBottom: "28px" }}>
            <label className="apple-label">Confirm Password</label>
            <input
              className="apple-input"
              type="password"
              placeholder="Confirm your password..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button
            className="apple-btn apple-btn-primary apple-btn-full"
            disabled={loading}
          >
            {loading ? "Registering..." : "Create Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <span style={{ fontSize: "14px", color: "var(--apple-text-secondary)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--apple-blue)", fontWeight: "500", textDecoration: "none" }}>
              Sign in here
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
