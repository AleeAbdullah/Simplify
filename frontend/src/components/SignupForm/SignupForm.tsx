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
import BottomGradient from "../ui/BottomGradient"
import { useAuth } from "../../auth/auth"

export function SignupForm() {
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("Male");
  const [Card, SetCard] = useState("");

  const handleGenderChange = () => {
    if (gender === "Male") {
      setGender("Female");
    } else if (gender === "Female") {
      setGender("Male");
    } 
  };

  const[error, SetError] = useState("");
  const[loading, SetLoading] = useState(false)

  const navigate = useNavigate();

  const {storeTokenInLS, SetImg} = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
   
    e.preventDefault();

    if (!(password === rePassword))
    {
      SetError("Passwords do not match");
      return false;
    }
    
    try {
      const config = {
        headers: {
          "Content-type": "application/json"
        }
      }
      SetLoading(true);

      const data = await axios.post(
        getApiUrl("api/users/register"), 
        {
          FirstName: firstName,
          LastName: lastName,
          Email: email,
          Password: password,
          Age: age,
          Gender: gender
        },
        config
      )

      console.log(data)

      if (data.data) {
        const res = data.data;
        storeTokenInLS(res.token);
        SetImg(res.Img);

        } else {
            console.log("Response data is empty.");
        }

      navigate('/');
      

      SetLoading(false);
      SetError("");

    } catch (error: any) 
    {
      SetError(error.response.data.message)
      SetLoading(false)
    }

  };


  const errMsg = ({error = " Wrong Email or Password."}) => {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm text-red-700 dark:text-red-400 px-4 py-3 rounded-lg relative flex items-center" role="alert">
        <span className="block sm:inline font-medium">{error}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-sky-50 via-white to-indigo-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
      <div className="max-w-md w-full rounded-2xl p-6 md:p-8 shadow-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-700">
        <div className="text-center mb-6">
          <h2 className="font-bold text-2xl md:text-3xl text-neutral-800 dark:text-neutral-200 mb-2">
            Create Account
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Signup to Simplifly
          </p>
        </div>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>

        {error && errMsg({error})}

        <div className="flex flex-col md:flex-row gap-4">
          <LabelInputContainer>
            <Label htmlFor="firstname">First name</Label>
            <Input 
              id="firstname" 
              placeholder="Ali" 
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required= {true}
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastname">Last name</Label>
            <Input
             id="lastname"
             placeholder="Abdullah"
             type="text"
             value={lastName}
             onChange={(e) => setLastName(e.target.value)}
             required= {true}
            />
          </LabelInputContainer>
        </div>

        <div className="flex flex-row gap-4">
          <LabelInputContainer>
            <Label htmlFor="gender">Gender</Label>
            <Btn text={gender} onClick={handleGenderChange} />
          </LabelInputContainer>

          <LabelInputContainer>
            <Label htmlFor="age">Age</Label>
            <Input
             id="Age"
             placeholder="19"
             type="number"
             value={age}
             onChange={(e) => setAge(e.target.value)}
             required= {true}
            />
          </LabelInputContainer>
        </div>

        <LabelInputContainer>
          <Label htmlFor="email">Email Address</Label>
          <Input 
            id="email" 
            placeholder="myemail@gmail.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required= {true}
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
            showIcon = {true}
            required= {true}
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="re-password">Re-Enter Password</Label>
          <Input
            id="re-password"
            placeholder="••••••••" 
            type="password"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
            showIcon = {true}
            required= {true}
          />
        </LabelInputContainer>
        <LabelInputContainer>
          <Label htmlFor="card">Card Number</Label>
          <Input
            id="card"
            placeholder="1234-xxxx-xxxx" 
            type="text"
            value={Card}
            onChange={(e) => SetCard(e.target.value)}
            showIcon = {false}
            required= {true}
          />
        </LabelInputContainer>
    
        <button
          className="mt-6 bg-gradient-to-br relative group/btn from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 block w-full text-white rounded-lg h-11 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
          type="submit"
        >
          Signup
          <BottomGradient />
        </button>

        <p className="mt-4 text-center text-sm text-neutral-600 dark:text-neutral-400">
            Already a Member?{" "}
            <Link to="/login"
                    className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:underline font-semibold transition duration-150 ease-in-out">
                Login
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

const Btn = ({ text, onClick, className, id = "FlightType" , name = "FlightType", value}: { text: string; onClick?: () => void; className?:string; id?:string; name?:string; value?:string }) => {
  return (
    <span
      className={cn("flex h-10 w-full border-none bg-gray-50 dark:bg-zinc-800 dark:text-white shadow-input rounded-md px-3 py-2 placeholder:text-neutral-400 dark:placeholder-text-neutral-600 focus-visible:outline-none focus-visible:ring-[2px] focus-visible:ring-neutral-400 dark:focus-visible:ring-neutral-600 disabled:cursor-not-allowed disabled:opacity-50 dark:shadow-[0px_0px_1px_1px_var(--neutral-700)] group-hover/input:shadow-none transition duration-400 items-center text-lg font-medium text-gray-600 hover:ring-2 cursor-pointer self-end mt-1 justify-center", className)}
      onClick={onClick}
      style={{ transition: "all 0.3s" }}
      id = {id}
    >
      {text}
    </span>
  );
};