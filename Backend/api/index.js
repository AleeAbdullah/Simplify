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
app.use(cors());

app.use(express.json());

// Connect to database (optimized for serverless - reuses connection)
connectDB().catch(err => {
    console.error("Database connection error:", err);
});

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/flights", flightRoutes);
app.use("/api/airports", airportRouts);
app.use("/api/reviews", UserReviewsRoutes);
app.use("/api/bookedFlights", bookedFlightsRoutes);

app.use(NotFound);
app.use(errHandler);

// Export the Express app as a serverless function
module.exports = app;

