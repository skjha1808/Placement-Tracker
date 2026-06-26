const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

connectDB();

const app = express();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Placement Tracker Backend Running...");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});