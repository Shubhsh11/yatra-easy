import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "api", "data.json");

export default async function handler(req, res) {
  // Allow CORS if needed
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Ensure data file exists
  try {
    await fs.access(DATA_PATH);
  } catch {
    await fs.writeFile(DATA_PATH, JSON.stringify({}), "utf-8");
  }

  if (req.method === "GET") {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const data = JSON.parse(raw);
    return res.status(200).json({ success: true, data });
  } else if (req.method === "POST") {
    const { key, value } = req.body;
    if (!key) {
      return res.status(400).json({ success: false, message: "Key is required" });
    }
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    const obj = JSON.parse(raw);
    obj[key] = value;
    await fs.writeFile(DATA_PATH, JSON.stringify(obj, null, 2), "utf-8");
    return res.status(200).json({ success: true, data: obj });
  } else {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
}
