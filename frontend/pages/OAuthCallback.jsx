import { useEffect, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const processedRef = useRef(false);

  useEffect(() => {
    // Prevent double processing
    if (processedRef.current) return;
    processedRef.current = true;

    console.log("OAuthCallback mounted");
    console.log("Current URL:", window.location.href);
    
    // Get params directly from URL
    const urlParams = new URLSearchParams(window.location.search);
    const userParam = urlParams.get("user");
    const error = urlParams.get("error");

    console.log("User param:", userParam);
    console.log("Error param:", error);

    if (error) {
      console.error("OAuth error:", error);
      navigate("/login?error=" + error, { replace: true });
      return;
    }

    if (userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        console.log("Parsed user data:", userData);
        login(userData);

        console.log("Navigating to dashboard for role:", userData.role);
        
        // Navigate based on user's assigned role
        setTimeout(() => {
          if (userData.role === "admin") {
            navigate("/admin", { replace: true });
          } else if (userData.role === "faculty") {
            navigate("/faculty", { replace: true });
          } else if (userData.role === "student") {
            navigate("/student", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }, 100);
      } catch (err) {
        console.error("Error parsing user data:", err);
        navigate("/login?error=invalid_response", { replace: true });
      }
    } else {
      console.log("No user data found, redirecting to login");
      navigate("/login?error=no_user_data", { replace: true });
    }
  }, [navigate, login]);

  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#bbeeeb"
    }}>
      <div style={{ textAlign: "center" }}>
        <Loader />
        <p style={{ marginTop: "20px", color: "#333" }}>Completing sign in...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;