# How Modules Communicate

This page explains exactly how routes, middlewares, controllers, models, and utils interact.

## Communication chain (standard)

1. `server.js` mounts a route group
2. route file maps endpoint to middleware stack + controller
3. middleware modifies request (auth user, file buffer, rate info)
4. controller reads request, calls model/util functions
5. model performs MongoDB read/write
6. controller returns response JSON

---

## Example 1: User login

Route:
- POST /api/v1/auth/login

Flow:
1. route calls authController.login
2. controller validates email/password
3. User model fetch with password selection
4. bcrypt compare password hash
5. jwt util generates token
6. cookie is set in response
7. frontend now sends cookie on future protected calls

COMMENT:
- no isAuthenticated middleware here because user is not logged in yet.

---

## Example 2: Upload a book PDF

Route:
- POST /api/v1/books

Flow:
1. `isAuthenticated` ensures user exists
2. `uploadBook` validates PDF and creates `req.file.buffer`
3. `handleFileUploadError` catches multer/file issues
4. bookController.createBook runs
5. `uploadToCloudinary` streams buffer to Cloudinary
6. Book model saves metadata + uploader reference
7. response sends created book payload

---

## Example 3: Read books list

Route:
- GET /api/v1/books

Flow:
1. bookController.getAllBooks reads query filters
2. Book model query with pagination and sorting
3. cloudinaryDownload utility converts each fileUrl
4. response includes books + pagination object

---

## Example 4: Admin content delete

Route:
- DELETE /api/v1/admin/books/:id

Flow:
1. isAuthenticated -> authorizeRoles("Admin")
2. adminController.deleteBook
3. Book model delete operation
4. response confirms deletion

WATCH OUT:
- if route role and controller role logic conflict, controller may still deny action.

---

## Example 5: Support chatbot request

Route:
- POST /api/v1/support/chatbot

Flow:
1. isAuthenticated ensures logged user
2. chatbotRateLimit checks remaining quota
3. supportController.getSupportBotReply
4. FAQ match or external AI fallback
5. response includes bot answer and status metadata

---

## Shared request properties across layers

Properties commonly passed between modules:

- `req.user`
  - set by auth middleware
  - consumed by protected controllers

- `req.file`
  - set by upload middleware
  - consumed by content/profile upload controllers

- `req.chatbotRateLimit`
  - set by chatbot middleware
  - consumed by support controller

---

## Error propagation style

- Middleware errors usually return 400/401/403/429 quickly.
- Controller errors are wrapped in try/catch and usually return 500.
- Validation errors may come from model schema and bubble into catch blocks.

TIP:
- debug from left to right in chain:
  - route -> middleware -> controller -> model/util
