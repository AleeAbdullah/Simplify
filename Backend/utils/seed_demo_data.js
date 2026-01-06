require('dotenv').config();
const connectDB = require('../config/db');
const User = require('../models/useModels');
const Airport = require('../models/airportData');
const AirportReview = require('../models/airportReviewData');
const UserReview = require('../models/UserReviews');
const BookedFlights = require('../models/bookedFlights');
const { Flight, SeatGroup, BookedSeat } = require('../models/flightData');
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

async function seedDemoData() {
    try {
        console.log('🌱 Starting demo data seeding...\n');
        
        // Connect to database
        console.log('Connecting to MongoDB...');
        await connectDB();
        console.log('✅ Connected to MongoDB successfully!\n');

        // Clear existing data
        console.log('🗑️  Clearing existing data...');
        await User.deleteMany({});
        await Airport.deleteMany({});
        await AirportReview.deleteMany({});
        await UserReview.deleteMany({});
        await BookedFlights.deleteMany({});
        await Flight.deleteMany({});
        await SeatGroup.deleteMany({});
        await BookedSeat.deleteMany({});
        console.log('✅ Cleared existing data\n');

        // 1. Create Users
        console.log('👥 Creating users...');
        const users = [];
        const userData = [
            { FirstName: 'John', LastName: 'Doe', Email: 'john.doe@example.com', Gender: 'Male', Age: 28, isAdmin: false, Img: 'https://i.pravatar.cc/150?img=1' },
            { FirstName: 'Jane', LastName: 'Smith', Email: 'jane.smith@example.com', Gender: 'Female', Age: 32, isAdmin: false, Img: 'https://i.pravatar.cc/150?img=2' },
            { FirstName: 'Mike', LastName: 'Johnson', Email: 'mike.johnson@example.com', Gender: 'Male', Age: 45, isAdmin: false, Img: 'https://i.pravatar.cc/150?img=3' },
            { FirstName: 'Sarah', LastName: 'Williams', Email: 'sarah.williams@example.com', Gender: 'Female', Age: 29, isAdmin: false, Img: 'https://i.pravatar.cc/150?img=4' },
            { FirstName: 'David', LastName: 'Brown', Email: 'david.brown@example.com', Gender: 'Male', Age: 35, isAdmin: false, Img: 'https://i.pravatar.cc/150?img=5' },
            { FirstName: 'Admin', LastName: 'User', Email: 'admin@simplify.com', Gender: 'Male', Age: 30, isAdmin: true, Img: 'https://i.pravatar.cc/150?img=6' },
        ];

        for (const userInfo of userData) {
            const hashedPassword = await bcrypt.hash('password123', 10);
            const user = new User({
                ...userInfo,
                Password: hashedPassword,
                confirmationToken: generateToken()
            });
            await user.save();
            users.push(user);
            console.log(`   ✓ Created user: ${user.Email}`);
        }
        console.log(`✅ Created ${users.length} users\n`);

        // 2. Create Airports
        console.log('🛫 Creating airports...');
        const airports = [];
        const airportData = [
            { code: 'JFK', city: 'New York', country: 'USA', location: 'Queens, New York', description: 'John F. Kennedy International Airport is one of the busiest airports in the United States.', services: ['WiFi', 'Restaurants', 'Shopping', 'Lounges', 'Parking'], imageURLs: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800'] },
            { code: 'LHR', city: 'London', country: 'UK', location: 'London, England', description: 'London Heathrow is the busiest airport in Europe and the main international gateway to London.', services: ['WiFi', 'Restaurants', 'Shopping', 'Lounges', 'Duty Free', 'Hotels'], imageURLs: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800'] },
            { code: 'CDG', city: 'Paris', country: 'France', location: 'Roissy-en-France, France', description: 'Charles de Gaulle Airport is the largest international airport in France.', services: ['WiFi', 'Restaurants', 'Shopping', 'Lounges', 'Spa'], imageURLs: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800'] },
            { code: 'DXB', city: 'Dubai', country: 'UAE', location: 'Dubai, UAE', description: 'Dubai International Airport is the primary international airport serving Dubai.', services: ['WiFi', 'Restaurants', 'Shopping', 'Lounges', 'Spa', 'Hotels'], imageURLs: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800'] },
            { code: 'LAX', city: 'Los Angeles', country: 'USA', location: 'Los Angeles, California', description: 'Los Angeles International Airport is the primary international airport serving Los Angeles.', services: ['WiFi', 'Restaurants', 'Shopping', 'Lounges', 'Parking'], imageURLs: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800'] },
            { code: 'NRT', city: 'Tokyo', country: 'Japan', location: 'Narita, Japan', description: 'Narita International Airport is the primary international airport serving the Greater Tokyo Area.', services: ['WiFi', 'Restaurants', 'Shopping', 'Lounges', 'Spa'], imageURLs: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800'] },
            { code: 'SYD', city: 'Sydney', country: 'Australia', location: 'Sydney, Australia', description: 'Sydney Kingsford Smith Airport is the primary international airport serving Sydney.', services: ['WiFi', 'Restaurants', 'Shopping', 'Lounges'], imageURLs: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800'] },
            { code: 'FRA', city: 'Frankfurt', country: 'Germany', location: 'Frankfurt, Germany', description: 'Frankfurt Airport is the main international airport serving Frankfurt, Germany.', services: ['WiFi', 'Restaurants', 'Shopping', 'Lounges', 'Hotels'], imageURLs: ['https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800'] },
        ];

        for (const airportInfo of airportData) {
            const airport = new Airport(airportInfo);
            await airport.save();
            airports.push(airport);
            console.log(`   ✓ Created airport: ${airport.code} - ${airport.city}`);
        }
        console.log(`✅ Created ${airports.length} airports\n`);

        // 3. Create Seat Groups (reusable)
        console.log('💺 Creating seat groups...');
        const seatGroups = [];
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
        console.log(`✅ Created ${seatGroups.length} seat group types\n`);

        // 4. Create Flights
        console.log('✈️  Creating flights...');
        const flights = [];
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
        ];

        const airplaneModels = ['Boeing 747', 'Boeing 777', 'Boeing 787', 'Airbus A380', 'Airbus A350', 'Boeing 737'];
        const statuses = ['Scheduled', 'Scheduled', 'Scheduled', 'Boarding', 'Scheduled']; // Mostly scheduled

        for (let i = 0; i < 30; i++) {
            const route = flightRoutes[i % flightRoutes.length];
            const flightDate = randomFutureDate(1, 60);
            const flight = new Flight({
                FlightID: `FL${100 + i}`,
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
            flights.push(flight);
            console.log(`   ✓ Created flight: ${flight.FlightID} (${flight.DepartureCity} → ${flight.DestinationCity})`);
        }
        console.log(`✅ Created ${flights.length} flights\n`);

        // 5. Create Airport Reviews
        console.log('⭐ Creating airport reviews...');
        const reviewComments = [
            'Great airport with excellent facilities!',
            'Very clean and well-organized.',
            'Good shopping options and restaurants.',
            'Could use more seating areas.',
            'Excellent customer service.',
            'Modern facilities and easy navigation.',
            'Long wait times at security.',
            'Beautiful architecture and design.',
        ];

        for (let i = 0; i < 20; i++) {
            const airport = airports[Math.floor(Math.random() * airports.length)];
            const user = users[Math.floor(Math.random() * users.length)];
            const review = new AirportReview({
                airport: airport._id,
                user: user._id,
                rating: Math.floor(Math.random() * 5) + 6, // 6-10
                comment: reviewComments[Math.floor(Math.random() * reviewComments.length)],
            });
            await review.save();
            airport.reviews.push(review._id);
            await airport.save();
        }
        console.log(`✅ Created 20 airport reviews\n`);

        // 6. Create User Reviews
        console.log('📝 Creating user reviews...');
        const userReviewTexts = [
            'Great flight experience!',
            'Comfortable seats and good service.',
            'On-time departure and smooth landing.',
            'Could improve the food quality.',
            'Excellent crew and service.',
            'Long flight but comfortable.',
            'Would recommend this airline.',
            'Good value for money.',
        ];

        for (let i = 0; i < 15; i++) {
            const flight = flights[Math.floor(Math.random() * flights.length)];
            const review = new UserReview({
                reviewText: userReviewTexts[Math.floor(Math.random() * userReviewTexts.length)],
                token: generateToken(),
                flightID: flight.FlightID,
            });
            await review.save();
        }
        console.log(`✅ Created 15 user reviews\n`);

        // 7. Create Booked Flights
        console.log('🎫 Creating booked flights...');
        const groupNames = ['First Class', 'Business Class', 'Economy Class'];
        const rows = ['A', 'B', 'C', 'D', 'E', 'F'];

        for (let i = 0; i < 25; i++) {
            const user = users[Math.floor(Math.random() * users.length)];
            const flight = flights[Math.floor(Math.random() * flights.length)];
            const groupName = groupNames[Math.floor(Math.random() * groupNames.length)];
            
            // Get appropriate seat group to determine col range
            const seatGroup = seatGroups.find(sg => sg.name === groupName);
            const maxCol = seatGroup ? seatGroup.cols : 10;

            const bookedFlight = new BookedFlights({
                UserToken: user._id.toString(), // Using user ID as token
                FlightID: flight.FlightID,
                row: rows[Math.floor(Math.random() * rows.length)],
                col: Math.floor(Math.random() * maxCol) + 1,
                group_name: groupName,
            });
            await bookedFlight.save();
        }
        console.log(`✅ Created 25 booked flights\n`);

        // 8. Create some booked seats for flights
        console.log('🪑 Creating booked seats for flights...');
        for (let i = 0; i < 15; i++) {
            const flight = flights[Math.floor(Math.random() * flights.length)];
            const groupName = groupNames[Math.floor(Math.random() * groupNames.length)];
            const seatGroup = seatGroups.find(sg => sg.name === groupName);
            
            if (seatGroup) {
                const bookedSeat = new BookedSeat({
                    row: rows[Math.floor(Math.random() * rows.length)],
                    col: Math.floor(Math.random() * seatGroup.cols) + 1,
                    group_name: groupName,
                    flight: flight._id,
                });
                await bookedSeat.save();
                flight.BookedSeats.push(bookedSeat._id);
                await flight.save();
            }
        }
        console.log(`✅ Created 15 booked seats\n`);

        // Summary
        console.log('\n' + '='.repeat(50));
        console.log('📊 DEMO DATA SEEDING COMPLETE!');
        console.log('='.repeat(50));
        console.log(`👥 Users: ${users.length}`);
        console.log(`🛫 Airports: ${airports.length}`);
        console.log(`✈️  Flights: ${flights.length}`);
        console.log(`💺 Seat Groups: ${seatGroups.length}`);
        console.log(`⭐ Airport Reviews: 20`);
        console.log(`📝 User Reviews: 15`);
        console.log(`🎫 Booked Flights: 25`);
        console.log(`🪑 Booked Seats: 15`);
        console.log('='.repeat(50));
        console.log('\n✅ Demo data successfully seeded!');
        console.log('\n📌 Test Credentials:');
        console.log('   Admin: admin@simplify.com / password123');
        console.log('   User:  john.doe@example.com / password123');
        console.log('   (All users have password: password123)\n');

    } catch (error) {
        console.error('❌ Error seeding demo data:', error);
        throw error;
    } finally {
        await mongoose.connection.close();
        console.log('Database connection closed.');
        process.exit(0);
    }
}

// Run the seeding function
if (require.main === module) {
    seedDemoData().catch((error) => {
        console.error('Fatal error:', error);
        process.exit(1);
    });
}

module.exports = seedDemoData;

