# Architecture And Request Flow

## Big picture

Current backend flow:

Client -> Express route -> Middleware chain -> Controller -> Model/Utility -> Response

## Backend folders

- Routes: [server/routes](../../server/routes)
- Controllers: [server/controllers](../../server/controllers)
- Models: [server/models](../../server/models)
- Middlewares: [server/middlewares](../../server/middlewares)
- Utils: [server/utils](../../server/utils)

## Runtime sequence

1. Express app starts from [server/server.js](../../server/server.js)
2. Global middleware runs:
   - `express.json()`
   - `cookieParser()`
   - `cors(...)`
   - static uploads path
3. Route prefix is matched (`/api/v1/...`)
4. Route middlewares run (auth, role checks, upload checks, rate limits)
5. Controller executes business logic
6. Mongoose models perform DB operations
7. JSON or text response is returned

## Current security layers

- JWT verification in [server/middlewares/auth.js](../../server/middlewares/auth.js)
- Role access checks using `authorizeRoles`
- PDF-only upload filter and size limits in [server/middlewares/fileUpload.js](../../server/middlewares/fileUpload.js)
- Chatbot request throttling by role in [server/middlewares/chatbotRateLimit.js](../../server/middlewares/chatbotRateLimit.js)

## Important current behavior notes

NOTE:

- Book/Note/ResearchPaper list and detail endpoints currently return stored `fileUrl` values directly from DB.
- The utility folder currently has no `cloudinaryDownload.js` helper file.
- Support chatbot route uses both role authorization and rate limiting middleware.

## Example request flow (upload note)

1. POST `/api/v1/notes`
2. `isAuthenticated` ensures user is logged in
3. `uploadNote` validates PDF and stores file in memory buffer
4. `handleFileUploadError` handles multer errors
5. `createNote` uploads to Cloudinary and saves note in MongoDB
6. Controller returns created note JSON

## Debug order for beginners

TIP:

1. Check route and path first
2. Check middleware rejection (401/403/400)
3. Check controller validation
4. Check model schema validation
5. Check external service calls (Cloudinary/OpenRouter)
