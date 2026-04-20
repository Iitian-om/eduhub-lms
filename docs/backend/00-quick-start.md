# Quick Start (Backend)

This page helps you run the backend locally for the first time.

## 1) Requirements

- Node.js 18+ (recommended: latest LTS)
- pnpm
- MongoDB Atlas (or local MongoDB)
- Cloudinary account

## 2) Install dependencies

From project root:

```bash
pnpm install
```

From backend folder:

```bash
cd server
pnpm install
```

## 3) Create environment variables

Use:
- [server/.env.example](../../server/.env.example)

Create:
- [server/.env](../../server/.env)

Minimum variables you need:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
NODE_ENV=development

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

NOTE: If Cloudinary variables are missing, uploads will fail.

## 4) Start backend

```bash
cd server
pnpm dev
```

You should see DB connection + server start log in terminal.

## 5) Base API paths

Common base routes:

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

## 6) First API smoke test

Open browser/Postman:
- GET http://localhost:5000/

Expected: welcome JSON message.

## 7) Auth and cookies (important)

This backend stores JWT in cookies.

WATCH OUT:
- Frontend requests must include credentials.
- If using fetch, use `credentials: "include"`.
- If using axios, use `withCredentials: true`.

## 8) Common startup errors

- DB connection failed:
  - check MONGO_URI
  - check DB network access/IP whitelist
- 401 Not logged in:
  - no auth cookie sent
- Cloudinary upload error:
  - check Cloudinary env keys

## 9) Helpful scripts

In [server/package.json](../../server/package.json):

- `pnpm dev` -> start with nodemon
- `pnpm start` -> production-style start
- `pnpm seed` -> seed initial courses
