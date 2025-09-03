require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");

const addSchoolRouter = require("./routes/addschool");
const showSchoolRouter = require("./routes/showschool");

const app = express();
const PORT = process.env.PORT || 5000;

// CORS
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/addschool", addSchoolRouter);
app.use("/api/showschool", showSchoolRouter);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
