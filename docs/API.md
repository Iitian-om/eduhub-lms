# API Reference

This document provides an overview of the main API endpoints for EduHub LMS.

This document also specifies authentication requirements, error handling, file upload endpoints, and links to relevant controller/route files.

## Authentication
- `POST /api/v1/auth/register` — Register a new user
  - Public
  - Controller: [`authController.js`](../server/controllers/authController.js)
- `POST /api/v1/auth/login` — Login and receive JWT
  - Public
  - Controller: [`authController.js`](../server/controllers/authController.js)

## User Management
- `GET /api/v1/users/:id` — Get user profile
  - Auth: JWT required
  - Roles: user, admin
  - Controller: [`userController.js`](../server/controllers/userController.js)
- `PUT /api/v1/users/:id` — Update user profile
  - Auth: JWT required
  - Roles: user, admin
  - Controller: [`userController.js`](../server/controllers/userController.js)
- `DELETE /api/v1/users/:id` — Delete user
  - Auth: JWT required
  - Roles: admin
  - Controller: [`userController.js`](../server/controllers/userController.js)

## Courses
- `GET /api/v1/courses` — List all courses
  - Public
  - Controller: [`courseController.js`](../server/controllers/courseController.js)
- `POST /api/v1/courses` — Create a new course
  - Auth: JWT required
  - Roles: instructor, admin
  - Controller: [`courseController.js`](../server/controllers/courseController.js)
- `GET /api/v1/courses/:id` — Get course details
  - Public
  - Controller: [`courseController.js`](../server/controllers/courseController.js)
- `PUT /api/v1/courses/:id` — Update course
  - Auth: JWT required
  - Roles: instructor, admin
  - Controller: [`courseController.js`](../server/controllers/courseController.js)
- `DELETE /api/v1/courses/:id` — Delete course
  - Auth: JWT required
  - Roles: admin
  - Controller: [`courseController.js`](../server/controllers/courseController.js)

## Notes & Books
- `GET /api/v1/notes` — List notes
  - Public
  - Controller: [`noteController.js`](../server/controllers/noteController.js)
- `GET /api/v1/books` — List books
  - Public
  - Controller: [`bookController.js`](../server/controllers/bookController.js)
- `GET /api/v1/research-papers` — List research papers
  - Public
  - Controller: [`researchPaperController.js`](../server/controllers/researchPaperController.js)

## Admin
- `GET /api/v1/admin/reports` — Get reports
  - Auth: JWT required
  - Roles: admin
  - Controller: [`adminController.js`](../server/controllers/adminController.js)
- `GET /api/v1/admin/` — Get admin dashboard
  - Auth: JWT required
  - Roles: admin
  - Controller: [`adminController.js`](../server/controllers/adminController.js)
- `GET /api/v1/admin/analytics` — Get analytics data
  - Auth: JWT required
  - Roles: admin
  - Controller: [`adminController.js`](../server/controllers/adminController.js)

## Payments
- `POST /api/v1/payment/checkout` — Initiate payment (under development)
  - Auth: JWT required
  - Roles: user
  - Controller: [`paymentController.js`](../server/controllers/paymentController.js)

## File Uploads
- `POST /api/v1/upload` — Upload files (images, profile pictures, etc.)
  - Auth: JWT required
  - Roles: user, admin
  - Middleware: [`fileUpload.js`](../server/middlewares/fileUpload.js)
  - Controller: [`userController.js`](../server/controllers/userController.js) or [`upload.js`](../server/middlewares/upload.js)

## Error Handling & Status Codes

- **200 OK** — Successful request
- **201 Created** — Resource created
- **400 Bad Request** — Invalid input
- **401 Unauthorized** — Missing or invalid JWT
- **403 Forbidden** — Insufficient permissions/role
- **404 Not Found** — Resource not found
- **500 Internal Server Error** — Server error

Error responses include a JSON object with `error` and `message` fields. Example:
```json
{
  "error": true,
  "message": "Invalid credentials"
}
```

---
For detailed request/response formats, see backend route files in [`server/routes/`](../server/routes/) and controllers in [`server/controllers/`](../server/controllers/).
