import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBookingApiUrl } from "../../utils/api";

export default function AdminLogin() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res  = await fetch(getBookingApiUrl("admin_login.php"), {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.message); return; }

      // Store admin separately from host/guest
      localStorage.setItem("adminToken", data.token);
      localStorage.setItem("adminUser",  JSON.stringify(data.user));
      navigate("/admin", { replace: true });
    } catch {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      background: "#f1f5f9", fontFamily: "inherit",
    }}>
      <div style={{
        background: "#fff", borderRadius: 16, padding: "40px 36px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)", width: "100%", maxWidth: 400,
      }}>
        <div style={{ marginBottom: 28, textAlign: "center" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#182435", margin: 0 }}>
            iBookNova <span style={{ color: "#19907e" }}>Admin</span>
          </h1>
          <p style={{ color: "#6b7280", fontSize: 14, marginTop: 6 }}>
            Sign in to your admin account
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
              Email
            </label>
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="admin@ibooknova.com.ng" required
              style={{
                width: "100%", padding: "10px 12px", border: "1.5px solid #d1d5db",
                borderRadius: 8, fontSize: 14, boxSizing: "border-box", outline: "none",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 5 }}>
              Password
            </label>
            <input
              type="password" value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••" required
              style={{
                width: "100%", padding: "10px 12px", border: "1.5px solid #d1d5db",
                borderRadius: 8, fontSize: 14, boxSizing: "border-box", outline: "none",
              }}
            />
          </div>
          {error && (
            <p style={{ color: "#dc2626", fontSize: 13, margin: 0 }}>{error}</p>
          )}
          <button
            type="submit" disabled={loading}
            style={{
              background: "#182435", color: "#fff", border: "none",
              borderRadius: 8, padding: "11px", fontSize: 15,
              fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1, fontFamily: "inherit",
            }}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}