const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");

// Load environment variables BEFORE importing passport
dotenv.config();

const passport = require("./config/passport");
const connectDB = require("./config/db");

connectDB();

const app = express();

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.FRONTEND_URL,
      'https://aarss-frontend.onrender.com',
      'http://localhost:5173',
      'http://localhost:5174'
    ];
    
    if (allowedOrigins.some(allowed => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key-change-in-production",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

console.log("Registering routes...");

app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

app.use("/api/auth", require("./routes/authRoutes"));
console.log("✓ Auth routes registered");

app.use("/api/students", require("./routes/studentRoutes"));
console.log("✓ Student routes registered");

app.use("/api/risk", require("./routes/riskRoutes"));
console.log("✓ Risk routes registered");

app.use("/api/feedback", require("./routes/feedbackRoutes"));
console.log("✓ Feedback routes registered");
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
// app.listen(5000, () =>
//   console.log("Server running on port 5000")
// );
