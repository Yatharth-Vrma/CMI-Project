import express, { Request, Response } from 'express';
import { filterVaccines } from '../controllers/vaccinesController';
import { loadVaccinesData } from '../utils/dataLoader';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const filters = {
      region: req.query.region as string,
      brand: req.query.brand as string,
      year: req.query.year as string,
    };
    const data = await filterVaccines(filters);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch vaccines' });
  }
});

router.get('/filters', async (_req: Request, res: Response) => {
  try {
    const data = await loadVaccinesData();
    const regions = Array.from(new Set(data.map(d => d.region))).sort();
    const brands = Array.from(new Set(data.map(d => d.brand))).sort();
    const years = Array.from(new Set(data.map(d => d.year))).sort((a, b) => a - b);
    res.json({ regions, brands, years });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch filters' });
  }
});

export default router;