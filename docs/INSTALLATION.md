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
3. Create a `.env` file (see `.env.example` if available)
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
3. Create a `.env.local` file (see `.env.local.example` if available)
4. Start the frontend:
   ```sh
   npm run dev
   ```

## Access
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

---
For deployment, see the main project `README.md`.
