const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const DATA_FILE = path.join(__dirname, "data.json");

// Utility: read data file
function readData() {
  try {
    const raw = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading data file:", err);
    return {};
  }
}

// Utility: write data file
function writeData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Error writing data file:", err);
  }
}

// GET endpoint — fetch stored data
app.get("/api/data", (req, res) => {
  const data = readData();
  res.json({ success: true, data });
});

// POST endpoint — store or update data
// Expect JSON body like { key: "...", value: {...} }
app.post("/api/data", (req, res) => {
  const { key, value } = req.body;
  if (!key) {
    return res.status(400).json({ success: false, message: "Key is required" });
  }
  const data = readData();
  data[key] = value;
  writeData(data);
  res.json({ success: true, data });
});

// You could also add DELETE, PUT, etc.

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
