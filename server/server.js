require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();
mongoose.set("strictQuery", true);

// Database connection
require("./config/db");

// CORS configuration for the client URL
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
};

app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options("*", cors(corsOptions));

// Trust the first proxy to enable cookie sharing between the client and the server
app.set("trust proxy", 1);

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);
// Middleware
app.use(express.json());
app.use(cookieParser());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
require("./config/passport")(passport);

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/api", require("./routes/user"));
app.use("/api", require("./routes/test"));
app.use("/api", require("./routes/extract-keywords"));
app.use("/api", require("./routes/resume"));
app.use("/api", require("./routes/cover-letter"));
app.use("/api", require("./routes/file"));
app.use("/api", require("./routes/scan-history"));
// Test route
app.get("/", (req, res) => {
  res.send("AI Career Toolbox server is running!");
});

// Error handling middleware (move this to the end)
app.use(require("./utils/errorHandler"));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
