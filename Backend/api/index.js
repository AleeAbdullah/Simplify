const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const connectDB = require("../config/db");
const userRoutes = require("../routes/userRoutes");
const flightRoutes = require("../routes/flightRoutes");
const airportRouts = require("../routes/airportRoutes");
const UserReviewsRoutes = require("../routes/UserReviewsRoutes");
const bookedFlightsRoutes = require("../routes/bookedFlightsRoutes");
const { NotFound, errHandler } = require("../middlewares/errorMiddleware");

const app = express();

var cors = require('cors');
// Configure CORS to allow requests from frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin) return callback(null, true);
    
    // Allow all origins for now - you can restrict this in production
    // Example: ['http://localhost:3000', 'https://your-frontend-domain.com']
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

app.use(express.json());

// Middleware to ensure database is connected before handling requests
const ensureDBConnection = async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error("Database connection error:", error);
        res.status(500).json({ 
            message: "Database connection failed", 
            error: error.message 
        });
    }
};

// Connect to database on startup (optimized for serverless - reuses connection)
connectDB().catch(err => {
    console.error("Initial database connection error:", err);
});

app.get("/", (req, res) => {
    res.send("API is running...");
});

// Apply database connection middleware to all API routes
app.use("/api", ensureDBConnection);

app.use("/api/users", userRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/airports", airportRouts);
app.use("/api/reviews", UserReviewsRoutes);
app.use("/api/bookedFlights", bookedFlightsRoutes);

app.use(NotFound);
app.use(errHandler);

// Export the Express app as a serverless function
module.exports = app;

