import { motion } from "framer-motion";
import style from "./header.module.css";
import { IoReorderThree } from "react-icons/io5";
import Image from "next/image";
const GrainyAnimation = () => (
  <motion.div
    className="absolute inset-0 bg-cover bg-center opacity-10"
    style={{
      backgroundImage: "url('path/to/grainy-texture.png')",
    }}
    animate={{ scale: [1, 1.05, 1] }}
    transition={{ duration: 10, ease: "linear", loop: Infinity }}
  />
);

const Header = ({ settoggle, togglev }) => {
  function togglefunction(togglev) {
    // console.log("toggle value:", togglev);
    settoggle((p) => !p);
  }

  return (
    <header className={style.container}>
      {/* <div className="absolute inset-0 z-0">
      <GrainyAnimation />
    </div> */}
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
    </header>
  );
};

export default Header;
