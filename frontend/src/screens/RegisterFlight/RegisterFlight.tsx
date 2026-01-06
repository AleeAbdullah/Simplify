    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import { Label } from "../../components/ui/label";
    import { getApiUrl } from "../../config/api";
    import { Input } from "../../components/ui/input";
    import { cn } from '../../utils/cn';

    interface Flight {
        FlightID: string;
    }

    interface SeatGroup {
        name: string;
        rows: number | null;
        cols: number | null;
    }

    interface BookedSeat {
        row: string;
        col: number;
        group_name: string;
    }

    interface FlightFormData {
        FlightID: string;
        Date: string;
        DepartureCity: string;
        DestinationCity: string;
        DepartureTime: string;
        FlightDuration: number;
        AirplaneModel: string;
        FlightType: string;
        FirstClassPrice: number;
        BusinessClassPrice: number;
        EconomyClassPrice: number;
        Status: string;
        SeatGroups: {
            Economy: SeatGroup;
            Business: SeatGroup;
            First: SeatGroup;
        };
        BookedSeats: BookedSeat[]; // Adjusted type for BookedSeats
    }


    export const RegisterFlight = () => {

        const [FlightID, setFlightID] = useState<string>("");

        useEffect(() => {
            // Fetch existing flight IDs when the component mounts
            const fetchFlightIDs = async () => {
                try {
                    const response = await axios.post(getApiUrl('api/flights/getflights'));
                    const flights: Flight[] = response.data;
                    const existingIDs = flights.map(flight => flight.FlightID);
                    if (existingIDs.length > 0) {
                        // Find the maximum ID and increment it
                        const maxID = Math.max(...existingIDs.map(id => parseInt(id.substring(2), 10))); // Assuming IDs are in the format 'FL001', 'FL002', etc.
                        const nextID = `FL${(maxID + 1).toString().padStart(3, '0')}`; // Increment the maximum ID and pad with zeros
                        setFormData(prevState => ({ ...prevState, FlightID: nextID }));
                        setFlightID(nextID);
                    } else {
                        // If no flights exist, start with FL001
                        setFormData(prevState => ({ ...prevState, FlightID: "FL001" }));
                        setFlightID("Fl001")
                    }
                } catch (error) {
                    console.error('Error fetching flight IDs:', error);
                }
            };
        
            fetchFlightIDs(); // Call the function to fetch flight IDs
        }, []); // Empty dependency array to run once on mount
    
        
        const [type, setType] = useState<string>("Domestic");

        const handletypeChange = () => {
            if (type === "Domestic") {
            setType("International");
            } else {
            setType("Domestic");
            }
        };

        const [status, setStatus] = useState("Scheduled");

        const handleStatusChange = () => {
          if (status === "Scheduled") {
            setStatus("Boarding");
          } else if (status === "Boarding") {
            setStatus("In-Flight");
          } else if (status === "In-Flight") {
            setStatus("Arrived");
          } else if (status === "Arrived") {
            setStatus("Delayed");
          } else if (status === "Delayed") {
            setStatus("Cancelled");
          } else {
            setStatus("Scheduled");
          }
        };

        const [formData, setFormData] = useState<FlightFormData>({
            FlightID: FlightID,
            Date: '',
            DepartureCity: '',
            DestinationCity: '',
            DepartureTime: '',
            FlightDuration: 0,
            AirplaneModel: '',
            FlightType: type,
            FirstClassPrice: 0,
            BusinessClassPrice: 0,
            EconomyClassPrice: 0,
            Status: status,
            SeatGroups: {
                Economy: { name: "Economy Class", rows: null, cols: null },
                Business: { name: "Business Class", rows: null, cols: null },
                First: { name: "First Class", rows: null, cols: null },
            },
            BookedSeats: [],
        });

        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            const { name, value } = e.target;
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        };

        const handleSeatGroupChange = (
            groupName: string,
            field: string,
            value: string | number
        ) => {
            setFormData(prevData => ({
                ...prevData,
                SeatGroups: {
                    ...prevData.SeatGroups,
                    [groupName]: {
                        ...prevData.SeatGroups[groupName as keyof typeof formData.SeatGroups],
                        [field]: value
                    }
                }
            }));
        };

        const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
            console.log(formData)

            e.preventDefault();
            try {
                const response = await axios.post(getApiUrl('api/flights/create'), formData);
                console.log(response.data);
                alert('Flight data uploaded successfully!');
            } catch (error: any) {
                console.error('Error:', error.response.data.message);
                alert('Error uploading flight data. Please try again later.');
            }
        };


        return (
            <div className="mx-32 rounded-2xl p-3 md:p-5 shadow-input bg-white dark:bg-black self-center">
                <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                    Register New Flight
                </h2>

                <form className=" space-y-4 w-full" onSubmit={handleSubmit}>
                {/* Flight ID */}
                    <div className='grid grid-cols-4 mt-3 gap-4'>
                        <div className="mb-4">
                            <Label htmlFor="FlightID" className="font-semibold text-neutral-800 dark:text-neutral-200">Flight ID:</Label>
                            <Btn text={FlightID} className='w-fit ring-2 mx-auto'/>
                        </div>
                        
                        {/* Date */}
                        <div className="mb-4">
                            <Label htmlFor="Date" className="font-semibold text-neutral-800 dark:text-neutral-200">Date:</Label>
                            <Input type="date" id="Date" name="Date" value={formData.Date} onChange={handleChange} required className="input-field" />
                        </div>

                        {/* Status */}
                        <div className="mb-4">
                            <Label htmlFor="Status" className="font-semibold text-neutral-800 dark:text-neutral-200">Status:</Label>
                            <Btn text={status} onClick={handleStatusChange} />
                        </div>

                        {/* Flight Type */}
                        <div className="mb-4">
                            <Label htmlFor="FlightType" className="font-semibold text-neutral-800 dark:text-neutral-200">Flight Type:</Label>
                            <Btn text={type} onClick={handletypeChange} />
                        </div>
                        
                    </div>
                    
                    <div className='grid grid-cols-4 mt-3 gap-4'>
                        {/* Departure City */}
                        <div className="mb-4">
                            <Label htmlFor="DepartureCity" className="font-semibold text-neutral-800 dark:text-neutral-200">Departure City:</Label>
                            <Input type="text" id="DepartureCity" name="DepartureCity" value={formData.DepartureCity} onChange={handleChange} required className="input-field" />
                        </div>

                        {/* Destination City */}
                        <div className="mb-4">
                            <Label htmlFor="DestinationCity" className="font-semibold text-neutral-800 dark:text-neutral-200">Destination City:</Label>
                            <Input type="text" id="DestinationCity" name="DestinationCity" value={formData.DestinationCity} onChange={handleChange} required className="input-field" />
                        </div>

                        {/* Departure Time */}
                        <div className="mb-4">
                            <Label htmlFor="DepartureTime" className="font-semibold text-neutral-800 dark:text-neutral-200">Departure Time:</Label>
                            <Input type="number" id="DepartureTime" name="DepartureTime" value={formData.DepartureTime} onChange={handleChange} required className="input-field" />
                        </div>

                        {/* Flight Duration */}
                        <div className="mb-4">
                            <Label htmlFor="FlightDuration" className="font-semibold text-neutral-800 dark:text-neutral-200">Flight Duration:</Label>
                            <Input type="number" id="FlightDuration" name="FlightDuration" value={formData.FlightDuration} onChange={handleChange} required className="input-field" />
                        </div>
                    </div>

                    <div className='grid grid-cols-4 mt-3 gap-4'>

                        {/* Airplane Model */}
                        <div className="mb-4">
                            <Label htmlFor="AirplaneModel" className="font-semibold text-neutral-800 dark:text-neutral-200">Airplane Model:</Label>
                            <Input type="text" id="AirplaneModel" name="AirplaneModel" value={formData.AirplaneModel} onChange={handleChange} required className="input-field" />
                        </div>

                        {/* First Class Price */}
                        <div className="mb-4">
                            <Label htmlFor="FirstClassPrice" className="font-semibold text-neutral-800 dark:text-neutral-200">First Class Price:</Label>
                            <Input type="number" id="FirstClassPrice" name="FirstClassPrice" value={formData.FirstClassPrice} onChange={handleChange} required className="input-field" />
                        </div>

                        {/* Business Class Price */}
                        <div className="mb-4">
                            <Label htmlFor="BusinessClassPrice" className="font-semibold text-neutral-800 dark:text-neutral-200">Business Class Price:</Label>
                            <Input type="number" id="BusinessClassPrice" name="BusinessClassPrice" value={formData.BusinessClassPrice} onChange={handleChange} required className="input-field" />
                        </div>

                        {/* Economy Class Price */}
                        <div className="mb-4">
                            <Label htmlFor="EconomyClassPrice" className="font-semibold text-neutral-800 dark:text-neutral-200">Economy Class Price:</Label>
                            <Input type="number" id="EconomyClassPrice" name="EconomyClassPrice" value={formData.EconomyClassPrice} onChange={handleChange} required className="input-field" />
                        </div>
                    </div>

                    <div className='grid grid-cols-3 mt-3 gap-4'>
                            
                            {/* Economy Seat Group */}
                            <div className="mb-4">
                                <Label htmlFor="EconomySeatGroupRows" className="font-semibold text-neutral-800 dark:text-neutral-200">{formData.SeatGroups.Economy.name}</Label>
                                <Input type="number" placeholder='rows' name="SeatGroups.Economy.rows" value={formData.SeatGroups.Economy.rows !== null ? formData.SeatGroups.Economy.rows : ''} onChange={(e) => handleSeatGroupChange('Economy', 'rows', parseInt(e.target.value, 10))} required className="input-field" />
                                <Input type="number" placeholder='cols' name="SeatGroups.Economy.cols" value={formData.SeatGroups.Economy.cols !== null ? formData.SeatGroups.Economy.cols : ''} onChange={(e) => handleSeatGroupChange('Economy', 'cols', parseInt(e.target.value, 10))} required className="input-field" />
                            </div>

                            {/* Business Seat Group */}
                            <div className="mb-4">
                                <Label htmlFor="BusinessSeatGroupName" className="font-semibold text-neutral-800 dark:text-neutral-200">{formData.SeatGroups.Business.name}</Label>
                                <Input type="number" placeholder='rows' id="BusinessSeatGroupName" name="SeatGroups.Business.rows" value={formData.SeatGroups.Business.rows != null ? formData.SeatGroups.Business.rows: ""} onChange={(e) => handleSeatGroupChange('Business', 'rows', parseInt(e.target.value, 10))} required className="input-field" />
                                <Input type="number" placeholder='cols' id="BusinessSeatGroupName" name="SeatGroups.Business.cols" value={formData.SeatGroups.Business.cols != null ? formData.SeatGroups.Business.cols: ""} onChange={(e) => handleSeatGroupChange('Business', 'cols', parseInt(e.target.value, 10))} required className="input-field" />
                            </div>

                            {/* First Class Seat Group */}
                            <div className="mb-4">
                                <Label htmlFor="FirstClassSeatGroupName" className="font-semibold text-neutral-800 dark:text-neutral-200">{formData.SeatGroups.First.name}</Label>
                                <Input type="number" placeholder='rows' id="FirstClassSeatGroupName" name="SeatGroups.First.rows" value={formData.SeatGroups.First.rows != null ? formData.SeatGroups.First.rows: ""} onChange={(e) => handleSeatGroupChange('First', 'rows', parseInt(e.target.value, 10))} required className="input-field" />
                                <Input type="number" placeholder='cols' id="FirstClassSeatGroupName" name="SeatGroups.First.cols" value={formData.SeatGroups.First.cols != null ? formData.SeatGroups.First.cols: ""} onChange={(e) => handleSeatGroupChange('First', 'cols', parseInt(e.target.value, 10))} required className="input-field" />
                            </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        className="m-auto w-1/2 mt-4 bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                        type="submit"
                    >
                        Register Flight
                    </button>
                </form>

            </div>
        );
    };

    const Btn = ({ text, onClick, className, id = "FlightType" , name = "FlightType", value}: { text: string; onClick?: () => void; className?:string; id?:string; name?:string; value?:string }) => {
        return (
          <span
            className={cn("flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 dark:text-white shadow-input rounded-md px-3 py-2 placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-400 items-center text-lg font-medium text-gray-600 hover:ring-2 cursor-pointer self-end mt-1 justify-center", className)}
            onClick={onClick}
            style={{ transition: "all 0.3s" }}
            id = {id}
          >
            {text}
          </span>
        );
      };