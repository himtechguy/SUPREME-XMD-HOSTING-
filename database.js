
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "database");

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const database = {
  read(file, fallback = {}) {
    const filePath = path.join(DATA_DIR, `${file}.json`);

    try {
      if (!fs.existsSync(filePath)) {
        return fallback;
      }

      return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (error) {
      console.error("Database read error:", error.message);
      return fallback;
    }
  },

  write(file, data) {
    const filePath = path.join(DATA_DIR, `${file}.json`);

    fs.writeFileSync(
      filePath,
      JSON.stringify(data, null, 2),
      "utf8"
    );

    return true;
  }
};

module.exports = database;
