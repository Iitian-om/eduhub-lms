
![EduHub Logo](./client/public/eduhub-logo.png)

A modern, scalable Learning Management System (LMS) evolving from a capstone project into an MVP, with a primary focus on digital resource management and sharing for students, educators, and institutions.

Last updated: 2026-04-12

---

## 🚀 Project Vision

EduHub aims to become a reliable academic resource hub where teams can curate, validate, and share notes, books, and research papers. Lightweight course capabilities are available, while monetization and marketplace features are planned for future phases.

---

## 🛠️ Getting Started

- _Log on to the [Website](https://eduhub-lms-rose.vercel.app/)._
---

## 🎨 Design

- **Primary Color**: Aqua Blue `#2AC9C7`
- **Logo**: See `eduhub-logo.png` in root
- **UI Kit**: Tailwind CSS, fully responsive and accessible

---

## 🌐 Deployment
- Frontend Deployed on [Vercel](https://vercel.com/): root/client is the frontend version and is live on _[Frontend](https://eduhub-lms-rose.vercel.app/)_ 
- Backend Deployed on [Render](https://render.com/):  root/server is the backend app/version/server and is live on _[Backend Server](https://eduhub-crit.onrender.com/)_ 
---
## DataBases used: 
- [Cloudinary](https://cloudinary.com/) storage is used for images uploading and storing (as a Cloud DB).
- [MongoDB Atlas](https://www.mongodb.com/atlas) this is the main Database (NoSQL) and is storing data in .json(Users, Courses, etc., DB Models)

---

## 🌟 Core Features:
- **Authentication**: JWT-based login/signup, role-based access (student, instructor, mod, admin)
- **User Management**: Profile pages, dashboards, admin user control
- **Digital Resource Hub**: Centralized access and sharing for notes, books, and research papers via the new `resources` route
- **Course Management (Lightweight)**: Basic course creation, enrollment, and dashboard flow (currently lower priority)
- **Content Delivery**: Video embedding (YouTube, edX, Coursera, etc.)
- **AI Support Assistant**: EduHub-aware support chatbot with FAQ-first responses and Gemma via OpenRouter fallback
- **Role-based Moderation**: Dedicated moderation workspace for `Admin` and `Mod`, with delete actions restricted to `Admin`
- **Smart Dashboards**: Progress tracking, personalized recommendations (AI-powered, planned)
- **Gamification**: Badges, XP, leaderboards (planned)
- **Payment Integration**: Razorpay for paid courses (planned)

---

## 🏗️ Development Roadmap

1. **Resource-First MVP**: Auth, role-based access, notes/books/papers workflows, resource discovery pages
2. **Reliability & Governance**: Moderation, access quality, and safer file delivery
3. **Learning Expansion**: Incremental improvements to course modules and learning journeys
4. **AI & Analytics**: Better support intelligence and actionable platform insights
5. **Monetization (Future)**: Selling and marketplace flows once infrastructure and scale are ready

<!-- ## 📅 Project Phases
See the attached [project plan](#) for a detailed breakdown, or refer to the summary below:
```
🔰 Phase 1: Core Foundation (MVP)
🎯 Phase 2: Smart Learning Features
🧠 Phase 3: Intelligent Personalization
💳 Phase 4: Monetization & Security
📊 Phase 5: Admin & Analytics
☁️ Phase 6: Deployment & Scalability
``` -->
 
---
## 🗂️ Project Structure
```
eduhub-lms/
├── client/                 # Frontend (Next.js App Router)
│   ├── app/                # App directory (Next.js routing, pages, layouts)
│   │   ├── components/     # Reusable React components (Header, Footer, etc.)
│   │   ├── context/        # React context (UserContext for auth state)
│   │   ├── about/          # About page
│   │   ├── resources/      # Unified resource discovery page
│   │   ├── dashboard/      # Dashboard page (protected)
│   │   ├── support/        # AI support assistant page (protected)
│   │   ├── moderation/     # Moderation workspace (Admin/Mod)
│   │   ├── profile/        # User profile page (protected)
│   │   ├── register/       # Registration page
│   │   ├── login/          # Login page
│   │   └── ...             # Other app pages/routes
│   ├── public/             # Static assets (images, favicon, etc.)
│   ├── package.json        # Frontend dependencies and scripts
│   ├── postcss.config.mjs  # PostCSS config for Tailwind CSS
│   ├── next.config.mjs     # Next.js config
│   ├── tailwind.config.js  # Tailwind CSS config (if present)
│   └── .env.local          # Frontend environment variables
├── server/                 # Backend (Node.js + Express)
│   ├── controllers/        # Route controllers (auth, user, course, etc.)
│   ├── routes/             # Express route definitions
│   ├── models/             # Mongoose models (User, Course, etc.)
│   ├── middlewares/        # Custom Express middleware (auth, error, etc.)
│   ├── utils/              # Utility functions (DB connection, JWT, etc.)
│   ├── server.js           # Main Express server entry point
│   ├── package.json        # Backend dependencies and scripts
│   ├── .env                # Backend environment variables (not committed)
│   └── .env.example        # Backend environment template
├── eduhub-logo.png         # Logo used in README/UI
├── README.md
├── .gitignore
├── pnpm-lock.yaml
└── pnpm-workspace.yaml
```
---

## 📄 License

_Well you need to ask the iitp adminisration for the License because It is Built for the capstone project-I of my college 2nd semester under the guidance my course instructor with my college team._
_FunFact: I am the only one who made this despite my team had 5 members._ 

---

## 📞 Contact

- **Om Kumar** (maintainer): omkumar@iitp.ac.in
---

## 🤝 Acknowledgements: 
LMS platform—built with ❤️ for the E-learners community. Thanks to all our Users!

Third-party technologies and providers used in this project:
- Google Gemma models (`gemma-2-9b-it`, `gemma-3-27b-it`) via OpenRouter
- OpenRouter API gateway for LLM routing
- Next.js and React for the frontend
- Express.js and Mongoose for backend APIs and data modeling
- MongoDB Atlas for primary database hosting
- Cloudinary for media and file storage
- Tailwind CSS and DaisyUI for UI styling
- Recharts for analytics visualizations
- Vercel and Render for deployment

---

> _Use us to enhance your e-learning._
