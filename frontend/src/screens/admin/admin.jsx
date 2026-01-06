import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {Navbar} from "../../components/navbar/navbar"
import { BackgroundBeams } from "../../components/ui/background-beams";
import { Link, useNavigate } from "react-router-dom";
import { Input } from '../../components/ui/input';
import {
    IconEdit
  } from "@tabler/icons-react";
import { UpdateFlight } from './UpdateFlight';
import axios from "axios";
import { getApiUrl } from "../../config/api";


const Admin = (props) => {

    const [ID, SetID] = useState("")
    const [NotFound, SetnotFound] = useState(false)
    const navigate = useNavigate();


    const handleclick = async () =>
    {
        try {
            
            const config = {
                headers: {
                  "Content-type": "application/json"
                }
              }

            const { data } = await axios.post(
                getApiUrl(`api/flights/Flightexists/${ID}`), 
                {},
                config
            );
        
            console.log(data);
        
            if (data === "") {
                SetnotFound(true);
                SetID("");
        
                setTimeout(() => {
                    SetnotFound(false);
                }, 500);
            } else {
                navigate(`admin/UpdateFlight/${ID}`)
            }
        } catch (error) {
            console.error("Error fetching flight data:", error);
            // Handle error
        }        
    }


  return (
    <div className='h-screen w-screen'>
        <Navbar/>

        <div className='flex grid-cols-2 px-10 items-center justify-center border-1 border-zinc-800 bg-white h-full w-full p-auto'>
            <div className='flex flex-wrap'>
                <button 
                onClick={() => {navigate("/admin/RegisterFlight")}}
                className='flex w-72 h-60 rounded-lg border-1 border-zinc-900 hover:ring-2 m-10 bg-blue-800 z-10 text-white font-bold text-2xl text-center items-center justify-center'>
                    Register Flights
                </button>
                <button 
                    className='flex flex-col w-72 h-60 rounded-lg border-1 border-zinc-900 hover:ring-2 m-10 bg-gray-700 z-10 text-white font-bold text-2xl text-center items-center justify-center'>
                        Update Flights
                    <div className='mt-2 flex flex-nowrap items-center'>
                        <Input 
                            type="text" 
                            value={ID} 
                            placeholder='Flight ID'     
                            className={`border-2 border-zinc-950 ${NotFound ? 'animate-shake' : ''}`}
                            onChange={(e) => {SetID(e.target.value)}} style={NotFound ? { animation: 'shake 0.5s ease-in-out' } : {}} />

                        <button onClick={handleclick}>
                            <IconEdit className='ml-3 h-8 w-8 text-zinc-200'/>
                        </button>
                        
                    </div>
                </button>
            </div>
        </div>

        <BackgroundBeams />

    </div>
  )
}

Admin.propTypes = {}

Admin.defaultProps = {}


export default Admin