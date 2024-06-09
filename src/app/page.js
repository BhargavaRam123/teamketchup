"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { GoogleLogin } from "@react-oauth/google";
import { apiconnector } from "./services/apiconnector";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
export default function Home() {
  const [accesstoken, setaccesstoken] = useState("");
  async function getemailinfo(){
    const response = await apiconnector("GET","https://gmail.googleapis.com/gmail/v1/users/me/profile",
  null,   
  {
    Authorization: `Bearer ${accesstoken}`,
  }   
    )
    console.log('response:',response)
  }
  
  async function getmessages(){
    const response = await apiconnector("GET","https://gmail.googleapis.com/gmail/v1/users/me/messages",
  null,   
  {
    Authorization: `Bearer ${accesstoken}`,
  }   
    )
    console.log('response:',response)
  }

  const login = useGoogleLogin({
    scope:
      "https://mail.google.com",
    onSuccess: (tokenResponse) => {
      setaccesstoken(tokenResponse.access_token);
      console.log(tokenResponse);
    },
  });
  return (
    <div className="flex h-screen items-center justify-center">
    <div className="flex flex-col justify-items-center max-w-md ma">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      <div className="flex flex-col max-w-md ma mt-4">
        <button
          className="group relative m-1 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-b-2 border-l-2 border-r-2 border-red-700 bg-gradient-to-tr from-red-600 to-red-500 px-4 py-1 text-white shadow-lg transition duration-100 ease-in-out active:translate-y-0.5 active:border-red-600 active:shadow-none"
          onClick={() => login()}
        >
          Sign in with Google 🚀
        </button>
        <button className="group relative m-1 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-b-2 border-l-2 border-r-2 border-red-700 bg-gradient-to-tr from-red-600 to-red-500 px-4 py-1 text-white shadow-lg transition duration-100 ease-in-out active:translate-y-0.5 active:border-red-600 active:shadow-none" onClick={getemailinfo}>test make a call</button>
        <button  className="group relative m-1 inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-lg border-b-2 border-l-2 border-r-2 border-red-700 bg-gradient-to-tr from-red-600 to-red-500 px-4 py-1 text-white shadow-lg transition duration-100 ease-in-out active:translate-y-0.5 active:border-red-600 active:shadow-none" onClick={getmessages}>test to get the messages</button>
      </div>
    </div>
  </div>
);
}