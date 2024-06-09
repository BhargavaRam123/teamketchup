"use client";
import Image from "next/image";
import styles from "./page.module.css";
import { apiconnector } from "./services/apiconnector";
import { useState } from "react";
import { useSelector } from "react-redux";
export default function Home() {
  const { accesstoken } = useSelector((state) => state.User);
  const [arr, setarr] = useState();
  console.log("access token is:", accesstoken);
  async function getmessages() {
    const response = await apiconnector(
      "GET",
      "https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5",
      null,
      {
        Authorization: `Bearer ${accesstoken}`,
      }
    );
    response.data.messages.map(async (o) => {
      // console.log("object is", o);
      const response = await apiconnector(
        "GET",
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${o.id}`,
        null,
        {
          Authorization: `Bearer ${accesstoken}`,
        }
      );
      console.log("response:", response);
      // setarr(response.data);
      // console.log("array value", arr);
    });
    // console.log("response:", response);
  }
  // getmessages();
  return <div>Home</div>;
}
