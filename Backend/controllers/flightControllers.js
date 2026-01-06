const {Flight, BookedSeat, SeatGroup} = require('../models/flightData');
const asyncHandler = require("express-async-handler");

const createFlight = asyncHandler(async (req, res) => {
    const {
        FlightID,
        Date,
        DepartureCity,
        DestinationCity,
        DepartureTime,
        FlightDuration,
        AirplaneModel,
        FlightType,
        FirstClassPrice,
        BusinessClassPrice,
        EconomyClassPrice,
        Status,
        SeatGroups,
        BookedSeats,
    } = req.body;

    const flightExists = await Flight.findOne({ FlightID });

    if (flightExists) {
        res.status(400);
        throw new Error("Flight already exists");
    }

    const seatGroupDocuments = await Promise.all(Object.values(SeatGroups).map(async (seatGroup) => {
        const newSeatGroup = new SeatGroup({
            name: seatGroup.name,
            rows: seatGroup.rows,
            cols: seatGroup.cols
        });
        return await newSeatGroup.save();
    }));
    
    const seatGroupIds = seatGroupDocuments.map(seatGroup => seatGroup._id);


    const flight = await Flight.create({
        FlightID,
        Date,
        DepartureCity,
        DestinationCity,
        DepartureTime,
        FlightDuration,
        AirplaneModel,
        FlightType,
        FirstClassPrice,
        BusinessClassPrice,
        EconomyClassPrice,
        Status,
        SeatGroups: seatGroupIds,
        BookedSeats,
    });

    res.status(201).json(flight);
});


const getFlights = async (req, res) => {
    try {
        const flights = await Flight.find({}, { _id: 0, __v: 0 });
        res.json(flights);
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};


const getFilteredFlights = asyncHandler(async (req, res) => {
    const { departureCity, destinationCity, dateFrom, dateTo, flightType, status, maxPrice } = req.body;
    let filter = {};

    // Check if any fields exist and are not empty
    if (departureCity) filter.DepartureCity = { $regex: new RegExp(departureCity, "i") };
    if (destinationCity) filter.DestinationCity = { $regex: new RegExp(destinationCity, "i") };
    if (dateFrom && dateTo) {
        filter.Date = { $gte: new Date(dateFrom), $lte: new Date(dateTo) };
    } else if (dateFrom) {
        filter.Date = { $gte: new Date(dateFrom) };
    } else if (dateTo) {
        filter.Date = { $lte: new Date(dateTo) };
    }
    if (flightType) filter.FlightType = flightType;
    if (status) filter.Status = status;
    if (maxPrice) filter.$or = [
        { FirstClassPrice: { $lte: maxPrice } },
        { BusinessClassPrice: { $lte: maxPrice } },
        { EconomyClassPrice: { $lte: maxPrice } }
    ];

    console.log(filter);

    const flights = await Flight.find(filter);

    res.json(flights);
});


const getFlightById = asyncHandler(async (req, res) => {
    const { FlightID } = req.params;

    const flight = await Flight.findOne({ FlightID }).populate('SeatGroups').populate('BookedSeats');

    if (!flight) {
        res.status(404);
        throw new Error("Flight not found");
    }

    res.json(flight);
});

const Flightexists = asyncHandler(async (req, res) => {
    const { FlightID } = req.params;

    const flight = await Flight.findOne({ FlightID });

    if (!flight) {
        res.json("")
    }
    else 
    {
        res.json(flight);
    }
});


const updateFlight = asyncHandler(async (req, res) => {
    const { FlightID } = req.params;

    const flight = await Flight.findOne({ FlightID });

    if (!flight) {
        res.status(404);
        throw new Error("Flight not found");
    }

    const {
        Date,
        DepartureCity,
        DestinationCity,
        DepartureTime,
        FlightDuration,
        AirplaneModel,
        FlightType,
        FirstClassPrice,
        BusinessClassPrice,
        EconomyClassPrice,
        Status,
    } = req.body;


    if (Date) flight.Date = Date;
    if (DepartureCity) flight.DepartureCity = DepartureCity;
    if (DestinationCity) flight.DestinationCity = DestinationCity;
    if (DepartureTime) flight.DepartureTime = DepartureTime;
    if (FlightDuration) flight.FlightDuration = FlightDuration;
    if (AirplaneModel) flight.AirplaneModel = AirplaneModel;
    if (FlightType) flight.FlightType = FlightType;
    if (FirstClassPrice) flight.FirstClassPrice = FirstClassPrice;
    if (BusinessClassPrice) flight.BusinessClassPrice = BusinessClassPrice;
    if (EconomyClassPrice) flight.EconomyClassPrice = EconomyClassPrice;
    if (Status) flight.Status = Status;

    await flight.save();

    res.json(flight);
});


const deleteFlight = asyncHandler(async (req, res) => {

    const { FlightID } = req.params;

    const flight = await Flight.findOne({FlightID});

    if (!flight) {
        res.status(404);
        throw new Error("Flight not found");
    }

    await Flight.findOneAndDelete({FlightID});
    res.json({ message: "Flight removed" });
});



const bookSeats = async (req, res) => {
    const { FlightID, seats } = req.body;

    console.log(req.body);
    console.log(FlightID);
    console.log(seats);

    try {
        const flight = await Flight.findOne({ FlightID });

        if (!flight) {
            res.status(404);
            throw new Error("Flight not found");
        }

        console.log(seats);

        // Iterate through each seat in the array
        for (const seat of seats) {
            const { row, col, group_name } = seat;
            
            // Check if the seat is already booked
            const isBooked = await BookedSeat.findOne({ row, col, group_name: group_name, flight: flight._id });
            if (isBooked) {
                res.status(400);
                throw new Error(`Seat (${row}, ${col}) in ${group_name} is already booked`);
            }

            // Create a new BookedSeat document and save it
            const newBookedSeat = new BookedSeat({
                row,
                col,
                group_name: group_name,
                flight: flight._id
            });
            await newBookedSeat.save();

            // Add the created booked seat to the flight's booked seats array
            flight.BookedSeats.push(newBookedSeat._id);
        }

        // Save the updated flight document
        await flight.save();

        res.status(201).json({ message: "Seats booked successfully" });
    } catch (error) {
        console.error('Error:', error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
};



module.exports = { createFlight, getFlights, getFlightById, getFilteredFlights, updateFlight, deleteFlight, bookSeats,Flightexists };
