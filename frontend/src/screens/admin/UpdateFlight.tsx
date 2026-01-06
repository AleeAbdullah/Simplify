import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Label } from "../../components/ui/label";
import { getApiUrl } from "../../config/api";
import { Input } from "../../components/ui/input";
import { cn } from '../../utils/cn';

interface Flight {
    FlightID: string;
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
    BookedSeats: BookedSeat[]; // Adjusted type for BookedSeats
}


export const UpdateFlight = () => {

    const params = useParams();

    const [FlightID, setFlightID] = useState<string>("");
    
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
        BookedSeats: [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await axios.post(getApiUrl(`api/flights/update/${FlightID}`), {
                Date: formData.Date,
                DepartureCity: formData.DepartureCity,
                DestinationCity: formData.DestinationCity,
                DepartureTime: formData.DepartureTime,
                FlightDuration: formData.FlightDuration,
                AirplaneModel: formData.AirplaneModel,
                FlightType: formData.FlightType,
                FirstClassPrice: formData.FirstClassPrice,
                BusinessClassPrice: formData.BusinessClassPrice,
                EconomyClassPrice: formData.EconomyClassPrice,
                Status: formData.Status
            });
            console.log(response.data);
            alert('Flight data updated successfully!');
        } catch (error: any) {
            console.error('Error:', error.response.data.message);
            alert('Error updating flight data. Please try again later.');
        }
    };
    


    useEffect(() => {
        const fetchFlightData = async () => {
            try {
                console.log("formData")
                const response = await axios.post(getApiUrl(`api/flights/getFlightById/${params.FlightID}`));
                const flightData: FlightFormData = response.data;
                
                console.log(flightData)
                const formattedDate = flightData.Date.split('T')[0];

                setFlightID(flightData.FlightID);
                setType(flightData.FlightType);
                setStatus(flightData.Status);
                setFormData({
                    FlightID: flightData.FlightID,
                    Date: formattedDate,
                    DepartureCity: flightData.DepartureCity,
                    DestinationCity: flightData.DestinationCity,
                    DepartureTime: flightData.DepartureTime,
                    FlightDuration: flightData.FlightDuration,
                    AirplaneModel: flightData.AirplaneModel,
                    FlightType: flightData.FlightType,
                    FirstClassPrice: flightData.FirstClassPrice,
                    BusinessClassPrice: flightData.BusinessClassPrice,
                    EconomyClassPrice: flightData.EconomyClassPrice,
                    Status: flightData.Status,
                    BookedSeats: flightData.BookedSeats
                });                

                console.log(formData)

    
            } catch (error) {
                console.error('Error fetching flight data:', error);
            }
        };
    
        if (params.FlightID) {
            fetchFlightData();
        }
    }, [params.FlightID]); // Include params.FlightID in the dependency array
    


    return (
        <div className="mx-32 rounded-2xl p-3 md:p-5 shadow-input bg-white dark:bg-black self-center">
            <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
                Update
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
