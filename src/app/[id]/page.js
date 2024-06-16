"use client"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { apiconnector } from "../services/apiconnector";
import { AnimatePresence, motion } from 'framer-motion';
import ComposeModal from '../components/compose/composeModal'; // Adjust the path as needed

export default function Logine({ params }) {
  const router = useRouter();
  const { accesstoken } = useSelector((state) => state.User);
  const [decodedcode, setDecodedCode] = useState("");
  const [msghtml, setMsgHtml] = useState("");
  const [summary, setSummary] = useState("");
  const [showModal, setShowModal] = useState(false);

  const addAltToImages = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const images = doc.getElementsByTagName("img");

    for (let i = 0; i < images.length; i++) {
      const img = images[i];
      if (!img.alt) {
        img.alt = "Missing alt text";
      }
    }

    return doc.documentElement.innerHTML;
  };

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
      setSummary(messageResponse.data.candidates[0].content.parts[0].text);
    } catch (error) {
      console.error("error occured in aiapi:", error);
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

        let encodedMessage = null;
        const parts = messageResponse.data.payload.parts;

        if (parts) {
          for (const part of parts) {
            if (part.mimeType === "text/html" && part.body.data) {
              encodedMessage = part.body.data;
              break;
            }
          }
        }

        if (!encodedMessage && messageResponse.data.payload.body.data) {
          encodedMessage = messageResponse.data.payload.body.data;
        }

        if (!encodedMessage) {
          throw new Error("No suitable part found in the message payload");
        }

        setDecodedCode(encodedMessage);
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
          setMsgHtml(addAltToImages(decodeResponse.data.decodedString));
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
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center px-4 py-2 bg-white shadow-md">
        <button
          className="p-2 rounded-full hover:bg-gray-200 focus:outline-none"
          onClick={() => router.back()}
        >
          <IoIosArrowRoundBack size={24} />
        </button>
        <button
          className="space-x-72 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          Compose
        </button>
        <div className="w-8" /> {/* Placeholder for additional header items */}
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4 overflow-auto">
        {/* Summary */}
        <div className="mb-4 p-4 bg-white rounded-md shadow-md">
          <h2 className="text-lg font-semibold mb-2">Summary</h2>
          <p>{summary}</p>
        </div>

        {/* Email Content */}
        <div className="p-4 bg-white rounded-md shadow-md">
          <div dangerouslySetInnerHTML={{ __html: msghtml }} />
        </div>
      </div>

      {/* Compose Modal */}
      {/* Compose Modal */}
<AnimatePresence>
  {showModal && (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-10 flex items-center justify-center"
    >
      <ComposeModal showModal={showModal} setShowModal={setShowModal} />
    </motion.div>
  )}
</AnimatePresence>
    </div>
  );
}
