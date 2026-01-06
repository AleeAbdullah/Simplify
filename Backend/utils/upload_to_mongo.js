require('dotenv').config();
const fs = require('fs');
const csv = require('csv-parser');
const { Flight, BookedSeat, SeatGroup } = require('../models/flightData');
const connectDB = require('../config/db');
const mongoose = require("mongoose");

// Function to upload data from CSV to MongoDB
async function uploadToMongo() {
    try {
        // Connect to database
        console.log('Connecting to MongoDB...');
        await connectDB();
        console.log('Connected to MongoDB successfully!');

        // Clear existing data (optional - comment out if you want to keep existing data)
        // await Flight.deleteMany({});
        // await SeatGroup.deleteMany({});
        // await BookedSeat.deleteMany({});
        // console.log('Cleared existing flight data');

        const flights = [];
        const csvPath = __dirname + '/../data/flight_schedule.csv';

        if (!fs.existsSync(csvPath)) {
            throw new Error(`CSV file not found at: ${csvPath}`);
        }

        console.log('Reading CSV file...');

        // Read and process CSV file
        const rows = [];

        // First, read all rows into memory
        await new Promise((resolve, reject) => {
            fs.createReadStream(csvPath)
                .pipe(csv())
                .on('data', (row) => {
                    rows.push(row);
                })
                .on('end', () => {
                    resolve();
                })
                .on('error', (error) => {
                    console.error('Error reading CSV file:', error);
                    reject(error);
                });
        });

        console.log(`Found ${rows.length} rows to process...\n`);

        // Process each row sequentially
        for (const row of rows) {
            try {
                // Clean and parse JSON strings from CSV
                let seatGroupsStr = String(row.SeatGroups || '').trim();
                let bookedSeatsStr = String(row.BookedSeats || '').trim();

                // Remove leading/trailing quotes and spaces
                seatGroupsStr = seatGroupsStr.replace(/^["\s]+|["\s]+$/g, '');
                bookedSeatsStr = bookedSeatsStr.replace(/^["\s]+|["\s]+$/g, '');

                // Replace escaped double quotes
                seatGroupsStr = seatGroupsStr.replace(/""/g, '"');
                bookedSeatsStr = bookedSeatsStr.replace(/""/g, '"');

                // Parse JSON
                const seatGroupsData = JSON.parse(seatGroupsStr);
                const bookedSeatsData = JSON.parse(bookedSeatsStr);

                // Create SeatGroup documents
                const seatGroupIds = [];
                for (const sgData of seatGroupsData) {
                    let seatGroup = await SeatGroup.findOne({
                        name: sgData.name,
                        rows: sgData.rows,
                        cols: sgData.cols
                    });

                    if (!seatGroup) {
                        seatGroup = new SeatGroup({
                            name: sgData.name,
                            rows: sgData.rows,
                            cols: sgData.cols
                        });
                        await seatGroup.save();
                    }
                    seatGroupIds.push(seatGroup._id);
                }

                // Create Flight document
                const flight = new Flight({
                    FlightID: row.FlightID,
                    Date: new Date(row.Date),
                    DepartureCity: row.DepartureCity,
                    DestinationCity: row.DestinationCity,
                    DepartureTime: row.DepartureTime,
                    FlightDuration: parseFloat(row.FlightDuration),
                    AirplaneModel: row.AirplaneModel,
                    FlightType: row.FlightType,
                    FirstClassPrice: parseFloat(row.FirstClassPrice),
                    BusinessClassPrice: parseFloat(row.BusinessClassPrice),
                    EconomyClassPrice: parseFloat(row.EconomyClassPrice),
                    Status: row.Status,
                    SeatGroups: seatGroupIds
                });

                // Save flight first to get its ID
                await flight.save();

                // Create BookedSeat documents with flight reference
                const bookedSeatIds = [];
                for (const bsData of bookedSeatsData) {
                    const bookedSeat = new BookedSeat({
                        row: bsData.row,
                        col: bsData.col,
                        group_name: bsData.group_name,
                        flight: flight._id
                    });
                    await bookedSeat.save();
                    bookedSeatIds.push(bookedSeat._id);
                }

                // Update flight with booked seats
                flight.BookedSeats = bookedSeatIds;
                await flight.save();

                flights.push(flight.FlightID);
                console.log(`✓ Uploaded flight: ${flight.FlightID}`);
            } catch (error) {
                console.error(`❌ Error processing row for FlightID ${row.FlightID}:`, error.message);
                if (error.stack) {
                    console.error('Stack:', error.stack.split('\n')[0]);
                }
            }
        }

        console.log('\n✅ CSV file successfully processed!');
        console.log(`📊 Total flights uploaded: ${flights.length}`);

    } catch (error) {
        console.error('❌ Error uploading data to MongoDB:', error);
        throw error;
    } finally {
        // Close MongoDB connection
        console.log('\nClosing database connection...');
        await mongoose.connection.close();
        console.log('Database connection closed.');
        process.exit(0);
    }
}

// Run the upload function
if (require.main === module) {
    uploadToMongo().catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = uploadToMongo;
