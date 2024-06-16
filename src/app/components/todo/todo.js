"use client";
import { useSelector } from "react-redux";
import styles from "./todo.module.css";
import { apiconnector } from "@/app/services/apiconnector";
import { useEffect, useState } from "react";
import { CheckIcon } from "@radix-ui/react-icons";
export default function Todo() {
  const { email } = useSelector((state) => state.User);
  const [arr, setarr] = useState([]);

  async function gettodos() {
    const response = await apiconnector(
      "POST",
      "http://localhost:3001/api/gettodo",
      { email }
    );
    console.log("response", response);
    setarr(response.data.todos.todos);
  }
  async function handledone(_id) {
    console.log("hey", _id);
    const response = await apiconnector(
      "POST",
      "http://localhost:3001/api/delete",
      { _id }
    );
    console.log("response", response);
    gettodos();
    // setarr(response.data.todos.todos);
  }

  useEffect(() => {
    gettodos();
  }, []);

  return (
    <div>
      {arr.map((message, index) => (
        <div key={index} className={styles.each}>
          <div className={styles.heading}>
            <a href={`/${message.messageid}`}>{message.messageid}</a>
          </div>
          <div className={styles.o}>{message.name}</div>
          <div className={styles.o}>{message.description}</div>
          <div onClick={() => handledone(message._id)}>
            <CheckIcon />
          </div>
        </div>
      ))}
    </div>
  );
}
