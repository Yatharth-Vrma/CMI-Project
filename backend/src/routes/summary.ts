import { Router } from 'express';
import { summaryForFilters } from '../controllers/summaryController';

const router = Router();

router.get('/', async (req, res) => {
  const { region, brand, year } = req.query;
  const summary = await summaryForFilters({ region: region as string, brand: brand as string, year: year as string });
  res.json(summary);
});

export default router;
