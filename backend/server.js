// ALL PACKAGES
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
require('dotenv').config();

// FILE IMPORTS
const { connectDB } = require("./database/connection");
const jwtAuthenticator = require("./middlewares/jwt");
const isSubscribed = require("./middlewares/isSubscribed");

// ROUTES
const usersRoute = require("./routes/userRoute");
const subscriptionRoute = require("./routes/subscriptionRoute");
const fearuresRoute = require("./routes/features");

// MAIN APP
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// MULTER SETUP
const upload = multer({ storage: multer.memoryStorage() }); // Configure Multer for image uploads

// PORT AVAILABILITY
const PORT = process.env.PORT || 5000;

// SERVER SETUP AND DATABASE CONNECTION
const serverAndDatabaseConnection = async () => {
  try {
    await connectDB();

    // UNPROTECTED ROUTES
    app.use("/auth/user", usersRoute);

    // PROTECTED ROUTES
    app.use('/pricing', jwtAuthenticator, subscriptionRoute);
    // app.use('/features', jwtAuthenticator, fearuresRoute);

    // FOOD ANALYSIS ROUTE (Protected with JWT)
    app.use('/main-core', jwtAuthenticator, upload.single('image'), fearuresRoute);

    // HOSTING
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(`Database Error: ${error.message}`);
    process.exit(1);
  } finally {
    console.log("Server initialization attempted.");
  }
};

// VISIT CODE
app.get("/", (req, res) => {
  res.send("MACROVERSE-BACKEND");
});

// MAIN APP CALL
serverAndDatabaseConnection();