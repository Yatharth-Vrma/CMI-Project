import app from './app';
import { config } from './config';
import https from 'https';
import http from 'http';

app.listen(config.port, () => {
  console.log(`Backend listening on http://localhost:${config.port}`);
  
  // Self-pinging mechanism to keep the service awake on Render
  const SELF_URL = process.env.SELF_PING_URL || `https://health-insight-backend-ymc7.onrender.com/api/health`;
  
  if (SELF_URL) {
    console.log(`Self-pinging ${SELF_URL} every 10 minutes...`);
    setInterval(() => {
      const client = SELF_URL.startsWith('https') ? https : http;
      client.get(SELF_URL, (res) => {
        console.log(`Self-ping status: ${res.statusCode}`);
      }).on('error', (err) => {
        console.error(`Self-ping failed: ${err.message}`);
      });
    }, 10 * 60 * 1000); // 10 minutes
  }
});