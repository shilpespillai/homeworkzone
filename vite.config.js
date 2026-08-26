import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Dev-only plugin: intercepts /api/generate-content and proxies it to Gemini / Claude
// so the app works with `vite dev` without needing `vercel dev`.
function devApiPlugin(env) {
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
            const parsed = JSON.parse(body || '{}');
            const { prompt, systemInstruction, responseMimeType, provider = 'gemini', clientKey } = parsed;
            const geminiKey = clientKey || env.VITE_GEMINI_API_KEY || env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
            
            if (!geminiKey) {
              console.warn('[Dev API] No Gemini API key found in .env or request.');
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'No API key configured for local dev. Add GEMINI_API_KEY to .env or settings.' }));
              return;
            }

            const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-flash-latest', 'gemini-1.5-pro'];
            let lastErrorMsg = '';
            for (const model of modelsToTry) {
              try {
                const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
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
                if (aiRes.ok) {
                  const data = await aiRes.json();
                  text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
                  if (text) break;
                } else {
                  const errJson = await aiRes.json().catch(() => ({}));
                  lastErrorMsg = errJson.error?.message || `HTTP ${aiRes.status}`;
                  console.warn(`[Dev API] Model ${model} returned error:`, lastErrorMsg);
                }
              } catch (e) {
                lastErrorMsg = e.message;
                console.warn(`[Dev API] Model ${model} failed:`, e.message);
              }
            }

            if (!text) {
              res.writeHead(502, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: `Gemini API error: ${lastErrorMsg || 'API key invalid or rate limit reached.'}` }));
              return;
            }

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
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), devApiPlugin(env)],
    css: {
      postcss: './postcss.config.js',
    }
  };
});

