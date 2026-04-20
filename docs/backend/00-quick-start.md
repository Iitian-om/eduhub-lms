# Quick Start (Backend)

This guide helps you run the current backend code quickly.

## 1) Requirements

- Node.js 18+
- pnpm
- MongoDB (Atlas or local)
- Cloudinary account (needed for file uploads)

## 2) Install dependencies

From project root:

```bash
pnpm install
```

Then:

```bash
cd server
pnpm install
```

## 3) Setup environment

Create [server/.env](../../server/.env) (you can copy from [server/.env.example](../../server/.env.example) if available).

Minimum required values:

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

OPENROUTER_API_KEY=...   # optional, used by support AI
```

NOTE: if Cloudinary variables are missing, profile/content uploads will fail.

## 4) Run the backend

```bash
cd server
pnpm dev
```

You should see MongoDB connection logs and server startup logs.

## 5) Available scripts (current)

From [server/package.json](../../server/package.json):

- `pnpm dev` -> nodemon server
- `pnpm start` -> node server
- `pnpm seed` -> run sample course seeder

## 6) Main API prefixes

- /api/v1/auth
- /api/v1/users
- /api/v1/courses
- /api/v1/books
- /api/v1/notes
- /api/v1/research-papers
- /api/v1/payment
- /api/v1/admin
- /api/v1/mod
- /api/v1/support

## 7) Auth cookie behavior

This backend uses cookie-based JWT auth.

WATCH OUT:

- Frontend must send credentials on API calls.
- fetch: `credentials: "include"`
- axios: `withCredentials: true`

## 8) First smoke test

Request:

- GET http://localhost:5000/

Expected response body: plain text welcome message from `otherController.getRoot`.
