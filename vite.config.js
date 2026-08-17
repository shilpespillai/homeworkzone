import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Dev-only plugin: intercepts /api/generate-content and proxies it to Gemini
// so the app works with `vite dev` without needing `vercel dev`.
function devApiPlugin() {
  return {
    name: 'dev-api-handler',
    configureServer(server) {
      server.middlewares.use('/api/generate-content', async (req, res) => {
        if (req.method === 'OPTIONS') {
          res.writeHead(200); res.end(); return;
        }
        if (req.method !== 'POST') {
          res.writeHead(405); res.end('Method not allowed'); return;
        }
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const { prompt, systemInstruction, responseMimeType } = JSON.parse(body);
            const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
            if (!apiKey) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'VITE_GEMINI_API_KEY not set in .env.local' }));
              return;
            }
            const model = 'gemini-2.0-flash';
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
            const bodyObj = {
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: {
                temperature: 0.7,
                responseMimeType: responseMimeType === 'application/json' ? 'application/json' : 'text/plain'
              }
            };
            if (systemInstruction) {
              bodyObj.systemInstruction = { parts: [{ text: systemInstruction }] };
            }
            const aiRes = await fetch(endpoint, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(bodyObj)
            });
            const data = await aiRes.json();
            let text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (responseMimeType === 'application/json') {
              const first = text.indexOf('{'), last = text.lastIndexOf('}');
              if (first !== -1 && last !== -1) text = text.substring(first, last + 1);
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ text }));
          } catch (err) {
            console.error('[Dev API] generate-content error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), devApiPlugin()],
  css: {
    postcss: './postcss.config.js',
  }
})

