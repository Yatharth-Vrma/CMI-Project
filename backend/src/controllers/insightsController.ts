import { Configuration, OpenAIApi } from 'openai';
import { loadVaccinesData } from '../utils/dataLoader';

export async function generateInsight(params: any) {
  const cfg = new Configuration({ apiKey: process.env.OPENAI_API_KEY || '' });
  const openai = new OpenAIApi(cfg);

  const data = await loadVaccinesData();
  const filtered = data.filter((r) => {
    if (params.region && r.region !== params.region) return false;
    if (params.brand && r.brand !== params.brand) return false;
    if (params.year && String(r.year) !== String(params.year)) return false;
    return true;
  });

  const totalMarket = filtered.reduce((a, r) => a + Number(r.marketSize || 0), 0);
  const avgPrice = filtered.length ? filtered.reduce((a, r) => a + Number(r.price || 0), 0) / filtered.length : 0;

  if (!process.env.OPENAI_API_KEY) return { error: 'OPENAI_API_KEY not configured' };

  try {
    const promptText = `Analyze these vaccine market stats: Total Market Size: ${totalMarket}, Average Price: ${avgPrice}. Provide 2 concise business insights.`;
    const res = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: promptText }],
      max_tokens: 150,
      temperature: 0.7,
    });
    return { text: res.data?.choices?.[0]?.message?.content?.trim(), totalMarket, avgPrice };
  } catch (e: any) {
    return { error: 'OpenAI failed', details: e.message };
  }
}
