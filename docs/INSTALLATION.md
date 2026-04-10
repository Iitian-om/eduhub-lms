# Installation & Setup

Follow these steps to set up EduHub LMS locally.

## Prerequisites
- Node.js (v18+ recommended)
- pnpm (recommended via Corepack)
- MongoDB Atlas account
- Cloudinary account

Enable pnpm once:
```sh
corepack enable
corepack prepare pnpm@latest --activate
```

## Backend Setup
1. From the project root, install all workspace dependencies:
   ```sh
   pnpm install
   ```

2. Create a `server/.env` file with:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `PORT=5000`
3. Start the server:
   ```sh
   pnpm --filter ./server start
   ```

## Frontend Setup
1. Create a `client/.env.local` file with:
   - `NEXT_PUBLIC_API_URL=http://localhost:5000`
2. Start the frontend:
   ```sh
   pnpm --filter ./client dev
   ```

## Restart checklist
1. Reinstall dependencies from root with `pnpm install`.
2. Recreate `.env` and `.env.local` variables above.
3. Start backend first (`server`), then frontend (`client`).
4. Verify baseline routes after login: `/dashboard`, `/profile`, `/courses`, `/profiles`.


## Access
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

---
For deployment, see the main project `README.md`.
