"use client";

//add alert...

import { Tabs } from "./../../components/ui/tabs";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button/button";
import axios from "axios";
import { getApiUrl } from "../../config/api";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../utils/cn"
import UploadProfileImage from "../imgupload";
import {
    IconX
} from "@tabler/icons-react";
import { DisplayFlights } from "../../components/DisplayList/DisplayList";
import { Loading } from "../../components/Loading/Loading";

interface Booking {
    _id: string;
    UserToken: string;
    FlightID: string;
    row: string;
    col: number;
    group_name: string;
    createdAt: string;
    updatedAt: string;
    flightData: {
        FlightID: string;
        Date: Date;
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
        createdAt: string;
        updatedAt: string;
    };
}

export function Dashboard() {
    const { isloggedin, getToken, GetImg, logout } = useAuth();
    const [message, setMessage] = useState("");
    const [IsMessage, setIsMessage] = useState(0);
    const Img = isloggedin ? GetImg() : null;

    const token = isloggedin ? getToken() : null;

    const [TabclassName, SetTabclassName] = useState("");
    const navigate = useNavigate()

    const tabs = [
        {
            title: "Profile",
            value: "Profile",
            content: (
                <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-SoftGreen to-PaleBlue">
                    <p className="text-green-950">Profile</p>
                    <Profile imageData={Img} token={token} msg={setMessage} Ismsg={setIsMessage} logout={logout} navigate={navigate}/>
                </div>
            ),
        },
        {
            title: "Bookings",
            value: "Bookings",
            content: (
                <div className="w-full overflow-hidden relative h-full rounded-2xl font-bold text-white bg-gradient-to-br from-SoftGreen to-PaleBlue">
                    <p className="text-xl md:text-4xl text-green-950 z-30 mt-8">Your Bookings</p>
                    <Bookings token={token}/>
                </div>
            ),
        },
        {
            title: "Security",
            value: "Security",
            content: (
                <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-SoftGreen to-PaleBlue">
                    <p className="text-green-950">Change Password</p>
                    <Security token={token} msg={setMessage} Ismsg={setIsMessage} />
                </div>
            ),
        },
        {
            title: "Offers",
            value: "Offers",
            content: (
                <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-gradient-to-br from-purple-700 to-violet-900">
                    <p>Content tab</p>
                    <DummyContent />
                </div>
            ),
        },
    ];

    return (
        <div className={cn("h-[33.5rem] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full  items-start justify-start px-10", TabclassName)}>
            {isloggedin && <Tabs tabs={tabs} />}

            {!isloggedin && (
                <div className="h-full w-full flex flex-col content-center justify-center">
                    <p className="text-lg text-slate-900"> You are not logged In. </p>
                    <div className="w-1/3 flex justify-center mt-6 self-center">
                        <Button displayName="Login" route="/login" />
                    </div>
                </div>
            )}

            {(IsMessage == 2) && <ErrMsg msg={message} Ismsg={setIsMessage} />}
            {(IsMessage == 1) && <SuccessMsg msg={message} Ismsg={setIsMessage} />}

        </div>
    );
}

const DummyContent = () => {
    return <div></div>;
};

const Profile = ({
    imageData,
    token,
    msg,
    Ismsg,
    logout,
    navigate
}: {
    imageData: String;
    token: string;
    msg: Function;
    Ismsg: Function;
    logout: Function;
    navigate: Function;
}) => {
    const [FirstName, SetFirstName] = useState("");
    const [LastName, SetLastName] = useState("");
    const [Email, SetEmail] = useState("");
    const [Gender, SetGender] = useState("");
    const [Age, SetAge] = useState(0);

    const [ChangeImage, SetChangeImage] = useState(false)
    const [ChangeInfo, SetChangeInfo] = useState(false)
    const [Updated, SetUpdated] = useState(false)

    const handleGenderChange = () => {
        if (Gender === "Male") {
            SetGender("Female");
        } else if (Gender === "Female") {
            SetGender("Male");
        }
    };

    const UpdateDetails = async () => {
        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const data = await axios.post(
                getApiUrl("api/users/updateDetails"),
                {
                    'token': token,
                    "FirstName": FirstName,
                    "LastName": LastName,
                    "Email": Email,
                    "gender": Gender,
                    "Age": Age,
                },
                config
            );

            msg(data.data.message);
            Ismsg(1);
        }
        catch (error: any) {
            msg(error.data.data.message);
            Ismsg(2);
        }

        SetChangeInfo(false);
        SetUpdated(true);
    };


    useEffect(() => {
        const OnLoad = async () => {
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                    },
                };

                const data = await axios.post(
                    getApiUrl("api/users/getDetails"),
                    {
                        'token': token,
                    },
                    config
                );

                const res = data.data

                SetFirstName(res.FirstName)
                SetLastName(res.LastName)
                SetEmail(res.Email)
                SetGender(res.Gender)
                SetAge(res.Age)
                SetEmail(res.Email)

            } catch (error: any) {
                msg(error.data.data.message);
                Ismsg(2);
            }
        };

        OnLoad();
    }, []);

    return (
        <div className="mt-10">
            <div className="flex flex-row">
                <div className="h-48 w-56">
                    <img
                        src={`data:image/png;base64,${imageData}`}
                        alt="Profile"
                        className="rounded-full shadow-md ring-2 ring-green-950"
                    />

                    <Btn
                        text="Change Image"
                        onClick={() => SetChangeImage(true)}
                        className="mt-6"
                    />

                    {ChangeImage && <UploadProfileImage />}

                </div>
                <div className="flex flex-col flex-1 ms-3">
                    <div className="flex flex-row space-x-4 mb-6">
                        <LabelInputContainer>
                            <Label htmlFor="firstname">First name</Label>
                            <Input
                                id="firstname"
                                placeholder="Ali"
                                type="text"
                                value={FirstName || ""}
                                onChange={(e) => ChangeInfo && SetFirstName(e.target.value)}
                                required={true}
                            />
                        </LabelInputContainer>
                        <LabelInputContainer>
                            <Label htmlFor="lastname">Last name</Label>
                            <Input
                                id="lastname"
                                placeholder="Abdullah"
                                type="text"
                                value={LastName || ""}
                                onChange={(e) => ChangeInfo && SetLastName(e.target.value)}
                                required={true}
                            />
                        </LabelInputContainer>
                    </div>
                    <div>
                        <div className="flex flex-row space-x-4 mb-6">
                            <LabelInputContainer>
                                <Label htmlFor="gender">Gender</Label>
                                <Btn text={Gender} onClick={() => { ChangeInfo && handleGenderChange() }} />
                            </LabelInputContainer>

                            <LabelInputContainer>
                                <Label htmlFor="age">Age</Label>
                                <Input
                                    id="Age"
                                    placeholder="19"
                                    type="number"
                                    value={Age || 0}
                                    onChange={(e) => ChangeInfo && SetAge(parseInt(e.target.value))}
                                    required={true}
                                />
                            </LabelInputContainer>
                        </div>

                        <LabelInputContainer className="mb-4">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                placeholder="myemail@gmail.com"
                                type="email"
                                value={Email || ""}
                                onChange={(e) => ChangeInfo && SetEmail(e.target.value)}
                                required={true}
                            />
                        </LabelInputContainer>
                    </div>
                    <div className="flex justify-end mr-7 space-x-7">
                        <Btn
                            text="Logout"
                            onClick={ () => {logout() && navigate("/")} }
                            className="w-fit px-7 rounded-lg self-end flex"
                        />

                        {
                            !ChangeInfo &&
                            <Btn
                                text="Edit"
                                onClick={() => { SetChangeInfo(true) }}
                                className="w-fit px-7 rounded-lg self-end flex"
                            />
                        }
                        {
                            ChangeInfo &&
                            <Btn
                                text="Save Changes"
                                onClick={() => { UpdateDetails() }}
                                className="w-fit px-7 rounded-lg self-end flex"
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

const Security = ({ token, msg, Ismsg }: { token: string, msg: Function, Ismsg: Function }) => {

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = async () => {
        try {
            if (currentPassword != confirmPassword) {
                msg("Passwords do not Match.");
                Ismsg(2);
                return;
            }
            const response = await axios.post(getApiUrl("api/users/ChangePassword"), {
                newPassword,
                token,
                currentPassword
            });
            msg(response.data.message);
            Ismsg(1)
        } catch (error: any) {
            msg(error.response.data.message);
            Ismsg(2)
        }
    };

    return (
        <div className="flex w-full justify-center">
            <div className="w-1/2 flex flex-col justify-center mt-8 self-center">
                <div>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="currentPassword">Current Password:</Label>
                        <Input
                            type="password"
                            id="currentPassword"
                            value={currentPassword || ""}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </LabelInputContainer>
                </div>
                <div>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="newPassword">New Password:</Label>
                        <Input
                            type="password"
                            id="newPassword"
                            value={newPassword || ""}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </LabelInputContainer>
                </div>
                <div>
                    <LabelInputContainer className="mb-4">
                        <Label htmlFor="confirmPassword">Confirm New Password:</Label>
                        <Input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword || ""}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </LabelInputContainer>
                </div>

                <Btn
                    onClick={handleChangePassword}
                    text="Change Password"
                    className="w-1/2 self-center"
                ></Btn>
            </div>
        </div>
    );
};

const Bookings = ({ token }: { token: string }) => {

    const [bookings, setBookings] = useState<Booking[] | null>(null);
    const [Isloading, SetIsloading] = useState(true);
    const [notFound, SetnotFound] = useState(false);
    const [notFoundMsg, SetnotFoundMsg] = useState("");

    const fetchData = async () => {
        try {
            SetIsloading(true);

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.post(
                getApiUrl('api/bookedFlights/getallbyuser'),
                {
                    "token": token,
                },
                config
            );

            const bookingData: Booking[] = response.data.data;

            console.log("booking data")
            console.log(bookingData)

            // Fetch flight details for each booking
            const bookingsWithFlightData: Booking[] = [];
            for (const booking of bookingData) {
                const flightResponse = await axios.post(
                    getApiUrl(`api/flights/getFlightById/${booking.FlightID}`)
                );
                const flightData = flightResponse.data;
                const bookingWithFlightData: Booking = { ...booking, flightData };
                bookingsWithFlightData.push(bookingWithFlightData);
            }

            setBookings(bookingsWithFlightData);
            SetIsloading(false);

        } catch (error: any) {
            console.error('Error fetching data:', error.response.data.message);
            SetnotFoundMsg(error.response.data.message);
            SetnotFound(true);
            setBookings(null);
            SetIsloading(false);
        }
    };


    useEffect(() => {
        fetchData();
    }, [token]);

    console.log(bookings)


    const cancel = async (id:string) => {
        try {
            SetIsloading(true);

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            const response = await axios.post(
                getApiUrl('api/bookedFlights/cancel'),
                {
                    "id": id,
                },
                config
            );

            SetIsloading(false);
            fetchData();
            return response

        } catch (error: any) {
            SetnotFoundMsg(error.response.data.message);
            SetIsloading(false);
        }
    };
    

    return (
        <div className="m-4 mt-12 pb-28 h-full overflow-auto scrollbar-hide">
            {Isloading && <LoadingModal />}
            {notFound && <div className="h-full w-full items-center justify-center text-2xl font-bold text-teal-950"> {notFoundMsg} </div>}
            {
                bookings?.map((booking) => (
                    <div className="flex flex-col">
                        <div className="px-4 rounded-lg shadow-md font-medium text-neutral-700 bg-white border border-gray-100 py-2 flex h-12 space-x-4 items-center">
                            <div className="flex flex-row">
                                Seat Type: <p className="font-normal pl-2">{booking.group_name}</p>
                            </div>
                            <div className="flex flex-row">
                                Seat ID: <p className="font-normal pl-2">{booking.row + booking.col}</p>
                            </div>
                            <button
                                className="flex border ml-12 px-2 py-1 border-red-400 bg-red-200 rounded-lg"
                                onClick={() => {cancel(booking._id)}}
                            >
                                Cancel Booking
                            </button>
                        </div>
                        <DisplayFlights
                            data= {[booking.flightData]}
                            Isloading={false}
                        />
                    </div>
                ))
            }
        </div>
    )
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

const Btn = ({ text, onClick, className, id = "FlightType", name = "FlightType", value }: { text: string; onClick?: () => void; className?: string; id?: string; name?: string; value?: string }) => {
    return (
        <span
            className={cn("flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 dark:text-white shadow-input rounded-md px-3 py-2 placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-400 items-center text-lg font-medium text-gray-600 hover:ring-2 cursor-pointer self-end mt-1 justify-center", className)}
            onClick={onClick}
            style={{ transition: "all 0.3s" }}
            id={id}
        >
            {text}
        </span>
    );
};

const ErrMsg = ({ msg = " Wrong Email or Password.", Ismsg }: { msg: String, Ismsg: Function }) => {
    return (
        <div className="absolute top-0 right-0 mt-4 mr-4">
            <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative min-w-52 flex"
                role="alert"
            >
                <strong className="font-semibold">{msg}</strong>
                <button className="pl-6" onClick={() => { Ismsg(0) }}>
                    <IconX className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};


const SuccessMsg = ({ msg = "Success!!", Ismsg }: { msg: String, Ismsg: Function }) => {
    return (
        <div className="absolute top-0 right-0 mt-4 mr-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative flex min-w-52" role="alert">
                <strong className="font-semibold">{msg}</strong>
                <button className="pl-6" onClick={() => { Ismsg(0) }}>
                    <IconX className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

const LoadingModal = () => {
    return (
        <div className="absolute w-full h-full inset-0 z-20 flex m-2 rounded-xl justify-center items-center backdrop-filter bg-opacity-50">
            <div className="dark:bg-black p-8 rounded-lg shadow-lg">
                <Loading />
            </div>
        </div>
    );
  };
