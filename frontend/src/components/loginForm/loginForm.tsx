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
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400 px-4 py-3 rounded-lg relative flex items-center" role="alert">
        <span className="block sm:inline font-medium">{error}</span>
      </div>
    );
  };

  
  const showResetOption = () => {
    return (
      <p className="text-right text-xs text-neutral-600 dark:text-neutral-400">
          <Link to="/forgotPassword"
                  className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline font-semibold transition duration-150 ease-in-out">
              Forgot Password?
          </Link>
      </p>
    );
  };


  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <div className="max-w-sm w-full rounded-2xl p-6 md:p-8 shadow-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-700">
        <div className="text-center mb-6">
          <h2 className="font-bold text-2xl md:text-3xl text-neutral-800 dark:text-neutral-200 mb-2">
            Welcome Back
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Login to Simplifly
          </p>
        </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>

      {error && errMsg({error})}

        <LabelInputContainer>
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            placeholder="myemail@gmail.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </LabelInputContainer>
        <LabelInputContainer>
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
          className="mt-6 bg-gradient-to-br relative group/btn from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 block w-full text-white rounded-lg h-11 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          type="submit"
        >
          Login
          <BottomGradient />
        </button>

        <p className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Don't have an account?{" "}
            <Link to="/signup"
                    className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline font-semibold transition duration-150 ease-in-out">
                Register
            </Link>
        </p>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-300 dark:border-neutral-700"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white dark:bg-zinc-900 px-2 text-neutral-500 dark:text-neutral-400">Or continue with</span>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <button
            className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-neutral-700 dark:text-neutral-300 rounded-lg h-11 font-medium bg-neutral-50 dark:bg-zinc-800 hover:bg-neutral-100 dark:hover:bg-zinc-700 border border-neutral-200 dark:border-neutral-700 transition-all duration-200"
            type="button"
          >
            <IconBrandGithub className="h-5 w-5" />
            <span className="text-sm">GitHub</span>
          </button>
          <button
            className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-neutral-700 dark:text-neutral-300 rounded-lg h-11 font-medium bg-neutral-50 dark:bg-zinc-800 hover:bg-neutral-100 dark:hover:bg-zinc-700 border border-neutral-200 dark:border-neutral-700 transition-all duration-200"
            type="button"
          >
            <IconBrandGoogle className="h-5 w-5" />
            <span className="text-sm">Google</span>
          </button>
        </div>
      </form>

      {loading && <LoadingModal />}
      </div>
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

