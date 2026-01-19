import express from 'express';
import cors from 'cors';
import vaccineRouter from './routes/vaccines';
import summaryRouter from './routes/summary';
import insightsRouter from './routes/insights';
import dotenv from 'dotenv';
import { loadVaccinesData } from './utils/dataLoader';
import { errorHandler } from './utils/errorHandler';

dotenv.config();

const app = express();

app.use(cors({
  origin: '*', // Allow all origins for this assignment (or specific Vercel URL in production)
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Load data immediately
loadVaccinesData().then((data) => {
  console.log(`Loaded ${data.length} vaccine records`);
}).catch((e) => {
  console.error('Data load error', e);
});

app.use('/api/vaccines', vaccineRouter);
app.use('/api/summary', summaryRouter);
app.use('/api/insights', insightsRouter);

app.get('/', (_req, res) => res.send('Health Insight Dashboard Backend'));

app.use(errorHandler);

export default app;
