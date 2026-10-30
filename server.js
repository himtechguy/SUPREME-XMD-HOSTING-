
require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const startedAt = Date.now();

app.use(
  helmet({
    contentSecurityPolicy: false
  })
);

app.use(express.json({ limit: "1mb" }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/health", (req, res) => {
  const uptimeSeconds = Math.floor(process.uptime());

  res.json({
    success: true,
    platform: "SUPREME XMD HOSTING",
    server: "online",
    bot: "not_connected",
    botIntegrationConfigured: false,
    uptimeSeconds,
    startedAt: new Date(startedAt).toISOString(),
    timestamp: new Date().toISOString()
  });
});

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

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("================================");
  console.log(" SUPREME XMD HOSTING");
  console.log(` Server running on port ${PORT}`);
  console.log("================================");
});
