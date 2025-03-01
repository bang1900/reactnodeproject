/**
 * server.js
 */
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");
const dbSingleton = require("./dbSingleton");

// For Multer, we only need it inside the route file now.
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8081;

// Connect to DB
dbSingleton.getConnection();
console.log("Connected to MySQL Database");

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

// Serve static assets
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Import your route files
const userRoutes = require("./routes/users");
const statueRoutes = require("./routes/statues");
const favoritesRoutes = require("./routes/favorites");

// Mount them all at "/", so e.g. /login is /login, /statues => /statues
app.use("/", userRoutes);
app.use("/", statueRoutes);
app.use("/", favoritesRoutes);

// Sample root route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Start
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
