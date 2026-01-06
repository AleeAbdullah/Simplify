//returns a list of components

import axios from "axios";
import { cn } from "../../utils/cn";
import { getApiUrl } from "../../config/api";
import React, { useEffect, useState } from "react";
import { BentoGridItem } from "../ui/grid-comp";
import { motion } from "framer-motion";
import { BrowseFlights, BrowseFlightsSm } from "../../screens/BrowseFlights/BrowseFlights";
import { Loading } from "../Loading/Loading";
import { DisplayFlightsSm } from "../DisplayList/DisplayList";

import {
  IconPlaneDeparture,
  IconUsersGroup,
  IconMessage2,
  IconMapSearch,
} from "@tabler/icons-react";
import { Route } from "react-router-dom";

export function GridItems() {

  const [IsSearched, setIsSearched] = useState(false);
  const[error, SetError] = useState("");
  const[loading, SetLoading] = useState(false);

  const [Type, SetType] = useState("") //show title or not

  const [FlightData, SetFlightData] = useState([])

  // handle Search Button Click
  const handleSearchButtonClick = async (jsonData: any) => {
    setIsSearched(true);
    SetType("list");
    SetLoading(true);

    console.log("Search Button Clicked")
    console.log("first")

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

  const handleRefreshButtonClick = async() => {

    setIsSearched(true);
    SetType("list");
    SetLoading(true);

    console.log("Search Button Clicked")

    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }
      SetLoading(true);
  
      const { data } = await axios.post(
        getApiUrl("api/flights/getFilteredFlights"), 
        {

        },
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

  useEffect(() => {
    handleRefreshButtonClick()
  }, [])

  const errMsg = ({error = "Something wrong on our End."}) => {
    return (
      <div className="bg-red-100 border text-sm border-red-400 text-red-700 mb-2 px-3 py-2 rounded relative flex" role="alert">
        <span className="block sm:inline mx-1 font-semibold self-start">{error}</span>
      </div>
    );
  };

  console.log(FlightData)
  const items = [
    {
      title: "Search",
      description: "Search for flights to anywhere in the world",
      header: <Browse 
        isSearched={IsSearched}
        onSearch={handleSearchButtonClick}
        onRefresh={handleRefreshButtonClick}
      />,
      className: "col-span-2",
      icon: <IconMapSearch className="icon h-4 w-4 text-neutral-500" />,
    },
    { 
      Type : "list",
      title: "Flights today",
      description: "Find flights leaving today.",
      header: <DisplayFlightsSm
        Isloading = {loading}
        data = {FlightData}
      />,
      className: "col-span-1",
      icon: <IconPlaneDeparture className="h-4 w-4 text-neutral-500" />,
    },
    {
      title: "Contact us",
      description: "Feel free to reach out to us if you have any queries.",
      header: <Chatwithus />,
      className: "col-span-1",
      icon: <IconMessage2 className="h-4 w-4 text-neutral-500" />,
      route: "/contactUs"
    },
    {
      title: "About us",
      description: "One Stop for all your travelling needs",
      header: <AboutUs />,
      className: "col-span-2",
      icon: <IconUsersGroup className="h-4 w-4 text-neutral-500" />,
      route: "/AboutUs"
    },
  ];
  
  return items.map((item, i) => ({
        component: (<BentoGridItem
          type={item.Type}
          key={i}
          title={item.title}
          description={item.description}
          header={item.header}
          icon= {item.icon}
          className={item.className}
          route={item.route}
          
        />),
        className: item.className
        }))
    };

const Chatwithus = () => {
  const variants = {
    initial: {
      x: 0,
    },
    animate: {
      x: 10,
      rotate: 5,
      transition: {
        duration: 0.2,
      },
    },
  };
  const variantsSecond = {
    initial: {
      x: 0,
    },
    animate: {
      x: -10,
      rotate: -5,
      transition: {
        duration: 0.2,
      },
    },
  };
  
  return (
    <motion.div
      initial="initial"
      whileHover="animate"
      className="image/contentSkeleton flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-col space-y-2"
    >
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2  items-center space-x-2 bg-white dark:bg-black"
      >
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
      </motion.div>
      <motion.div
        variants={variantsSecond}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 w-3/4 ml-auto bg-white dark:bg-black"
      >
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
      </motion.div>
      <motion.div
        variants={variants}
        className="flex flex-row rounded-full border border-neutral-100 dark:border-white/[0.2] p-2 items-center space-x-2 bg-white dark:bg-black"
      >
        <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-violet-500 flex-shrink-0" />
        <div className="w-full bg-gray-100 h-4 rounded-full dark:bg-neutral-900" />
      </motion.div>
    </motion.div>
  );
};

interface BrowseProps {
  isSearched: boolean;
  onSearch: (jsonData: any) => void;
  onRefresh: () => void;
}

const Browse: React.FC<BrowseProps> = ({ isSearched, onSearch, onRefresh }) => 
{
  return (
    <div className="image/contentSkeleton">
      <BrowseFlightsSm
        isSearched={isSearched}
        onSearch={(jsonData) => onSearch(jsonData)}
        onRefresh={onRefresh}
      />
    </div>
  );
};

const AboutUs = () => {
  const first = {
    initial: {
      x: 20,
      rotate: -5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  const second = {
    initial: {
      x: -20,
      rotate: 5,
    },
    hover: {
      x: 0,
      rotate: 0,
    },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="aboutUs my-2 flex flex-1 w-full h-full min-h-[6rem] dark:bg-dot-white/[0.2] bg-dot-black/[0.2] flex-row space-x-2"
    >
      <motion.div
        variants={first}
        className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
      >
        <img
          src={require("./../../assets/HeroImages/laash.png")}
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Laash
        </p>
        <p className="border border-red-500 bg-red-100 dark:bg-red-900/20 text-red-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Feeling Less
        </p>
      </motion.div>
      <motion.div className="h-full relative z-20 w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center">
        <img
          src={require("./../../assets/HeroImages/12.png")}
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Ali Abdullah
        </p>
        <p className="border border-green-500 bg-green-100 dark:bg-green-900/20 text-green-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Developer
        </p>
      </motion.div>
      <motion.div className="lg:flex h-full relative z-20 w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 hidden flex-col items-center justify-center">
        <img
          src={require("./../../assets/HeroImages/avatar.png")}
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Owi
        </p>
        <p className="border border-green-500 bg-green-100 dark:bg-green-900/20 text-green-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Scrum Master
        </p>
      </motion.div>
      <motion.div
        variants={second}
        className="h-full w-1/3 rounded-2xl bg-white p-4 dark:bg-black dark:border-white/[0.1] border border-neutral-200 flex flex-col items-center justify-center"
      >
        <img
          src={require("./../../assets/HeroImages/pistol.png")}
          alt="avatar"
          height="100"
          width="100"
          className="rounded-full h-10 w-10"
        />
        <p className="sm:text-sm text-xs text-center font-semibold text-neutral-500 mt-4">
          Pistol
        </p>
        <p className="border border-orange-500 bg-orange-100 dark:bg-orange-900/20 text-orange-600 text-xs rounded-full px-2 py-0.5 mt-4">
          Helpless
        </p>
      </motion.div>
    </motion.div>
  );
};

const Skeleton = () => (
  <div className="image/contentSkeleton flex flex-1 w-full h-full min-h-[6rem] rounded-xl   dark:bg-dot-white/[0.2] bg-dot-black/[0.2] [mask-image:radial-gradient(ellipse_at_center,white,transparent)]  border border-transparent dark:border-white/[0.2] bg-neutral-100 dark:bg-black">
    <div className="bg-red-50">

    </div>
  </div>
);


