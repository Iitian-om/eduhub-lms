# Architecture Overview

<subscript>Last updated: 2026-04-12 </subscript>


EduHub LMS is a full-stack web application built with a modular, scalable architecture. It consists of two main components:

## 1. Frontend (client/)
- **Framework:** Next.js 15.3.4 (React)
- **Routing:** App Router (file-based routing)
- **Styling:** Tailwind CSS, PostCSS
- **State Management:** React Context API
- **Features:**
  - Authentication (JWT, role-based)
  - Digital resource discovery and sharing (`/resources`, `/notes`, `/books`, `/research-papers`)
  - Course browsing and enrollment (lightweight scope)
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

## 6. Current Product Direction
- Resource-first MVP: notes, books, and research paper management is the primary focus.
- Course management remains available but is currently lower priority due to budget and infrastructure limits.
- Monetization/selling features are planned for future phases after stability and scale milestones.

---
For more details, see the main project `README.md` and individual documentation files.
