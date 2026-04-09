# Installation & Setup

Follow these steps to set up EduHub LMS locally.

## Prerequisites
- Node.js (v18+ recommended)
- npm or yarn
- MongoDB Atlas account
- Cloudinary account

## Backend Setup
1. Navigate to `server/`
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file with:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `PORT=5000`
4. Start the server:
   ```sh
   npm start
   ```

## Frontend Setup
1. Navigate to `client/`
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env.local` file with:
   - `NEXT_PUBLIC_API_URL=http://localhost:5000`
4. Start the frontend:
   ```sh
   npm run dev
   ```

## Restart checklist
1. Reinstall dependencies in both `server/` and `client/`.
2. Recreate `.env` and `.env.local` variables above.
3. Start backend first (`server`), then frontend (`client`).
4. Verify baseline routes after login: `/dashboard`, `/profile`, `/courses`, `/profiles`.

## Access
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

---
For deployment, see the main project `README.md`.
