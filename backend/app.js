require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/users");
const fileRoutes = require("./routes/files");
const connectDB = require("./config/db");
connectDB();
app.use(express.json());

app.use(cors());
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/admin", fileRoutes);
app.use("/users", fileRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log("Server ishga tushdi"));
