import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs/promises";
import path from "path";
import { INITIAL_PRIZES, ADMIN_PASSWORD } from "./src/constants.js";

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), "data.json");

app.use(express.json());

// Helper to get default data
const getDefaultData = () => ({
  prizes: INITIAL_PRIZES,
  history: [],
  showHistory: true,
  siteName: "Lucky Draw",
  siteIcon: "L",
  mainTitle: "今日好运，一触即发",
  subTitle: "点击中心按钮，开启你的专属惊喜",
  adminPassword: ADMIN_PASSWORD,
});

// API routes
app.get("/api/data", async (req, res) => {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    res.json(JSON.parse(data));
  } catch (error: any) {
    if (error.code === "ENOENT") {
      const defaultData = getDefaultData();
      await fs.writeFile(DATA_FILE, JSON.stringify(defaultData, null, 2));
      res.json(defaultData);
    } else {
      res.status(500).json({ error: "Failed to read data" });
    }
  }
});

app.post("/api/data", async (req, res) => {
  try {
    let currentData = {};
    try {
      const currentDataStr = await fs.readFile(DATA_FILE, "utf-8");
      currentData = JSON.parse(currentDataStr);
    } catch (e) {
      currentData = getDefaultData();
    }
    
    const newData = { ...currentData, ...req.body };
    await fs.writeFile(DATA_FILE, JSON.stringify(newData, null, 2));
    res.json({ success: true, data: newData });
  } catch (error) {
    res.status(500).json({ error: "Failed to save data" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
