import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] z-50">
      {/* Spinner */}
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="relative w-14 h-14"
      >
        <div className="absolute inset-0 rounded-full border-[3px] border-gray-300"></div>
        <div className="absolute inset-0 rounded-full border-[3px] border-t-emerald-600"></div>
      </motion.div>
    </div>
  );
};

export default Loading;
