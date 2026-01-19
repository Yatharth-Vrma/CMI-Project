import { GoogleGenerativeAI } from '@google/generative-ai';
import { loadVaccinesData } from '../utils/dataLoader';

export async function generateInsight(params: any) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return { error: 'GEMINI_API_KEY not configured' };

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const data = await loadVaccinesData();
  const filtered = data.filter((r) => {
    if (params.region && r.region !== params.region) return false;
    if (params.brand && r.brand !== params.brand) return false;
    if (params.year && String(r.year) !== String(params.year)) return false;
    return true;
  });

  const totalMarket = filtered.reduce((a, r) => a + Number(r.marketSize || 0), 0);
  const avgPrice = filtered.length ? filtered.reduce((a, r) => a + Number(r.price || 0), 0) / filtered.length : 0;

  try {
    const promptText = `Analyze these vaccine market stats: Total Market Size: ${totalMarket}, Average Price: ${avgPrice}. Context: ${JSON.stringify(params)}. Provide 2 high-level, concise executive business insights. Avoid jargon.`;
    
    const result = await model.generateContent(promptText);
    const response = await result.response;
    const text = response.text();
    
    return { text: text.trim(), totalMarket, avgPrice };
  } catch (e: any) {
    console.error(e);
    return { error: 'Gemini AI failed', details: e.message };
  }
}
