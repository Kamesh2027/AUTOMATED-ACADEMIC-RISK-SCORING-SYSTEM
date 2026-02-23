import { useState, useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { API_BASE_URL } from "../config";

//const API_BASE_URL = "http://localhost:5000/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for error in URL params
    const errorParam = searchParams.get("error");
    if (errorParam) {
      const errorMessages = {
        "authentication_failed": "Authentication failed. Please try again.",
        "server_error": "Server error occurred. Please try again later.",
        "invalid_response": "Invalid response from server.",
        "no_user_data": "No user data received."
      };
      setError(errorMessages[errorParam] || "An error occurred during login.");
    }
  }, [searchParams]);

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
        let errorMessage = "Login failed";
        try {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } catch (e) {
          // If response is not JSON, use status text
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        setError(errorMessage);
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
      console.error("Login error:", err);
      setError("Connection error: " + (err.message || "Cannot reach server"));
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  console.log("Login component rendering");

  return (
    <div style={{
      padding: "40px 20px",
      display: "flex",
      justifyContent: "center", 
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#bbeeeb"
    }}>
      <div style={{
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        maxWidth: "400px",
        width: "100%"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "10px", color: "#65b2bf" }}>AARSS</h1>
        <p style={{ textAlign: "center", marginBottom: "30px", color: "#565353" }}>Academic Portal</p>

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
              backgroundColor: "#65b2bf",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.8 : 1,
              marginBottom: "15px"
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div style={{
          display: "flex",
          alignItems: "center",
          margin: "20px 0"
        }}>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }}></div>
          <span style={{ padding: "0 10px", color: "#666", fontSize: "14px" }}>OR</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#ddd" }}></div>
        </div>

        {/* Google OAuth Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          style={{
            width: "100%",
            padding: "12px",
            backgroundColor: "white",
            color: "#444",
            border: "1px solid #ddd",
            borderRadius: "6px",
            fontSize: "16px",
            fontWeight: "500",
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            transition: "all 0.3s ease",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
              e.currentTarget.style.backgroundColor = "#f8f8f8";
            }
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)";
            e.currentTarget.style.backgroundColor = "white";
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
            <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z" fill="#FBBC05"/>
            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>

        {/* <div style={{
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
        </div> */}
      </div>
    </div>
  );
};

export default Login;
