"use client";
import React, { ReactElement, useState } from "react";
import { cn } from "../../utils/cn";
import { Link } from "react-router-dom";
import axios from "axios";
import { Loading } from "../../components/Loading/Loading";
import BottomGradient from "../../components/ui/BottomGradient";

import {
  IconCalendarClock,
  IconTruckLoading,
  IconPlaneOff,
  IconClockExclamation,
  IconPlaneInflight,
  IconTimeline,
  IconTag,
  IconPlaneArrival,
  IconPlaneDeparture,
  IconCoins,
  IconCalendarMonth,
  IconPlaneTilt,
  IconMapPins,
  IconWorld,
} from "@tabler/icons-react";
import { Button } from "../button/button";


interface Flight {
  FlightID: string;
  DepartureCity: string;
  DestinationCity: string;
  DepartureTime: string;
  AirplaneModel: string;
  FlightType: string;
  Status: string;
  FlightDuration: number;
  FirstClassPrice: number;
  BusinessClassPrice: number;
  EconomyClassPrice: number;
  Date: Date;
}

interface DisplayFlightsProps {
  Isloading: boolean;
  data: Flight[];
}


export const DisplayFlightsSm: React.FC<DisplayFlightsProps> = ({
  Isloading,
  data,
}) => {

    console.log("display list")
    console.log(data)

    interface ListItemProps {
        departureCity: string;
        destination: string;
        price: string | number;
        departureTime: string;
        type: string
        status: string
      }
    
    const ListItem: React.FC<ListItemProps> = ({ departureCity, destination, price, departureTime, type, status }) => {
      return (
        <div className="bg-gray-100 border rounded px-2 py-1 mb-4 flex justify-between">
          <div className="font-semibold">{departureCity}</div>
          <div className="text-blue-500">{destination}</div>
          <div className="text-red-500">{price}</div>
          <div className="italic">{departureTime}</div>
        </div>
      );
    };

  return (
    <div className="image/contentSkeleton h-full overflow-y-auto max-h-56 w-full pr-4 box-content">
        <div>
            {Isloading && <LoadingModal />}
            {data?.length == 0 ?
              <Nodata/> :
              ( data?.map((data) => (
                <ListItem
                  key={data.FlightID}
                  departureCity={data.DepartureCity}
                  destination={data.DestinationCity}
                  price={data.EconomyClassPrice}
                  type = {data.FlightType}
                  status = {data.Status}
                  departureTime={data.DepartureTime}
                />
              ))
            )}
        </div>
    </div>
  );
}


export const DisplayFlights: React.FC<DisplayFlightsProps> = ({
  Isloading,
  data,
}) => {
    console.log("display list")
    console.log(data)

    interface ListItemProps {
        FlightId: string;
        departureCity: string;
        destination: string;
        price: string | number;
        departureTime: string;
        date: Date;
        type: string;
        status: string;
        Airplane: string;
        Airline: string;
      }
    
    const ListItem: React.FC<ListItemProps> = ({ departureCity, destination, price, departureTime, date, type, status, FlightId, Airplane, Airline }) => {
      
      const parsedDate = new Date(date);
      const isValidDate = !isNaN(parsedDate.getTime());
      const formattedDate = isValidDate ? parsedDate.toLocaleDateString() : "";

      return (
        <div className="p-4 rounded-xl shadow-lg font-medium text-neutral-700 bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 px-4 py-4 flex mb-4 min-h-32 hover:shadow-xl transition-shadow duration-200"
        style={{textWrap:"nowrap"}}
        >

          <div className="flex flex-col items-center justify-between">

            <div className="flex flex-row items-center">
              <StatusIcon
                status={status}
              />
              <h3 className="text-lg px-2 text-sky-900">{status}</h3>
            </div>
            
            <div className="w-full flex flex-row">
              <div className="inline-flex items-center justify-start self-start">
                <IconCalendarMonth className="h-4 w-4 text-neutral-500" />
                <p className="text-sm text-neutral-600 px-1">{formattedDate}</p>
              </div>
            </div>
            
            <div className="w-full flex flex-row">
              <div className="inline-flex items-center justify-start self-start">
                <IconTimeline className="h-4 w-4 text-neutral-500" />
                <p className="text-sm px-1">{departureTime}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-between px-3 lg:px-6">
            <div className="w-full justify-around flex flex-row">
              <div className="flex items-center self-start mt-2 mx-2">
                <IconPlaneTilt className="h-4 w-4 text-neutral-500" />
                <h3 className="px-2 font-medium text-md">{Airline}</h3>
              </div>
              <div className="items-center self-start mt-2 mx-2 hidden md:flex">
                <IconTag className="h-4 w-4 text-neutral-500" />
                <p className="px-2 font-normal">{FlightId}</p>
              </div>
              <div className="flex items-center self-start mt-2 mx-2 min-w-[6rem]">
                <IconCoins className="h-4 w-4 text-neutral-500" />
                <p className="px-2 font-normal">Rs. {price}</p>
              </div>
              <div>
                <Label
                  text={type}
                  className="hidden md:flex"
                />
                <Label
                  text = {type == "Domestic" ? <IconMapPins className="h-4 w-4 text-neutral-500" /> : <IconWorld className="h-4 w-4 text-neutral-500" /> }
                  className="flex md:hidden"
                />
              </div>
            </div>
            <div className="mt-2 flex flex-row w-[100%] max-w-[28rem] min-w-[15rem] items-end">
              <p className="text-gray-500">{departureCity}</p>
              <div className="w-full px-2 mb-2">
                <div className="w-full flex flex-row justify-between p-1">
                  <IconPlaneDeparture className="h-5 w-5 text-neutral-500 self-start" />
                  <IconPlaneArrival className="h-5 w-5 text-neutral-500 self-end" />
                </div>
                  <div className="h-0.5 rounded-md bg-gray-500"></div>
              </div>
              <p className="text-gray-500">{destination}</p>
            </div>
          </div>

          <div className="flex items-center">
            <Button
              className="h-12 rounded-xl text-center flex"
              displayName="More Info"
              route={"/Flights/"+FlightId}
            />
          </div>
        </div>
      );
    };

  return (
    <div className="h-fit w-full">
        <div>
            {Isloading && <LoadingModal />}
            {data?.length == 0 ?
              <Nodata/> :
              ( data?.map((data) => (
                <ListItem
                  FlightId={data.FlightID}
                  key={data.FlightID}
                  departureCity={data.DepartureCity}
                  destination={data.DestinationCity}
                  price={data.EconomyClassPrice}
                  type = {data.FlightType}
                  status = {data.Status}
                  departureTime={data.DepartureTime}
                  date={data.Date}
                  Airplane={data.AirplaneModel}
                  Airline="fly Emirates"
                />
                
              ))
            )}
        </div>
    </div>
  );
}


const Label = ({text, className}:{text:string | React.ReactNode, className?:string}) => {
  return(
    <span className={cn("inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-sm font-medium text-gray-600 ring-1",
    className)}                 
    >
    {text}
    </span>
  )
}

const StatusIcon = ({ status }: { status: string }) => {

  const statusIconMapping: { [key: string]: JSX.Element } = {
    Scheduled: <IconCalendarClock className="h-4 w-4 text-sky-950" />,
    Boarding: <IconTruckLoading className="h-4 w-4 text-sky-950" />,
    'In-Flight': <IconPlaneInflight className="h-4 w-4 text-sky-950" />,
    Arrived: <IconPlaneArrival className="h-4 w-4 text-sky-950" />,
    Delayed: <IconClockExclamation className="h-4 w-4 text-sky-950" />,
    Cancelled: <IconPlaneOff className="h-4 w-4 text-sky-950" />,
  };

  const icon = statusIconMapping[status];

  return icon
}

const Nodata = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-6 p-4 rounded-full bg-sky-100 dark:bg-sky-900/20">
        <IconPlaneOff className="h-12 w-12 text-sky-600 dark:text-sky-400" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-2">
        No Flights Found
      </h3>
      <p className="text-neutral-600 dark:text-neutral-400 max-w-md mb-4">
        We couldn't find any flights matching your search criteria. Try adjusting your filters or search parameters.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-medium transition-colors duration-200"
        >
          Refresh Search
        </button>
      </div>
    </div>
  )
}

const LoadingModal = () => {
    return (
      <div className="absolute inset-0 z-5 flex m-2 rounded-xl justify-center items-center backdrop-filter backdrop-blur-lg bg-opacity-50">
        <div className="dark:bg-black p-8 rounded-lg shadow-lg">
          <Loading />
        </div>
      </div>
    );
  };