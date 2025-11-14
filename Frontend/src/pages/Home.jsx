import MainBanner from "../components/MainBanner";
import Categories from "../components/Categories";
import BestSeller from "../components/BestSeller";
import BottomBanner from "../components/BottomBanner";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="mt-15 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <MainBanner />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="mt-10 md:mt-14"
      >
        <Categories />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
        viewport={{ once: true }}
        className="mt-12 md:mt-14"
      >
        <BestSeller />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="mt-14"
      >
        <BottomBanner />
      </motion.div>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100 py-16 md:py-20 mt-20 text-center rounded-xl mx-6 md:mx-16 lg:mx-24 xl:mx-32"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">
          Freshness Delivered Daily
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto mb-8">
          Order your favorite groceries, snacks, and essentials with just a few
          clicks. Experience convenience and freshness like never before.
        </p>
        <Link
          to="/products"
          className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-full transition-all shadow-md hover:shadow-lg"
        >
          Shop Now
        </Link>
      </motion.section>
    </div>
  );
};

export default Home;
