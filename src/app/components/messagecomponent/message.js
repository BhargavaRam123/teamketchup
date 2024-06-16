"use client";
import style from "./message.module.css";
export function MessageList({ messages }) {
  return (
    <div>
      {messages.map((message, index) => (
        <div
          key={index}
          className={style.each}
          onClick={() => handleonclick(message.msgid)}
        >
          <div className={style.heading}>
            {message.sender.split("<")[0].trim()}
          </div>
          <div className={style.o}>
            {message.snippet.length > 10
              ? `${message.snippet.substring(0, 50)}...`
              : message.snippet}
          </div>
          <div className={style.o}>{message.time}</div>
        </div>
      ))}
    </div>
  );
}
