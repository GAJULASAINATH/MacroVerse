const { GoogleGenerativeAI } = require('@google/generative-ai');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Initialize Gemini API with your API key (store in .env)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Controller to analyze food image
const analyzeFoodImage = async (req, res) => {
  try {
    // Check if image is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    // Extract and verify JWT from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token missing or invalid!' });
    }
    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);
      console.log('Decoded JWT:', decoded);
    } catch (error) {
      return res.status(403).json({ error: 'Invalid or expired token!', details: error.message });
    }

    // Use Gemini 2.5 Pro model (free tier, supports images)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro' });

    // Define prompt for nutrient analysis
    const prompt = `
      Analyze the food in this image and estimate its macro and micro nutrients.
      Return a JSON object with the following structure:
      {
        "macros": {
          "calories": number,
          "protein": number,
          "carbs": number,
          "fats": number
        },
        "micros": {
          "vitaminA": "string",
          "vitaminC": "string",
          "iron": "string",
          "calcium": "string"
        }
      }
    `;

    // Send image and prompt to Gemini API
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: req.file.buffer.toString('base64'),
          mimeType: req.file.mimetype, // e.g., 'image/jpeg'
        },
      },
    ]);

    // Parse the response
    const response = await result.response;
    let jsonOutput;
    try {
      // Extract JSON from response (Gemini wraps JSON in markdown, so clean it)
      const text = response.text().replace(/```json\n|```/g, '');
      jsonOutput = JSON.parse(text);
      console.log('Parsed nutrient data:', jsonOutput);
    } catch (parseError) {
      return res.status(500).json({ error: 'Failed to parse Gemini response', details: parseError.message });
    }

    // Update user foodLogs using userId
    const User = require('../models/user.js'); // Adjust path as needed
    if (!decoded || !decoded.userId) {
      console.log('Decoded token issue - decoded:', decoded);
      return res.status(401).json({ error: 'Token does not contain userId' });
    }
    const userId = decoded.userId;
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found for userId:', userId);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log('User before update:', user.foodLogs);

    // Get current date
    const now = new Date();
    const currentMonth = now.getMonth(); // 8 for September 2025
    const currentDate = now.toISOString().split('T')[0]; // 2025-09-26
    console.log('Current date:', currentDate, 'Current month:', currentMonth);

    // Find or create the month entry
    let monthLog = user.foodLogs.monthlyLogs.find(log => log.month === currentMonth);
    if (!monthLog) {
      console.log('Creating new month entry for month:', currentMonth);
      monthLog = { month: currentMonth, dailyEntries: [] };
      user.foodLogs.monthlyLogs.push(monthLog);
    } else {
      console.log('Found existing month entry for month:', currentMonth);
    }

    // Check if entry for today exists, update or create
    let dailyEntry = monthLog.dailyEntries.find(entry => {
      return entry.date.toISOString().split('T')[0] === currentDate;
    });
    if (!dailyEntry) {
      console.log('Creating new daily entry for date:', currentDate);
      dailyEntry = {
        date: now,
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0
      };
      monthLog.dailyEntries.push(dailyEntry);
    } else {
      console.log('Updating existing daily entry for date:', currentDate);
    }

    // Update with new data
    dailyEntry.calories += jsonOutput.macros.calories || 0;
    dailyEntry.protein += jsonOutput.macros.protein || 0;
    dailyEntry.carbs += jsonOutput.macros.carbs || 0;
    dailyEntry.fats += jsonOutput.macros.fats || 0;
    console.log('Updated daily entry:', dailyEntry);

    const saveResult = await user.save({ validateBeforeSave: true });
    console.log('Save result:', saveResult.foodLogs.monthlyLogs);

    // Return the nutrient data
    res.status(200).json(jsonOutput);
  } catch (error) {
    console.error('Error in analyzeFoodImage:', error);
    res.status(500).json({
      error: 'Failed to analyze food image',
      details: error.message,
    });
  }
};

module.exports = { analyzeFoodImage };