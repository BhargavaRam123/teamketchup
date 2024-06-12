import { motion } from "framer-motion";
import style from "./header.module.css";
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

const Header = () => (
  <header className={style.container}>
    {/* <div className="absolute inset-0 z-0">
      <GrainyAnimation />
    </div> */}
    <div className={style.lcon}>
      <Image src="/logo.png" width={35} height={35}></Image>
    </div>
  </header>
);

export default Header;
