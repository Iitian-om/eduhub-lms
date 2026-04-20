# Middlewares Reference

This file explains backend middlewares in [server/middlewares](../../server/middlewares).

Middleware means: functions that run before controller handlers.

---

## 1) Auth middleware
File: [server/middlewares/auth.js](../../server/middlewares/auth.js)

Exports:
- `isAuthenticated`
- `authorizeRoles(...roles)`

How `isAuthenticated` works:
1. reads JWT token from cookie
2. verifies token
3. finds user in DB
4. attaches user to request as `req.user`
5. calls next()

Failure behavior:
- returns 401 if token is missing/invalid.

How `authorizeRoles` works:
1. checks `req.user.role`
2. allows only configured roles
3. returns 403 if role is not allowed

COMMENT:
- most protected routes use both of these in sequence.

---

## 2) File upload middleware
File: [server/middlewares/fileUpload.js](../../server/middlewares/fileUpload.js)

Exports:
- `uploadBook`
- `uploadNote`
- `uploadResearchPaper`
- `uploadToCloudinary`
- `handleFileUploadError`

How it works:
- multer stores file in memory (buffer)
- accepts only PDF mimetype
- enforces size limits by route type
- controller then calls `uploadToCloudinary` to stream file buffer

Failure behavior:
- wrong file type -> 400
- file too large -> 400

WATCH OUT:
- buffer upload means if upload fails, client usually needs to re-send file.

---

## 3) Profile upload middleware
File: [server/middlewares/upload.js](../../server/middlewares/upload.js)

Purpose:
- simple multer memory storage for profile picture upload routes.

COMMENT:
- profile validation rules are mostly handled in controller logic.

---

## 4) Chatbot rate limit middleware
File: [server/middlewares/chatbotRateLimit.js](../../server/middlewares/chatbotRateLimit.js)

Exports:
- `chatbotRateLimit`
- `consumeAiChatQuota`
- `getChatbotRateLimitStatus`

How it works:
- limits AI chatbot usage per user role
- tracks remaining quota in memory map
- injects rate-limit info into request

Failure behavior:
- returns 429 when quota exhausted

WATCH OUT:
- in-memory counters reset on server restart.

---

## Execution examples

Example A (protected route):
- route -> isAuthenticated -> authorizeRoles -> controller

Example B (file upload route):
- route -> isAuthenticated -> upload middleware -> handleFileUploadError -> controller

Example C (support chatbot):
- route -> isAuthenticated -> authorizeRoles(User, Instructor, Admin, Mod) -> chatbotRateLimit -> controller
