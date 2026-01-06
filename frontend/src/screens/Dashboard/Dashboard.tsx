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
import { Navbar } from "../../components/navbar/navbar";

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
                <div className="w-full overflow-y-auto relative h-full rounded-2xl p-6 md:p-10 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-700 shadow-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-6">Profile</h2>
                    <Profile imageData={Img} token={token} msg={setMessage} Ismsg={setIsMessage} logout={logout} navigate={navigate}/>
                </div>
            ),
        },
        {
            title: "Bookings",
            value: "Bookings",
            content: (
                <div className="w-full overflow-y-auto relative h-full rounded-2xl p-6 md:p-10 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-700 shadow-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-6">Your Bookings</h2>
                    <Bookings token={token}/>
                </div>
            ),
        },
        {
            title: "Security",
            value: "Security",
            content: (
                <div className="w-full overflow-y-auto relative h-full rounded-2xl p-6 md:p-10 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-700 shadow-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-6">Change Password</h2>
                    <Security token={token} msg={setMessage} Ismsg={setIsMessage} />
                </div>
            ),
        },
        {
            title: "Offers",
            value: "Offers",
            content: (
                <div className="w-full overflow-y-auto relative h-full rounded-2xl p-6 md:p-10 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-700 shadow-lg">
                    <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 dark:text-neutral-200 mb-6">Special Offers</h2>
                    <DummyContent />
                </div>
            ),
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
            <Navbar />
            <div className="pt-24 pb-16 px-4 md:px-8">
                <div className={cn("min-h-[600px] [perspective:1000px] relative flex flex-col max-w-5xl mx-auto w-full items-start justify-start", TabclassName)}>
                    {isloggedin && <Tabs tabs={tabs} contentClassName="h-[600px]" />}

                    {!isloggedin && (
                        <div className="h-full w-full flex flex-col items-center justify-center py-32">
                            <div className="text-center">
                                <p className="text-xl font-semibold text-neutral-800 dark:text-neutral-200 mb-4">You are not logged in</p>
                                <div className="flex justify-center">
                                    <Button displayName="Login" route="/login" />
                                </div>
                            </div>
                        </div>
                    )}

                    {(IsMessage == 2) && <ErrMsg msg={message} Ismsg={setIsMessage} />}
                    {(IsMessage == 1) && <SuccessMsg msg={message} Ismsg={setIsMessage} />}
                </div>
            </div>
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
        <div className="mt-6">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex flex-col items-center md:items-start">
                    <img
                        src={`data:image/png;base64,${imageData}`}
                        alt="Profile"
                        className="rounded-full shadow-lg ring-4 ring-sky-200 dark:ring-sky-800 w-48 h-48 object-cover mb-4"
                    />

                    <button
                        onClick={() => SetChangeImage(true)}
                        className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-zinc-800 hover:bg-neutral-50 dark:hover:bg-zinc-700 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium transition-colors"
                    >
                        Change Image
                    </button>

                    {ChangeImage && <UploadProfileImage />}

                </div>
                <div className="flex flex-col flex-1">
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
                    <div className="flex justify-end mr-7 space-x-4 mt-6">
                        <button
                            onClick={() => {logout() && navigate("/")}}
                            className="px-6 py-2 border-2 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg font-medium transition-colors"
                        >
                            Logout
                        </button>

                        {
                            !ChangeInfo &&
                            <button
                                onClick={() => { SetChangeInfo(true) }}
                                className="px-6 py-2 bg-gradient-to-br from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                Edit
                            </button>
                        }
                        {
                            ChangeInfo &&
                            <button
                                onClick={() => { UpdateDetails() }}
                                className="px-6 py-2 bg-gradient-to-br from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                Save Changes
                            </button>
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
            <div className="w-full max-w-md flex flex-col justify-center mt-8">
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

                <button
                    onClick={handleChangePassword}
                    className="w-full mt-4 bg-gradient-to-br from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white rounded-lg h-11 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                    Change Password
                </button>
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
        <div className="pb-8 overflow-auto" style={{ scrollbarWidth: "none", msOverflowStyle: "none", maxHeight: "calc(600px - 8rem)" }}>
            {Isloading && <LoadingModal />}
            {notFound && (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="mb-6 p-4 rounded-full bg-sky-100 dark:bg-sky-900/20">
                        <p className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">{notFoundMsg}</p>
                    </div>
                </div>
            )}
            {!notFound && bookings && bookings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <div className="mb-6 p-4 rounded-full bg-sky-100 dark:bg-sky-900/20">
                        <p className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">No bookings found</p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">You haven't made any bookings yet</p>
                    </div>
                </div>
            )}
            {
                bookings?.map((booking) => (
                    <div key={booking._id} className="flex flex-col mb-6">
                        <div className="px-6 py-4 rounded-xl shadow-lg font-medium text-neutral-700 dark:text-neutral-300 bg-gradient-to-r from-sky-50 to-indigo-50 dark:from-sky-900/20 dark:to-indigo-900/20 border border-sky-200 dark:border-sky-800 flex flex-wrap gap-4 items-center justify-between">
                            <div className="flex flex-row items-center gap-2">
                                <span className="font-semibold text-neutral-800 dark:text-neutral-200">Seat Type:</span>
                                <span className="text-neutral-600 dark:text-neutral-400">{booking.group_name}</span>
                            </div>
                            <div className="flex flex-row items-center gap-2">
                                <span className="font-semibold text-neutral-800 dark:text-neutral-200">Seat ID:</span>
                                <span className="text-neutral-600 dark:text-neutral-400">{booking.row}{booking.col}</span>
                            </div>
                            <button
                                className="px-4 py-2 border border-red-300 dark:border-red-700 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/40 text-red-700 dark:text-red-400 rounded-lg font-medium transition-colors"
                                onClick={() => {cancel(booking._id)}}
                            >
                                Cancel Booking
                            </button>
                        </div>
                        <div className="mt-2">
                            <DisplayFlights
                                data={[booking.flightData]}
                                Isloading={false}
                            />
                        </div>
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
        <button
            type="button"
            className={cn("flex h-10 w-full border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-zinc-800 text-neutral-700 dark:text-neutral-300 shadow-sm rounded-lg px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:focus-visible:ring-sky-400 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-neutral-50 dark:hover:bg-zinc-700 transition-all duration-200 items-center text-sm font-medium cursor-pointer justify-center", className)}
            onClick={onClick}
            id={id}
        >
            {text}
        </button>
    );
};

const ErrMsg = ({ msg = " Wrong Email or Password.", Ismsg }: { msg: String, Ismsg: Function }) => {
    return (
        <div className="fixed top-24 right-4 z-50">
            <div
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg relative min-w-52 flex items-center gap-3 shadow-lg"
                role="alert"
            >
                <strong className="font-medium flex-1">{msg}</strong>
                <button className="hover:bg-red-100 dark:hover:bg-red-900/30 rounded p-1 transition-colors" onClick={() => { Ismsg(0) }}>
                    <IconX className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};


const SuccessMsg = ({ msg = "Success!!", Ismsg }: { msg: String, Ismsg: Function }) => {
    return (
        <div className="fixed top-24 right-4 z-50">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 px-4 py-3 rounded-lg relative flex items-center gap-3 min-w-52 shadow-lg" role="alert">
                <strong className="font-medium flex-1">{msg}</strong>
                <button className="hover:bg-green-100 dark:hover:bg-green-900/30 rounded p-1 transition-colors" onClick={() => { Ismsg(0) }}>
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
