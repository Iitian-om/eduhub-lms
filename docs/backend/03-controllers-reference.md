# Controllers Reference

This page documents the current controllers in [server/controllers](../../server/controllers).

## Auth controller

File: [server/controllers/authController.js](../../server/controllers/authController.js)

Exports:

- register
- login
- logout

Behavior:

- register validates required fields, checks duplicate users, hashes password, optionally uploads profile image, creates user, then sets token cookie.
- login validates credentials, compares password hash, then sets token cookie (`sameSite: "none"`, `secure: true`).
- logout clears cookie using configurable cookie flags.

## User controller

File: [server/controllers/userController.js](../../server/controllers/userController.js)

Exports:

- upload (multer instance)
- getUserProfile
- updateProfile
- uploadProfilePicture
- getPublicProfiles
- getPublicProfileByUsername

Behavior:

- profile APIs use `req.user` from auth middleware.
- updateProfile checks username uniqueness.
- uploadProfilePicture streams image buffer to Cloudinary.
- public profile endpoints support search and pagination.

## Course controller

File: [server/controllers/courseController.js](../../server/controllers/courseController.js)

Exports:

- getAllCourses
- getCourseById
- enrollInCourse
- getEnrolledCourses
- checkEnrollment
- createCourse
- markLessonComplete
- getCourseProgress
- markCourseComplete

Behavior:

- read endpoints transform course documents for frontend shape.
- enrollment updates both User and Course enrollment arrays.
- createCourse seeds sample modules into new courses.
- progress is stored in `User.CourseProgress` map.

## Book controller

File: [server/controllers/bookController.js](../../server/controllers/bookController.js)

Exports:

- createBook
- getAllBooks
- getBookById
- updateBook
- deleteBook
- getUserBooks

Behavior:

- createBook requires file upload and stores Cloudinary `secure_url` in DB.
- getAllBooks supports filtering, search, sorting, and pagination.
- getBookById increments downloads count.
- update/delete enforce owner checks.
- moderators are blocked from delete in this controller.

NOTE:

- current responses return stored `fileUrl` values directly.

## Note controller

File: [server/controllers/noteController.js](../../server/controllers/noteController.js)

Exports:

- createNote
- getAllNotes
- getNoteById
- updateNote
- deleteNote
- getUserNotes
- getNotesByCourse

Behavior:

- supports `contentType` values: file/manual/both.
- file is optional depending on contentType.
- list/detail endpoints provide pagination and download count increment on detail.
- owner checks on update/delete.

## Research paper controller

File: [server/controllers/researchPaperController.js](../../server/controllers/researchPaperController.js)

Exports:

- createResearchPaper
- getAllResearchPapers
- getResearchPaperById
- updateResearchPaper
- deleteResearchPaper
- getUserResearchPapers
- incrementCitations

Behavior:

- creation requires PDF upload.
- parses comma-separated authors/keywords.
- supports search/filter/sort/pagination.
- increments downloads on detail endpoint.
- increments citations through dedicated endpoint.

## Admin controller

File: [server/controllers/adminController.js](../../server/controllers/adminController.js)

Exports cover:

- user/instructor CRUD and verification
- course CRUD
- content listing/deletion (notes/books/papers)
- stats + analytics + reports
- audit logs aggregation (Vercel + Render + local fallback)
- in-memory notifications CRUD
- in-memory platform settings read/update

WATCH OUT:

- this file mixes real DB-backed data and in-memory demo data.

## Moderation controller

File: [server/controllers/modController.js](../../server/controllers/modController.js)

Exports:

- getModerationOverview
- getModerationNotes
- getModerationBooks
- getModerationPapers
- deleteModerationNote
- deleteModerationBook
- deleteModerationPaper

Behavior:

- overview uses `Promise.all` for counts and recent lists.
- list endpoints return latest content with uploader info.

## Support controller

File: [server/controllers/supportController.js](../../server/controllers/supportController.js)

Export:

- getSupportBotReply

Behavior:

- validates message and max length.
- answers from local FAQ first.
- consumes role-based AI quota.
- uses OpenRouter primary/fallback model strategy.
- returns fallback reply if key/provider is unavailable.

## Payment controller

File: [server/controllers/paymentController.js](../../server/controllers/paymentController.js)

Export:

- createPayment

Behavior:

- placeholder response only (integration pending).

## Other controller

File: [server/controllers/otherController.js](../../server/controllers/otherController.js)

Exports:

- getRoot
- getAbout
- getContact
- getPrivacy
- getTerms

Behavior:

- simple text responses for root and static page routes.
