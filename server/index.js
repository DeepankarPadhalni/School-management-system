const express = require("express");
const cors = require("cors");
const path = require("path");

const addSchoolRouter = require("./routes/addschool");
const showSchoolRouter = require("./routes/showSchool");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Mount routes
app.use("/api", showSchoolRouter);
app.use("/api", addSchoolRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
