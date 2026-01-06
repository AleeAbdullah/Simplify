require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/useModels');
const { Flight, SeatGroup } = require('../models/flightData');
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

// Generate random token
function generateToken() {
    return crypto.randomBytes(32).toString('hex');
}

// Generate random date in the future
function randomFutureDate(daysFromNow = 0, maxDays = 90) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow + Math.floor(Math.random() * maxDays));
    return date;
}

// Generate random time
function randomTime() {
    const hour = String(Math.floor(Math.random() * 24)).padStart(2, '0');
    const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0');
    return `${hour}:${minute}`;
}

async function addMoreData() {
    try {
        console.log('➕ Adding more flights and users to database...\n');
        
        // Connect to database
        console.log('Connecting to MongoDB...');
        await connectDB();
        console.log('✅ Connected to MongoDB successfully!\n');

        // Get existing seat groups (reuse them)
        const seatGroups = await SeatGroup.find();
        if (seatGroups.length === 0) {
            console.log('⚠️  No seat groups found. Creating seat groups...');
            const seatGroupData = [
                { name: 'First Class', rows: 5, cols: 8 },
                { name: 'Business Class', rows: 10, cols: 6 },
                { name: 'Economy Class', rows: 20, cols: 10 },
            ];
            for (const sgData of seatGroupData) {
                const seatGroup = new SeatGroup(sgData);
                await seatGroup.save();
                seatGroups.push(seatGroup);
            }
            console.log(`✅ Created ${seatGroups.length} seat groups\n`);
        } else {
            console.log(`✅ Found ${seatGroups.length} existing seat groups\n`);
        }

        // 1. Create More Users
        console.log('👥 Creating additional users...');
        const newUsers = [];
        const userData = [
            { FirstName: 'Emily', LastName: 'Davis', Email: 'emily.davis@example.com', Gender: 'Female', Age: 27, isAdmin: false, Img: 'https://i.pravatar.cc/150?img=7' },
            { FirstName: 'Robert', LastName: 'Miller', Email: 'robert.miller@example.com', Gender: 'Male', Age: 41, isAdmin: false, Img: 'https://i.pravatar.cc/150?img=8' },
            { FirstName: 'Lisa', LastName: 'Wilson', Email: 'lisa.wilson@example.com', Gender: 'Female', Age: 33, isAdmin: false, Img: 'https://i.pravatar.cc/150?img=9' },
            { FirstName: 'James', LastName: 'Moore', Email: 'james.moore@example.com', Gender: 'Male', Age: 38, isAdmin: false, Img: 'https://i.pravatar.cc/150?img=10' },
            { FirstName: 'Maria', LastName: 'Taylor', Email: 'maria.taylor@example.com', Gender: 'Female', Age: 26, isAdmin: false, Img: 'https://i.pravatar.cc/150?img=11' },
            { FirstName: 'William', LastName: 'Anderson', Email: 'william.anderson@example.com', Gender: 'Male', Age: 44, isAdmin: false, Img: 'https://i.pravatar.cc/150?img=12' },
            { FirstName: 'Jessica', LastName: 'Thomas', Email: 'jessica.thomas@example.com', Gender: 'Female', Age: 31, isAdmin: false, Img: 'https://i.pravatar.cc/150?img=13' },
            { FirstName: 'Christopher', LastName: 'Jackson', Email: 'christopher.jackson@example.com', Gender: 'Male', Age: 36, isAdmin: false, Img: 'https://i.pravatar.cc/150?img=14' },
            { FirstName: 'Amanda', LastName: 'White', Email: 'amanda.white@example.com', Gender: 'Female', Age: 29, isAdmin: false, Img: 'https://i.pravatar.cc/150?img=15' },
            { FirstName: 'Daniel', LastName: 'Harris', Email: 'daniel.harris@example.com', Gender: 'Male', Age: 42, isAdmin: false, Img: 'https://i.pravatar.cc/150?img=16' },
        ];

        for (const userInfo of userData) {
            // Check if user already exists
            const existingUser = await User.findOne({ Email: userInfo.Email });
            if (existingUser) {
                console.log(`   ⏭️  Skipped existing user: ${userInfo.Email}`);
                continue;
            }

            const hashedPassword = await bcrypt.hash('password123', 10);
            const user = new User({
                ...userInfo,
                Password: hashedPassword,
                confirmationToken: generateToken()
            });
            await user.save();
            newUsers.push(user);
            console.log(`   ✓ Created user: ${user.Email}`);
        }
        console.log(`✅ Created ${newUsers.length} new users\n`);

        // 2. Get existing flights to determine next FlightID
        const existingFlights = await Flight.find().sort({ FlightID: -1 }).limit(1);
        let nextFlightNumber = 130; // Start from FL130
        if (existingFlights.length > 0) {
            const lastFlightID = existingFlights[0].FlightID;
            const match = lastFlightID.match(/FL(\d+)/);
            if (match) {
                nextFlightNumber = parseInt(match[1]) + 1;
            }
        }

        // 3. Create 30 More Flights
        console.log('✈️  Creating 30 additional flights...');
        const newFlights = [];
        const flightRoutes = [
            { DepartureCity: 'New York', DestinationCity: 'London', FlightType: 'International', Duration: 8 },
            { DepartureCity: 'London', DestinationCity: 'Paris', FlightType: 'International', Duration: 2 },
            { DepartureCity: 'New York', DestinationCity: 'Los Angeles', FlightType: 'Domestic', Duration: 6 },
            { DepartureCity: 'Paris', DestinationCity: 'Dubai', FlightType: 'International', Duration: 7 },
            { DepartureCity: 'Dubai', DestinationCity: 'Tokyo', FlightType: 'International', Duration: 10 },
            { DepartureCity: 'Los Angeles', DestinationCity: 'Tokyo', FlightType: 'International', Duration: 12 },
            { DepartureCity: 'London', DestinationCity: 'Frankfurt', FlightType: 'International', Duration: 2 },
            { DepartureCity: 'New York', DestinationCity: 'Dubai', FlightType: 'International', Duration: 13 },
            { DepartureCity: 'Paris', DestinationCity: 'Sydney', FlightType: 'International', Duration: 22 },
            { DepartureCity: 'Tokyo', DestinationCity: 'Sydney', FlightType: 'International', Duration: 10 },
            { DepartureCity: 'Frankfurt', DestinationCity: 'New York', FlightType: 'International', Duration: 9 },
            { DepartureCity: 'Dubai', DestinationCity: 'London', FlightType: 'International', Duration: 7 },
            { DepartureCity: 'Los Angeles', DestinationCity: 'New York', FlightType: 'Domestic', Duration: 6 },
            { DepartureCity: 'Sydney', DestinationCity: 'Los Angeles', FlightType: 'International', Duration: 15 },
            { DepartureCity: 'London', DestinationCity: 'Tokyo', FlightType: 'International', Duration: 12 },
            { DepartureCity: 'Paris', DestinationCity: 'New York', FlightType: 'International', Duration: 8 },
            { DepartureCity: 'Tokyo', DestinationCity: 'Dubai', FlightType: 'International', Duration: 9 },
            { DepartureCity: 'Frankfurt', DestinationCity: 'Paris', FlightType: 'International', Duration: 1 },
            { DepartureCity: 'Dubai', DestinationCity: 'Frankfurt', FlightType: 'International', Duration: 6 },
            { DepartureCity: 'Sydney', DestinationCity: 'Tokyo', FlightType: 'International', Duration: 10 },
        ];

        const airplaneModels = ['Boeing 747', 'Boeing 777', 'Boeing 787', 'Airbus A380', 'Airbus A350', 'Boeing 737'];
        const statuses = ['Scheduled', 'Scheduled', 'Scheduled', 'Boarding', 'Scheduled', 'In-Flight', 'Scheduled'];

        for (let i = 0; i < 30; i++) {
            const route = flightRoutes[i % flightRoutes.length];
            const flightDate = randomFutureDate(1, 90);
            
            // Check if FlightID already exists
            const flightID = `FL${nextFlightNumber + i}`;
            const existingFlight = await Flight.findOne({ FlightID: flightID });
            if (existingFlight) {
                console.log(`   ⏭️  Skipped existing flight: ${flightID}`);
                continue;
            }

            const flight = new Flight({
                FlightID: flightID,
                Date: flightDate,
                DepartureCity: route.DepartureCity,
                DestinationCity: route.DestinationCity,
                DepartureTime: randomTime(),
                FlightDuration: route.Duration,
                AirplaneModel: airplaneModels[Math.floor(Math.random() * airplaneModels.length)],
                FlightType: route.FlightType,
                FirstClassPrice: Math.floor(Math.random() * 2000) + 1000,
                BusinessClassPrice: Math.floor(Math.random() * 1500) + 600,
                EconomyClassPrice: Math.floor(Math.random() * 800) + 300,
                Status: statuses[Math.floor(Math.random() * statuses.length)],
                SeatGroups: seatGroups.map(sg => sg._id),
            });
            await flight.save();
            newFlights.push(flight);
            console.log(`   ✓ Created flight: ${flight.FlightID} (${flight.DepartureCity} → ${flight.DestinationCity})`);
        }
        console.log(`✅ Created ${newFlights.length} new flights\n`);

        // Summary
        const totalUsers = await User.countDocuments();
        const totalFlights = await Flight.countDocuments();

        console.log('\n' + '='.repeat(50));
        console.log('📊 DATA ADDITION COMPLETE!');
        console.log('='.repeat(50));
        console.log(`👥 New Users Added: ${newUsers.length}`);
        console.log(`👥 Total Users: ${totalUsers}`);
        console.log(`✈️  New Flights Added: ${newFlights.length}`);
        console.log(`✈️  Total Flights: ${totalFlights}`);
        console.log('='.repeat(50));
        console.log('\n✅ Additional data successfully added!');
        console.log('\n📌 New User Credentials:');
        console.log('   All new users have password: password123');
        newUsers.slice(0, 5).forEach(user => {
            console.log(`   - ${user.Email}`);
        });
        if (newUsers.length > 5) {
            console.log(`   ... and ${newUsers.length - 5} more`);
        }
        console.log('');

    } catch (error) {
        console.error('❌ Error adding data:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed.');
        process.exit(0);
    }
}

// Run the function
if (require.main === module) {
    addMoreData().catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = addMoreData;

