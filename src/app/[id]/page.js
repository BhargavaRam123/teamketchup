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
  async function getmessageinfo() {
    const messageResponse = await apiconnector(
      "GET",
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/${params.id}`,
      null,
      {
        Authorization: `Bearer ${accesstoken}`,
      }
    );
    // console.log(messageResponse.data.payload.parts[1].body.data);
    setdecodedcode(messageResponse.data.payload.parts[1].body.data);
  }
  // console.log("decodable code is:", decodedcode);
  const result = decodeURIComponent(escape(decodedcode));

  console.log("decoded html is", result);
  useEffect(() => {
    getmessageinfo();
  }, []);
  return (
    <>
      <div className="">
        <div>
          <IoIosArrowRoundBack />
        </div>
      </div>
    </>
  );
}
