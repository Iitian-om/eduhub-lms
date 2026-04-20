# Utils Reference

This file explains utility modules in [server/utils](../../server/utils).

Utilities are shared helper files that controllers and startup code reuse.

---

## 1) DB utility
File: [server/utils/db.js](../../server/utils/db.js)

Export:
- `connectDB`

Purpose:
- opens MongoDB connection before server starts.

Used by:
- [server/server.js](../../server/server.js)

---

## 2) JWT utility
File: [server/utils/jwt.js](../../server/utils/jwt.js)

Export:
- `generateToken`

Purpose:
- signs JWT with user id + role.

Used by:
- [server/controllers/authController.js](../../server/controllers/authController.js)

---

## 3) Cloudinary config utility
File: [server/utils/cloudinary.js](../../server/utils/cloudinary.js)

Export:
- configured Cloudinary instance

Purpose:
- central Cloudinary client configuration using env variables.

Used by:
- upload middleware and profile/content upload controllers

---

## 4) Cloudinary download URL utility
File: [server/utils/cloudinaryDownload.js](../../server/utils/cloudinaryDownload.js)

Exports:
- `getAccessibleFileUrl`
- `withAccessibleFileUrl`

Purpose:
- converts stored Cloudinary raw URLs into signed/access-friendly URLs for downloads.

How it helps:
- improves reliability for PDF delivery
- provides temporary signed URLs

Used by:
- book/note/research read/list responses

---

## 5) Add course content utility
File: [server/utils/addCourseContent.js](../../server/utils/addCourseContent.js)

Purpose:
- helper script structure for adding module/lesson content to courses.

Typical usage:
- script/manual execution for content seeding or enrichment.

---

## 6) Seed courses utility
File: [server/utils/seedCourses.js](../../server/utils/seedCourses.js)

Purpose:
- seeds initial course data for development/demo.

Run with:
- `pnpm seed` from [server/package.json](../../server/package.json)

---

## 7) Profile picture migration utility
File: [server/utils/migrateProfilePictures.js](../../server/utils/migrateProfilePictures.js)

Purpose:
- migration support for profile picture path updates.

Use case:
- cleanup when moving from local paths to cloud URLs.

---

## 8) Enrollment synchronization utility
File: [server/utils/syncEnrollmentData.js](../../server/utils/syncEnrollmentData.js)

Purpose:
- repairs sync between user enrollment lists and course enrolled students lists.

Use case:
- data consistency maintenance after partial failures or legacy data issues.

---

## Utility best practices for contributors

TIP:
- put reusable logic in utils when used by 2+ files.
- keep utilities side-effect free where possible.
- for scripts, log clearly and fail fast on missing env values.
