require('dotenv').config();
const connectDB = require('../config/db');
const { Flight, SeatGroup, BookedSeat } = require('../models/flightData');
const mongoose = require("mongoose");

async function verifyData() {
    try {
        console.log('Connecting to MongoDB...');
        await connectDB();
        console.log('Connected to MongoDB successfully!\n');

        // Count documents
        const flightCount = await Flight.countDocuments();
        const seatGroupCount = await SeatGroup.countDocuments();
        const bookedSeatCount = await BookedSeat.countDocuments();

        console.log('📊 Database Statistics:');
        console.log(`   Flights: ${flightCount}`);
        console.log(`   Seat Groups: ${seatGroupCount}`);
        console.log(`   Booked Seats: ${bookedSeatCount}\n`);

        // Get sample flights
        const flights = await Flight.find().limit(5).populate('SeatGroups').populate('BookedSeats');
        
        console.log('✈️  Sample Flights:');
        flights.forEach((flight, index) => {
            console.log(`\n${index + 1}. ${flight.FlightID}`);
            console.log(`   Route: ${flight.DepartureCity} → ${flight.DestinationCity}`);
            console.log(`   Date: ${flight.Date.toLocaleDateString()}`);
            console.log(`   Time: ${flight.DepartureTime}`);
            console.log(`   Type: ${flight.FlightType}`);
            console.log(`   Status: ${flight.Status}`);
            console.log(`   Seat Groups: ${flight.SeatGroups.length}`);
            console.log(`   Booked Seats: ${flight.BookedSeats.length}`);
        });

    } catch (error) {
        console.error('❌ Error verifying data:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('\nDatabase connection closed.');
        process.exit(0);
    }
}

verifyData().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});

