# AutoGuru Backend API v2.2.0

> **Modular, Production-Ready Backend for AutoGuru Projects**

A standalone Node.js/Express backend API with JWT authentication, MongoDB integration, and a clean modular architecture. Ready to use with any AutoGuru project.

---

## What's New in v2.2.0

- **Advanced Mechanic Search** - Pagination, sorting, and enhanced filtering
- **Enhanced Quote System** - Request multiple quotes and compare side-by-side
- **Improved Reviews** - Helpful votes and photo support
- **Notification System** - Complete in-app notification infrastructure
- **Enhanced Models** - Recurring bookings, service tracking, and more

**See [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) for new features**

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp env.example .env
# Edit .env with your MongoDB URI

# 3. Start the server
npm run dev
```

Server will run at `http://localhost:5000`

---

## Features

### Authentication
- User registration with email/password
- Secure login with JWT tokens (24h expiration)
- Token verification for protected routes
- Password hashing with bcrypt
- User profile management

### Booking Management
- Create service bookings
- View all user bookings
- Update booking details (status, date, time)
- Cancel/delete bookings
- User data isolation (users only see their own bookings)

### Database
- MongoDB integration with Mongoose
- User model (firstName, lastName, email, password)
- Booking model (serviceType, vehicle details, location, date, time, price, status)
- Automatic timestamps (createdAt, updatedAt)

### Security
- JWT authentication
- Password hashing (bcrypt, 10 rounds)
- Protected API routes
- Input validation & sanitization
- Global error handling
- CORS enabled

### Architecture
- **Modular structure** - Organized by feature
- **Separation of concerns** - Config, controllers, middleware, routes, utils
- **Scalable** - Easy to add new features
- **Maintainable** - Clean, documented code
- **Production-ready** - Error handling, logging, validation

---

## Project Structure

```
backend/
├── config/              # Configuration modules
│   ├── database.js      # MongoDB connection
│   └── jwt.js           # JWT utilities
├── controllers/         # Business logic
│   ├── auth.controller.js
│   └── booking.controller.js
├── middleware/          # Request processing
│   ├── auth.js          # JWT authentication
│   ├── errorHandler.js  # Error handling
│   └── validator.js     # Input validation
├── models/              # Database schemas
│   ├── User.js
│   └── Booking.js
├── routes/              # API endpoints
│   ├── auth.routes.js
│   └── booking.routes.js
├── utils/               # Helper functions
│   ├── logger.js        # Structured logging
│   └── response.js      # Response formatting
├── .env                 # Environment variables (gitignored)
├── .env.example         # Environment template
├── server.js            # Main entry point
└── package.json         # Dependencies
```

---

## API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new user | No |
| POST | `/login` | Login user | No |
| POST | `/verify` | Verify JWT token | Yes |
| GET | `/profile` | Get user profile | Yes |
| GET | `/users` | Get all users (debug) | No |

### Bookings (`/api/bookings`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create booking | Yes |
| GET | `/` | Get all user bookings | Yes |
| GET | `/:id` | Get specific booking | Yes |
| PUT | `/:id` | Update booking | Yes |
| DELETE | `/:id` | Delete booking | Yes |

---

## Usage Examples

### 1. User Signup
```javascript
POST /api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

// Response
{
  "success": true,
  "message": "User registered successfully",
  "user": { "id": "...", "firstName": "John", ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. User Login
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

// Response
{
  "success": true,
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Create Booking (Protected)
```javascript
POST /api/bookings
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "serviceType": "Oil Change",
  "vehicleMake": "Toyota",
  "vehicleModel": "Camry",
  "location": "Sydney CBD",
  "date": "2025-12-01",
  "time": "10:00 AM",
  "price": "$50",
  "notes": "Please use synthetic oil"
}

// Response
{
  "success": true,
  "message": "Booking created successfully",
  "booking": { ... }
}
```

### 4. Get All Bookings (Protected)
```javascript
GET /api/bookings
Authorization: Bearer <your-jwt-token>

// Response
{
  "success": true,
  "bookings": [
    {
      "id": "...",
      "serviceType": "Oil Change",
      "vehicleMake": "Toyota",
      "status": "Pending",
      ...
    }
  ]
}
```

---

## Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autoguru

# JWT Configuration
JWT_SECRET=your-super-secret-random-key-change-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration (optional)
# ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Required Variables
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing (use a strong random string)

### Optional Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (default: development)
- `JWT_EXPIRES_IN` - Token expiration (default: 24h)

---

## Testing

### Using Postman or Thunder Client

1. **Start the server**: `npm run dev`

2. **Test Signup**:
   - POST `http://localhost:5000/api/auth/signup`
   - Body: `{ "firstName": "Test", "lastName": "User", "email": "test@example.com", "password": "password123" }`

3. **Test Login**:
   - POST `http://localhost:5000/api/auth/login`
   - Body: `{ "email": "test@example.com", "password": "password123" }`
   - Copy the `token` from response

4. **Test Create Booking**:
   - POST `http://localhost:5000/api/bookings`
   - Headers: `Authorization: Bearer <your-token>`
   - Body: `{ "serviceType": "Oil Change", "vehicleMake": "Toyota", "vehicleModel": "Camry", "location": "Sydney", "date": "2025-12-01", "time": "10:00 AM", "price": "$50" }`

5. **Test Get Bookings**:
   - GET `http://localhost:5000/api/bookings`
   - Headers: `Authorization: Bearer <your-token>`

---

## Frontend Integration

### Example: React/Next.js

```javascript
// Signup
const signup = async (userData) => {
  const response = await fetch('http://localhost:5000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

// Create Booking
const createBooking = async (bookingData) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(bookingData)
  });
  return await response.json();
};

// Get Bookings
const getBookings = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/bookings', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};
```

---

## Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Quick setup instructions
- **[CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)** - How to customize and extend
- **[API Documentation](#api-endpoints)** - Complete API reference (this file)

---

## Deployment

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Update `MONGODB_URI` with production database
- [ ] Set `NODE_ENV=production`
- [ ] Remove debug endpoint `/api/auth/users`
- [ ] Enable HTTPS
- [ ] Configure CORS for production domains
- [ ] Set up logging service
- [ ] Configure rate limiting (optional)
- [ ] Set up monitoring (optional)

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create autoguru-backend

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

---

## Troubleshooting

### MongoDB Connection Failed
- Check your `MONGODB_URI` is correct
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify database user credentials

### JWT Token Invalid
- Check token is being sent in `Authorization: Bearer <token>` format
- Verify `JWT_SECRET` matches between signup/login and verification
- Check token hasn't expired (default 24h)

### CORS Errors
- Ensure frontend URL is allowed in CORS configuration
- Check `Access-Control-Allow-Origin` headers

---

## Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with auto-reload
npm test        # Run tests (not implemented yet)
```

---

## Contributing

This backend is designed for AutoGuru projects. To extend functionality:

1. Add new models in `models/`
2. Create controllers in `controllers/`
3. Define routes in `routes/`
4. Register routes in `server.js`

See [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md) for detailed instructions.

---

## License

ISC

---

## Support

For issues or questions:
1. Check this README for API documentation
2. Review [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)
3. Verify environment variables are correctly set
4. Check MongoDB connection is working

---

**Built with care for AutoGuru Projects** | v2.0.0


```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp env.example .env
# Edit .env with your MongoDB URI

# 3. Start the server
npm run dev
```

Server will run at `http://localhost:5000`

---

## ✨ Features

### 🔐 Authentication
- User registration with email/password
- Secure login with JWT tokens (24h expiration)
- Token verification for protected routes
- Password hashing with bcrypt
- User profile management

### 📋 Booking Management
- Create service bookings
- View all user bookings
- Update booking details (status, date, time)
- Cancel/delete bookings
- User data isolation (users only see their own bookings)

### 🗄️ Database
- MongoDB integration with Mongoose
- User model (firstName, lastName, email, password)
- Booking model (serviceType, vehicle details, location, date, time, price, status)
- Automatic timestamps (createdAt, updatedAt)

### 🛡️ Security
- JWT authentication
- Password hashing (bcrypt, 10 rounds)
- Protected API routes
- Input validation & sanitization
- Global error handling
- CORS enabled

### 🏗️ Architecture
- **Modular structure** - Organized by feature
- **Separation of concerns** - Config, controllers, middleware, routes, utils
- **Scalable** - Easy to add new features
- **Maintainable** - Clean, documented code
- **Production-ready** - Error handling, logging, validation

---

## 📁 Project Structure

```
backend/
├── config/              # Configuration modules
│   ├── database.js      # MongoDB connection
│   └── jwt.js           # JWT utilities
├── controllers/         # Business logic
│   ├── auth.controller.js
│   └── booking.controller.js
├── middleware/          # Request processing
│   ├── auth.js          # JWT authentication
│   ├── errorHandler.js  # Error handling
│   └── validator.js     # Input validation
├── models/              # Database schemas
│   ├── User.js
│   └── Booking.js
├── routes/              # API endpoints
│   ├── auth.routes.js
│   └── booking.routes.js
├── utils/               # Helper functions
│   ├── logger.js        # Structured logging
│   └── response.js      # Response formatting
├── .env                 # Environment variables (gitignored)
├── .env.example         # Environment template
├── server.js            # Main entry point
└── package.json         # Dependencies
```

---

## 🔌 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/signup` | Register new user | ❌ |
| POST | `/login` | Login user | ❌ |
| POST | `/verify` | Verify JWT token | ✅ |
| GET | `/profile` | Get user profile | ✅ |
| GET | `/users` | Get all users (debug) | ❌ |

### Bookings (`/api/bookings`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/` | Create booking | ✅ |
| GET | `/` | Get all user bookings | ✅ |
| GET | `/:id` | Get specific booking | ✅ |
| PUT | `/:id` | Update booking | ✅ |
| DELETE | `/:id` | Delete booking | ✅ |

---

## 📖 Usage Examples

### 1. User Signup
```javascript
POST /api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}

// Response
{
  "success": true,
  "message": "User registered successfully",
  "user": { "id": "...", "firstName": "John", ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. User Login
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}

// Response
{
  "success": true,
  "message": "Login successful",
  "user": { ... },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Create Booking (Protected)
```javascript
POST /api/bookings
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "serviceType": "Oil Change",
  "vehicleMake": "Toyota",
  "vehicleModel": "Camry",
  "location": "Sydney CBD",
  "date": "2025-12-01",
  "time": "10:00 AM",
  "price": "$50",
  "notes": "Please use synthetic oil"
}

// Response
{
  "success": true,
  "message": "Booking created successfully",
  "booking": { ... }
}
```

### 4. Get All Bookings (Protected)
```javascript
GET /api/bookings
Authorization: Bearer <your-jwt-token>

// Response
{
  "success": true,
  "bookings": [
    {
      "id": "...",
      "serviceType": "Oil Change",
      "vehicleMake": "Toyota",
      "status": "Pending",
      ...
    }
  ]
}
```

---

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autoguru

# JWT Configuration
JWT_SECRET=your-super-secret-random-key-change-in-production
JWT_EXPIRES_IN=24h

# CORS Configuration (optional)
# ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Required Variables
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret key for JWT signing (use a strong random string)

### Optional Variables
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment mode (default: development)
- `JWT_EXPIRES_IN` - Token expiration (default: 24h)

---

## 🧪 Testing

### Using Postman or Thunder Client

1. **Start the server**: `npm run dev`

2. **Test Signup**:
   - POST `http://localhost:5000/api/auth/signup`
   - Body: `{ "firstName": "Test", "lastName": "User", "email": "test@example.com", "password": "password123" }`

3. **Test Login**:
   - POST `http://localhost:5000/api/auth/login`
   - Body: `{ "email": "test@example.com", "password": "password123" }`
   - Copy the `token` from response

4. **Test Create Booking**:
   - POST `http://localhost:5000/api/bookings`
   - Headers: `Authorization: Bearer <your-token>`
   - Body: `{ "serviceType": "Oil Change", "vehicleMake": "Toyota", "vehicleModel": "Camry", "location": "Sydney", "date": "2025-12-01", "time": "10:00 AM", "price": "$50" }`

5. **Test Get Bookings**:
   - GET `http://localhost:5000/api/bookings`
   - Headers: `Authorization: Bearer <your-token>`

---

## 🔗 Frontend Integration

### Example: React/Next.js

```javascript
// Signup
const signup = async (userData) => {
  const response = await fetch('http://localhost:5000/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  return data;
};

// Login
const login = async (email, password) => {
  const response = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.token);
  }
  return data;
};

// Create Booking
const createBooking = async (bookingData) => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(bookingData)
  });
  return await response.json();
};

// Get Bookings
const getBookings = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch('http://localhost:5000/api/bookings', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return await response.json();
};
```

---

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Quick setup instructions
- **[CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)** - How to customize and extend
- **[API Documentation](#-api-endpoints)** - Complete API reference (this file)

---

## 🚀 Deployment

### Production Checklist

- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Update `MONGODB_URI` with production database
- [ ] Set `NODE_ENV=production`
- [ ] Remove debug endpoint `/api/auth/users`
- [ ] Enable HTTPS
- [ ] Configure CORS for production domains
- [ ] Set up logging service
- [ ] Configure rate limiting (optional)
- [ ] Set up monitoring (optional)

### Deploy to Heroku

```bash
# Login to Heroku
heroku login

# Create app
heroku create autoguru-backend

# Set environment variables
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret-key
heroku config:set NODE_ENV=production

# Deploy
git push heroku main
```

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
- Check your `MONGODB_URI` is correct
- Ensure your IP is whitelisted in MongoDB Atlas
- Verify database user credentials

### JWT Token Invalid
- Check token is being sent in `Authorization: Bearer <token>` format
- Verify `JWT_SECRET` matches between signup/login and verification
- Check token hasn't expired (default 24h)

### CORS Errors
- Ensure frontend URL is allowed in CORS configuration
- Check `Access-Control-Allow-Origin` headers

---

## 📦 Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with auto-reload
npm test        # Run tests (not implemented yet)
```

---

## 🤝 Contributing

This backend is designed for AutoGuru projects. To extend functionality:

1. Add new models in `models/`
2. Create controllers in `controllers/`
3. Define routes in `routes/`
4. Register routes in `server.js`

See [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md) for detailed instructions.

---

## 📄 License

ISC

---

## 🆘 Support

For issues or questions:
1. Check this README for API documentation
2. Review [CUSTOMIZATION_GUIDE.md](./CUSTOMIZATION_GUIDE.md)
3. Verify environment variables are correctly set
4. Check MongoDB connection is working

---

**Built with ❤️ for AutoGuru Projects** | v2.0.0
