"use client";
import { useState, useEffect } from "react";
import Todo from "./components/todo/todo";
import { useSelector } from "react-redux";
import { apiconnector } from "./services/apiconnector";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Header from "./components/header/header";
import { RiCalendarTodoLine } from "react-icons/ri";
import style from "./page.module.css";
import { RiDraftLine } from "react-icons/ri";
import { FaInbox } from "react-icons/fa";
import { LuSendHorizonal } from "react-icons/lu";
import ComposeModal from "./components/compose/composeModal";
import { MessageList } from "./components/messagecomponent/message.js";
import fetchMessages from "./services/fetchmessage/fechmessages";
import fetchDrafts from "./services/fetchDrafts/fetchDrafts";
import fetchmoreMessages from "./services/fetchmoremessages/fetchmoremessages";

export default function Home() {
  const router = useRouter();
  const [togglev, settoggle] = useState(false);
  const [show, setshow] = useState({
    inbox: true,
    drafts: false,
    todo: false,
    trash: false,
    send: false,
    spam: false,
  });
  const [drafts, setdrafts] = useState([]);
  const { accesstoken } = useSelector((state) => state.User);
  const [messages, setMessages] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

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
            <div className="">{message.payload.headers[1].value}</div>
          </div>
        ))}
      </div>
    );
  });

  const handleSendClick = () => {
    setShowModal(true);
  };

  function render() {
    if (show.inbox) {
      return (
        <>
          <MessageList messages={messages} />
          {nextPageToken && (
            <button
              style={{ width: "200px" }}
              className={`group/button min-h-9 mt-4  p-2 relative overflow-hidden rounded-md border border-red-500/20 bg-white px-4 py-1 text-xs font-medium text-red-500 transition-all duration-150 hover:border-red-500 active:scale-95 ${style.loadMoreButton} ${loading ? style.loading : ""}`}
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
        </>
      );
    } else if (show.drafts) {
      return (
        <Draftlist drafts={drafts} />
      );
    } else if (show.todo) {
      return (
        <Todo />
      );
    } else if (show.send) {
      // Handle send section
    } else if (show.spam) {
      // Handle spam section
      // Example placeholder
      return <div>Spam Section</div>;
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

  if (accesstoken) {
    return (
      <>
        <Header settoggle={settoggle} togglev={togglev} />
        <div className={style.maincontainer}>
          <div className={togglev ? style.sidecontainert : style.sidecontainer}>
            <div
              className={show.inbox ? style.minis : style.mini}
              onClick={() =>
                fetchMessages(
                  nextPageToken,
                  setMessages,
                  setLoading,
                  accesstoken,
                  apiconnector,
                  setNextPageToken,
                  setshow
                )
              }
            >
              <FaInbox
                className={show.inbox ? style.iconsselect : style.icons}
              />
            </div>
            <div
              className={show.todo ? style.minis : style.mini}
              onClick={() => {
                setshow({
                  inbox: false,
                  drafts: false,
                  todo: true,
                  trash: false,
                  sent: false,
                  spam: false,
                });
              }}
            >
              <RiCalendarTodoLine
                className={show.todo ? style.iconsselect : style.icons}
              />
            </div>
            <div
              className={show.drafts ? style.minis : style.mini}
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
              <RiDraftLine
                className={show.drafts ? style.iconsselect : style.icons}
              />
            </div>
            <div className={show.send ? style.minis : style.mini}>
              <LuSendHorizonal
                className={show.send ? style.iconsselect : style.icons}
                onClick={handleSendClick}
              />
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
          </div>
        </div>
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
      </>
    );
  } else {
    router.push("/login");
    return null;
  }
}
