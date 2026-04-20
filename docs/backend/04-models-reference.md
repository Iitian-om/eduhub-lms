# Models Reference

This file documents all Mongoose models in [server/models](../../server/models).

Models define:
- data shape
- validations
- defaults
- relationships between collections

---

## 1) User Model
File: [server/models/User.js](../../server/models/User.js)

Purpose:
- stores account identity, role, profile data, and learning progress.

Important fields:
- name, userName, email, password
- role (User/Admin/Instructor/Mod)
- profile_picture
- Courses_Enrolled_In
- Courses_Completed
- CourseProgress map
- content relation arrays (Books_Uploaded, Notes_Uploaded, ResearchPapers_Uploaded)

COMMENT:
- password is hidden by default (`select: false`) and must be explicitly selected during login checks.

---

## 2) Course Model
File: [server/models/Course.js](../../server/models/Course.js)

Purpose:
- stores course metadata and learning structure.

Important fields:
- title, description, category, level
- createdBy (User reference)
- profile_picture
- lectures array
- modules array with lessons
- enrolledStudents (User references)

How it links:
- one course belongs to one creator (createdBy)
- many users can enroll in one course

---

## 3) Book Model
File: [server/models/Book.js](../../server/models/Book.js)

Purpose:
- stores uploaded PDF books and metadata.

Important fields:
- title, description, author, category, level
- fileUrl, fileName, fileSize
- markdownContent
- uploadedBy (User reference)
- downloads, isPublic, tags
- createdAt, updatedAt

Validation highlights:
- PDF size max around 3MB in schema + middleware checks

COMMENT:
- a pre-save hook updates `updatedAt` automatically.

---

## 4) Note Model
File: [server/models/Note.js](../../server/models/Note.js)

Purpose:
- stores notes as file/manual/hybrid content.

Important fields:
- title, description, type, subject
- course (optional Course reference)
- fileUrl, fileName, fileSize
- markdownContent, richTextContent
- contentType (file/manual/both)
- uploadedBy, downloads, isPublic, tags
- createdAt, updatedAt

Validation highlights:
- file-related validations for upload mode
- size limit around 2MB in schema + middleware checks

---

## 5) Research Paper Model
File: [server/models/ResearchPaper.js](../../server/models/ResearchPaper.js)

Purpose:
- stores academic research papers and metadata.

Important fields:
- title, abstract
- authors array
- field, keywords array
- publicationYear, journal, doi
- fileUrl, fileName, fileSize
- markdownContent
- uploadedBy
- downloads, citations
- isPublic, isPeerReviewed
- createdAt, updatedAt

Validation highlights:
- publication year range checks
- size limit around 2MB in schema + middleware

---

## 6) Other model files

### coursesThumb model
File: [server/models/coursesThumb.js](../../server/models/coursesThumb.js)

- helper/model for course thumbnail media metadata.

### usersPfp model
File: [server/models/usersPfp.js](../../server/models/usersPfp.js)

- helper/model for user profile picture metadata.

NOTE:
- if these are lightly used, keep them documented for future expansion and migrations.

---

## Relationship summary

- User <-> Course
  - User.Courses_Enrolled_In references Course IDs
  - Course.enrolledStudents references User IDs

- User -> Book/Note/ResearchPaper
  - each content doc has `uploadedBy`
  - user can maintain uploaded content lists

TIP:
- whenever you change relation logic in controllers, update both sides or run sync utility scripts.
