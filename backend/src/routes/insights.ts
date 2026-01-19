import { Router } from 'express';
import { generateInsight } from '../controllers/insightsController';

const router = Router();

router.get('/', async (req, res) => {
  const { region, brand, year, prompt } = req.query;
  const insight = await generateInsight({ region: region as string, brand: brand as string, year: year as string, prompt: prompt as string });
  res.json(insight);
});

export default router;
