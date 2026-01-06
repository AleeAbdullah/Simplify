"use client";
import React, { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../utils/cn";
import { Link } from "react-router-dom";
import axios from "axios";
import { Loading } from "../../components/Loading/Loading";
import { getApiUrl } from "../../config/api";
import BottomGradient from "../../components/ui/BottomGradient";
import { isErrored } from "stream";
import { DisplayFlights } from "../../components/DisplayList/DisplayList";

export interface BrowseFlightsSmProps {
  isSearched: boolean;
  onSearch: (formData: any) => void;
  onRefresh: () => void;
}

export const BrowseFlightsSm: React.FC<BrowseFlightsSmProps> = ({
  isSearched,
  onSearch,
  onRefresh,
}) => {
  const [OriginCity, SetOriginCity] = useState("");
  const [DestinationCity, SetDestinationCity] = useState("");
  const [Status, SetStatus] = useState("");

  const[error, SetError] = useState("");
  const[loading, SetLoading] = useState(false)

  const handleSubmit = () => {

    const formData = {
      "departureCity": OriginCity,
      "destinationCity": DestinationCity,
      "status": Status,
    };

    const jsonData = JSON.stringify(formData);

    onSearch(jsonData); 
  };

  const handleRefresh = () => {
    SetOriginCity("");
    SetDestinationCity("");
    SetStatus("");
    
    onRefresh();
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className=" mx-auto space-y-4">
        <div className="grid grid-cols-3 mt-3 gap-4">
          <div>
            <Input
              id="originCity"
              type="text"
              placeholder="Enter Origin City"
              value={OriginCity}
              onChange={(e) => SetOriginCity(e.target.value)}
            />
          </div>
          <div>
            <Input
              id="destinationCity"
              type="text"
              placeholder="Enter Destination City"
              value={DestinationCity}
              onChange={(e) => SetDestinationCity(e.target.value)}
            />
          </div>
          <div>
            <Input
              id="Status"
              type="text"
              placeholder="Enter Flight Status"
              value={Status}
              onChange={(e) => SetStatus(e.target.value)}
            />
          </div>
        </div>
      
        <div className="grid grid-cols-3 gap-4 p-4 px-8">
          <div>
            <Link
              to="/BrowseFlights"
            >
              <button
                className="w-full h-10 p-[2px] rounded-md bg-gray-200 relative group/btn"
              >
                <div className="absolute inset-0 bg-grey w-full text-white rounded-md" />
                <div className="flex items-center justify-center w-full h-full bg-neutral-100 rounded-md relative group transition duration-200 text-black hover:bg-transparent font-medium">
                  More Options
                </div>
              </button>
            </Link>
          </div>
          <div>
            <button
              className="w-full h-10 p-[2px] rounded-md bg-gray-200 relative group/btn"
              onClick={handleRefresh}
              type="button"
            >
              <div className="absolute inset-0 bg-grey w-full text-white rounded-md" />
              <div className="flex items-center justify-center w-full h-full bg-neutral-100 rounded-md relative group transition duration-200 text-black hover:bg-transparent font-medium">
                Refresh
              </div>
            </button>
          </div>
          <div>
            <button
              className=" bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              onClick={handleSubmit}
            >
              Search Flights
              <BottomGradient />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}


export function BrowseFlights() {

  const [Airline, SetAirline] = useState("");
  const [Airplane, SetAirplane] = useState(""); 
  const [OriginCity, SetOriginCity] = useState("");
  const [DestinationCity, SetDestinationCity] = useState("");
  const [DateFrom, SetDateFrom] = useState("");
  const [DateTo, SetDateTo] = useState("");
  const [price, SetPrice] = useState<number>();

  const[error, SetError] = useState("");
  const[loading, SetLoading] = useState(false)
  const[IsSearched, setIsSearched] = useState(false)

  const [FlightData, SetFlightData] = useState([])


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) =>
  {
    e.preventDefault();
    
    SetLoading(true);
    setIsSearched(true);

    console.log("Search Button Clicked")

    const flightType = label === "Both" ? "" : label;

    const formData = {
      "OriginCity": OriginCity,
      "DestinationCity": DestinationCity,
      "dateFrom": DateFrom,
      "dateTo": DateTo,
      "maxPrice": price,
      "status": status,
      "flightType": flightType,
      "Airline": Airline,
      "Airplane": Airplane,
      };

    console.log(formData);

    const jsonData = JSON.stringify(formData);

    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }
      SetLoading(true);
  
      const { data } = await axios.post(
        getApiUrl("api/flights/getFilteredFlights"), 
        jsonData
        ,
        config
      );


      SetFlightData(data)

      SetLoading(false);
      SetError("");

    } catch (error: any) {
      SetError(error.response.data.message);
      SetLoading(false);
    }
  };

  //////////////////////////
  const [label, setLabel] = useState("Both");

  const handleLabelChange = () => {
    if (label === "Both") {
      setLabel("Domestic");
    } else if (label === "Domestic") {
      setLabel("International");
    } else {
      setLabel("Both");
    }
  };
  ///////////////////////////
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

  return (
    <div>
      <div className=" my-14 px-5 mx-10 rounded-2xl p-3 md:p-5 shadow-input bg-white dark:bg-black self-center">
        <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
          Find Flights
        </h2>

        <form onSubmit={handleSubmit} className=" mx-auto space-y-4">

        <div className="grid grid-cols-3 mt-3 gap-4">
          <div>
            <Label htmlFor="airline">Airline</Label>
            <Input
              id="airline"
              type="text"
              placeholder="Enter Airline"
              value={Airline}
              onChange={(e) => SetAirline(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="originCity">Origin City</Label>
            <Input
              id="originCity"
              type="text"
              placeholder="Enter Origin City"
              value={OriginCity}
              onChange={(e) => SetOriginCity(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="destinationCity">Destination City</Label>
            <Input
              id="destinationCity"
              type="text"
              placeholder="Enter Destination City"
              value={DestinationCity}
              onChange={(e) => SetDestinationCity(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="w-fit justify-self-center">
            <Label htmlFor="Date From">Date From</Label>
            <Input
              id="Date From"
              type="Date"
              placeholder="Enter Date From"
              value={DateFrom}
              onChange={(e) => SetDateFrom(e.target.value)}
            />
          </div>

          <div className="w-fit justify-self-center">
            <Label htmlFor="Date to">Date To</Label>
            <Input
              id="Date to"
              type="Date"
              placeholder="Enter Date to"
              value={DateTo}
              onChange={(e) => SetDateTo(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="Airplane Model">Airplane</Label>
            <Input
              id="Plane Model"
              type="text"
              placeholder="Enter airplane"
              value={Airplane}
              onChange={(e) => SetAirline(e.target.value)}
            />
          </div>

          <div className="w-fit justify-self-center">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              placeholder="Enter price range"
              value={price}
              onChange={(e) => SetPrice(parseInt(e.target.value))}
            />
          </div>  

          <div className="w-fit justify-self-center col-span-1 md:col-span-2 lg:col-span-1">
            <Label htmlFor="label">Flight Type</Label>
            <Btn text={label} onClick={handleLabelChange} />
          </div>

          <div className="w-fit justify-self-center col-span-1 md:col-span-2 lg:col-span-1">
            <Label htmlFor="Status">Flight Status</Label>
            <Btn text={status} onClick={handleStatusChange} />
          </div>

        </div>

        <div className="grid grid-cols-2 gap-4 p-5">
          <div>
            <button
              className=" mt-4 border-2 border-gray bg-neutral-100 block w-full text-black rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="button"
            >
              More options
              <BottomGradient />
            </button>
          </div>
          <div>
            <button
              className=" mt-4 bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
              type="submit"
            >
              Search Flights
              <BottomGradient />
            </button>
          </div>
        </div>
      </form>
    </div> 
    <div className="flex flex-row">
      <div className=" flex-col min-w-56 w-56 my-14 px-5 mx-5 rounded-2xl p-3 md:p-5 shadow-input bg-white dark:bg-black self-start hidden xl:flex">
          <h3 className="text-lg font-semibold mb-3 ">Discounts</h3>
          <p>20% off on master cards</p>
      </div>
      <div className="flex flex-1 my-14 px-5 mx-5 mr-10 rounded-2xl p-3 md:p-5 shadow-input bg-white dark:bg-black self-center">
        {error && <DisplayError error = {error} />}
        {IsSearched && <DisplayFlights
          Isloading = {loading}
          data={FlightData}
        />}
      </div>
    </div>
  </div>
  );
}


const DisplayError = ({
  error
}: {
  error:string
}) => {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
      {error}
    </div>
  );
};

const LabelInputContainer = ({
    children,
    className,
  }: {
    children: React.ReactNode;
    className?: string;
  }) => {
    return (
      <div className={cn("flex flex-col space-y-2 w-full", className)}>
        {children}
      </div>
    );
  };


  const Btn = ({ text, onClick }: { text: string; onClick: () => void }) => {
    return (
      <span
        className="flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 dark:text-white shadow-input rounded-md px-3 py-2
        placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] 
        focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-400
        items-center text-lg font-medium text-gray-600 hover:ring-2 cursor-pointer self-end mt-1 justify-center"
        onClick={onClick}
        style={{ transition: "all 0.3s" }}
      >
        {text}
      </span>
    );
  };