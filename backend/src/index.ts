import express from 'express';
import cors from 'cors';
import vaccineRouter from './routes/vaccines';
import summaryRouter from './routes/summary';
import insightsRouter from './routes/insights';
import dotenv from 'dotenv';
import { loadVaccinesData } from './utils/dataLoader';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

loadVaccinesData().then((data) => {
  console.log(`Loaded ${data.length} vaccine records`);
}).catch((e) => {
  console.error('Data load error', e);
});

app.use('/api/vaccines', vaccineRouter);
app.use('/api/summary', summaryRouter);
app.use('/api/insights', insightsRouter);

app.get('/', (_req, res) => res.send('Health Insight Dashboard Backend'));

app.listen(PORT, () => console.log(`Backend listening on http://localhost:${PORT}`));
export default app;
