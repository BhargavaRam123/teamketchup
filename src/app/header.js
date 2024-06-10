import { motion } from "framer-motion";

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
  <header className="bg-slate-700 mx-3 mt-3 border-white rounded-xl p-4 flex justify-between items-center shadow relative overflow-hidden">
    <div className="absolute inset-0 z-0">
      <GrainyAnimation />
    </div>
    <h3 className="font-light text-white relative z-10">
      KetchUp <strong className="font-medium text-white">Mail.</strong>
    </h3>
    <div>{/* Add any header actions or user profile here */}</div>
  </header>
);

export default Header;
