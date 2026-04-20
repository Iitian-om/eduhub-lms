# Routes Reference

This file documents all route files in [server/routes](../../server/routes) and how they map to controllers.

NOTE: `server.js` mounts route prefixes.

## Route mounting map (from server.js)

- /api/v1/auth -> [server/routes/authRoutes.js](../../server/routes/authRoutes.js)
- /api/v1/users -> [server/routes/userRoutes.js](../../server/routes/userRoutes.js)
- /api/v1/courses -> [server/routes/courseRoutes.js](../../server/routes/courseRoutes.js)
- /api/v1/books -> [server/routes/bookRoutes.js](../../server/routes/bookRoutes.js)
- /api/v1/notes -> [server/routes/noteRoutes.js](../../server/routes/noteRoutes.js)
- /api/v1/research-papers -> [server/routes/researchPaperRoutes.js](../../server/routes/researchPaperRoutes.js)
- /api/v1/payment -> [server/routes/paymentRoutes.js](../../server/routes/paymentRoutes.js)
- /api/v1/admin -> [server/routes/adminRoutes.js](../../server/routes/adminRoutes.js)
- /api/v1/mod -> [server/routes/modRoutes.js](../../server/routes/modRoutes.js)
- /api/v1/support -> [server/routes/supportRoutes.js](../../server/routes/supportRoutes.js)
- / -> [server/routes/otherRoutes.js](../../server/routes/otherRoutes.js)
- catch-all 404 -> [server/routes/pageNotFound.js](../../server/routes/pageNotFound.js)

---

## 1) Auth Routes
File: [server/routes/authRoutes.js](../../server/routes/authRoutes.js)
Base: /api/v1/auth

- POST /register -> authController.register
- POST /login -> authController.login
- POST /logout -> authController.logout

COMMENT:
- Registration/login create JWT cookie sessions.

---

## 2) User Routes
File: [server/routes/userRoutes.js](../../server/routes/userRoutes.js)
Base: /api/v1/users

All protected with `isAuthenticated`.

- GET /profile -> userController.getUserProfile
- PUT /profile -> userController.updateProfile
- POST /profile/upload -> userController.uploadProfilePicture
- GET /profiles -> userController.getPublicProfiles
- GET /profiles/:userName -> userController.getPublicProfileByUsername

COMMENT:
- `req.user` comes from auth middleware.

---

## 3) Course Routes
File: [server/routes/courseRoutes.js](../../server/routes/courseRoutes.js)
Base: /api/v1/courses

Public:
- GET / -> courseController.getAllCourses
- GET /:id -> courseController.getCourseById

Authenticated:
- GET /enrolled/courses -> courseController.getEnrolledCourses
- POST /enroll -> courseController.enrollInCourse
- GET /check-enrollment/:courseId -> courseController.checkEnrollment
- GET /progress/:courseId -> courseController.getCourseProgress
- POST /lesson/complete -> courseController.markLessonComplete
- POST /complete/:courseId -> courseController.markCourseComplete

Role-restricted create:
- POST / -> courseController.createCourse
  - requires isAuthenticated + authorizeRoles(Admin, Instructor, Mod)

---

## 4) Book Routes
File: [server/routes/bookRoutes.js](../../server/routes/bookRoutes.js)
Base: /api/v1/books

Public:
- GET / -> bookController.getAllBooks
- GET /:id -> bookController.getBookById
- GET /user/:userId -> bookController.getUserBooks

Protected:
- POST / -> uploadBook + handleFileUploadError + createBook
- PUT /:id -> updateBook
- DELETE /:id -> deleteBook

COMMENT:
- `uploadBook` handles PDF validation and memory buffering.

---

## 5) Note Routes
File: [server/routes/noteRoutes.js](../../server/routes/noteRoutes.js)
Base: /api/v1/notes

Public:
- GET / -> noteController.getAllNotes
- GET /:id -> noteController.getNoteById
- GET /user/:userId -> noteController.getUserNotes
- GET /course/:courseId -> noteController.getNotesByCourse

Protected:
- POST / -> uploadNote + handleFileUploadError + createNote
- PUT /:id -> updateNote
- DELETE /:id -> deleteNote

---

## 6) Research Paper Routes
File: [server/routes/researchPaperRoutes.js](../../server/routes/researchPaperRoutes.js)
Base: /api/v1/research-papers

Public:
- GET / -> researchPaperController.getAllResearchPapers
- GET /:id -> researchPaperController.getResearchPaperById
- GET /user/:userId -> researchPaperController.getUserResearchPapers
- PUT /:id/citations -> researchPaperController.incrementCitations

Protected:
- POST / -> uploadResearchPaper + handleFileUploadError + createResearchPaper
- PUT /:id -> updateResearchPaper
- DELETE /:id -> deleteResearchPaper

---

## 7) Admin Routes
File: [server/routes/adminRoutes.js](../../server/routes/adminRoutes.js)
Base: /api/v1/admin

All endpoints use:
- isAuthenticated
- authorizeRoles("Admin")

Main groups:
- users management
- instructors management
- courses management
- content management (books/notes/papers)
- stats/reports/analytics/audit logs
- notifications settings management

COMMENT:
- This is the highest-privilege API surface.

---

## 8) Moderation Routes
File: [server/routes/modRoutes.js](../../server/routes/modRoutes.js)
Base: /api/v1/mod

All endpoints use:
- isAuthenticated
- authorizeRoles("Admin", "Mod")

Main endpoints:
- GET /overview
- GET /notes
- GET /books
- GET /papers
- DELETE /notes/:id
- DELETE /books/:id
- DELETE /papers/:id

WATCH OUT:
- Delete in moderation may still be restricted in controller by role checks.

---

## 9) Support Routes
File: [server/routes/supportRoutes.js](../../server/routes/supportRoutes.js)
Base: /api/v1/support

Protected:
- POST /chatbot -> chatbotRateLimit + supportController.getSupportBotReply

COMMENT:
- Per-role rate limiting is enforced before AI response.

---

## 10) Payment Routes
File: [server/routes/paymentRoutes.js](../../server/routes/paymentRoutes.js)
Base: /api/v1/payment

Protected:
- POST /payment -> paymentController.createPayment

NOTE:
- Current implementation is placeholder/stub.

---

## 11) Other Routes (public pages)
File: [server/routes/otherRoutes.js](../../server/routes/otherRoutes.js)
Base: /

- GET /
- GET /about
- GET /contact
- GET /privacy
- GET /terms

---

## 12) 404 Route
File: [server/routes/pageNotFound.js](../../server/routes/pageNotFound.js)

- Catch-all fallback when no route matches.
- Must remain last in [server/server.js](../../server/server.js).
