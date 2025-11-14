import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TbError404 } from "react-icons/tb";

const PageNotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center ">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="mb-5"
      >
        <TbError404 className="text-emerald-600 text-[6rem] md:text-[8rem]" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-5xl font-bold text-gray-800"
      >
        Page Not Found
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-gray-500 mt-4 text-sm md:text-base max-w-md"
      >
        The page you're looking for might have been removed, renamed, or is
        temporarily unavailable. But don't worry — let's get you back on track!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-wrap items-center justify-center gap-4 mt-8"
      >
        <Link
          to="/"
          className="bg-emerald-600 hover:bg-emerald-700 px-7 py-2.5 text-white rounded-md font-medium shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          Return Home
        </Link>
        <Link
          to="/contact"
          className="border border-gray-300 px-7 py-2.5 text-gray-700 rounded-md font-medium hover:border-emerald-500 hover:text-emerald-600 active:scale-95 transition-all"
        >
          Contact Support
        </Link>
      </motion.div>

      <div className="h-1 w-16 rounded bg-emerald-600 my-8 opacity-70"></div>
    </div>
  );
};

export default PageNotFound;
