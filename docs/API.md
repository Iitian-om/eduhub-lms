# EduHub API Onboarding Guide

Last updated: 2026-04-11

## What is an API?
An API (Application Programming Interface) is a set of rules that allows your frontend to communicate with your backend (server). Instead of hardcoding data, the frontend makes HTTP requests to the backend and receives JSON data in response.

**Real-world analogy**: An API is like a restaurant menu:
- You (frontend) look at the menu (API endpoints)
- You order a dish (HTTP request)
- The kitchen (backend) prepares it (processes your request)
- You receive your food (JSON response)

---

## Backend Framework: Express.js

Your EduHub backend uses **Express.js**, a lightweight Node.js framework for building APIs.

**Why Express.js?**
- Fast and minimalist
- Easy to learn
- Large community and ecosystem
- Great for REST APIs
- Easy middleware integration (auth, validation, CORS, etc.)

**In your project**: `server/server.js` initializes Express and mounts all route handlers.

---

## API Style: REST API

Your EduHub uses **REST (Representational State Transfer)** API style.

REST means:
- Each API endpoint represents a resource (users, courses, books, etc.)
- HTTP methods describe what you do with that resource
- URLs are predictable and resource-oriented

**REST Principles in EduHub**:
```
/api/v1/users       → refers to users resource
/api/v1/courses     → refers to courses resource
/api/v1/books       → refers to books resource
```

---

## API Version: /api/v1/

Your APIs are versioned as `/api/v1/`.

**Why versioning?**
- You can later create `/api/v2/` with breaking changes without affecting old clients
- Users on old apps keep working while new apps use new API
- You can deprecate old endpoints gradually

**Example**: If you later want to change the user response format, you could create `/api/v2/users` while keeping `/api/v1/users` working.

---

## HTTP Methods (VERBS)

These methods describe what action to perform on a resource:

| Method | Purpose | Example |
|--------|---------|---------|
| **GET** | Read/retrieve data | `GET /api/v1/users/profile` → Get my profile |
| **POST** | Create new data | `POST /api/v1/auth/register` → Create new user |
| **PUT** | Replace entire resource | `PUT /api/v1/users/profile` → Replace entire profile |
| **PATCH** | Partial update | `PATCH /api/v1/users/settings` → Update only settings |
| **DELETE** | Remove data | `DELETE /api/v1/courses/:id` → Delete a course |

**In EduHub**: All these methods are used across your different route files.

---

## Complete API Endpoints by Category

### 1. Authentication (Public - No Auth Required)
Routes: `server/routes/authRoutes.js`
```
POST   /api/v1/auth/register        → Create new user account
POST   /api/v1/auth/login           → Login and get JWT token
POST   /api/v1/auth/logout          → Logout and clear session
```

**Database**: User collection in MongoDB
- Stores: name, email, password (hashed), userName, role, profile_picture
- Middleware: No auth required, but input validation applied

---

### 2. User Management (Auth Required)
Routes: `server/routes/userRoutes.js`
```
GET    /api/v1/users/profile                    → Get your own profile (requires login)
PUT    /api/v1/users/profile                    → Update your profile (requires login)
POST   /api/v1/users/profile/upload             → Upload profile picture (requires login)
GET    /api/v1/users/profiles                   → Get list of all public profiles (paginated)
GET    /api/v1/users/profiles/:userName         → Get specific user's public profile
```

**Database**: User collection (same as auth)
- `GET /profile` → Reads from User model
- `PUT /profile` → Updates User model
- `POST /profile/upload` → Uploads to Cloudinary, stores URL in User model
- `GET /profiles` → Paginated read with search/filter by role

---

### 3. Course Management
Routes: `server/routes/courseRoutes.js`
```
GET    /api/v1/courses                          → List all courses (public)
POST   /api/v1/courses                          → Create course (Admin/Instructor only)
GET    /api/v1/courses/:id                      → Get course details (public)
POST   /api/v1/courses/enroll                   → Enroll in course (requires login)
GET    /api/v1/courses/enrolled/courses         → Get my enrolled courses (requires login)
GET    /api/v1/courses/check-enrollment/:id     → Check if enrolled (requires login)
POST   /api/v1/courses/lesson/complete          → Mark lesson as done (requires login)
POST   /api/v1/courses/complete/:id             → Mark course as completed (requires login)
GET    /api/v1/courses/progress/:id             → Get my progress in course (requires login)
```

**Database**: Course collection + User updates
- `POST /courses` → Creates in Course collection
- `GET /courses` → Reads from Course collection
- Enrolling updates User.Courses_Enrolled_In array
- Completion tracking stored in User.CourseProgress map

---

### 4. Books Management
Routes: `server/routes/bookRoutes.js`
```
GET    /api/v1/books                            → List all books
POST   /api/v1/books                            → Upload/create book (Instructor/Admin)
GET    /api/v1/books/:id                        → Get book details
PUT    /api/v1/books/:id                        → Update book (Instructor/Admin)
DELETE /api/v1/books/:id                        → Delete book (Admin only)
```

**Database**: Book collection + Cloudinary for file storage
- Books stored in MongoDB
- PDF files stored on Cloudinary

---

### 5. Notes Management
Routes: `server/routes/noteRoutes.js`
```
GET    /api/v1/notes                            → List all notes
POST   /api/v1/notes                            → Create note (any user)
GET    /api/v1/notes/:id                        → Get note details
PUT    /api/v1/notes/:id                        → Update note
DELETE /api/v1/notes/:id                        → Delete note
```

**Database**: Note collection
- Stores: title, content, author, timestamps, etc.

---

### 6. Research Papers Management
Routes: `server/routes/researchPaperRoutes.js`
```
GET    /api/v1/research-papers                  → List all papers
POST   /api/v1/research-papers                  → Upload paper (Instructor/Admin)
GET    /api/v1/research-papers/:id              → Get paper details
PUT    /api/v1/research-papers/:id              → Update paper
DELETE /api/v1/research-papers/:id              → Delete paper
```

**Database**: ResearchPaper collection + Cloudinary
- Similar to books, files on Cloudinary, metadata in MongoDB

---

### 7. Payment Management
Routes: `server/routes/paymentRoutes.js`
```
POST   /api/v1/payment/create-order             → Create payment order
POST   /api/v1/payment/verify                   → Verify payment success
GET    /api/v1/payment/history                  → Get payment history
```

**Database**: Payment collection
- Records all transactions

---

### 8. Support Chatbot
Routes: `server/routes/supportRoutes.js`
``` 
POST   /api/v1/support/chatbot                  → Ask the EduHub support bot a question (auth required)
```

**Access rules**:
- Requires a valid logged-in session
- Allowed roles: `User`, `Instructor`, `Mod`, `Admin`
- AI-only rate limit (FAQ replies do not consume quota):
  - `User`: 5 AI messages per hour
  - `Instructor`: 10 AI messages per hour
  - `Mod`: 15 AI messages per hour
  - `Admin`: unlimited

**Cost controls**:
- Short message limit to block oversized prompts
- FAQ-style answers are served locally when possible
- Live AI is only used when `OPENROUTER_API_KEY` is configured
- Primary model: `google/gemma-2-9b-it`
- Fallback model: `google/gemma-3-27b-it`
- Response generation is capped to a short completion

**Environment variables**:
- `OPENROUTER_API_KEY`
- `AI_MODEL` optional, defaults to `google/gemma-2-9b-it`
- `SUPPORT_BOT_NAME` optional
- `SUPPORT_BOT_SYSTEM_CONTEXT` optional

---

### 9. Admin Management (Admin Only)
Routes: `server/routes/adminRoutes.js`

**User Management**:
```
GET    /api/v1/admin/users                      → List all users
DELETE /api/v1/admin/users/:id                  → Delete user
```

**Instructor Management**:
```
GET    /api/v1/admin/instructors                → List instructors
PATCH  /api/v1/admin/instructors/:id/verify     → Verify instructor
PUT    /api/v1/admin/instructors/:id            → Update instructor
DELETE /api/v1/admin/instructors/:id            → Delete instructor
```

**Course Management**:
```
GET    /api/v1/admin/courses                    → List all courses
PUT    /api/v1/admin/courses/:id                → Update course
DELETE /api/v1/admin/courses/:id                → Delete course
```

**Content Management**:
```
GET    /api/v1/admin/notes                      → List all notes
GET    /api/v1/admin/books                      → List all books
GET    /api/v1/admin/papers                     → List all papers
DELETE /api/v1/admin/notes/:id                  → Delete note
DELETE /api/v1/admin/books/:id                  → Delete book
DELETE /api/v1/admin/papers/:id                 → Delete paper
```

**Analytics & Reporting**:
```
GET    /api/v1/admin/stats                      → Get platform statistics
GET    /api/v1/admin/analytics                  → Get analytics data
GET    /api/v1/admin/reports                    → Get reports
GET    /api/v1/admin/audit-logs                 → Get audit logs
```

**Notifications**:
```
GET    /api/v1/admin/notifications              → List notifications
POST   /api/v1/admin/notifications              → Create notification
PUT    /api/v1/admin/notifications/:id          → Update notification
DELETE /api/v1/admin/notifications/:id          → Delete notification
PATCH  /api/v1/admin/notifications/:id/toggle   → Toggle notification
```

**Settings**:
```
GET    /api/v1/admin/settings                   → Get all settings
PUT    /api/v1/admin/settings/:tab              → Update specific setting
```

**Database**: Multiple collections (User, Course, Book, Note, Payment, etc.)
- All admin operations read/write to respective collections

---

### 10. Moderation Management (Admin + Mod)
Routes: `server/routes/modRoutes.js`

**Read/Review endpoints**:
```
GET    /api/v1/mod/overview                     → Moderation overview stats
GET    /api/v1/mod/notes                        → List notes for moderation
GET    /api/v1/mod/books                        → List books for moderation
GET    /api/v1/mod/papers                       → List research papers for moderation
```

**Delete endpoints (Admin only)**:
```
DELETE /api/v1/mod/notes/:id                    → Delete note
DELETE /api/v1/mod/books/:id                    → Delete book
DELETE /api/v1/mod/papers/:id                   → Delete research paper
```

---

## Internal vs External APIs

### External APIs (Used by Your Frontend)
These are consumed by your Next.js frontend:

**Public (No Auth)**:
- `GET /api/v1/courses` → List courses
- `GET /api/v1/courses/:id` → Course details
- `GET /api/v1/books` → List books
- `GET /api/v1/notes` → List notes
- `GET /api/v1/research-papers` → List papers

**Protected (Requires Login)**:
- All `/api/v1/users/*` endpoints
- All `/api/v1/courses/*` enrollment endpoints
- Admin endpoints (admin role required)

### Internal APIs Used
These are third-party APIs your backend calls:

1. **Cloudinary** (`server/utils/cloudinary.js`)
   - Stores profile pictures, books, papers
   - Returns secure URLs to store in database

2. **MongoDB** (`server/utils/db.js`)
   - Stores all data
   - Called through Mongoose ORM

3. **JWT** (jsonwebtoken package)
   - Generates tokens on login
   - Validates tokens on protected routes

---

## Middleware & Security

### Authentication Middleware
Location: `server/middlewares/auth.js`

```javascript
isAuthenticated()     → Checks if user is logged in (validates JWT token)
authorizeRoles()      → Checks if user has specific role (Admin, Mod, Instructor, User)
```

**How it works**:
1. Client sends JWT in Authorization header
2. Middleware extracts and verifies JWT
3. If invalid, returns 401 Unauthorized
4. If valid, attaches `req.user` object to request

**Example**: 
```
POST /api/v1/courses
isAuthenticated         → ✅ Must be logged in
authorizeRoles("Admin") → ✅ Must be Admin
```

### File Upload Middleware
Location: `server/middlewares/upload.js`

- Handles multipart/form-data
- Uses Multer for file parsing
- Only allows specific file types
- Validates file size

---

## Security Best Practices in EduHub

### 1. Password Security ✅
```javascript
// bcryptjs hashes passwords before storing
const hashedPassword = await bcrypt.hash(password, 10);
// Never store plain passwords
```

### 2. JWT Authentication ✅
```javascript
// Tokens expire (usually 7 days)
// Never return password in API responses (select: false in schema)
```

### 3. Role-Based Access Control (RBAC) ✅
```javascript
// Admin, Mod, Instructor, User roles with different permissions
router.delete("/users/:id", adminOnly, deleteUser);
```

### 4. CORS Protection ✅
```javascript
// Only allow requests from trusted origins
const allowedOrigins = [
  "https://eduhub-lms-rose.vercel.app",
  "http://localhost:3000"
];
```

### 5. SQL/NoSQL Injection Prevention ✅
```javascript
// Using Mongoose prevents injection attacks
// Input validation with express-validator
```

### Additional Security Improvements You Should Add

#### 1. **Rate Limiting** (Prevent brute force attacks)
```bash
npm install express-rate-limit
```
```javascript
const rateLimit = require("express-rate-limit");

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5 // 5 attempts
});

router.post("/login", loginLimiter, login);
```

#### 2. **Input Validation** (Already using express-validator)
```javascript
// Validate email, password strength, file types
const { body, validationResult } = require('express-validator');

router.post("/register", [
  body('email').isEmail(),
  body('password').isLength({ min: 7 }),
], register);
```

#### 3. **Helmet.js** (Secure HTTP headers)
```bash
npm install helmet
```
```javascript
import helmet from "helmet";
app.use(helmet());
```

#### 4. **Environment Variables** (Secrets management)
```
Never commit .env files
Use env1.cloud or AWS Secrets Manager for production
```

#### 5. **HTTPS Enforcement** (Already done on Vercel/Render)
```javascript
// Use HTTPS only in production
```

#### 6. **SQL/NoSQL Injection Prevention** (Already using Mongoose)
```javascript
// Never concatenate user input into queries
// Always use parameterized queries
```

---

## Cost Optimization for APIs

### 1. **Database Optimization** 💾
```javascript
// ❌ BAD: Load entire user object every time
User.findById(userId) // loads password, internal fields

// ✅ GOOD: Select only needed fields
User.findById(userId).select("name email profile_picture")
```

### 2. **Pagination** (Reduce data transfer)
```javascript
// ❌ BAD: Return all 10,000 users
GET /api/v1/users → Returns 10,000 records

// ✅ GOOD: Return paginated results
GET /api/v1/users?page=1&limit=20 → Returns 20 records
```

**In your code**:
```javascript
// server/controllers/userController.js
const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 12, 1), 50);
const skip = (page - 1) * limit;

const users = await User.find(filter).skip(skip).limit(limit);
```

### 3. **Database Indexing**
```javascript
// Add indexes to frequently queried fields
userSchema.index({ email: 1, userName: 1 });
courseSchema.index({ createdAt: -1 }); // For sorting by latest
```

### 4. **Caching** (With Redis) 
```bash
npm install redis
```
```javascript
// Cache course list for 1 hour
const cacheKey = `courses:page:${page}`;
const cached = await redis.get(cacheKey);
if (cached) return JSON.parse(cached);

// If not cached, fetch and cache it
const courses = await Course.find(filter).limit(limit);
await redis.setex(cacheKey, 3600, JSON.stringify(courses));
return courses;
```

### 5. **Lazy Loading** (Load related data only when needed)
```javascript
// ❌ BAD: Always load user's enrolled courses
user.populate("Courses_Enrolled_In") // Loads all courses every time

// ✅ GOOD: Load courses only when requested
router.get("/users/:id/courses", async (req, res) => {
  const user = await User.findById(req.params.id).populate("Courses_Enrolled_In");
  res.json(user.Courses_Enrolled_In);
});
```

### 6. **File Storage Optimization** (Using Cloudinary)
```javascript
// ✅ GOOD: Store files on Cloudinary, not on server disk
// This saves disk space on your server
// Cloudinary handles CDN & fast delivery globally

// Resize images before storing
const result = await cloudinary.uploader.upload(buffer, {
  folder: "eduhub/profilePics",
  width: 200, // Resize to 200px
  crop: "fill"
});
```

### 7. **Database Query Optimization**
```javascript
// ❌ BAD: N+1 problem (10 calls instead of 1)
const users = await User.find();
for (let user of users) {
  const enrolledCourses = await Course.find({ 
    _id: { $in: user.Courses_Enrolled_In } 
  });
  user.enrolledCourses = enrolledCourses;
}

// ✅ GOOD: Use populate to join in one query
const users = await User.find()
  .populate("Courses_Enrolled_In", "title")
  .limit(20);
```

### 8. **Monitor API Usage & Costs**
```javascript
// Log API calls to identify expensive operations
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${duration}ms`);
  });
  next();
});
```

### 9. **Use CDN for Static Content** (Already doing with Cloudinary)
```
✅ Profile pictures on Cloudinary CDN
✅ Frontend on Vercel CDN
✅ Backend static files on Express static middleware
```

### 10. **Compress API Responses**
```bash
npm install compression
```
```javascript
import compression from "compression";
app.use(compression()); // Gzip compression
```

**Result**: Reduces payload size by 70-90%

---

## Summary: Your EduHub API Architecture

```
Frontend (Next.js)
      ↓
Express.js Server (Node.js)
      ↓↓↓
┌─────────────────────────────────┐
│  MongoDB (Data Storage)         │
│  - Users, Courses, Books, etc.  │
└─────────────────────────────────┘
      ↓
Cloudinary (File Storage)
```

**What You Have**:
- ✅ REST API with /api/v1 versioning
- ✅ JWT Authentication
- ✅ Role-Based Access Control
- ✅ MongoDB + Mongoose ORM
- ✅ Pagination
- ✅ CORS Protection
- ✅ File upload to Cloudinary

**What To Add Next**:
1. Rate limiting (prevent abuse)
2. Helmet.js (HTTP security headers)
3. Redis caching (performance)
4. Request logging (monitoring)
5. Error tracking (Sentry/LogRocket)
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
