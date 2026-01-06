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
import { Navbar } from "../../components/navbar/navbar";
import { IconPlaneOff, IconSearch, IconRefresh } from "@tabler/icons-react";

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

  const [error, SetError] = useState("");
  const [loading, SetLoading] = useState(false);

  const handleSubmit = () => {
    const formData = {
      departureCity: OriginCity,
      destinationCity: DestinationCity,
      status: Status,
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
            <Link to="/BrowseFlights">
              <button className="w-full h-10 p-[2px] rounded-md bg-gray-200 relative group/btn">
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
};

export function BrowseFlights() {
  const [Airline, SetAirline] = useState("");
  const [Airplane, SetAirplane] = useState("");
  const [OriginCity, SetOriginCity] = useState("");
  const [DestinationCity, SetDestinationCity] = useState("");
  const [DateFrom, SetDateFrom] = useState("");
  const [DateTo, SetDateTo] = useState("");
  const [price, SetPrice] = useState<number>();

  const [error, SetError] = useState("");
  const [loading, SetLoading] = useState(false);
  const [IsSearched, setIsSearched] = useState(false);

  const [FlightData, SetFlightData] = useState([]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    SetLoading(true);
    setIsSearched(true);

    console.log("Search Button Clicked");

    const flightType = label === "Both" ? "" : label;

    const formData = {
      OriginCity: OriginCity,
      DestinationCity: DestinationCity,
      dateFrom: DateFrom,
      dateTo: DateTo,
      maxPrice: price,
      status: status,
      flightType: flightType,
      Airline: Airline,
      Airplane: Airplane,
    };

    console.log(formData);

    const jsonData = JSON.stringify(formData);

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      SetLoading(true);

      const { data } = await axios.post(
        getApiUrl("api/flights/getFilteredFlights"),
        jsonData,
        config
      );

      SetFlightData(data);

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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <Navbar />
      <div className="pt-24 pb-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 px-5 py-6 rounded-2xl shadow-lg bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-700">
            <div className="text-center mb-6">
              <h2 className="font-bold text-2xl md:text-3xl text-neutral-800 dark:text-neutral-200 mb-2">
                Find Your Perfect Flight
              </h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Search and filter flights to match your travel needs
              </p>
            </div>

            <form onSubmit={handleSubmit} className=" mx-auto space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label
                    htmlFor="airline"
                    className="text-neutral-700 dark:text-neutral-300"
                  >
                    Airline
                  </Label>
                  <Input
                    id="airline"
                    type="text"
                    placeholder="Enter Airline"
                    value={Airline}
                    onChange={(e) => SetAirline(e.target.value)}
                  />
                </div>
                <div>
                  <Label
                    htmlFor="originCity"
                    className="text-neutral-700 dark:text-neutral-300"
                  >
                    Origin City
                  </Label>
                  <Input
                    id="originCity"
                    type="text"
                    placeholder="Enter Origin City"
                    value={OriginCity}
                    onChange={(e) => SetOriginCity(e.target.value)}
                    className=""
                  />
                </div>
                <div>
                  <Label
                    htmlFor="destinationCity"
                    className="text-neutral-700 dark:text-neutral-300"
                  >
                    Destination City
                  </Label>
                  <Input
                    id="destinationCity"
                    type="text"
                    placeholder="Enter Destination City"
                    value={DestinationCity}
                    onChange={(e) => SetDestinationCity(e.target.value)}
                    className=""
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <div>
                  <Label
                    htmlFor="Date From"
                    className="text-neutral-700 dark:text-neutral-300"
                  >
                    Date From
                  </Label>
                  <Input
                    id="Date From"
                    type="Date"
                    placeholder="Enter Date From"
                    value={DateFrom}
                    onChange={(e) => SetDateFrom(e.target.value)}
                    className=""
                  />
                </div>

                <div>
                  <Label
                    htmlFor="Date to"
                    className="text-neutral-700 dark:text-neutral-300"
                  >
                    Date To
                  </Label>
                  <Input
                    id="Date to"
                    type="Date"
                    placeholder="Enter Date to"
                    value={DateTo}
                    onChange={(e) => SetDateTo(e.target.value)}
                    className=""
                  />
                </div>

                <div>
                  <Label
                    htmlFor="Airplane Model"
                    className="text-neutral-700 dark:text-neutral-300"
                  >
                    Airplane
                  </Label>
                  <Input
                    id="Plane Model"
                    type="text"
                    placeholder="Enter airplane"
                    value={Airplane}
                    onChange={(e) => SetAirplane(e.target.value)}
                    className=""
                  />
                </div>

                <div>
                  <Label
                    htmlFor="price"
                    className="text-neutral-700 dark:text-neutral-300"
                  >
                    Max Price
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="Enter max price"
                    value={price}
                    onChange={(e) => SetPrice(parseInt(e.target.value))}
                    className=""
                  />
                </div>

                <div>
                  <Label
                    htmlFor="label"
                    className="text-neutral-700 dark:text-neutral-300"
                  >
                    Flight Type
                  </Label>
                  <Btn text={label} onClick={handleLabelChange} />
                </div>

                <div>
                  <Label
                    htmlFor="Status"
                    className="text-neutral-700 dark:text-neutral-300"
                  >
                    Flight Status
                  </Label>
                  <Btn text={status} onClick={handleStatusChange} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <button
                  className="flex items-center justify-center gap-2 border-2 border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-zinc-800 hover:bg-neutral-100 dark:hover:bg-zinc-700 block w-full text-neutral-700 dark:text-neutral-300 rounded-lg h-11 font-medium transition-all duration-200"
                  type="button"
                  onClick={() => {
                    SetAirline("");
                    SetAirplane("");
                    SetOriginCity("");
                    SetDestinationCity("");
                    SetDateFrom("");
                    SetDateTo("");
                    SetPrice(undefined);
                    setLabel("Both");
                    setStatus("Scheduled");
                    setIsSearched(false);
                    SetFlightData([]);
                    SetError("");
                  }}
                >
                  <IconRefresh className="h-4 w-4" />
                  Reset Filters
                </button>
                <button
                  className="flex items-center justify-center gap-2 bg-gradient-to-br from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 block w-full text-white rounded-lg h-11 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                  type="submit"
                >
                  <IconSearch className="h-4 w-4" />
                  Search Flights
                </button>
              </div>
            </form>
          </div>

          <div className="flex flex-row gap-6 mt-8">
            <div className="hidden xl:flex flex-col min-w-64 w-64 px-6 py-6 rounded-2xl shadow-lg bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-700 self-start">
              <h3 className="text-lg font-semibold mb-3 text-neutral-800 dark:text-neutral-200">
                Special Offers
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-900/20 dark:to-indigo-900/20 border border-sky-200 dark:border-sky-800">
                  <p className="text-sm font-semibold text-sky-700 dark:text-sky-300">
                    20% off
                  </p>
                  <p className="text-xs text-neutral-600 dark:text-neutral-400">
                    On Mastercard payments
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-1 px-6 py-6 rounded-2xl shadow-lg bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-700">
              {error && <DisplayError error={error} />}
              {!IsSearched && !error && <EmptySearchState />}
              {IsSearched && (
                <DisplayFlights Isloading={loading} data={FlightData} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const DisplayError = ({ error }: { error: string }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg">
      <p className="font-medium">{error}</p>
    </div>
  );
};

const EmptySearchState = () => {
  return (
    <div className="flex flex-col w-full items-center justify-center py-16 px-4 text-center">
      <div className="mb-6 p-4 rounded-full bg-sky-100 dark:bg-sky-900/20">
        <IconSearch className="h-12 w-12 text-sky-600 dark:text-sky-400" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
        Start Your Flight Search
      </h3>
      <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
        Fill in the search form above to find available flights. You can filter
        by origin, destination, dates, price, and more.
      </p>
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
    <button
      type="button"
      className="flex h-10 w-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-zinc-800 text-neutral-700 dark:text-neutral-300 shadow-sm rounded-lg px-3 py-2
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400 
        disabled:cursor-not-allowed disabled:opacity-50 hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-all duration-200
        items-center text-sm font-medium cursor-pointer justify-center "
      onClick={onClick}
    >
      {text}
    </button>
  );
};
