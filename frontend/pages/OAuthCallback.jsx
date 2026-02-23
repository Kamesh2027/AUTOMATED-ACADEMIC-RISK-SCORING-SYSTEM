import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Loader from "../components/Loader";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    console.log("OAuthCallback mounted");
    console.log("Current URL:", window.location.href);
    console.log("Search params:", window.location.search);
    
    // Get user data from URL params
    const userParam = searchParams.get("user");
    const error = searchParams.get("error");

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

        // Small delay to ensure state is updated
        setTimeout(() => {
          // Navigate based on user's assigned role
          if (userData.role === "admin") navigate("/admin", { replace: true });
          else if (userData.role === "faculty") navigate("/faculty", { replace: true });
          else if (userData.role === "student") navigate("/student", { replace: true });
          else navigate("/", { replace: true });
        }, 500);
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login?error=invalid_response", { replace: true });
      }
    } else {
      console.log("No user data found, redirecting to login");
      navigate("/login?error=no_user_data", { replace: true });
    }
  }, []); // Empty deps - only run once on mount

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