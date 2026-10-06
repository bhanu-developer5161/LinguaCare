const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

const PORT = process.env.PORT || 5000;

// ==========================================
// DATABASE
// ==========================================
connectDB();

// ==========================================
// MIDDLEWARE
// ==========================================
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// ==========================================
// ROUTES
// ==========================================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/requests", requestRoutes);

// ==========================================
// HEALTH CHECK
// ==========================================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LinguaCare API is running successfully!",
    environment: process.env.NODE_ENV || "development",
  });
});

// ==========================================
// 404 HANDLER
// ==========================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found.",
  });
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `LinguaCare server running on port ${PORT}`
  );
});