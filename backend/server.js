require('dotenv').config();
const express = require("express");
const app = express();
const path = require("path");
const connectionDB = require("./db/connection");
const cors = require("cors");
const { requireAuth, syncUser } = require("./middleware/clerkAuth");

const queryRoutes = require("./routes/queryRoutes");
const answerRoutes = require("./routes/answerRoutes");
const userRoutes = require("./routes/userRoutes");

// Connect to Database
connectionDB();

// Middleware
const allowedOrigins = [
  "http://localhost:5173",
  "https://dev-query-ten.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app") // Allow all Vercel deployments
    ) {
      callback(null, true);
    } else {
      // Optional: Allow all during development/testing or log
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser()); // No longer needed with Clerk

// Routes
// Protected Routes: Auth is handled inside individual route files
app.use("/api/queries", queryRoutes);
app.use("/api/queries", answerRoutes);
app.use("/api", requireAuth, syncUser, userRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Dev Query Platform API is running");
});

const PORT = 8080;
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
  });
}

module.exports = app;
