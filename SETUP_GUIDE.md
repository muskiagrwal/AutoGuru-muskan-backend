# AutoGuru Backend - Quick Setup Guide

## 🎯 Your Backend is Already Created!

Good news! Your backend project is already well-structured and ready to use. It's located at:
```
c:/Users/ashut/Downloads/AutoGuru-muskan-dev (1)/backend/
```

## 🚀 Quick Setup (3 Steps)

### Option A: Automated Setup (Recommended)

1. **Run the setup script:**
   ```bash
   cd "c:/Users/ashut/Downloads/AutoGuru-muskan-dev (1)/backend"
   setup.bat
   ```

2. **Edit the `.env` file** with your MongoDB credentials:
   - Open `backend/.env` in a text editor
   - Replace the MongoDB URI with your actual connection string
   - Change the JWT_SECRET to a strong random string

3. **Start the server:**
   ```bash
   npm run dev
   ```

### Option B: Manual Setup

1. **Create .env file:**
   ```bash
   cd "c:/Users/ashut/Downloads/AutoGuru-muskan-dev (1)/backend"
   copy env.example .env
   ```

2. **Edit .env file** with your values:
   ```env
   MONGODB_URI=mongodb+srv://muskan:muskan@2002@autoguru.3du9w43.mongodb.net/autoguru
   JWT_SECRET=your-super-secret-random-key-here
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```

## ✅ What You Have

Your backend includes:

### Authentication APIs
- User signup with password hashing
- User login with JWT tokens
- Token verification
- User profile management

### Booking APIs
- Create bookings
- View all user bookings
- Update bookings
- Delete bookings

### Security Features
- JWT authentication
- Password hashing (bcrypt)
- Protected routes
- User data isolation

## 📚 Documentation

For complete API documentation, see:
- `backend/README.md` - Full API reference
- `backend_overview.md` - Project overview and setup guide

## 🔗 Frontend Integration

Your frontend (`AutoGuru-muskan-dev/`) is already configured to work with this backend:
- Frontend uses `utils/auth.ts` for authentication
- API calls should point to `http://localhost:5000`

## 🎉 You're All Set!

Once you complete the setup steps above, your backend will be running and ready to handle requests from your AutoGuru frontend application.
