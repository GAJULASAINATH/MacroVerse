const mongoose = require("mongoose");
const { usersDB } = require("../database/connection");

// User Schema
const usersSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  credits: { type: Number, required: false },
  foodLogs: {
    monthlyLogs: [
      {
        month: { type: Number, required: true, min: 0, max: 11 }, // 0 = January, 11 = December
        dailyEntries: [
          {
            date: { type: Date, required: true },
            calories: { type: Number, default: 0 },
            protein: { type: Number, default: 0 },
            carbs: { type: Number, default: 0 },
            fats: { type: Number, default: 0 }
          }
        ]
      }
    ]
  }
});

module.exports = usersDB.model("users", usersSchema);