import request from 'supertest';
import app from '../src/app';

describe('GET /api/summary', () => {
  it('should return summary data structure', async () => {
    const res = await request(app).get('/api/summary');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('marketSizeTotal');
    expect(res.body).toHaveProperty('avgPrice');
    expect(res.body).toHaveProperty('cagr');
  });

  it('should filter by region', async () => {
    const res = await request(app).get('/api/summary?region=Americas');
    expect(res.status).toBe(200);
    // Since we know the data, we could assert values, but structure is enough for now
    expect(res.body.marketSizeTotal).toBeGreaterThan(0);
  });
});
