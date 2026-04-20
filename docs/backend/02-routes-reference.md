# Routes Reference

This file documents the current route modules in [server/routes](../../server/routes).

## Mounted route prefixes (from server.js)

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
- fallback -> [server/routes/pageNotFound.js](../../server/routes/pageNotFound.js)

## Auth routes

File: [server/routes/authRoutes.js](../../server/routes/authRoutes.js)

- POST /register -> `upload.single("profilePic")` -> register
- POST /login -> login
- POST /logout -> logout

## User routes (all authenticated)

File: [server/routes/userRoutes.js](../../server/routes/userRoutes.js)

- GET /profile -> getUserProfile
- PUT /profile -> updateProfile
- POST /profile/upload -> `upload.single("profile_picture")` -> uploadProfilePicture
- GET /profiles -> getPublicProfiles
- GET /profiles/:userName -> getPublicProfileByUsername

## Course routes

File: [server/routes/courseRoutes.js](../../server/routes/courseRoutes.js)

Public:

- GET /
- GET /:id

Authenticated:

- GET /enrolled/courses
- POST /enroll
- GET /check-enrollment/:courseId
- GET /progress/:courseId
- POST /lesson/complete
- POST /complete/:courseId

Authenticated + role restricted:

- POST / (Admin, Instructor, Mod)

## Book routes

File: [server/routes/bookRoutes.js](../../server/routes/bookRoutes.js)

Public:

- GET /
- GET /:id
- GET /user/:userId

Authenticated:

- POST / -> `uploadBook` + `handleFileUploadError` + createBook
- PUT /:id
- DELETE /:id

## Note routes

File: [server/routes/noteRoutes.js](../../server/routes/noteRoutes.js)

Public:

- GET /
- GET /:id
- GET /user/:userId
- GET /course/:courseId

Authenticated:

- POST / -> `uploadNote` + `handleFileUploadError` + createNote
- PUT /:id
- DELETE /:id

## Research paper routes

File: [server/routes/researchPaperRoutes.js](../../server/routes/researchPaperRoutes.js)

Public:

- GET /
- GET /:id
- GET /user/:userId
- PUT /:id/citations

Authenticated:

- POST / -> `uploadResearchPaper` + `handleFileUploadError` + createResearchPaper
- PUT /:id
- DELETE /:id

## Admin routes (admin-only)

File: [server/routes/adminRoutes.js](../../server/routes/adminRoutes.js)

Guard: `isAuthenticated` + `authorizeRoles("Admin")` on all endpoints.

Groups:

- User and instructor management
- Course management
- Content management
- Stats, analytics, reports, audit logs
- Notifications CRUD
- Platform settings

## Moderation routes

File: [server/routes/modRoutes.js](../../server/routes/modRoutes.js)

Read access guard: Admin or Mod

- GET /overview
- GET /notes
- GET /books
- GET /papers

Delete guard: Admin only

- DELETE /notes/:id
- DELETE /books/:id
- DELETE /papers/:id

## Support routes

File: [server/routes/supportRoutes.js](../../server/routes/supportRoutes.js)

POST /chatbot middleware order:

1. isAuthenticated
2. authorizeRoles(User, Instructor, Admin, Mod)
3. chatbotRateLimit
4. getSupportBotReply

## Payment routes

File: [server/routes/paymentRoutes.js](../../server/routes/paymentRoutes.js)

- POST /payment (authenticated)

NOTE: controller is currently a placeholder.

## Other public routes

File: [server/routes/otherRoutes.js](../../server/routes/otherRoutes.js)

- GET /
- GET /about
- GET /contact
- GET /privacy
- GET /terms

## Fallback route

File: [server/routes/pageNotFound.js](../../server/routes/pageNotFound.js)

- Defines `GET /` in the fallback router and returns 404 JSON.
- Intended as the final not-found handler because it is mounted last in `server.js`.
