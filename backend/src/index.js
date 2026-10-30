import express from 'express'; import cors from 'cors'; import rateLimit from 'express-rate-limit';
import { admin } from './supabase.js';
import products from './routes/products.js'; import clinics from './routes/clinics.js'; import reports from './routes/reports.js'; import adminRoutes from './routes/admin.js';
const app = express();
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.options('*', cors());
app.use(express.json({ limit: '100kb' }));
app.use(rateLimit({ windowMs: 60_000, max: 200 }));
app.get('/', (_, res) => res.json({ ok: true, message: 'Petly API is running' }));
app.get('/api', (_, res) => res.json({ ok: true, message: 'Petly API is running' }));
app.use('/api/products', products); app.use('/api/clinics', clinics);
app.use('/api/reports', reports); app.use('/api/admin', adminRoutes);
app.get('/api/categories', async (_req, res) => {
  const { data, error } = await admin.from('categories').select('id, name, pet_type').order('id');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});
app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ error: 'Server error' }); });
app.listen(process.env.PORT || 4000, () => console.log('Petly API running'));

