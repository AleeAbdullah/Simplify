# Demo Data Guide

## ✅ Demo Data Successfully Seeded!

Your database has been populated with comprehensive demo data for testing and development.

## 📊 Data Summary

- **👥 6 Users** (5 regular users + 1 admin)
- **🛫 8 Airports** (Major international airports)
- **✈️ 30 Flights** (Various routes, dates, and times)
- **💺 3 Seat Group Types** (First Class, Business Class, Economy Class)
- **⭐ 20 Airport Reviews** (Reviews for various airports)
- **📝 15 User Reviews** (Flight reviews)
- **🎫 25 Booked Flights** (User bookings)
- **🪑 15 Booked Seats** (Seats booked on flights)

## 🔑 Test Credentials

All demo users have the password: **`password123`**

### Admin Account
- **Email:** `admin@simplify.com`
- **Password:** `password123`
- **Role:** Admin

### Regular User Accounts
- **Email:** `john.doe@example.com`
- **Email:** `jane.smith@example.com`
- **Email:** `mike.johnson@example.com`
- **Email:** `sarah.williams@example.com`
- **Email:** `david.brown@example.com`

## 🛫 Airports Created

1. **JFK** - New York, USA
2. **LHR** - London, UK
3. **CDG** - Paris, France
4. **DXB** - Dubai, UAE
5. **LAX** - Los Angeles, USA
6. **NRT** - Tokyo, Japan
7. **SYD** - Sydney, Australia
8. **FRA** - Frankfurt, Germany

Each airport includes:
- Location information
- Services (WiFi, Restaurants, Shopping, Lounges, etc.)
- Descriptions
- Reviews

## ✈️ Flight Routes

The demo includes 30 flights covering various routes:
- **International Routes:** New York ↔ London, Paris ↔ Dubai, Tokyo ↔ Sydney, etc.
- **Domestic Routes:** New York ↔ Los Angeles
- **Various Dates:** Flights scheduled over the next 60 days
- **Different Times:** Random departure times
- **Multiple Aircraft:** Boeing 747, 777, 787, Airbus A380, A350, 737
- **Price Ranges:**
  - First Class: $1,000 - $3,000
  - Business Class: $600 - $2,100
  - Economy Class: $300 - $1,100

## 💺 Seat Configuration

All flights have 3 seat classes:
- **First Class:** 5 rows × 8 columns
- **Business Class:** 10 rows × 6 columns
- **Economy Class:** 20 rows × 10 columns

## 📝 Reviews

- **Airport Reviews:** 20 reviews with ratings (6-10) and comments
- **User Reviews:** 15 flight reviews with various feedback

## 🎫 Bookings

- **25 Booked Flights:** Users have booked various flights
- **15 Booked Seats:** Seats are marked as booked on flights

## 🔄 Reseeding Data

To clear and reseed the database with fresh demo data:

```bash
cd Backend
npm run seed-demo
```

**⚠️ Warning:** This will **DELETE ALL EXISTING DATA** and replace it with fresh demo data.

## 📋 Available Commands

### Seed Demo Data
```bash
npm run seed-demo
```
Clears existing data and seeds fresh demo data.

### Verify Data
```bash
npm run verify-data
```
Shows database statistics and sample data.

### Upload from CSV
```bash
npm run upload-data
```
Uploads flight data from `data/flight_schedule.csv`.

## 🎯 Use Cases

This demo data is perfect for:
- ✅ Testing your frontend application
- ✅ Developing new features
- ✅ Demonstrating the application
- ✅ API testing and development
- ✅ UI/UX testing with realistic data

## 📌 Notes

- All flight dates are in the future (next 1-60 days)
- User passwords are hashed using bcrypt
- All relationships between models are properly linked
- Airport reviews are linked to airports and users
- Booked flights reference actual flight IDs
- Seat groups are reusable across flights

## 🔍 Querying Demo Data

You can query the demo data through your API endpoints:

- **GET** `/api/users` - List all users
- **GET** `/api/flights` - List all flights
- **GET** `/api/airports` - List all airports
- **GET** `/api/reviews` - List reviews
- **GET** `/api/bookedFlights` - List bookings

Your database is now ready for development and testing! 🚀

