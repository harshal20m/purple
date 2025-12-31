# Mini User Management System

A production-ready full-stack user management system with authentication, role-based access control (RBAC), and comprehensive security features.

## 🚀 Features

### Authentication & Authorization

- ✅ JWT-based authentication
- ✅ Secure password hashing with bcrypt (12 salt rounds)
- ✅ Role-based access control (Admin & User roles)
- ✅ Protected routes and API endpoints
- ✅ Automatic token refresh handling

### User Management

- ✅ User registration and login
- ✅ Profile management (update name, email)
- ✅ Password change functionality
- ✅ Account activation/deactivation

### Admin Features

- ✅ User listing with pagination (10 users per page)
- ✅ Activate/deactivate user accounts
- ✅ User search functionality (debounced)
- ✅ Real-time user statistics

### Security

- ✅ Rate limiting (100 requests/15min globally, 5/15min for auth)
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Security headers with Helmet
- ✅ Environment variable protection

### UI/UX

- ✅ Responsive design (mobile-first)
- ✅ Toast notifications
- ✅ Loading states and spinners
- ✅ Confirmation modals
- ✅ Client-side form validation
- ✅ Debounced search inputs
- ✅ Clean, modern interface with Tailwind CSS v4

---

## 🛠️ Tech Stack

### Backend

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Validation:** Joi
- **Security:** helmet, cors, express-rate-limit
- **Testing:** Jest
- **Logging:** Morgan

### Frontend

- **Framework:** React 18 (Hooks)
- **Routing:** React Router v6
- **State Management:** Context API
- **Styling:** Tailwind CSS v4
- **HTTP Client:** Axios
- **Build Tool:** Vite
- **Utilities:** lodash (debouncing)

---

## 📁 Project Structure

### Backend Structure

```
backend/
├── src/
│   ├── controllers/        # Request handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── adminController.js
│   ├── models/            # Mongoose schemas
│   │   └── User.js
│   ├── routes/            # API routes
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── adminRoutes.js
│   │   └── healthRoutes.js
│   ├── services/          # Business logic
│   │   ├── authService.js
│   │   ├── userService.js
│   │   └──  adminService.js
│   ├── middlewares/       # Custom middleware
│   │   ├── auth.js
│   │   ├── validate.js
│   │   └── errorHandler.js
│   ├── validators/        # Input validation schemas
│   │   └── schemas.js
│   ├── utils/            # Utility functions
│   │   ├── jwt.js
│   │   └── response.js
│   ├── config/           # Configuration
│   │   └── database.js
│   ├── app.js           # Express app setup
│   └── server.js        # Server entry point
├── __tests__/           # Jest tests
│   └── auth.test.js
├── .env.example
├── package.json
└── jest.config.js
```

### Frontend Structure

```
frontend/
├── src/
│   ├── api/                # API client & services
│   │   ├── client.js
│   │   └── services.js
│   ├── components/         # Reusable components
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── Navbar.jsx
│   │   ├── Pagination.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/           # React Context
│   │   ├── AuthContext.jsx
│   │   └── ToastContext.jsx
│   ├── hooks/             # Custom hooks
│   │   └── useDebounce.js
│   ├── pages/             # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Profile.jsx
│   │   └── AdminDashboard.jsx
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Tailwind styles
├── index.html
├── .env.example
├── package.json
└── vite.config.js
```

---

## 🏗️ Architecture & Design Decisions

### Clean Architecture Principles

#### 1. **Separation of Concerns**

- **Controllers:** Handle HTTP requests/responses
- **Services:** Contain business logic
- **Models:** Define data structure and validation
- **Middleware:** Handle cross-cutting concerns
- **Routes:** Define API endpoints

#### 2. **Layered Architecture**

```
Routes → Middleware → Controllers → Services → Models → Database
```

#### 3. **Dependency Flow**

- Routes depend on controllers
- Controllers depend on services
- Services depend on models
- No circular dependencies

### Security Architecture

#### 1. **Authentication Flow**

```
User → Login → Verify Credentials → Generate JWT → Client stores token
User → Request → Attach token → Verify JWT → Allow access
```

#### 2. **Password Security**

- Passwords hashed with bcrypt (12 rounds)
- Never stored or logged in plain text
- Password complexity requirements enforced
- Old password verification for changes

#### 3. **Token Management**

- JWT tokens with 7-day expiration
- Tokens include user ID, email, and role
- Automatic token verification on protected routes
- Token stored in localStorage (client-side)

#### 4. **Rate Limiting Strategy**

- **Global:** 100 requests per 15 minutes
- **Auth routes:** 5 requests per 15 minutes
- Prevents brute force attacks
- IP-based limiting

#### 5. **Input Validation**

- **Client-side:** Immediate feedback
- **Server-side:** Joi validation schemas
- **Sanitization:** Remove malicious input
- **Type checking:** Ensure correct data types

### Database Design

#### User Schema

```javascript
{
  email: String (unique, lowercase, validated),
  password: String (hashed, min 8 chars, not selected by default),
  fullName: String (2-100 chars),
  role: Enum ['admin', 'user'] (default: 'user'),
  status: Enum ['active', 'inactive'] (default: 'active'),
  lastLogin: Date (nullable),
  createdAt: Date (auto-generated),
  updatedAt: Date (auto-generated)
}
```

#### Indexes

- `email`: Unique index for fast lookups
- `role + status`: Compound index for admin queries

### Frontend Architecture

#### 1. **State Management**

- **Context API** for global state (auth, toast)
- **Local state** for component-specific data
- **localStorage** for persistence

#### 2. **Component Hierarchy**

```
App
├── AuthProvider
│   ├── ToastProvider
│   │   ├── Navbar
│   │   └── Routes
│   │       ├── Public (Home, Login, Signup)
│   │       └── Protected (Profile, AdminDashboard)
```

#### 3. **Protected Routes**

- HOC pattern with `ProtectedRoute` component
- Checks authentication status
- Redirects unauthenticated users
- Admin routes check role

#### 4. **API Integration**

- Centralized Axios client with interceptors
- Automatic token attachment
- Global error handling
- Request/response transformation

#### 5. **Performance Optimizations**

- Debounced search inputs (500ms)
- Pagination for large datasets
- Lazy loading of routes (optional)
- Memoization of expensive computations

### Error Handling Strategy

#### Backend

```javascript
// Standardized error format
{
  success: false,
  message: "Error description",
  errors: [
    { field: "email", message: "Field-specific error" }
  ]
}
```

#### Frontend

- Toast notifications for user feedback
- Field-specific error messages
- Loading states during async operations
- Graceful fallbacks for failed requests

### Testing Strategy

#### Unit Tests (Backend)

- Password hashing/verification
- JWT generation/validation
- Role-based middleware
- User activation/deactivation
- Authentication service methods

#### Integration Tests

- Full authentication flow
- End-to-end user operations

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+ and npm
- MongoDB (local or Atlas)
- Git

### Backend Setup

1. **Clone and install:**

   ```bash
   git clone <repository-url>
   cd user-management-system/backend
   npm install
   ```

2. **Configure environment:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/user-management
   JWT_SECRET=your-super-secret-key-min-32-chars
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

3. **Start MongoDB:**

   ```bash
   # If using local MongoDB
   mongod
   ```

4. **Run the server:**

   ```bash
   # Development mode with nodemon
   npm run dev

   # Production mode
   npm start
   ```

5. **Run tests:**
   ```bash
   npm test
   ```

### Frontend Setup

1. **Navigate and install:**

   ```bash
   cd frontend
   npm install
   ```

2. **Configure environment:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env`:

   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm run preview
   ```

### Create Admin User

After starting the backend, create an admin user:

1. Sign up through the frontend
2. Connect to MongoDB:

   ```bash
   mongosh user-management
   ```

3. Update user role:
   ```javascript
   db.users.updateOne(
     { email: "your-email@example.com" },
     { $set: { role: "admin" } }
   );
   ```

---

## 📝 API Documentation

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

### Quick Reference

**Health Check:**

- `GET /health` - Simple health check
- `GET /ping` - Minimal ping
- `GET /api/health` - Detailed health with system info
- `GET /api/health/ready` - Readiness probe
- `GET /api/health/live` - Liveness probe

**Authentication:**

- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

**User:**

- `GET /api/users/profile` - Get profile
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/change-password` - Change password

**Admin:**

- `GET /api/admin/users` - List all users
- `GET /api/admin/users/:id` - Get user by ID
- `PATCH /api/admin/users/:id/activate` - Activate user
- `PATCH /api/admin/users/:id/deactivate` - Deactivate user

---

## 🚢 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

**Backend (Render):**

```bash
# Connect GitHub repo to Render
# Set environment variables
# Deploy automatically
```

**Frontend (netlify):**

```bash
cd frontend
vercel --prod
```

---

## 🧪 Testing

### Run Backend Tests

```bash
cd backend
npm test
```

### Test Coverage

```bash
npm test -- --coverage
```

### Manual Testing

1. Sign up a new user
2. Log in
3. Update profile
4. Change password
5. Log in as admin
6. View users list
7. Activate/deactivate users

---

## 🔒 Security Considerations

### What's Implemented

✅ Password hashing with bcrypt
✅ JWT authentication
✅ Rate limiting
✅ Input validation and sanitization
✅ CORS configuration
✅ Security headers
✅ Environment variable protection

### Best Practices

- Never commit `.env` files
- Use strong JWT secrets (min 32 chars)
- Rotate secrets periodically
- Enable HTTPS in production
- Monitor for suspicious activity
- Keep dependencies updated

---

## 📊 Performance

### Backend

- Indexed database queries
- Efficient pagination
- Mongoose lean queries where appropriate
- Rate limiting prevents abuse

### Frontend

- Debounced search (500ms)
- Pagination for large datasets
- Optimized bundle size with Vite
- Lazy loading of routes

---

## 🐛 Troubleshooting

### Backend won't start

```bash
# Check MongoDB is running
mongosh

# Check environment variables
cat .env

# Check logs
npm run dev
```

### Frontend can't connect

- Verify `VITE_API_BASE_URL` in `.env`
- Check backend is running on correct port
- Verify CORS settings allow frontend URL

### JWT token issues

- Check `JWT_SECRET` is set
- Verify token in localStorage
- Check token hasn't expired

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📄 License

MIT License - feel free to use this project for learning or production.

---

## 🙏 Acknowledgments

- Express.js community
- React team
- MongoDB team
- Tailwind CSS team
- All open-source contributors

---

## 📮 Support

For issues and questions:

- Create an issue on GitHub
- Check existing documentation
- Review API documentation

---

## 🎯 Future Enhancements

- [ ] Email verification
- [ ] Password reset via email
- [ ] Two-factor authentication
- [ ] OAuth integration (Google, GitHub)
- [ ] User activity logs
- [ ] Advanced role permissions
- [ ] File upload for profile pictures
- [ ] Real-time notifications
- [ ] Advanced search and filters
- [ ] Export user data (CSV/PDF)
