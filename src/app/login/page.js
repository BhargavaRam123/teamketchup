"use client";
import { GoogleLogin } from "@react-oauth/google";
import { apiconnector } from "../services/apiconnector.js";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { setToken } from "../redux/slices/userslice.js";
import { cn } from "@/app/utils/cn";
import { Spotlight } from "@/app/ui/Spotlight";
import React from "react";
import Image from "next/image.js";
import { motion } from "framer-motion";

export default function Login() {
  const { accesstoken } = useSelector((state) => state.User);
  console.log("access token is:", accesstoken);
  const router = useRouter();
  // const [saccesstoken, setaccesstoken] = useState("");
  const dispatch = useDispatch();
  async function getemailinfo() {
    const response = await apiconnector(
      "GET",
      "https://gmail.googleapis.com/gmail/v1/users/me/profile",
      null,
      {
        Authorization: `Bearer ${accesstoken}`,
      }
    );
    console.log("response:", response);
  }

  async function getmessages() {
    const response = await apiconnector(
      "GET",
      "https://gmail.googleapis.com/gmail/v1/users/me/messages",
      null,
      {
        Authorization: `Bearer ${accesstoken}`,
      }
    );
    console.log("response:", response);
  }

  const login = useGoogleLogin({
    scope: "https://mail.google.com",
    onSuccess: (tokenResponse) => {
      dispatch(
        setToken({
          email: "",
          accesstoken: tokenResponse.access_token,
        })
      );
      // setaccesstoken(tokenResponse.access_token);
      console.log(tokenResponse);
    },
  });
  // if (accesstoken !== null) {
  //   console.log("hello");
  //   router.push("/");
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       <div className="flex flex-col justify-items-center max-w-md ma">
  //         <GoogleLogin
  //           onSuccess={(credentialResponse) => {
  //             console.log(credentialResponse);
  //           }}
  //           onError={() => {
  //             console.log("Login Failed");
  //           }}
  //         />
  //         <div className="flex flex-col max-w-md ma mt-4">
  //           <button
  //             className="group relative m-1 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-b-2 border-l-2 border-r-2 border-red-700 bg-gradient-to-tr from-red-600 to-red-500 px-4 py-1 text-white shadow-lg transition duration-100 ease-in-out active:translate-y-0.5 active:border-red-600 active:shadow-none"
  //             onClick={() => login()}
  //           >
  //             Sign in with Google 🚀
  //           </button>
  //           <button
  //             className="group relative m-1 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-b-2 border-l-2 border-r-2 border-red-700 bg-gradient-to-tr from-red-600 to-red-500 px-4 py-1 text-white shadow-lg transition duration-100 ease-in-out active:translate-y-0.5 active:border-red-600 active:shadow-none"
  //             onClick={getemailinfo}
  //           >
  //             test make a call
  //           </button>
  //           <button
  //             className="group relative m-1 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-b-2 border-l-2 border-r-2 border-red-700 bg-gradient-to-tr from-red-600 to-red-500 px-4 py-1 text-white shadow-lg transition duration-100 ease-in-out active:translate-y-0.5 active:border-red-600 active:shadow-none"
  //             onClick={getmessages}
  //           >
  //             test to get the messages
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // } else {
    return (

<div className="h-screen w-full  flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className=" p-4 max-w-7xl mx-auto relative z-10 w-full pt-20 md:pt-0 flex flex-col items-center">
      <motion.div className="relative"
      initial={{ opacity: 0 }} // Initial state before animation
      animate={{ opacity: 1  }} // Target state after animation
      transition={{ duration: 0.2 }} // Duration of the animation
   
      >
      <Image className="object-cover w-128 h-32 text-4xl md:text-7xl font-bold align-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50"
    src="/2.svg"  // Use an absolute path starting from the root of the public directory
    alt="Description of the image" // Always provide an alt attribute for accessibility
    width={500} // Specify the width of the image
    height={500} // Specify the height of the image
  />
  </motion.div>
      
      <motion.div
      initial={{ opacity: 0 }} // Initial state before animation
      animate={{ opacity: 1  }} // Target state after animation
      transition={{ duration: 5 }} // Duration of the animation
      >
      <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
      Our mission is simple: to enhance your email experience and boost productivity. How? With our AI-powered summaries! Just click on an email, and get a concise summary at your fingertips. It's the perfect condiment for your inbox!
      </p>
      </motion.div>


        <div className="flex flex-col max-w-md ma mt-4">
        <button className="inline-flex h-12 animate-shimmer items-center justify-center rounded-md border border-slate-800 bg-[linear-gradient(110deg,#000103,45%,#1e2631,55%,#000103)] bg-[length:200%_100%] px-6 font-medium text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
        onClick={() => login()}>
          Sign in with Google 
        </button>
            {/* <button
              className="group relative m-1 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-b-2 border-l-2 border-r-2 border-red-700 bg-gradient-to-tr from-red-600 to-red-500 px-4 py-1 text-white shadow-lg transition duration-100 ease-in-out active:translate-y-0.5 active:border-red-600 active:shadow-none"
              onClick={getemailinfo}
            >
              test make a call
            </button> */}
            {/* <button
              className="group relative m-1 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-b-2 border-l-2 border-r-2 border-red-700 bg-gradient-to-tr from-red-600 to-red-500 px-4 py-1 text-white shadow-lg transition duration-100 ease-in-out active:translate-y-0.5 active:border-red-600 active:shadow-none"
              onClick={getmessages}
            >
              test to get the messages
            </button> */}
          </div>
      </div>
    </div>
  
    );
  }