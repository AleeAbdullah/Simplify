const AirportReview = require("../models/airportReviewData");
const asyncHandler = require("express-async-handler");

// Create a new review
const createReview = asyncHandler(async (req, res) => {
    const { airportId, userId, rating, comment } = req.body;

    if (!(airportId || userId)) {
        res.status(404);
        throw new Error("indentification data not found");
    }

    if (!(rating || comment)) {
        res.status(404);
        throw new Error("review data not found");
    }

    const review = await AirportReview.create({
        airport: airportId,
        user: userId,
        //possible error
        rating: rating,
        comment: comment
    });

    res.status(201).json(review);
});

// Get all reviews for a specific airport
const getReviewsByAirport = asyncHandler(async (req, res) => {
    const { airportId } = req.params;

    const reviews = await AirportReview.find({ airport: airportId });

    res.json(reviews);
});

// Update an existing review
const updateReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    const review = await AirportReview.findById(reviewId);

    if (!review) {
        res.status(404);
        throw new Error("Review not found");
    }

    review.rating = rating;
    review.comment = comment;

    await review.save();

    res.json(review);
});



module.exports = { createReview, getReviewsByAirport, updateReview };
