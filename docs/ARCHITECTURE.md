# Architecture Overview

<subsript>**Last Updated:** April 13, 2026 </subscript>
<subscript>**Version:** 1.4.1 </subscript>

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

## 6. Frontend Design System (v1.2.0 - April 13, 2026)

A comprehensive, DaisyUI-integrated design system has been implemented across all public-facing and admin pages to ensure visual consistency, accessibility, and professional UX standards.

### Key Design Elements
- **Color Palette:** Custom aqua/teal theme with semantic colors
  - Primary: `#29C7C9` (aqua)
  - Backgrounds: `#F4FAFA` (light teal-tinted white)
  - Text: `#1B2A33` (dark), `#4A6572` (secondary), `#6A808A` (muted)
  
- **Component Library:** DaisyUI 4.12.24
  - Buttons (primary, secondary, destructive, rounded-full, enhanced sizing in v1.2.0)
  - Cards with consistent borders and shadows (improved in v1.2.0)
  - Hero sections with gradient backgrounds
  - Stats cards with enhanced visibility (v1.2.0: border-2, text-4xl values)
  - Form inputs, tabs, modals, badges
  - Responsive grid layouts

- **Typography:** Semantic heading hierarchy with consistent spacing and line heights
- **Responsive Design:** Mobile-first approach with Tailwind breakpoints (sm, md, lg, xl)
- **Accessibility:** WCAG AA compliance, focus states, semantic HTML

### Latest Changes (v1.2.0)
- **Button Enhancements:** Dashboard hero buttons enlarged to `btn-lg`, added padding and shadows
- **Stats Card Redesign:** White backgrounds, border-2 styling, text-4xl values, enhanced spacing
- **Header Navigation:** Added role-gated Moderation and Admin links
- **Quality Improvements:** Better visibility, contrast, and visual hierarchy across components

### Pages Implementing v1.2.0 Design System
- Dashboard (button + stats enhancements)
- Profiles, Content Review/Moderation (refinements)
- Homepage, About, Profile, Contact, Courses, Notes, Books, Research Papers, Privacy, Terms

**For complete design documentation**, see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).

## 7. Current Product Direction
- Resource-first MVP: notes, books, and research paper management is the primary focus.
- Course management remains available but is currently lower priority due to budget and infrastructure limits.
- Monetization/selling features are planned for future phases after stability and scale milestones.

---
For more details, see the main project `README.md` and individual documentation files.
