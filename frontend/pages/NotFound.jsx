import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.heading}>404</h1>
        <p style={styles.text}>Page Not Found</p>
        <p style={styles.description}>
          The page you're looking for doesn't exist.
        </p>
        <button
          style={styles.button}
          onClick={() => navigate("/")}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#5568d3")}
          onMouseLeave={(e) =>
            (e.target.style.backgroundColor = "#667eea")
          }
        >
          Go Back to Login
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  content: {
    textAlign: "center",
    color: "white",
  },
  heading: {
    fontSize: "72px",
    fontWeight: "700",
    margin: "0 0 1rem 0",
  },
  text: {
    fontSize: "32px",
    fontWeight: "600",
    margin: "0 0 1rem 0",
  },
  description: {
    fontSize: "16px",
    margin: "0 0 2rem 0",
    opacity: 0.9,
  },
  button: {
    padding: "0.9rem 2rem",
    fontSize: "16px",
    fontWeight: "600",
    backgroundColor: "#667eea",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};
