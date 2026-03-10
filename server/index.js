import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import documentsRouter from './routes/documents.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true }));
app.use(express.json({ limit: '1mb' }));

app.use('/api', documentsRouter);

app.listen(PORT, () => {
  console.log(`Doc Creator API running at http://localhost:${PORT}`);
});
