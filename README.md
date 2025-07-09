# EduHub LMS

![EduHub Logo](./client/public/eduhub-logo.png)

A modern, scalable and feature-rich Learning Management System (LMS) designed to unify digital education experiences for students, instructors, and administrators. EduHub streamlines course delivery, management, and analytics with a beautiful UI and powerful backend.

---

## 🚀 Project Vision

EduHub aims to be the go-to platform for digital learning, supporting interactive courses, smart content delivery, AI-powered recommendations, and secure payments—built for scalability and extensibility.

---

## 🗂️ Project Structure

```

eduhub-lms/
├── client/                 # Frontend (Next.js App Router)
│   ├── app/                # App directory (Next.js routing, pages, layouts)
│   │   ├── components/     # Reusable React components (Header, Footer, etc.)
│   │   ├── context/        # React context (UserContext for auth state)
│   │   ├── about/          # About page
│   │   ├── dashboard/      # Dashboard page (protected)
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
│   └── .env                # Backend environment variables (not committed)
├── eduhub-logo.png         # Logo used in README/UI
├── README.md
├── .gitignore
└── package-lock.json

```

---

## 🌟 Core Features

- **Authentication**: JWT-based login/signup, role-based access (student, instructor, admin)
- **User Management**: Profile pages, dashboards, admin user control
- **Course Management**: CRUD for courses, enrollment, instructor & student dashboards
- **Content Delivery**: Video embedding (YouTube, edX, Coursera, etc.), module/playlist support
- **Assignment & Quizzes**: Instructor-created quizzes, student submissions, auto-grading (MVP)
- **Smart Dashboards**: Progress tracking, personalized recommendations (AI-powered, planned)
- **Gamification**: Badges, XP, leaderboards (planned)
- **Payment Integration**: Stripe/Razorpay for premium courses (planned)
- **Analytics**: Platform usage, engagement heatmaps (planned)
- **Admin Panel**: User & course moderation, reports (planned)

---

## 🏗️ Development Roadmap

_Phases:_

1. **Core MVP**: Auth, course CRUD, dashboard UI, REST APIs
2. **Smart Learning**: Video content, assignments/quizzes, progress tracking
3. **AI Personalization**: Recommendations, learning paths
4. **Monetization & Security**: Payments, content protection, advanced auth (OAuth/2FA)
5. **Analytics & Admin**: Admin panel, metrics dashboards
6. **Deployment & Scaling**: CI/CD, Vercel/Netlify (frontend), Render/Heroku/Railway (backend), MongoDB Atlas
7. **Community & Open Source**: Docs, issue templates, contribution guides

See [Project Phases](#project-phases) below for details.

---

## 🛠️ Getting Started

Open [http://localhost:3000](http://localhost:3000) in your browser.
Open [main Website](https://eduhub-lms-rose.vercel.app/) This is the main website.
Open [Server](https://eduhub-crit.onrender.com) This is the main website.

---

## 🌐 Deployment

- **Frontend**: [Vercel](https://vercel.com/) [Frontend](https://eduhub-lms-rose.vercel.app/)
- **Backend**: [Render](https://render.com/) [Server](https://eduhub-crit.onrender.com/) 
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Cloud**: [Cloudinary](https://cloudinary.com/) for images uploading and storing.

---

## 🎨 Design

- **Primary Color**: Aqua Blue `#2AC9C7`
- **UI Kit**: Tailwind CSS, fully responsive and accessible
- **Logo**: See `eduhub-logo.png` in root

---

## 📄 License

This project is [MIT Licensed](LICENSE).

---

## 📞 Contact

- **Om Kumar** (maintainer): omkumar@iitp.ac.in

---

## 📅 Project Phases

See the attached [project plan](#) for a detailed breakdown, or refer to the summary below:

```
🔰 Phase 1: Core Foundation (MVP)
🎯 Phase 2: Smart Learning Features
🧠 Phase 3: Intelligent Personalization
💳 Phase 4: Monetization & Security
📊 Phase 5: Admin & Analytics
☁️ Phase 6: Deployment & Scalability
📦 Bonus: Community & Open Source
```

---

## 🤝 Acknowledgements

Thanks to the open-source community and all contributors!  
Inspired by leading LMS platforms—built with ❤️ for the EduHub community.

---

> _Let us know if you need sample .env files, scripts, or deployment guides!_
