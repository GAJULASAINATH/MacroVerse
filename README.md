# MACROVERSE - AI-Powered Food Tracking & Nutrition Analysis

A modern, full-stack web application for tracking food nutrition using AI-powered image analysis. Upload photos of your meals and get instant macronutrient and micronutrient breakdowns powered by Google's Gemini AI.

## 🌟 Features

### 🔐 User Authentication
- Secure signup and login with JWT authentication
- Password encryption with bcrypt
- Persistent sessions with local storage

### 📸 AI Food Analysis
- Upload food images for instant nutrition analysis
- Powered by Google Gemini 2.5 Pro AI
- Get detailed breakdown of:
  - **Macronutrients**: Calories, Protein, Carbs, Fats
  - **Micronutrients**: Vitamins and Minerals
- Automatic logging to your daily food diary

### 📊 Monthly Health Reports
- Generate comprehensive PDF reports with:
  - Macronutrient distribution pie charts
  - Daily calorie intake line charts
  - AI-powered health insights and recommendations
  - High and low consumption analysis
- Download reports for any month

### 💳 Credit System
- Purchase credits to analyze food images
- Multiple pricing tiers available
- Track your credit balance in real-time
- 10 free credits on signup

### 🎨 Modern UI/UX
- Beautiful gradient design with glassmorphism
- Fully responsive for all devices
- Smooth animations and transitions
- Intuitive navigation

## 🛠️ Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for data persistence
- **Google Gemini AI** (2.5 Pro & Flash) for food analysis
- **JWT** for authentication
- **Multer** for image uploads
- **LaTeX** for PDF report generation

### Frontend
- **React 18** with Hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Context API** for state management

## 📁 Project Structure

```
/app
├── backend/
│   ├── controllers/
│   │   ├── analyzeFoodImage.js    # AI food analysis logic
│   │   ├── getMonthlyReport.js    # PDF report generation
│   │   ├── updateCredits.js       # Credit management
│   │   └── userAuth.js            # Authentication logic
│   ├── database/
│   │   └── connection.js          # MongoDB connection
│   ├── middlewares/
│   │   └── jwt.js                 # JWT authentication middleware
│   ├── models/
│   │   └── user.js                # User data model
│   ├── routes/
│   │   ├── userRoute.js           # Auth routes
│   │   ├── subscriptionRoute.js   # Credit routes
│   │   └── features.js            # Feature routes
│   ├── server.js                  # Express server
│   ├── package.json               # Node dependencies
│   └── .env                       # Environment variables
│
└── frontend/
    ├── public/
    │   └── index.html             # HTML template
    ├── src/
    │   ├── components/
    │   │   └── Navbar.js          # Navigation component
    │   ├── context/
    │   │   └── AuthContext.js     # Authentication context
    │   ├── pages/
    │   │   ├── Login.js           # Login page
    │   │   ├── Signup.js          # Signup page
    │   │   ├── Dashboard.js       # Main dashboard
    │   │   ├── FoodAnalysis.js    # Food upload & analysis
    │   │   ├── MonthlyReport.js   # Report generation
    │   │   └── Credits.js         # Credit management
    │   ├── App.js                 # Main app with routing
    │   ├── index.js               # React entry point
    │   └── index.css              # Global styles
    ├── package.json               # React dependencies
    ├── tailwind.config.js         # Tailwind configuration
    └── .env                       # Frontend environment

```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and yarn
- MongoDB (local or Atlas)
- Google Gemini API key
- LaTeX installation (for PDF reports)

### Installation

1. **Clone the repository**
```bash
cd /app
```

2. **Install Backend Dependencies**
```bash
cd backend
yarn install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
yarn install
```

4. **Configure Environment Variables**

Backend `.env`:
```env
MONGO_URI=mongodb://your-mongodb-connection-string
PORT=3000
SALTROUNDS=10
JWT_SECRET_TOKEN=your-jwt-secret
GEMINI_API_KEY=your-gemini-api-key
```

Frontend `.env`:
```env
REACT_APP_BACKEND_URL=http://localhost:3000
```

5. **Start the Services**
```bash
# Using supervisor (recommended)
sudo supervisorctl restart all

# Or manually
# Terminal 1 - Backend
cd backend && node server.js

# Terminal 2 - Frontend
cd frontend && yarn start
```

6. **Access the Application**
- Frontend: http://localhost:5000
- Backend API: http://localhost:3000

## 🔑 API Endpoints

### Authentication (Unprotected)
- `POST /auth/user/signup` - Create new account
- `POST /auth/user/login` - Login to account

### Features (Protected - Requires JWT)
- `POST /main-core/analyzeFoodImage` - Analyze food image (multipart/form-data)
- `POST /main-core/getMonthlyReport?month=X` - Generate monthly report PDF
- `POST /pricing/addCredits?action=add|reduce` - Manage credits

### Headers for Protected Routes
```
Authorization: Bearer <jwt-token>
```

## 📱 Usage Guide

### 1. Create Account
1. Click "Sign up" on the login page
2. Enter your email and password
3. Confirm password
4. Get 10 free credits automatically!

### 2. Analyze Food
1. Navigate to "Analyze Food"
2. Upload an image of your meal
3. Click "Analyze Food"
4. View detailed nutrition breakdown
5. Data is automatically saved to your profile

### 3. View Reports
1. Go to "Monthly Report"
2. Select a month from the dropdown
3. Click "Download PDF Report"
4. Get comprehensive analysis with charts

### 4. Manage Credits
1. Visit "Credits" page
2. View current balance
3. Choose a pricing plan
4. Purchase more credits as needed

## 🎨 Design Features

- **Gradient Background**: Beautiful purple-blue gradient
- **Glassmorphism**: Semi-transparent cards with backdrop blur
- **Responsive Design**: Works on mobile, tablet, and desktop
- **Smooth Animations**: Hover effects and transitions
- **Modern Typography**: Clean, readable fonts
- **Visual Feedback**: Loading states and error messages

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Secure HTTP-only practices
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## 🐛 Troubleshooting

### Backend not starting
```bash
# Check logs
tail -f /var/log/supervisor/backend.err.log

# Restart backend
sudo supervisorctl restart backend
```

### Frontend not loading
```bash
# Check logs
tail -f /var/log/supervisor/frontend.err.log

# Clear node_modules and reinstall
cd frontend
rm -rf node_modules
yarn install
```

### Database connection issues
- Verify MongoDB is running: `sudo supervisorctl status mongodb`
- Check MONGO_URI in backend/.env
- Ensure network connectivity to MongoDB

### Gemini API errors
- Verify GEMINI_API_KEY is set in backend/.env
- Check API quota and limits
- Ensure image format is supported (JPEG, PNG)

## 📊 Data Model

### User Schema
```javascript
{
  email: String (unique),
  password: String (hashed),
  credits: Number,
  foodLogs: {
    monthlyLogs: [{
      month: Number (0-11),
      dailyEntries: [{
        date: Date,
        calories: Number,
        protein: Number,
        carbs: Number,
        fats: Number
      }]
    }]
  }
}
```

## 🎯 Future Enhancements

- [ ] Barcode scanning for packaged foods
- [ ] Meal planning and suggestions
- [ ] Social sharing features
- [ ] Exercise tracking integration
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Recipe recommendations
- [ ] Custom macro goals

## 📄 License

This project is private and proprietary.

## 👨‍💻 Author

Built with ❤️ for MACROVERSE

## 🙏 Acknowledgments

- Google Gemini AI for nutrition analysis
- MongoDB for data storage
- React and Tailwind CSS communities
- All open-source contributors

---

**Need Help?** Contact support or check the troubleshooting section above.
