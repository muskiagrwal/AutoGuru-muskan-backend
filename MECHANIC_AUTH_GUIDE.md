# Mechanic Authentication - Quick Start Guide

## 🚀 Setup Instructions

### 1. Configure Environment

Create a `.env` file in the project root:

```env
# Server
PORT=5000

# MongoDB - REQUIRED
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/autoguru

# JWT - REQUIRED
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=24h

# Email (Optional for now)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password
FROM_NAME=AutoGuru

# Cloudinary (Optional)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Server

```bash
npm start
```

Server will run on `http://localhost:5000`

---

## 📡 API Endpoints

### Mechanic Signup

**POST** `/api/auth/mechanic/signup`

**Required Fields**:
- `firstName` - Mechanic's first name
- `lastName` - Mechanic's last name
- `email` - Valid email address
- `password` - Minimum 6 characters
- `businessName` - Business/shop name
- `phone` - Contact phone number

**Optional Fields**:
- `address` - Object with street, suburb, state, postcode, country
- `servicesOffered` - Array of service types
- `abn` - Australian Business Number
- `description` - Business description
- `operatingHours` - Object with day/time schedules
- `priceRange` - 'budget', 'standard', or 'premium'

**Example Request**:
```bash
curl -X POST http://localhost:5000/api/auth/mechanic/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "password123",
    "businessName": "John'\''s Auto Repair",
    "phone": "+61412345678",
    "servicesOffered": ["Logbook Service", "Brake Repairs"],
    "priceRange": "standard"
  }'
```

---

### Mechanic Login

**POST** `/api/auth/mechanic/login`

**Required Fields**:
- `email` - Mechanic's email
- `password` - Account password

**Example Request**:
```bash
curl -X POST http://localhost:5000/api/auth/mechanic/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

---

## 🧪 Testing

### Run Automated Tests

```bash
node test_mechanic_auth.js
```

This will test:
- ✓ Mechanic signup
- ✓ Mechanic login
- ✓ Invalid credentials
- ✓ Duplicate prevention

### Manual Testing with Postman

1. **Import Collection**: Create new requests for signup and login
2. **Test Signup**: Send POST to `/api/auth/mechanic/signup` with required fields
3. **Copy Token**: Save the JWT token from response
4. **Test Login**: Send POST to `/api/auth/mechanic/login`
5. **Use Token**: Add token to Authorization header for protected routes

---

## 🔐 Using JWT Token

After signup or login, you'll receive a JWT token. Use it for authenticated requests:

**Header Format**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example Protected Request**:
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📊 Response Formats

### Successful Signup Response
```json
{
  "success": true,
  "message": "Mechanic registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "mechanic",
    "createdAt": "2025-12-05T06:44:46.000Z"
  },
  "mechanic": {
    "id": "507f1f77bcf86cd799439012",
    "businessName": "John's Auto Repair",
    "phone": "+61412345678",
    "status": "pending",
    "isVerified": false
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Successful Login Response
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "mechanic",
    "createdAt": "2025-12-05T06:44:46.000Z"
  },
  "mechanic": {
    "id": "507f1f77bcf86cd799439012",
    "businessName": "John's Auto Repair",
    "phone": "+61412345678",
    "status": "pending",
    "isVerified": false,
    "rating": {
      "average": 0,
      "count": 0
    },
    "servicesOffered": ["Logbook Service", "Brake Repairs"]
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Error Response
```json
{
  "success": false,
  "message": "An account with this email already exists"
}
```

---

## ❌ Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 400 | Missing required fields | Check all required fields are provided |
| 400 | Email already exists | Use different email or login instead |
| 400 | Password too short | Use minimum 6 characters |
| 401 | Invalid email or password | Check credentials |
| 401 | Not a mechanic account | Use regular login endpoint |
| 500 | Database error | Check MongoDB connection |

---

## 🔄 Workflow

### New Mechanic Registration
1. Mechanic fills signup form
2. POST to `/api/auth/mechanic/signup`
3. System creates User (role='mechanic') + Mechanic profile
4. Status set to 'pending', isVerified=false
5. Returns JWT token
6. Admin approves mechanic (separate workflow)
7. Status changes to 'approved', isVerified=true

### Returning Mechanic Login
1. Mechanic enters email/password
2. POST to `/api/auth/mechanic/login`
3. System validates credentials and role
4. Returns user + mechanic profile data
5. Returns JWT token for session

---

## 📝 Database Structure

### Users Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  password: String (hashed),
  role: 'mechanic',
  createdAt: Date,
  updatedAt: Date
}
```

### Mechanics Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  businessName: String,
  phone: String,
  address: {
    street: String,
    suburb: String,
    state: String,
    postcode: String,
    country: String
  },
  servicesOffered: [String],
  status: 'pending' | 'approved' | 'rejected',
  isVerified: Boolean,
  rating: {
    average: Number,
    count: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🎯 Next Steps

1. **Test the endpoints** using the test script or Postman
2. **Integrate with frontend** - Create signup/login forms
3. **Implement admin approval** - Add admin dashboard for mechanic verification
4. **Add profile updates** - Allow mechanics to edit their profiles
5. **Add photo upload** - Integrate with Cloudinary for business photos

---

## 💡 Tips

- **Token Storage**: Store JWT in localStorage or httpOnly cookies
- **Token Refresh**: Implement refresh token logic for better security
- **Role Checking**: Use role='mechanic' for authorization in protected routes
- **Status Checking**: Check mechanic.status before allowing certain actions
- **Error Handling**: Always handle errors gracefully in frontend

---

## 📞 Support

For issues or questions:
1. Check the [walkthrough.md](file:///C:/Users/user/.gemini/antigravity/brain/4d139de7-d2de-432d-8fc8-a19907ee3565/walkthrough.md) for detailed documentation
2. Review error messages in server logs
3. Verify MongoDB connection
4. Check environment variables are set correctly
