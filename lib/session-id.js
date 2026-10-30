"use strict";

const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const STORE_DIR = path.join(__dirname, "..", "private");
const STORE_FILE = path.join(STORE_DIR, "sessions.json");

fs.mkdirSync(STORE_DIR, { recursive: true });

if (!fs.existsSync(STORE_FILE)) {
  fs.writeFileSync(STORE_FILE, "{}", { mode: 0o600 });
}

function readSessions() {
  return JSON.parse(fs.readFileSync(STORE_FILE, "utf8"));
}

function saveSessions(data) {
  fs.writeFileSync(
    STORE_FILE,
    JSON.stringify(data, null, 2),
    { mode: 0o600 }
  );
}

function generateSessionId(sessionFolder) {
  if (!sessionFolder) {
    throw new Error("A valid session folder is required.");
  }

  const id = "SUPREME-" +
    crypto.randomBytes(24).toString("hex");

  const sessions = readSessions();

  sessions[id] = {
    folder: sessionFolder,
    createdAt: new Date().toISOString()
  };

  saveSessions(sessions);

  return id;
}

function getSession(id) {
  if (!id || typeof id !== "string") return null;

  const sessions = readSessions();
  return sessions[id] || null;
}

function revokeSession(id) {
  const sessions = readSessions();

  if (!sessions[id]) return false;

  delete sessions[id];
  saveSessions(sessions);

  return true;
}

module.exports = {
  generateSessionId,
  getSession,
  revokeSession
};
