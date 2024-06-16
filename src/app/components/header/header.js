"use client";
import { motion } from "framer-motion";
import style from "./header.module.css";
import { IoReorderThree } from "react-icons/io5";
import { IoIosLogOut } from "react-icons/io";
import { logout } from "@/app/redux/slices/userslice";
import { useDispatch } from "react-redux";
import { ExitIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { useRouter } from "next/navigation";
const Headerelement = ({ settoggle, togglev }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  function togglefunction(togglev) {
    // console.log("toggle value:", togglev);
    settoggle((p) => !p);
  }
  function logoutfunction() {
    dispatch(logout());
    router.push("/login");
  }
  return (
    <div className={style.container}>
      <div className={style.lcon}>
        <Image
          src="/logo.png"
          width={35}
          height={35}
          className={style.pc}
        ></Image>
        <div onClick={() => togglefunction(togglev)}>
          <IoReorderThree className={style.mobile} />
        </div>
      </div>
      <div>
        <ExitIcon
          onClick={logoutfunction}
          style={{ width: "35px", height: "35px" }}
          className={style.logout}
        />
      </div>
    </div>
  );
};

export default Headerelement;
