"use client"
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { apiconnector } from "./services/apiconnector";
import React from "react";
import { useRouter } from "next/navigation";
import Header from "./header";

export default function Home() {
  const router = useRouter();
  
  function handleonclick(id) {
    router.push(`/${id}`);
  }

  const MessageList = React.memo(({ messages }) => {
    return (
      <ul className="space-y-4 ">
        {messages.map((message, index) => (
          <li
            key={index}
            className="flex flex-col justify-between md:flex-row p-4 bg-slate-400 shadow-md rounded-md mb-4"
            onClick={() => handleonclick(message.msgid)}
          >
            <div className="flex flex-col">
            <p className="text-lg font-bold">{message.sender.split('<')[0].trim()}</p>
            <p className="text-gray-600 ">
              {message.snippet.length > 10
                ? `${message.snippet.substring(0, 50)}...`
                : message.snippet}
            </p>
            </div>
            <p className=" text-gray-600 text-sm md:w-1/3 md:text-right">{message.time}</p>
          </li>
        ))}
      </ul>
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
        const params = new URLSearchParams({ maxResults: 5 });
        if (pageToken) {
          params.append("pageToken", pageToken);
        }

        const response = await apiconnector(
          "GET",
          `https://gmail.googleapis.com/gmail/v1/users/me/messages?${params.toString()}`,
          null,
          {
            Authorization: `Bearer ${accesstoken}`,
          }
        );

        const messageDetails = await Promise.all(
          response.data.messages.map(async (o) => {
            const messageResponse = await apiconnector(
              "GET",
              `https://gmail.googleapis.com/gmail/v1/users/me/messages/${o.id}`,
              null,
              {
                Authorization: `Bearer ${accesstoken}`,
              }
            );
            const { payload, snippet, internalDate } = messageResponse.data;
            const headers = payload.headers;

            const senderHeader = headers.find(
              (header) => header.name === "From"
            );
            const sender = senderHeader ? senderHeader.value : "Unknown Sender";

            const time = new Date(parseInt(internalDate)).toLocaleString();

            return { msgid: o.id, sender, snippet, time };
          })
        );

        setMessages((prevMessages) => [...prevMessages, ...messageDetails]);
        setNextPageToken(response.data.nextPageToken);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    },
    [accesstoken]
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
    <div className="min-h-screen flex flex-col bg-black font-poppins">
     <Header/>
      <div className="flex flex-1 flex-col md:flex-row">
        
        <div className="w-full mt-3 ml-3 backdrop-blur-3xl rounded-xl md:w-64 bg-slate-700 rounded-b-xl p-4 ">
          <nav>
            <ul className="space-y-2">
              <li>
                <a className="block p-2 text-gray-400 hover:bg-slate-800 rounded">Inbox</a>
              </li>
              <li>
                <a className="block p-2 text-gray-400 hover:bg-slate-800 rounded">Sent</a>
              </li>
              <li>
                <a className="block p-2 text-gray-400 hover:bg-slate-800 rounded">Drafts</a>
              </li>
              <li>
                <a className="block p-2 text-gray-400 hover:bg-slate-800 rounded">Trash</a>
              </li>
            </ul>
          </nav>
        </div>
        
        <div className="flex-1 mt-3 mr-3 ml-3 bg-slate-700 rounded-xl p-4 overflow-hidden">
          <div className="overflow-y-auto h-full">
            <h2 className=" text-gray-400 mb-4">Messages</h2>
            {messages.length > 0 ? (
              <MessageList messages={messages} />
            ) : (
              <p className="text-gray-400">Loading...</p>
            )}
            {nextPageToken && (
              <button
                className="group/button min-h-9 mt-4 p-2 relative overflow-hidden rounded-md border border-red-500/20 bg-white px-4 py-1 text-xs font-medium text-red-500 transition-all duration-150 hover:border-red-500 active:scale-95"
                onClick={fetchMoreMessages}
                disabled={loading}
              >
                <span className="absolute bottom-0 left-0 z-0 h-0 w-full bg-gradient-to-t from-red-600 to-red-500 transition-all duration-500 group-hover/button:h-full" />
                <span className="relative z-10 transition-all duration-500 group-hover/button:text-white">
                  {loading ? "Loading..." : "Load More"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
