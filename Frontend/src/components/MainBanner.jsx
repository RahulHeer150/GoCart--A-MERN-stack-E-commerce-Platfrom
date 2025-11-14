import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { motion } from "framer-motion";

const MainBanner = () => {
  return (
    <div className="relative w-full overflow-hidden">
      <img
        src={assets.main_banner_bg}
        alt="FreshCart Banner"
        className="hidden md:block w-full h-[80vh] object-cover brightness-[0.85]"
      />
      <img
        src={assets.main_banner_bg_sm}
        alt="FreshCart Banner Mobile"
        className="md:hidden w-full object-cover brightness-[0.85]"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/70 via-emerald-900/20 to-transparent md:from-emerald-950/60"></div>

      <div className="absolute inset-0 flex flex-col justify-center md:pl-24 lg:pl-32 px-6 md:px-0 items-center md:items-start text-center md:text-left z-10">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-white font-extrabold text-3xl md:text-5xl lg:text-6xl max-w-[680px] leading-tight drop-shadow-lg"
        >
          Freshness You Can Trust, <br className="hidden md:block" />
          Savings You'll Love!
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-gray-100 mt-4 text-base md:text-lg max-w-[520px] leading-relaxed"
        >
          Shop fresh fruits, vegetables, and essentials from trusted local
          stores — delivered straight to your doorstep with love and care.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="flex flex-col md:flex-row gap-4 mt-8"
        >
          <Link
            to="/products"
            className="group flex items-center justify-center gap-2 px-8 py-3 text-base font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-200"
          >
            Shop Now
            <FaArrowRightLong className="transition group-hover:translate-x-1" />
          </Link>

          <Link
            to="/products"
            className="group md:flex items-center justify-center gap-2 px-8 py-3 text-base font-semibold border border-white/80 text-white rounded-full hover:bg-white/10 transition-all duration-200 hidden "
          >
            Explore Deals
            <FaArrowRightLong className="transition group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      <motion.img
        src={assets.leaf_icon}
        alt="Leaf Accent"
        className="absolute bottom-10 right-10 w-14 opacity-80 hidden md:block"
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default MainBanner;
