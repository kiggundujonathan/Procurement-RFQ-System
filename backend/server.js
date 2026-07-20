const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/database");

dotenv.config();

connectDB();

console.log("Connecting to DB...");

const app = express();
app.use(cors());


app.use(express.json({ limit: "20mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "20mb",
  })
);

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const rfqRoutes = require("./routes/rfqRoutes");

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rfqs", rfqRoutes);

app.get("/", (req, res) => {
  res.send("RFQ API Root Working");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "UP",
    message: "RFQ API Running",
  });
});

app.post("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "POST route working",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});