"use client";
import React, { useState } from "react";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { cn } from "../../utils/cn";
import { Link } from "react-router-dom";
import axios from "axios";
import { Loading } from "../../components/Loading/Loading";
import { getApiUrl } from "../../config/api";
import { useParams } from "react-router-dom";

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [Repassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordChanged, setpasswordChanged] = useState(false);

  const params = useParams()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!(password === Repassword))
    {
      setError("Passwords do not match");
      return false;
    }

    if (!checkPassword(password)) {
      setError("Password must contain eight characters, one uppercase, lowercase and number");
      return false;
    }

    const confirmationToken = params.token;

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      setLoading(true);

      const { data } = await axios.post(
        getApiUrl("api/users/resetPassword"),
        {
          "newPassword" : password,
          "token": confirmationToken
        },
        config
      );

      console.log(data);
      setpasswordChanged(true);
      setLoading(false);
      setError("");
    } catch (error: any) {
      setError(error.response.data.message);
      setLoading(false);
    }
  };

  const errMsg = ({ error = "something went wrong, try again" }) => {
    return (
      <div className="bg-red-100 border text-sm border-red-400 text-red-700 mb-2 px-3 py-2 rounded relative flex" role="alert">
        <span className="block sm:inline mx-1 font-semibold self-start">{error}</span>
      </div>
    );
  };

  const checkPassword = (password: string) => {
    const re = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    console.log(password);
    if (re.test(password)) {
      return true;
    }
    return false;
  };

  return (
    <div className="max-w-sm w-full mx-auto rounded-2xl p-3 md:p-5 shadow-input bg-white dark:bg-black self-center">
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
        Reset Password
      </h2>

      <form className="my-5" onSubmit={handleSubmit}>
        {error && errMsg({ error })}

        {passwordChanged ? (
        <>
          <div className="bg-green-100 border text-sm border-green-400 text-green-700 mb-2 px-3 py-2 rounded relative flex" role="alert">
            <span className="block sm:inline mx-1 font-semibold self-start">Password Successfully Changed</span>
          </div>
          <p className="mt-2 flex text-xs font-normal justify-self-start mx-2">
           Proceed to
           <Link
             to="/login"
             className="text-indigo-500 hover:text-blue-600 hover:underline  font-semibold transition duration-150 ease-in-out hover:text-danger-600 focus:text-danger-600 active:text-danger-700 mx-1"
           >
             Login
           </Link>
         </p>
        </>
        ) : (
        <>
          <div className="flex flex-col space-y-2 md:space-y-0 mb-4">
            <LabelInputContainer className="mb-3">
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
            <LabelInputContainer className="mb-3">
              <Label htmlFor="password">Confirm Password</Label>
              <Input
                id="re-password"
                placeholder="••••••••" 
                type="password"
                value={Repassword}
                onChange={(e) => setRePassword(e.target.value)}
                showIcon = {true}
                required= {true}
              />
            </LabelInputContainer>  
          </div>

          <button
            className=" mt-4 bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            >
            Reset Password
            <BottomGradient />
          </button>
        </>
      )}

        <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-6 h-[1px] w-full" />
      </form>

      {loading && <LoadingModal />}
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
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

const LoadingModal = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center backdrop-blur-lg">
      <div className="dark:bg-black p-8 rounded-lg shadow-lg">
        <Loading />
      </div>
    </div>
  );
};
