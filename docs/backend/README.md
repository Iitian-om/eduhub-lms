# EduHub Backend Documentation (Beginner Guide)

This folder explains the complete backend in simple language.

If you are new to Node.js + Express + MongoDB, start here and read the files in this order:

1. [00-quick-start.md](00-quick-start.md)
2. [01-architecture-and-request-flow.md](01-architecture-and-request-flow.md)
3. [02-routes-reference.md](02-routes-reference.md)
4. [03-controllers-reference.md](03-controllers-reference.md)
5. [04-models-reference.md](04-models-reference.md)
6. [05-middlewares-reference.md](05-middlewares-reference.md)
7. [06-utils-reference.md](06-utils-reference.md)
8. [07-how-modules-communicate.md](07-how-modules-communicate.md)

---

## What this backend does

- Handles authentication (register/login/logout)
- Manages users and public profiles
- Manages courses and enrollments
- Uploads and serves books, notes, and research papers
- Uses Cloudinary for file hosting
- Uses MongoDB for app data
- Provides admin/moderation and support chatbot APIs

---

## Backend entry point

Main server entry file:
- [server/server.js](../../server/server.js)

From there:
- Express app starts
- global middlewares run
- route modules are mounted
- controllers execute business logic
- models read/write MongoDB
- utils support shared operations (DB, JWT, Cloudinary, etc.)

---

## Comment legend used in docs

To keep this beginner-friendly, each section uses short comment-style notes:

- NOTE: Important concept
- WHY: Why this part exists
- WATCH OUT: Common beginner mistake
- TIP: Practical shortcut
