# Petly — Pet Products Marketplace and Vet Directory

Petly is a web application concept for pet owners to discover pet products and find veterinary clinics. It is being developed as a full-stack project using React, Express, and Supabase.

## Features
Based on the current repository implementation:
- Browse and search pet product listings
- Product categories and product detail pages
- Seller listing routes and account-related pages
- Veterinary clinic directory and clinic detail pages
- User authentication integration
- Reporting endpoints and admin moderation routes
- Supabase database schema and row-level security policies

Some frontend areas, including messaging, wishlist, reviews, and the seller flow, may still be in progress. Check the application before treating every route as production-ready.

## Tech stack
- **Frontend:** React 18, Vite, React Router
- **Backend:** Node.js, Express
- **Database and services:** Supabase (PostgreSQL, Auth, Storage)
- **Middleware:** Express rate limiting

## Structure
```text
.
├── frontend/       # React application
├── backend/        # Express API
└── supabase/       # SQL schema, migrations, and demo seed data
```

## Local setup
Requirements: Node.js 18+, npm, and a Supabase project.

1. Create a Supabase project.
2. Apply the SQL migration files in `supabase/` in the documented order.
3. Configure local environment variables for frontend and backend. Never commit real credentials.
4. Start the backend: `cd backend && npm install && npm run dev`.
5. In another terminal, start the frontend: `cd frontend && npm install && npm run dev`.

The backend uses port 4000 by default and Vite uses port 5173 by default.

## Security notes
- Keep Supabase service-role credentials on the server only.
- Never expose service-role keys in frontend variables.
- Review database RLS policies before deployment.
- Restrict backend CORS origins to the intended frontend domain in production.

This project is under active development. Some user-facing features are still being completed and tested.
