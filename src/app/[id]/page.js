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

  return (
    <>
      <div>
        <div>
          <IoIosArrowRoundBack />
        </div>
        <div dangerouslySetInnerHTML={{ __html: msghtml }} />
      </div>
    </>
  );
}
