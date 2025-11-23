const express = require("express");
const app = express();
const path = require("path");
const connectionDB = require("./db/connection");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const queryRoutes = require("./routes/queryRoutes");
const answerRoutes = require("./routes/answerRoutes");

// Connect to Database
connectionDB();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Vite default port
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/queries", queryRoutes);
app.use("/api/queries", answerRoutes); // Changed from /api to /api/queries

// Basic route
app.get("/", (req, res) => {
  res.send("Dev Query Platform API is running");
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
