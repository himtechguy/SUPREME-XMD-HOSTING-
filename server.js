
require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const rateLimit = require("express-rate-limit");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const startedAt = Date.now();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: "1mb" }));

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Try again later."
  }
});

app.use(
  session({
    name: "supreme.sid",
    secret: process.env.SESSION_SECRET || "development-only-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 12
    }
  })
);

// Admin login
app.post("/api/auth/login", loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body || {};

    if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD_HASH ||
        !process.env.SESSION_SECRET ||
        process.env.SESSION_SECRET === "development-only-secret-change-me") {
      return res.status(503).json({
        success: false,
        message: "Admin security is not configured."
      });
    }

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      username.length > 100 ||
      password.length > 200
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid username and password."
      });
    }

    const usernameMatches = username === process.env.ADMIN_USERNAME;
    const passwordMatches = await bcrypt.compare(
      password,
      process.env.ADMIN_PASSWORD_HASH
    );

    if (!usernameMatches || !passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Incorrect username or password."
      });
    }

    req.session.regenerate((error) => {
      if (error) {
        return res.status(500).json({
          success: false,
          message: "Could not create login session."
        });
      }

      req.session.isAdmin = true;
      req.session.username = username;

      req.session.save((saveError) => {
        if (saveError) {
          return res.status(500).json({
            success: false,
            message: "Could not save login session."
          });
        }

        res.json({
          success: true,
          message: "Admin login successful."
        });
      });
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Login failed."
    });
  }
});

// Check login status
app.get("/api/auth/me", (req, res) => {
  res.json({
    success: true,
    authenticated: req.session.isAdmin === true,
    username: req.session.isAdmin ? req.session.username : null
  });
});

// Admin logout
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: "Could not log out."
      });
    }

    res.clearCookie("supreme.sid");
    res.json({
      success: true,
      message: "Logged out successfully."
    });
  });
});

// Protect future admin-only API routes with this middleware
function requireAdmin(req, res, next) {
  if (req.session.isAdmin !== true) {
    return res.status(401).json({
      success: false,
      message: "Admin login required."
    });
  }

  next();
}

// Example protected endpoint
app.get("/api/admin/check", requireAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Admin access granted."
  });
});

// Server health
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    platform: "SUPREME XMD HOSTING",
    server: "online",
    bot: "not_connected",
    botIntegrationConfigured: false,
    uptimeSeconds: Math.floor(process.uptime()),
    startedAt: new Date(startedAt).toISOString(),
    timestamp: new Date().toISOString()
  });
});

// Platform overview
app.get("/api/overview", (req, res) => {
  res.json({
    success: true,
    services: {
      dashboard: "online",
      github: "not_connected",
      deployment: "not_configured",
      whatsapp: "not_connected"
    }
  });
});

app.get("/api", (req, res) => {
  res.json({
    name: "SUPREME XMD HOSTING API",
    version: "1.0.0",
    status: "online"
  });
});

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal server error."
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("================================");
  console.log(" SUPREME XMD HOSTING");
  console.log(` Server running on port ${PORT}`);
  console.log("================================");
});
