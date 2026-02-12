import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:5000/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      const data = await response.json();
      login(data);

      // Navigate based on user's assigned role
      if (data.role === "admin") navigate("/admin");
      else if (data.role === "faculty") navigate("/faculty");
      else if (data.role === "student") navigate("/student");
      else navigate("/");
    } catch (err) {
      setError("Connection error: " + err.message);
      setLoading(false);
    }
  };

  console.log("Login component rendering");

  return (
    <div style={{
      padding: "40px 20px",
      display: "flex",
      justifyContent: "center", 
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f0f0f0"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        maxWidth: "400px",
        width: "100%"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "10px", color: "#333" }}>AARSS</h1>
        <p style={{ textAlign: "center", marginBottom: "30px", color: "#666" }}>Academic At-Risk Student System</p>

        {error && (
          <div style={{
            backgroundColor: "#fee",
            color: "#c00",
            padding: "12px",
            borderRadius: "6px",
            marginBottom: "20px",
            border: "1px solid #fcc"
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
              Email:
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              placeholder="your@email.com"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div style={{ marginBottom: "25px" }}> 
            <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold", color: "#333" }}>
              Password:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="Enter your password"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #ddd",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#667eea",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.8 : 1
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div style={{
          marginTop: "30px",
          paddingTop: "20px",
          borderTop: "1px solid #eee",
          backgroundColor: "#f9f9f9",
          padding: "15px",
          borderRadius: "6px"
        }}>
          <p style={{ fontWeight: "bold", marginBottom: "12px", color: "#333", textAlign: "center" }}>Demo Credentials:</p>
          <div style={{ fontSize: "13px", color: "#555", lineHeight: "1.8" }}>
            <p><strong>Admin:</strong> admin@email.com / password</p>
            <p><strong>Faculty:</strong> faculty@email.com / password</p>
            <p><strong>Student:</strong> student@email.com / password</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
