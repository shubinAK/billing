import express from "express";
import path from "path";
import fs from "fs";

const app = express();
const PORT = 3000;
const DB_FILE = path.join(process.cwd(), "db_store.json");

// Parse large JSON request bodies
app.use(express.json({ limit: "20mb" }));

// Helper to read DB file
const readDbFile = () => {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading database file:", err);
  }
  return null;
};

// Helper to write DB file
const writeDbFile = (data: any) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing database file:", err);
    return false;
  }
};

// API: Get entire persistent state
app.get("/api/db", (req, res) => {
  const data = readDbFile();
  res.json({ success: true, data });
});

// API: Save entire persistent state
app.post("/api/db", (req, res) => {
  const { dbState } = req.body;
  if (!dbState) {
    return res.status(400).json({ success: false, error: "Missing dbState data" });
  }
  const result = writeDbFile(dbState);
  res.json({ success: result });
});

// API: Reset DB to fresh state (optional safety)
app.post("/api/db/reset", (req, res) => {
  try {
    if (fs.existsSync(DB_FILE)) {
      fs.unlinkSync(DB_FILE);
    }
    res.json({ success: true, message: "Database file deleted successfully." });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to reset database" });
  }
});

// Vite Middleware Integration or Static Assets
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

start();
