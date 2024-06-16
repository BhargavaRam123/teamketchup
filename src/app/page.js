"use client";
import { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { apiconnector } from "./services/apiconnector";
import React from "react";
import { useRouter } from "next/navigation";
import Header from "./components/header/header";
import { RiCalendarTodoLine } from "react-icons/ri";
import style from "./page.module.css";
import { RiDraftLine } from "react-icons/ri";
import { CiTrash } from "react-icons/ci";
import { FaInbox } from "react-icons/fa";
import { RiSpam2Line } from "react-icons/ri";
import { LuSendHorizonal } from "react-icons/lu";
import { MessageList } from "./components/messagecomponent/message.js";
import fetchMessages from "./services/fetchmessage/fechmessages";
import fetchDrafts from "./services/fetchDrafts/fetchDrafts";
import fetchmoreMessages from "./services/fetchmoremessages/fetchmoremessages";
export default function Home() {
  const router = useRouter();
  var arr = ["inbox", "todo", "drafts", "trash", "spam"];
  const [togglev, settoggle] = useState(false);
  const [show, setshow] = useState({
    inbox: true,
    drafts: false,
    todo: false,
    trash: false,
    sent: false,
    spam: false,
  });
  const [drafts, setdrafts] = useState([]);
  const { accesstoken } = useSelector((state) => state.User);
  const [messages, setMessages] = useState([]);
  const [spam, setspam] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [spamnextPageToken, spamsetNextPageToken] = useState(null);
  const [dnextPageToken, setdNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);

  const Draftlist = React.memo(({ drafts }) => {
    return (
      <div>
        {drafts.map((message, index) => (
          <div
            key={index}
            className={style.each}
            onClick={() => handleonclick(message.draftid)}
          >
            <div>subject:{message.payload.headers[3].value}</div>
            {/* <div className="">{message.sender.split("<")[0].trim()}</div> */}
            {/* <div className="">
              {message.snippet.length > 10
                ? `${message.snippet.substring(0, 50)}...`
                : message.snippet}
            </div> */}
            <div className="">{message.payload.headers[1].value}</div>
          </div>
        ))}
      </div>
    );
  });

  function render() {
    if (show.inbox) {
      return <MessageList messages={messages} />;
    } else if (show.drafts) {
      return <Draftlist drafts={drafts} />;
    } else if (show.spam) {
      // return <MessageList messages={messages} />;
    } else if (show.todo) {
    } else if (show.trash) {
    } else if (show.sent) {
    }
  }

  useEffect(() => {
    if (accesstoken) {
      setMessages([]);
      fetchMessages(
        nextPageToken,
        setMessages,
        setLoading,
        accesstoken,
        apiconnector,
        setNextPageToken,
        setshow
      );
    }
  }, [fetchMessages, accesstoken]);

  return (
    <>
      <Header settoggle={settoggle} togglev={togglev} />
      <div className={style.maincontainer}>
        <div className={togglev ? style.sidecontainert : style.sidecontainer}>
          <div
            className={style.minis}
            onClick={() =>
              fetchMessages(
                setMessages,
                setLoading,
                accesstoken,
                apiconnector,
                setNextPageToken,
                setshow
              )
            }
          >
            <FaInbox className={style.iconsselect} />
          </div>
          <div className={style.mini}>
            <RiCalendarTodoLine className={style.icons} />
          </div>
          <div
            className={style.mini}
            onClick={() =>
              fetchDrafts(
                setdrafts,
                setLoading,
                apiconnector,
                accesstoken,
                setdNextPageToken,
                setshow
              )
            }
          >
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
            render()
          ) : (
            <div className={style.lcontainer}>
              <div className={style.loader}></div>
            </div>
          )}

          {nextPageToken && (
            <button
              style={{ width: "200px" }}
              className="group/button min-h-9 mt-4  p-2 relative overflow-hidden rounded-md border border-red-500/20 bg-white px-4 py-1 text-xs font-medium text-red-500 transition-all duration-150 hover:border-red-500 active:scale-95"
              onClick={() =>
                fetchmoreMessages(
                  nextPageToken,
                  setMessages,
                  setLoading,
                  accesstoken,
                  apiconnector,
                  setNextPageToken,
                  setshow
                )
              }
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
