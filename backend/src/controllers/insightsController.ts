import { GoogleGenerativeAI } from '@google/generative-ai';
import { loadVaccinesData } from '../utils/dataLoader';
import { config } from '../config';
import { ApiError } from '../utils/errorHandler';

export async function generateInsight(params: any) {
  if (!config.geminiApiKey) {
    throw new ApiError(500, 'Gemini API Key not configured');
  }

  const genAI = new GoogleGenerativeAI(config.geminiApiKey);
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-2.0-flash',
    generationConfig: {
      maxOutputTokens: 300,
      temperature: 0.7,
    }
  });

  const data = await loadVaccinesData();
  
  // Safe filtering
  const filtered = data.filter((r) => {
    if (params.region && r.region !== params.region) return false;
    if (params.brand && r.brand !== params.brand) return false;
    if (params.year && String(r.year) !== String(params.year)) return false;
    return true;
  });

  const totalMarket = filtered.reduce((a, r) => a + Number(r.marketSize || 0), 0);
  const avgPrice = filtered.length ? filtered.reduce((a, r) => a + Number(r.price || 0), 0) / filtered.length : 0;

  try {
    const promptText = `
      Context: Global Vaccine Market Analysis.
      Filters Applied: ${JSON.stringify(params)}.
      Data Summary: 
      - Total Market Size: $${totalMarket.toLocaleString()}
      - Average Unit Price: $${avgPrice.toFixed(2)}
      
      Task: Provide an executive summary of these metrics.
      Format: 
      - 2 concise paragraphs.
      - Professional tone (Bloomberg/McKinsey style).
      - Focus on growth implications and pricing strategy.
    `;
    
    const result = await model.generateContent(promptText);
    const response = await result.response;
    const text = response.text();
    
    return { text: text.trim(), totalMarket, avgPrice };
  } catch (e: any) {
    console.error("Gemini Error:", e);
    throw new ApiError(502, 'Failed to generate insights from AI provider');
  }
}