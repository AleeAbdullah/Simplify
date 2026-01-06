import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
import { Seat_Picker } from "../../components/SeatPicker/SeatPicker";
import { Button } from "../../components/button/button";
import classnames from "classnames";
import { useAuth } from "../../auth/auth";

import {
  IconClock,
  IconTimeDuration0,
  IconMapPinDown,
  IconMapPinUp,
  IconClick,
  IconReceipt2,
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
  IconX,
} from "@tabler/icons-react";
import { response } from "express";
import { Navbar } from "../../components/navbar/navbar";

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

interface FlightData {
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

export function FlightInfo() {
  const { getToken, isloggedin } = useAuth();
  const { FlightID } = useParams();

  const navigate = useNavigate();

  const [SelectedSeats, SetSelectedSeats] = useState<
    { row: string; col: number; group_name: string }[]
  >([]);

  const [flightData, setFlightData] = useState<FlightData>();

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [IsMessage, setIsMessage] = useState(0);

  useEffect(() => {
    setLoading(true);

    async function fetchFlightData() {
      try {
        const response = await axios.post(
          getApiUrl(`api/flights/getFlightById/${FlightID}`)
        );
        setFlightData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching flight data:", error);
        setLoading(false);
      }
    }
    fetchFlightData();
    console.log(flightData);
  }, [FlightID]);

  if (!flightData) {
    if (loading) {
      return <LoadingModal />;
    }
    return <div>Error: Flight data not found.</div>;
  } else if (!flightData.SeatGroups) {
    if (loading) {
      return <LoadingModal />;
    }
    return <div>Error: Seat groups not found.</div>;
  }

  const seatGroupsArray = Object.values(flightData.SeatGroups);
  const BookedSeatsArray = Object.values(flightData.BookedSeats);

  const totalCost = SelectedSeats.reduce((total, seat) => {
    const seatGroup = seatGroupsArray.find(
      (group) => group.name === seat.group_name
    );
    if (seatGroup) {
      switch (seat.group_name) {
        case "Economy Class":
          total += flightData.EconomyClassPrice;
          break;
        case "Business Class":
          total += flightData.BusinessClassPrice;
          break;
        case "First Class":
          total += flightData.FirstClassPrice;
          break;
        default:
          break;
      }
    }
    return total;
  }, 0);

  const getPriceByGroupName = (groupName: string): number => {
    switch (groupName) {
      case "Economy Class":
        return flightData?.EconomyClassPrice || 0;
      case "Business Class":
        return flightData?.BusinessClassPrice || 0;
      case "First Class":
        return flightData?.FirstClassPrice || 0;
      default:
        return 0;
    }
  };

  const onsubmit = async () => {
    const data = {
      FlightID: FlightID,
      seats: SelectedSeats,
    };

    console.log(SelectedSeats);
    console.log(FlightID);
    try {
      const response = await axios.post(getApiUrl("api/flights/book/"), data);

      console.log(response.data);
    } catch (error) {
      console.error("Error booking seats:", error);
    }

    try {
      for (const seat of SelectedSeats) {
        const response = await axios.post(getApiUrl("api/bookedFlights/book"), {
          UserToken: getToken(),
          FlightID: FlightID,
          row: seat.row,
          col: seat.col,
          group_name: seat.group_name,
        });
        setMessage(response.data.message);
      }
      setIsMessage(1);
    } catch (error: any) {
      setMessage(error.response.data.message);
      setIsMessage(2);
      navigate("/login");
    }
  };
  return (
    <div className="flight info">
      {IsMessage == 2 && <ErrMsg msg={message} Ismsg={setIsMessage} />}
      {IsMessage == 1 && <SuccessMsg msg={message} Ismsg={setIsMessage} />}

      {loading && <LoadingModal />}
      <div className="flex">
        <div className="h-screen w-[380px] hover:w-[420px] overflow-hidden transform duration-700">
          <Seat_Picker
            seatGroups={seatGroupsArray.map((seatGroup) => ({
              name: seatGroup.name,
              rows: seatGroup.rows || 0,
              cols: seatGroup.cols || 0,
            }))}
            BookedSeats={BookedSeatsArray.map((BookedSeat) => ({
              seat_group: BookedSeat.group_name,
              row: BookedSeat.row,
              col: BookedSeat.col,
            }))}
            SelectedSeats={SelectedSeats}
            SetSelectedSeats={SetSelectedSeats}
            className="mx-6 pt-10 hover:pt-0 transform duration-700 hover:-translate-y-7"
          />
        </div>

        <div className="flex flex-col flex-1 mt-12 mx-8 p-8 rounded-lg border-2 overflow-y-auto h-[31rem]">
          {/* ------------------------------ */}
          <div className="w-full flex flex-row justify-between mb-6">
            <div className="inline-flex items-center justify-start self-start">
              <Label className="text-xl font-bold text-sky-900">
                {flightData.Status}
              </Label>
            </div>

            <div className="inline-flex items-center justify-start self-start">
              <IconTag className="h-5 w-5 text-neutral-500" />
              <Label className="text-lg text-neutral-700">Flight ID:</Label>
              <div className="mx-4 text-lg">{flightData.FlightID}</div>
            </div>

            <div className="inline-flex items-center justify-start self-start">
              <IconPlaneTilt className="h-5 w-5 text-neutral-500" />
              <Label className="text-lg text-neutral-700">Airplane:</Label>
              <div className="mx-4 text-lg">{flightData.AirplaneModel}</div>
            </div>
          </div>
          {/* ------------------------------ */}
          <div className="w-full flex flex-row justify-between mb-6">
            <div className="inline-flex items-center justify-start self-start">
              <IconCalendarMonth className="h-5 w-5 text-neutral-500" />
              <Label className="text-lg text-neutral-700">Date:</Label>
              <div className="mx-4 text-lg">{formatDate(flightData.Date)}</div>
            </div>

            <div className="inline-flex items-center justify-start self-start">
              <IconClock className="h-5 w-5 text-neutral-500" />
              <Label className="text-lg text-neutral-700">Time:</Label>
              <div className="mx-4 text-lg">{flightData.DepartureTime}</div>
            </div>

            <div className="inline-flex items-center justify-start self-start">
              <IconTimeDuration0 className="h-5 w-5 text-neutral-500" />
              <Label className="text-lg text-neutral-700">Duration:</Label>
              <div className="mx-4 text-lg">{flightData.FlightDuration}</div>
            </div>
          </div>
          {/* ----------------------------- */}
          <div className="w-full flex flex-row justify-between mb-6">
            <div className="inline-flex items-center justify-start self-start">
              <IconMapPinUp className="h-5 w-5 text-neutral-500" />
              <Label className="text-lg text-neutral-700">From:</Label>
              <div className="mx-4 text-lg">{flightData.DepartureCity}</div>
            </div>

            <div className="inline-flex items-center justify-start self-start">
              <IconMapPinDown className="h-5 w-5 text-neutral-500" />
              <Label className="text-lg text-neutral-700">To:</Label>
              <div className="mx-4 text-lg">{flightData.DestinationCity}</div>
            </div>

            <div className="inline-flex items-center justify-start self-start">
              <IconPlaneInflight className="h-5 w-5 text-neutral-500" />
              <Label className="text-lg text-neutral-700">Flight Type:</Label>
              <div className="mx-4 text-lg">{flightData.FlightType}</div>
            </div>
          </div>
          {/* ----------------------------- */}

          <div className="flex flex-row">
            <div>
              <div className="inline-flex items-center justify-start self-center my-3">
                <IconCoins className="h-5 w-5 text-neutral-500" />
                <Label className="text-xl text-sky-900">Pricing</Label>
              </div>
              <div className="w-full flex flex-row justify-evenly mb-6 space-x-4">
                <div className="items-center justify-center border-2 rounded-lg flex flex-col flex-wrap content-center min-w-32 text-center">
                  <Label className="text-lg text-neutral-700 py-2 px-0 text-center w-full">
                    Economy
                  </Label>
                  <div className="w-full h-[2px] bg-[#e5e7eb]" />
                  <Label className="text-lg font-normal text-neutral-700 py-3 px-0 text-center w-full">
                    {flightData.EconomyClassPrice} pkr
                  </Label>
                </div>

                <div className="items-center justify-center border-2 rounded-lg flex flex-col flex-wrap content-center min-w-32 text-center">
                  <Label className="text-lg text-neutral-700 py-2 px-0 text-center w-full">
                    Business
                  </Label>
                  <div className="w-full h-[2px] bg-[#e5e7eb]" />
                  <Label className="text-lg font-normal text-neutral-700 py-3 px-0 text-center w-full">
                    {flightData.BusinessClassPrice} pkr
                  </Label>
                </div>

                <div className="items-center justify-center border-2 rounded-lg flex flex-col flex-wrap content-center min-w-32 text-center">
                  <Label className="text-lg text-neutral-700 py-2 px-0 text-center w-full">
                    First
                  </Label>
                  <div className="w-full h-[2px] bg-[#e5e7eb]" />
                  <Label className="text-lg font-normal text-neutral-700 py-3 px-0 text-center w-full">
                    {flightData.FirstClassPrice} pkr
                  </Label>
                </div>
              </div>
            </div>
            <div className="inline-flex items-center justify-center self-start flex-1 flex-col">
              <div className="inline-flex items-center justify-start self-center my-3">
                <IconClick className="h-5 w-5 text-neutral-500" />
                <Label className="text-lg text-neutral-700">
                  Selected Seats:
                </Label>
              </div>
              <div className="ml-4 text-sm">
                {SelectedSeats.map((seat, index) => (
                  <span key={index}>
                    {`${seat.row}${seat.col}`} ({seat.group_name})
                    {index !== SelectedSeats.length - 1 && ", "}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center justify-start self-center my-3">
              <IconReceipt2 className="h-5 w-5 text-neutral-500" />
              <Label className="text-lg text-neutral-700">
                Booking Details:
              </Label>
            </div>

            <div className=" min-h-8 mx-14 py-auto  border-2 border-neutral-400 rounded-md">
              {SelectedSeats.map((seat, index) => (
                <>
                  <div key={index} className="text-base flex flex-row w-full">
                    <div className="inline-flex items-center w-1/3 mx-2">
                      {`${seat.row}${seat.col}`}
                    </div>

                    <div className="inline-flex items-center self-center w-1/3 mx-2">
                      {seat.group_name}
                    </div>

                    <div className="inline-flex items-center self-center w-1/3 mx-2">
                      {getPriceByGroupName(seat.group_name)} pkr
                    </div>
                  </div>
                  <div className="w-full h-[2px] my-1 bg-neutral-400"></div>
                </>
              ))}
              <div className="text-base flex flex-row w-full">
                <div className="inline-flex items-center w-1/3 mx-2" />
                <div className="inline-flex items-center self-center justify-end w-1/3 mx-2 font-medium">
                  Total =
                </div>
                <div className="inline-flex items-center self-center w-1/3 mx-2">
                  {totalCost} pkr
                </div>
              </div>
            </div>
          </div>
          <div className={SelectedSeats.length === 0 ? "hidden" : ""}>
            <div className="h-12 items-center justify-center flex mt-5">
              <button onClick={onsubmit} type="button">
                <div className="button flex items-center justify-center px-3 h-9 text-lg bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 dark:bg-zinc-800 w-full text-white rounded-full font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]">
                  <button>Book Now</button>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const LoadingModal = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-lg">
      <div className="dark:bg-black p-8 rounded-lg shadow-lg bg-slate-100">
        <Loading />
      </div>
    </div>
  );
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
};

const ErrMsg = ({
  msg = " Wrong Email or Password.",
  Ismsg,
}: {
  msg: String;
  Ismsg: Function;
}) => {
  return (
    <div className="absolute top-0 right-0 mt-4 mr-4">
      <div
        className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative min-w-52 flex"
        role="alert"
      >
        <strong className="font-semibold">{msg}</strong>
        <button
          className="pl-6"
          onClick={() => {
            Ismsg(0);
          }}
        >
          <IconX className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

const SuccessMsg = ({
  msg = "Success!!",
  Ismsg,
}: {
  msg: String;
  Ismsg: Function;
}) => {
  return (
    <div className="absolute top-0 right-0 mt-4 mr-4">
      <div
        className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex min-w-52"
        role="alert"
      >
        <strong className="font-semibold">{msg}</strong>
        <button
          className="pl-6"
          onClick={() => {
            Ismsg(0);
          }}
        >
          <IconX className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
