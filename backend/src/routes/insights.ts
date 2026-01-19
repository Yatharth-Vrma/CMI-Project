import express, { Request, Response, NextFunction } from 'express';
import { generateInsight } from '../controllers/insightsController';

const router = express.Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const filters = {
      region: req.query.region as string,
      brand: req.query.brand as string,
      year: req.query.year as string,
    };
    const result = await generateInsight(filters);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

export default router;
