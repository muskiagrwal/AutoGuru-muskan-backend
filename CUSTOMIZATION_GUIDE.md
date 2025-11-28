# AutoGuru Backend - Customization Guide

## Overview

This backend is a modular, standalone API server that can be used with any AutoGuru project or adapted for other applications. It provides complete authentication and booking management functionality.

---

## What This Backend Can Do

### ✅ Authentication Features
- **User Signup**: Register new users with email/password
- **User Login**: Authenticate users and issue JWT tokens
- **Token Verification**: Validate JWT tokens
- **User Profile**: Retrieve authenticated user information
- **Password Security**: Bcrypt hashing for all passwords
- **JWT Authentication**: Secure token-based authentication

### ✅ Booking Management
- **Create Bookings**: Store service bookings with vehicle details
- **View Bookings**: Retrieve all bookings for authenticated user
- **Update Bookings**: Modify booking status, date, time, notes
- **Delete Bookings**: Cancel/remove bookings
- **User Isolation**: Users can only access their own bookings

### ✅ Data Storage
- **MongoDB Integration**: All data stored in MongoDB
- **User Model**: Stores user accounts (firstName, lastName, email, password)
- **Booking Model**: Stores bookings (serviceType, vehicleMake, vehicleModel, location, date, time, price, notes, status)
- **Automatic Timestamps**: createdAt and updatedAt for all records

### ✅ Security Features
- **JWT Tokens**: 24-hour expiration (configurable)
- **Password Hashing**: Bcrypt with salt rounds
- **Protected Routes**: Middleware authentication
- **CORS Enabled**: Cross-origin requests allowed
- **Input Validation**: Request validation middleware
- **Error Handling**: Centralized error responses

---

## Project Structure

```
backend/
├── config/
│   ├── database.js          # MongoDB connection
│   └── jwt.js               # JWT utilities
├── controllers/
│   ├── auth.controller.js   # Authentication logic
│   └── booking.controller.js # Booking logic
├── middleware/
│   ├── auth.js              # JWT authentication
│   ├── errorHandler.js      # Error handling
│   └── validator.js         # Input validation
├── models/
│   ├── User.js              # User schema
│   └── Booking.js           # Booking schema
├── routes/
│   ├── auth.routes.js       # Auth endpoints
│   └── booking.routes.js    # Booking endpoints
├── utils/
│   ├── logger.js            # Logging utility
│   └── response.js          # Response helpers
├── .env                     # Environment variables
├── server.js                # Main entry point
└── package.json             # Dependencies
```

---

## How to Use with AutoGuru Frontend

### 1. Start the Backend
```bash
cd backend
npm install
npm run dev
```

### 2. Configure Frontend to Use This Backend

In your AutoGuru frontend, make API calls to:
- **Base URL**: `http://localhost:5000`
- **Auth Endpoints**: `http://localhost:5000/api/auth/*`
- **Booking Endpoints**: `http://localhost:5000/api/bookings/*`

### 3. Example Frontend Integration

**Signup:**
```javascript
const response = await fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});
const data = await response.json();
// Store data.token in localStorage
```

**Login:**
```javascript
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});
const data = await response.json();
// Store data.token in localStorage
```

**Create Booking (requires authentication):**
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    serviceType: 'Oil Change',
    vehicleMake: 'Toyota',
    vehicleModel: 'Camry',
    location: 'Sydney',
    date: '2025-12-01',
    time: '10:00 AM',
    price: '$50',
    notes: 'Please use synthetic oil'
  })
});
const data = await response.json();
```

**Get All Bookings:**
```javascript
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:5000/api/bookings', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
const data = await response.json();
// data.bookings contains array of user's bookings
```

---

## Adding New Features

### Add a New Model

1. Create model file in `models/` directory:
```javascript
// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
```

### Add a New Controller

2. Create controller in `controllers/` directory:
```javascript
// controllers/contact.controller.js
const Contact = require('../models/Contact');

const createContact = async (req, res) => {
    const { name, email, message } = req.body;
    
    try {
        const contact = new Contact({ name, email, message });
        await contact.save();
        
        res.status(201).json({
            success: true,
            message: 'Contact saved successfully',
            contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error saving contact'
        });
    }
};

module.exports = { createContact };
```

### Add New Routes

3. Create routes in `routes/` directory:
```javascript
// routes/contact.routes.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

router.post('/', contactController.createContact);

module.exports = router;
```

4. Register routes in `server.js`:
```javascript
const contactRoutes = require('./routes/contact.routes');
app.use('/api/contact', contactRoutes);
```

---

## Environment Variables

Configure these in your `.env` file:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autoguru

# JWT
JWT_SECRET=your-super-secret-random-key
JWT_EXPIRES_IN=24h

# CORS (optional)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

---

## API Endpoints Summary

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify` - Verify JWT token (protected)
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/auth/users` - Get all users (debug only)

### Bookings
- `POST /api/bookings` - Create booking (protected)
- `GET /api/bookings` - Get all user bookings (protected)
- `GET /api/bookings/:id` - Get specific booking (protected)
- `PUT /api/bookings/:id` - Update booking (protected)
- `DELETE /api/bookings/:id` - Delete booking (protected)

---

## Testing the Backend

### Using Postman or Thunder Client

1. **Test Signup**:
   - POST `http://localhost:5000/api/auth/signup`
   - Body: `{ "firstName": "Test", "lastName": "User", "email": "test@example.com", "password": "password123" }`

2. **Test Login**:
   - POST `http://localhost:5000/api/auth/login`
   - Body: `{ "email": "test@example.com", "password": "password123" }`
   - Copy the `token` from response

3. **Test Create Booking**:
   - POST `http://localhost:5000/api/bookings`
   - Headers: `Authorization: Bearer <your-token>`
   - Body: `{ "serviceType": "Oil Change", "vehicleMake": "Toyota", "vehicleModel": "Camry", "location": "Sydney", "date": "2025-12-01", "time": "10:00 AM", "price": "$50" }`

4. **Test Get Bookings**:
   - GET `http://localhost:5000/api/bookings`
   - Headers: `Authorization: Bearer <your-token>`

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
- [ ] Configure rate limiting
- [ ] Set up monitoring

---

## Common Issues

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

## Support

For issues or questions:
1. Check the main `README.md` for API documentation
2. Review the code comments in each module
3. Check environment variables are correctly set
4. Verify MongoDB connection is working

---

**Your backend is now ready to use with any AutoGuru project!** 🚀
