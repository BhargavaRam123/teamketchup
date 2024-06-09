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
    <div>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
      />
      {/* for the below i am getting the access token */}
      <button  onClick={() => login()}>Sign in with Google 🚀</button>
      <button onClick={getemailinfo}>test make a call</button>
      <button onClick={getmessages}>test to get the messages</button>
    </div>
  );
}
