const express = require ("express");
const dotenv = require("dotenv");

const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));


const db = require("./config/db.js");
dotenv.config();
db.connectDB();
const userRoutes = require("./routes/userRoutes");

// app.set("view engine", "ejs");
// userRoutes.set("views", "./views/user");

app.use("/api/user", userRoutes);
// app.use("/", express.static("public/assets"));





const PORT = process.env.PORT || 4000;

app.listen(PORT, console.log(`server has started in the port ${PORT}`));