import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_FILE = path.join(process.cwd(), 'data.json');

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Ensure data.json exists
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));
  }

  // API Routes
  app.get('/api/data', (req, res) => {
    try {
      const data = fs.readFileSync(DATA_FILE, 'utf-8');
      res.json(JSON.parse(data));
    } catch (err) {
      res.status(500).json({ error: 'Failed to read data' });
    }
  });

  app.post('/api/data', (req, res) => {
    try {
      const currentData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      const newData = { ...currentData, ...req.body };
      fs.writeFileSync(DATA_FILE, JSON.stringify(newData, null, 2));
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to save data' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
