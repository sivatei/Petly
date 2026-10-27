# Petly — pet shop, marketplace & vet directory
Stack: React+Vite+Tailwind, Express, Supabase (Postgres, Auth, Storage, Realtime).

## Setup
1. Create a Supabase project. Run `supabase/migrations/001_schema.sql` in the SQL editor.
2. Create storage buckets `product-images` (public) and `evidence` (private).
3. Copy `.env.example` values into `backend/.env` and `frontend/.env`.
4. `cd backend && npm i && npm run dev` (port 4000)
5. `cd frontend && npm i && npm run dev` (port 5173, proxies /api)
6. Make an admin: in SQL, `insert into user_roles(user_id,role) values ('<uid>','admin');` (only possible via SQL/service key; RLS blocks self-grants).

## Status
Done: schema + RLS, auth, products CRUD/search API, clinics API, reports API, admin report moderation, UI (home, shop, vet centre, login).
Not yet built: chat UI, reviews UI, wishlist UI, sell form, admin dashboard UI, map. Tables/policies for them already exist.
No demo data is seeded into real tables; see `supabase/seed_demo.sql` pattern before adding any.

## Test checklist
Register/login; create listing as seller; filter/sort shop; guest cannot POST /api/products (401); non-admin cannot PATCH /api/admin/reports (403); user cannot insert own admin role.
