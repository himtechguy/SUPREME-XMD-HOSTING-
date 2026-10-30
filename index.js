
const express = require("express");
const path = require("path");
const config = require("./config");

const app = express();
const PORT = process.env.PORT || 3000;
const startedAt = Date.now();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/status", (req, res) => {
  const uptime = Math.floor((Date.now() - startedAt) / 1000);

  res.json({
    name: config.BOT_NAME,
    status: "Online",
    botStatus: "Not connected",
    deployment: "Server running",
    uptime: `${uptime}s`,
    version: config.VERSION
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`${config.BOT_NAME} server running on port ${PORT}`);
});
