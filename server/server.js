const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const studentRoutes = require("./routes/studentRoutes");

const companyRoutes = require("./routes/companyRoutes");

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Placement Tracker Backend Running...");
});

app.use("/api/students", studentRoutes);

app.use("/api/companies", companyRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});