# 🚀 MACROVERSE Quick Start Guide

Welcome to MACROVERSE! This guide will get you up and running in minutes.

## ✅ Current Status

Your application is **FULLY CONFIGURED** and **RUNNING**!

- ✅ Backend Server: Running on port 3000
- ✅ Frontend App: Running on port 5000  
- ✅ MongoDB: Connected and running
- ✅ Google Gemini AI: Configured with your API key

## 🌐 Access Your Application

**Frontend URL**: http://localhost:5000
**Backend API**: http://localhost:3000

## 🎯 Test the Application

### 1. Create Your First Account
1. Open http://localhost:5000 in your browser
2. Click "Sign up"
3. Enter your email and password
4. You'll get 10 free credits to start!

### 2. Analyze Your First Food Item
1. Login with your new account
2. Click "Analyze Food" in the navigation
3. Upload a photo of any food
4. Click "Analyze Food"
5. View the detailed nutrition breakdown

### 3. Generate a Monthly Report
1. Navigate to "Monthly Report"
2. Select the current month
3. Click "Download PDF Report"
4. Open the PDF to see your nutrition summary

## 🛠️ Service Management

### Check Service Status
```bash
sudo supervisorctl status
```

### Restart Services
```bash
# Restart everything
sudo supervisorctl restart all

# Restart individual services
sudo supervisorctl restart backend
sudo supervisorctl restart frontend
```

### View Logs
```bash
# Backend logs
tail -f /var/log/supervisor/backend.out.log
tail -f /var/log/supervisor/backend.err.log

# Frontend logs
tail -f /var/log/supervisor/frontend.out.log
tail -f /var/log/supervisor/frontend.err.log

# MongoDB logs
tail -f /var/log/mongodb.out.log
```

## 📋 Environment Configuration

### Backend (.env)
Located at: `/app/backend/.env`
```env
MONGO_URI=mongodb+srv://...  # Your MongoDB connection
PORT=3000                     # Backend port
SALTROUNDS=10                # Password hash rounds
JWT_SECRET_TOKEN=MacroVerse  # JWT secret
GEMINI_API_KEY=AIzaSy...    # Your Gemini API key
```

### Frontend (.env)
Located at: `/app/frontend/.env`
```env
REACT_APP_BACKEND_URL=http://localhost:3000
```

## 🔧 Common Commands

### Install New Backend Package
```bash
cd /app/backend
yarn add package-name
```

### Install New Frontend Package
```bash
cd /app/frontend
yarn add package-name
```

### Database Access
```bash
mongosh  # Open MongoDB shell
```

## 📦 What's Included

### Pages
- ✅ Login & Signup
- ✅ Dashboard (with quick actions and stats)
- ✅ Food Analysis (image upload & AI analysis)
- ✅ Monthly Reports (PDF generation with charts)
- ✅ Credits Management (view balance & purchase)

### Features
- ✅ JWT Authentication
- ✅ Password Encryption
- ✅ Image Upload
- ✅ AI Food Recognition (Gemini 2.5 Pro)
- ✅ Nutrition Tracking
- ✅ PDF Report Generation
- ✅ Credit System
- ✅ Responsive Design
- ✅ Modern UI with Glassmorphism

## 🎨 Customization

### Change Colors
Edit `/app/frontend/tailwind.config.js` to customize the color scheme.

### Modify Backend Port
Edit `/app/backend/.env` and change `PORT=3000` to your desired port.

### Update Frontend Design
All page components are in `/app/frontend/src/pages/`

## 📱 Testing Features

### Test Account Creation
```bash
curl -X POST http://localhost:3000/auth/user/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "credits": 10
  }'
```

### Test Login
```bash
curl -X POST http://localhost:3000/auth/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

## 🐛 Troubleshooting

### Frontend won't start
```bash
cd /app/frontend
rm -rf node_modules
yarn install
sudo supervisorctl restart frontend
```

### Backend errors
```bash
# Check error logs
tail -50 /var/log/supervisor/backend.err.log

# Restart backend
sudo supervisorctl restart backend
```

### Port conflicts
```bash
# Check what's using a port
lsof -i :3000
lsof -i :5000

# Kill process if needed
kill -9 <PID>
```

## 📞 Support

For issues or questions, check:
1. Service logs in `/var/log/supervisor/`
2. README.md for detailed documentation
3. Backend API at http://localhost:3000/

## 🎉 You're All Set!

Your MACROVERSE application is ready to use. Start by creating an account and analyzing your first meal!

---

**Happy Tracking! 🍎📊**
