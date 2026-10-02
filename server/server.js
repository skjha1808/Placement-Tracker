const path = require("path");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables BEFORE importing files that use process.env
dotenv.config();

const connectDB = require("./config/db");

const studentRoutes = require("./routes/studentRoutes");
const companyRoutes = require("./routes/companyRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const eligibilityRoutes = require("./routes/eligibilityRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const authRoutes = require("./routes/authRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const aiRoutes = require("./routes/aiRoutes");

// Connect Database
connectDB();
const app = express();

// Render and other managed hosts sit behind a reverse proxy.
app.set("trust proxy", 1);

// Middleware
const allowedOrigins = (process.env.CLIENT_URL || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow non-browser requests (curl, health checks, server-to-server).
            if (!origin || allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("CORS origin not allowed"));
        },
    })
);
app.use(express.json());

// Uploaded resumes are served from the backend.
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check for deployment/monitoring.
app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "healthy",
    });
});

// Routes
app.get("/", (req, res) => {
    res.send("Placement Tracker Backend Running...");
});

app.use("/api/students", studentRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/eligibility", eligibilityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);

// AI Routes
app.use("/api/ai", aiRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err);

    if (err.name === "MulterError") {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(413).json({
                success: false,
                message: "File size must not exceed 5 MB.",
            });
        }

        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    if (err.message === "Only PDF files are allowed.") {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }

    res.status(500).json({
        success: false,
        message: "Internal server error",
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});