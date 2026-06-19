const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const tenantRoutes = require("./routes/tenantRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5002;
const frontendOrigin = (
  process.env.FRONTEND_URL || "http://localhost:5173"
).trim();

// CORS configuration to allow secure communication with the frontend
app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  }),
);
app.options(
  "*",
  cors({
    origin: frontendOrigin,
    credentials: true,
  }),
);

// Configure body parsing middleware with 50mb limit for large Base64 media uploads
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Cloud-Native Gatekeeper Middleware: Guarantees active DB connection before query execution
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failure at runtime:", error.message);
    res.status(500).json({ 
      success: false, 
      error: "Database connection failed at runtime." 
    });
  }
});

// Mount the Tenant configuration endpoints
app.use("/api/tenant", tenantRoutes);

app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, error: "Endpoint not found on Tenant Service." });
});

app.listen(PORT, () => {
  console.log(`🎨 Tenant Customization Engine online on port ${PORT}`);
});