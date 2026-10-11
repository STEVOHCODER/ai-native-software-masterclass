'use strict';

const express = require('express');
const helmet = require('helmet');

const app = express();
const port = Number(process.env.PORT || 3000);
const allowedOrigin = process.env.ALLOWED_ORIGIN || 'http://localhost:5173';
const records = new Map([['course-progress', { id: 'course-progress', title: 'Local Sandbox Wiring', progress: 0, __v: 0 }]]);

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '32kb', strict: true, type: 'application/json' }));
app.use((req, res, next) => {
  if (req.method !== 'GET' && req.get('origin') && req.get('origin') !== allowedOrigin) return res.status(403).json({ error: 'origin_not_allowed' });
  res.setHeader('cache-control', 'no-store');
  next();
});

const cleanText = (value, maxLength) => {
  if (typeof value !== 'string' || value.length > maxLength) return null;
  const clean = value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').replace(/[<>]/g, '');
  return clean.trim() || null;
};
const validProgress = (value) => Number.isInteger(value) && value >= 0 && value <= 100;
const requireRecord = (req, res, next) => { const record = records.get(req.params.id); if (!record) return res.status(404).json({ error: 'record_not_found' }); req.record = record; next(); };

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/progress/:id', requireRecord, (req, res) => res.json(req.record));
app.patch('/api/progress/:id', requireRecord, (req, res, next) => {
  try {
    const body = req.body;
    if (!body || !Number.isInteger(body.__v) || !validProgress(body.progress)) return res.status(400).json({ error: 'invalid_payload' });
    const title = body.title === undefined ? req.record.title : cleanText(body.title, 160);
    if (!title) return res.status(400).json({ error: 'invalid_title' });
    if (body.__v !== req.record.__v) return res.status(409).json({ error: 'version_conflict', current: req.record });
    const updated = { ...req.record, title, progress: body.progress, __v: req.record.__v + 1 };
    records.set(req.params.id, updated);
    return res.json(updated);
  } catch (error) { return next(error); }
});

app.use((error, _req, res, _next) => {
  if (error instanceof SyntaxError) return res.status(400).json({ error: 'invalid_json' });
  console.error(error);
  return res.status(500).json({ error: 'internal_server_error' });
});

if (require.main === module) app.listen(port, '127.0.0.1', () => console.log(`API listening on 127.0.0.1:${port}`));
module.exports = { app, records };

