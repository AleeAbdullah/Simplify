"use client";
import React, { useState }  from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { cn } from "../../utils/cn";
import {
  IconBrandGithub,
  IconBrandGoogle,
} from "@tabler/icons-react";

import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Loading } from "../Loading/Loading";
import { getApiUrl } from "../../config/api";
import BottomGradient from "../ui/BottomGradient";
import { useAuth } from "../../auth/auth"
import { response } from "express";

// @ts-ignore


export function LoginForm() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const[error, SetError] = useState("");
  const[loading, SetLoading] = useState(false);

  const[loginAttempts, SetLoginAttempts] = useState(0)

  const navigate = useNavigate();

  const {storeTokenInLS, SetImg} = useAuth()

  const checkEmail = (email: string) => {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if ( re.test(email) ) {
        return true;
    }
    return false;
  }


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    if (!checkEmail(email)) {
      SetError("Sorry, Your Email Seems to be Invalid.");
      return false;
    }
    
    if (password === "") {
      SetError("Oops, you forgot to enter your Password.");
      return false;
    }
    
    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }
      SetLoading(true);
  
      const data  = await axios.post(
        getApiUrl("api/users/login"), 
        {
          "Email" : email,
          "Password": password
        },
        config
      );

      console.log(data.data.token)
      
      if (data.data) {
        const res = data.data;
        console.log(res.token);
        storeTokenInLS(res.token);
        SetImg(res.Img);
        } else {
            console.log("Response data is empty.");
        }
      navigate('/');
      


      SetLoading(false);
      SetError("");
  
    } catch (error: any) {
      SetError(error.response.data.message);
      SetLoading(false);

      SetLoginAttempts(loginAttempts + 1);
    }
  };


  const errMsg = ({error = " Wrong Email or Password."}) => {
    return (
      <div className="bg-red-100 border text-sm border-red-400 text-red-700 mb-2 px-3 py-2 rounded relative flex" role="alert">
        <span className="block sm:inline mx-1 font-semibold self-start">{error}</span>
      </div>
    );
  };

  
  const showResetOption = () => {
    return (
      <p className="mb-3 flex text-xs font-normal justify-self-start mx-2">
          Forgot Password?
          <Link to="/forgotPassword"
                  className="text-indigo-500 hover:text-blue-600 hover:underline  font-semibold transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700 mx-1">
              Reset Here
          </Link>
      </p>
    );
  };


  return (
    <div className="max-w-sm w-full mx-auto rounded-2xl p-3 md:p-5 shadow-input bg-white dark:bg-black self-center">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Login to Simplifly
      </h2>

      <form className="my-5" onSubmit={handleSubmit}>

      {error && errMsg({error})}

        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            placeholder="myemail@gmail.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="••••••••" 
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
            showIcon={true}
          />
        </LabelInputContainer>

        { loginAttempts >= 2 && showResetOption()}

        <button
          className=" mt-4 bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Login
          <BottomGradient />
        </button>

        <p className="mt-2 flex text-xs font-normal justify-self-start mx-2">
            Don't have an account?
            <Link to="/signup"
                    className="text-indigo-500 hover:text-blue-600 hover:underline  font-semibold transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700 mx-1">
                Register
            </Link>
        </p>

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-6 h-[1px] w-full" />

        <div className="flex flex-col space-y-4">
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              GitHub
            </span>
            <BottomGradient />
          </button>
          <button
            className=" relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
            type="submit"
          >
            <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Google
            </span>
            <BottomGradient />
          </button>
        </div>
      </form>

      {loading && <LoadingModal />}

    </div>
  );
}


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


const LoadingModal = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-lg">
      <div className="dark:bg-black p-8 rounded-lg shadow-lg">
        <Loading />
      </div>
    </div>
  );
};

