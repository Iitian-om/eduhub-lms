# EduHub Backend Docs (Updated To Current Code)

This folder explains the backend in beginner-friendly language and matches the current implementation under `server/`.

Start reading in this order:

1. [00-quick-start.md](00-quick-start.md)
2. [01-architecture-and-request-flow.md](01-architecture-and-request-flow.md)
3. [02-routes-reference.md](02-routes-reference.md)
4. [03-controllers-reference.md](03-controllers-reference.md)
5. [04-models-reference.md](04-models-reference.md)
6. [05-middlewares-reference.md](05-middlewares-reference.md)
7. [06-utils-reference.md](06-utils-reference.md)
8. [07-how-modules-communicate.md](07-how-modules-communicate.md)

## Backend entrypoint

- Main file: [server/server.js](../../server/server.js)

From this file, the app:

1. Loads environment values
2. Configures core middleware (JSON, cookies, CORS)
3. Mounts all route modules
4. Connects to MongoDB
5. Starts Express server

## What this backend currently handles

- Authentication and cookie-based sessions
- User profile and public profile APIs
- Courses and enrollment/progress tracking
- Books, notes, and research papers (PDF upload + metadata)
- Admin and moderation panels
- Support chatbot with FAQ + AI fallback + rate limiting
- Payment endpoint placeholder

## Comment labels used in docs

- NOTE: important behavior
- WATCH OUT: common mistakes
- TIP: practical recommendation
