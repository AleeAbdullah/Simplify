# Data Upload Guide

## ✅ Data Successfully Uploaded!

Your flight data has been uploaded to MongoDB Atlas. Here's what was uploaded:

- **2 Flights** (FL123, FL124)
- **6 Seat Groups** (3 per flight: First Class, Business Class, Economy Class)
- **6 Booked Seats** (3 per flight)

## Available Commands

### Upload Data from CSV
```bash
cd Backend
npm run upload-data
```

This command:
- Reads data from `data/flight_schedule.csv`
- Creates Flight, SeatGroup, and BookedSeat documents
- Links them with proper references
- Shows progress and summary

### Verify Uploaded Data
```bash
cd Backend
npm run verify-data
```

This command:
- Shows database statistics (counts)
- Displays sample flights with details
- Verifies data integrity

## CSV File Format

Your CSV file should have the following columns:
- `FlightID` - Unique flight identifier
- `Date` - Flight date (YYYY-MM-DD)
- `DepartureCity` - Departure city name
- `DestinationCity` - Destination city name
- `DepartureTime` - Departure time (HH:MM)
- `FlightDuration` - Duration in hours (number)
- `AirplaneModel` - Aircraft model
- `FlightType` - "Domestic" or "International"
- `FirstClassPrice` - Price (number)
- `BusinessClassPrice` - Price (number)
- `EconomyClassPrice` - Price (number)
- `Status` - Flight status
- `SeatGroups` - JSON array of seat groups
- `BookedSeats` - JSON array of booked seats

### SeatGroups JSON Format:
```json
[
  {"name": "First Class", "rows": 5, "cols": 8},
  {"name": "Business Class", "rows": 10, "cols": 6},
  {"name": "Economy Class", "rows": 20, "cols": 10}
]
```

### BookedSeats JSON Format:
```json
[
  {"row": "A", "col": 3, "group_name": "First Class"},
  {"row": "B", "col": 10, "group_name": "Economy Class"}
]
```

## Adding More Data

1. **Add to existing CSV**: Add new rows to `data/flight_schedule.csv`
2. **Run upload**: `npm run upload-data`
   - The script will skip duplicates (based on FlightID)
   - To clear and re-upload, uncomment the delete lines in `utils/upload_to_mongo.js`

## Clearing Data

To clear all flight data and re-upload:

1. Open `utils/upload_to_mongo.js`
2. Uncomment these lines (around line 18-20):
   ```javascript
   await Flight.deleteMany({});
   await SeatGroup.deleteMany({});
   await BookedSeat.deleteMany({});
   ```
3. Run `npm run upload-data`

## Troubleshooting

### "FlightID already exists" error
- The FlightID must be unique
- Either change the FlightID or delete the existing flight first

### JSON parsing errors
- Ensure JSON in CSV columns is properly formatted
- Check for escaped quotes (should be `""` in CSV)
- Verify no trailing commas in JSON arrays

### Connection errors
- Verify `.env` file has correct `MONGO_URI`
- Check MongoDB Atlas network access settings
- Ensure database user has proper permissions

## Current Data Summary

✅ **2 Flights uploaded:**
- FL123: New York → London (International)
- FL124: London → Paris (International)

All flights have:
- 3 seat groups (First, Business, Economy classes)
- Pre-booked seats configured
- Proper pricing and scheduling

Your database is ready to use! 🚀

