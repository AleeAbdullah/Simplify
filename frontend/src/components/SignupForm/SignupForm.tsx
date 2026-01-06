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
      <div className="bg-red-100 border text-sm border-red-400 text-red-700 mb-2 px-3 py-2 rounded relative flex" role="alert">
        <span className="block sm:inline mx-1 font-semibold self-start">{error}</span>
      </div>
    );
  };

  return (
    <div className="max-w-sm w-full mx-auto rounded-2xl p-3 md:p-5 shadow-input bg-white dark:bg-black self-center">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Signup to Simplifly
      </h2>

      <form className="my-5" onSubmit={handleSubmit}>

        {error && errMsg({error})}

        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
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

        <div className="flex flex-row space-y-0 space-x-2 mb-4">
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

        <LabelInputContainer className="mb-4">
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
        <LabelInputContainer className="mb-4">
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
        <LabelInputContainer className="mb-1">
          <Label htmlFor="password">Re-Enter Password</Label>
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
        <LabelInputContainer className="mb-1">
          <Label htmlFor="password">Card Number</Label>
          <Input
            id=""
            placeholder="1234-xxxx-xxxx" 
            type="text"
            value={Card}
            onChange={(e) => SetCard(e.target.value)}
            showIcon = {false}
            required= {true}
          />
        </LabelInputContainer>
    
        <button
          className=" mt-4 bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
        >
          Signup
          <BottomGradient />
        </button>

        <p className="mt-2 flex text-xs font-normal justify-self-start mx-2">
            Already a Member?
            <Link to="/login"
                    className="text-indigo-500 hover:text-blue-600 hover:underline  font-semibold transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700 mx-1">
                Login
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