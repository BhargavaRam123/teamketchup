"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { apiconnector } from "../services/apiconnector";

export default function Logine({ params }) {
  const router = useRouter();
  const { accesstoken } = useSelector((state) => state.User);
  const [decodedcode, setdecodedcode] = useState("");
  const [msghtml, setmsghtml] = useState("");
  const [summary, setsummary] = useState("");

  async function aiapi() {
    try {
      const messageResponse = await apiconnector(
        "POST",
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyDVlwxL5yJYNN2IpsaepNCHxeGYzHjA93Y`,
        {
          contents: [
            {
              parts: [{ text: msghtml + "summarise this mail in a one liner" }],
            },
          ],
        }
      );
      console.log("ai response", messageResponse);
      setsummary(messageResponse.data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.log("error occured in aiapi:", error);
    }
  }

  useEffect(() => {
    async function fetchMessage() {
      try {
        const messageResponse = await apiconnector(
          "GET",
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${params.id}`,
          null,
          {
            Authorization: `Bearer ${accesstoken}`,
          }
        );

        const encodedMessage = messageResponse.data.payload.parts[1].body.data;
        setdecodedcode(encodedMessage);
      } catch (error) {
        console.error("Error fetching message info:", error);
      }
    }

    fetchMessage();
  }, [accesstoken, params.id]);

  useEffect(() => {
    async function decodeMessage() {
      if (decodedcode) {
        try {
          const decodeResponse = await apiconnector(
            "POST",
            `http://localhost:3001/api/decode`,
            {
              encodedstr: decodedcode,
            }
          );

          setmsghtml(decodeResponse.data.decodedString);
        } catch (error) {
          console.error("Error decoding message:", error);
        }
      }
    }

    decodeMessage();
  }, [decodedcode]);

  useEffect(() => {
    if (msghtml) aiapi();
  }, [msghtml]);
  return (
    <>
      <div>
        <h1>summary:{summary}</h1>
        {/* <div onClick={aiapi}>click me</div> */}
        <div>
          <IoIosArrowRoundBack />
        </div>
        <div dangerouslySetInnerHTML={{ __html: msghtml }} />
      </div>
    </>
  );
}
