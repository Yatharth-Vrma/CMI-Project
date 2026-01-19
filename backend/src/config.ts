import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  geminiApiKey: process.env.GEMINI_API_KEY,
};

if (!config.geminiApiKey) {
  console.warn('⚠️ GEMINI_API_KEY is not defined in .env file. AI features will fail.');
}
