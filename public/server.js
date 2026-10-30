
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>SUPREME XMD</title>
        <style>
          body {
            background: #080808;
            color: white;
            font-family: Arial;
            text-align: center;
            padding: 60px 15px;
          }
          h1 { color: #00d9ff; }
          p { color: #aaa; }
        </style>
      </head>
      <body>
        <h1>SUPREME XMD</h1>
        <p>WhatsApp Bot Management System</p>
        <p>Status: Server Online</p>
      </body>
    </html>
  `);
});

app.get("/api/status", (req, res) => {
  res.json({
    bot: "SUPREME XMD",
    status: "online",
    version: "1.0.0"
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`SUPREME XMD server running on port ${PORT}`);
});
