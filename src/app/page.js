"use client";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { apiconnector } from "./services/apiconnector";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Header from "./components/header/header";
import { RiCalendarTodoLine } from "react-icons/ri";
import style from "./page.module.css";
import { RiDraftLine } from "react-icons/ri";
import { CiTrash } from "react-icons/ci";
import { FaInbox } from "react-icons/fa";
import { RiSpam2Line } from "react-icons/ri";
import { LuSendHorizonal } from "react-icons/lu";

export default function Home() {
  const router = useRouter();

  function handleonclick(id) {
    router.push(`/${id}`);
  }

  const MessageList = React.memo(({ messages }) => {
    return (
      <div>
        {messages.map((message, index) => (
          <div
            key={index}
            className={style.each}
            onClick={() => handleonclick(message.msgid)}
          >
            <div className="">{message.sender.split("<")[0].trim()}</div>
            <div className="">
              {message.snippet.length > 10
                ? `${message.snippet.substring(0, 50)}...`
                : message.snippet}
            </div>
            <div className="">{message.time}</div>
          </div>
        ))}
      </div>
    );
  });

  const { accesstoken } = useSelector((state) => state.User);
  const [messages, setMessages] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMessages = useCallback(
    async (pageToken = null) => {
      if (!accesstoken) return;
      setLoading(true);
      try {
        const params = new URLSearchParams({ maxResults: 15 });
        if (pageToken) {
          params.append("pageToken", pageToken);
        }

        const response = await apiconnector(
          "GET",
          `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params.toString()}`,
          null,
          {
            Authorization: `Bearer ${accesstoken}`,
          },
        );

        const messageDetails = await Promise.all(
          response.data.messages.map(async (o) => {
            const messageResponse = await apiconnector(
              "GET",
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${o.id}`,
              null,
              {
                Authorization: `Bearer ${accesstoken}`,
              },
            );
            const { payload, snippet, internalDate } = messageResponse.data;
            const headers = payload.headers;

            const senderHeader = headers.find(
              (header) => header.name === "From",
            );
            const sender = senderHeader ? senderHeader.value : "Unknown Sender";

            const time = new Date(parseInt(internalDate)).toLocaleString();

            return { msgid: o.id, sender, snippet, time };
          }),
        );

        setMessages((prevMessages) => [...prevMessages, ...messageDetails]);
        setNextPageToken(response.data.nextPageToken);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    },
    [accesstoken],
  );

  const fetchMoreMessages = useCallback(() => {
    fetchMessages(nextPageToken);
  }, [fetchMessages, nextPageToken]);

  useEffect(() => {
    if (accesstoken) {
      setMessages([]);
      fetchMessages();
    }
  }, [fetchMessages, accesstoken]);

  return (
    <>
      <Header />
      <div className={style.maincontainer}>
        <div className={style.sidecontainer}>
          <div className={style.minis}>
            <FaInbox className={style.iconsselect} />
          </div>
          <div className={style.mini}>
            <RiCalendarTodoLine className={style.icons} />
          </div>
          <div className={style.mini}>
            <RiDraftLine className={style.icons} />
          </div>
          <div className={style.mini}>
            <CiTrash className={style.icons} />
          </div>
          <div className={style.mini}>
            <LuSendHorizonal className={style.icons} />
          </div>
          <div className={style.mini}>
            <RiSpam2Line className={style.icons} />
          </div>
        </div>

        <div className={style.mcontainer}>
          {messages.length > 0 ? (
            <MessageList messages={messages} />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="flex space-x-2">
                <motion.div
                  className="h-16 w-16 rounded-full bg-red-500"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeInOut",
                    repeat: Infinity,
                  }}
                />
                <motion.div
                  className="h-3 w-3 rounded-full bg-red-500"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: 0.3,
                  }}
                />
                <motion.div
                  className="h-3 w-3 rounded-full bg-red-500"
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    ease: "easeInOut",
                    repeat: Infinity,
                    delay: 0.6,
                  }}
                />
              </div>
            </div>
          )}
          {nextPageToken && (
            <button
              style={{ width: "200px" }}
              className="group/button min-h-9 mt-4  p-2 relative overflow-hidden rounded-md border border-red-500/20 bg-white px-4 py-1 text-xs font-medium text-red-500 transition-all duration-150 hover:border-red-500 active:scale-95"
              onClick={fetchMoreMessages}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          )}
        </div>
      </div>
    </>
  );
}
