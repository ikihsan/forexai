# ForexAI

Monorepo with:
- backend (NestJS + GraphQL + Prisma + PostgreSQL)
- frontend (Next.js 14 + Apollo Client + Tailwind)

## Environment

Create `frontend/.env.local` with:
- NEXT_PUBLIC_API_URL=http://localhost:4000/graphql
- NEXTAUTH_URL=http://localhost:3000
- NEXTAUTH_SECRET=change-me
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx

Create `backend/.env` with DB + JWT values (see `backend/.env.example`).

## Development
```bash
# backend
cd backend
npm install
npm run start:dev

# frontend
cd ../frontend
npm install
npm run dev
```

## Deploy (Vercel)
- Set Project Root to `frontend`
- Set Build Command to `npm run build`
- Set Output to `.next`
- Add the four frontend env vars above in Vercel Project Settings.

If you deploy the whole repo, configure monorepo settings to use the `frontend` folder.
