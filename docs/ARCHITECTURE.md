# Architecture Overview

EduHub LMS is a full-stack web application built with a modular, scalable architecture. It consists of two main components:

## 1. Frontend (client/)
- **Framework:** Next.js (React)
- **Routing:** App Router (file-based routing)
- **Styling:** Tailwind CSS, PostCSS
- **State Management:** React Context API
- **Features:**
  - Authentication (JWT, role-based)
  - Course browsing, enrollment, dashboards
  - Profile management
  - Admin panel (analytics, reports)
  - Responsive UI

## 2. Backend (server/)
- **Framework:** Node.js + Express
- **Database:** MongoDB Atlas (NoSQL)
- **ORM:** Mongoose
- **Storage:** Cloudinary (images, files)
- **Authentication:** JWT
- **Features:**
  - RESTful APIs for users, courses, notes, books, payments
  - Role-based access control
  - Admin analytics and reporting
  - File uploads
  - Utility scripts for data migration and seeding

## 3. Deployment
- **Frontend:** Vercel
- **Backend:** Render
- **Environment Variables:** Managed via `.env` for backend ( root/server/ ) and `.env.local` for frontend ( root/client/ ). 

## 4. Folder Structure
```
eduhub-lms/
├── client/      # Next.js frontend
├── server/      # Express backend
├── docs/        # Documentation
├── README.md    # Project overview
```

## 5. Data Flow
- Frontend communicates with backend via REST APIs
- Backend handles authentication, business logic, and data storage
- Images/files are stored in Cloudinary
- User sessions managed via JWT

---
For more details, see the main project `README.md` and individual documentation files.
