# Architecture And Request Flow

## Big picture

EduHub backend follows a standard layered flow:

Client -> Route -> Middleware -> Controller -> Model/Utils -> Response

## Main backend folders

- Routes: [server/routes](../../server/routes)
- Controllers: [server/controllers](../../server/controllers)
- Models: [server/models](../../server/models)
- Middlewares: [server/middlewares](../../server/middlewares)
- Utils: [server/utils](../../server/utils)

## Step-by-step request lifecycle

1. Request enters Express app
- Entry file: [server/server.js](../../server/server.js)
- JSON body parsing and cookie parsing happen first.

2. CORS check
- Allowed origins are validated before route logic.

3. Route match
- Express chooses the route module by prefix, like /api/v1/books.

4. Route-level middleware
- Example middleware sequence:
  - auth check (`isAuthenticated`)
  - role check (`authorizeRoles`)
  - upload validation (`multer` middleware)

5. Controller logic
- Controller validates input
- uses models for DB operations
- uses utils for shared logic (JWT, Cloudinary URLs, etc.)

6. DB / cloud call
- MongoDB via Mongoose models
- Cloudinary for file upload/download URL generation

7. Response sent
- JSON with `success`, `message`, and data payload.

## Why this split is useful

WHY:
- Routes stay clean (only endpoint mapping)
- Controllers own business logic
- Models define data structure
- Middlewares handle reusable request checks
- Utils avoid repeated helper code

## Typical example (book upload)

1. POST /api/v1/books
2. Route calls upload middleware (validates PDF)
3. Route calls auth middleware (must be logged in)
4. Controller uploads file to Cloudinary
5. Controller saves metadata in Book model
6. Response returns created book object

## Typical example (book list)

1. GET /api/v1/books
2. Controller fetches public books from MongoDB
3. Controller applies accessible file URL helper
4. Response returns list + pagination

## Security building blocks in this backend

- JWT auth stored in httpOnly cookies
- role-based guards (Admin/Mod/Instructor/User)
- upload file type + file size checks
- private/signed Cloudinary download links for protected delivery

## Newbie mental model

TIP:
- If request is rejected early, look at middleware first.
- If request reaches controller but fails, check controller validation.
- If schema error appears, check model rules.
- If URL/download issue appears, check cloudinary utility functions.
