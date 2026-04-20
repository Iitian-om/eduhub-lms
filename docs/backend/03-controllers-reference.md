# Controllers Reference

This page explains all controller files in [server/controllers](../../server/controllers).

Controller role in this project:
- validate request data
- run business logic
- call models and utils
- return standardized JSON response

---

## 1) Auth Controller
File: [server/controllers/authController.js](../../server/controllers/authController.js)

Exports:
- `register`
- `login`
- `logout`

How it works:
- register:
  - validates required user fields
  - checks duplicate email/username
  - hashes password with bcrypt
  - optionally uploads profile image to Cloudinary
  - creates User document
  - signs JWT and sets auth cookie
- login:
  - validates email/password
  - fetches user with password field explicitly
  - compares password hash
  - signs JWT and sets cookie
- logout:
  - clears auth cookie/session response

COMMENT:
- `generateToken` utility is used for JWT creation.

---

## 2) User Controller
File: [server/controllers/userController.js](../../server/controllers/userController.js)

Exports:
- `getUserProfile`
- `updateProfile`
- `uploadProfilePicture`
- `getPublicProfiles`
- `getPublicProfileByUsername`

How it works:
- profile read/update uses `req.user` from auth middleware
- profile picture upload uses multer memory buffer + Cloudinary stream upload
- public profile listing supports search + pagination

WATCH OUT:
- if auth cookie is missing, protected profile endpoints return 401 before this controller runs.

---

## 3) Course Controller
File: [server/controllers/courseController.js](../../server/controllers/courseController.js)

Exports:
- `getAllCourses`
- `getCourseById`
- `createCourse`
- `enrollInCourse`
- `getEnrolledCourses`
- `checkEnrollment`
- `getCourseProgress`
- `markLessonComplete`
- `markCourseComplete`

How it works:
- reads and writes Course and User docs together for enrollment
- uses map-like progress tracking in user document
- role-restricted create endpoint for Admin/Instructor/Mod

COMMENT:
- enrollment consistency between User and Course is maintained at controller level.

---

## 4) Book Controller
File: [server/controllers/bookController.js](../../server/controllers/bookController.js)

Exports:
- `createBook`
- `getAllBooks`
- `getBookById`
- `updateBook`
- `deleteBook`
- `getUserBooks`

How it works:
- createBook:
  - requires PDF file
  - uploads to Cloudinary (`raw` PDF)
  - saves metadata in Book model
- getAllBooks:
  - supports filter/sort/pagination
  - returns signed/accessible download URL using cloudinaryDownload util
- getBookById:
  - increments download counter
  - returns accessible URL
- update/delete:
  - ownership checks using `uploadedBy`

WATCH OUT:
- mod role delete restrictions are also enforced in logic.

---

## 5) Note Controller
File: [server/controllers/noteController.js](../../server/controllers/noteController.js)

Exports:
- `createNote`
- `getAllNotes`
- `getNoteById`
- `updateNote`
- `deleteNote`
- `getUserNotes`
- `getNotesByCourse`

How it works:
- supports content modes:
  - file
  - manual
  - both
- file uploads are optional depending on contentType
- reads include signed-accessible file URLs when file exists
- list endpoints support filtering and pagination

COMMENT:
- this controller is more flexible than books because note content can be manual text only.

---

## 6) Research Paper Controller
File: [server/controllers/researchPaperController.js](../../server/controllers/researchPaperController.js)

Exports:
- `createResearchPaper`
- `getAllResearchPapers`
- `getResearchPaperById`
- `updateResearchPaper`
- `deleteResearchPaper`
- `getUserResearchPapers`
- `incrementCitations`

How it works:
- requires PDF upload for creation
- parses authors and keywords arrays from comma-separated input
- supports filters by field/year/peer-reviewed status
- increments download count on detail fetch
- citations can be incremented from dedicated endpoint

---

## 7) Admin Controller
File: [server/controllers/adminController.js](../../server/controllers/adminController.js)

Main exported groups:
- user CRUD + instructor verification
- course management
- content management for notes/books/papers
- dashboard stats and reporting endpoints
- notifications/settings endpoints

How it works:
- central admin control layer for moderation/operations
- pulls metrics from multiple models
- some endpoints are placeholders/stubs for future implementation

TIP:
- treat this file as an operations dashboard API backend.

---

## 8) Moderation Controller
File: [server/controllers/modController.js](../../server/controllers/modController.js)

Exports:
- `getModerationOverview`
- `getModerationNotes`
- `getModerationBooks`
- `getModerationPapers`
- `deleteModerationNote`
- `deleteModerationBook`
- `deleteModerationPaper`

How it works:
- fetches moderation-friendly datasets
- overview combines counts + recent uploads
- deletion actions are sensitive and role-checked

---

## 9) Support Controller
File: [server/controllers/supportController.js](../../server/controllers/supportController.js)

Export:
- `getSupportBotReply`

How it works:
- first tries FAQ/knowledge-base style matching
- if no match, calls external AI provider (OpenRouter)
- returns model response or fallback message
- works with chatbot rate limit middleware

WATCH OUT:
- external API key and provider settings must be valid in env.

---

## 10) Payment Controller
File: [server/controllers/paymentController.js](../../server/controllers/paymentController.js)

Export:
- `createPayment`

How it works:
- currently placeholder for payment integration flow.

---

## 11) Other Controller
File: [server/controllers/otherController.js](../../server/controllers/otherController.js)

Exports:
- `getRoot`
- `getAbout`
- `getContact`
- `getPrivacy`
- `getTerms`

How it works:
- simple informational/public endpoints.
