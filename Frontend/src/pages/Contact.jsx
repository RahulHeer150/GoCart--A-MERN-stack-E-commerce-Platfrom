import { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineEmail } from "react-icons/md";
import { PiBuildingOffice } from "react-icons/pi";
import { FiPhone } from "react-icons/fi";
import { motion } from "framer-motion";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const onSubmitHandler = (e) => {
    e.preventDefault();
    console.log(name, email, message);
    setName("");
    setEmail("");
    setMessage("");
    alert("Thank you for reaching out! We'll get back to you soon.");
  };

  return (
    <div className="mt-20">
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="text-emerald-600 font-semibold uppercase tracking-wide">
          Contact Us
        </p>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-2">
          Get in Touch with Us
        </h1>
        <p className="text-gray-500 mt-3 text-sm md:text-base max-w-2xl mx-auto">
          We're here to help with any questions, feedback, or concerns you have.
          Fill out the form below and our team will respond as soon as possible.
        </p>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        onSubmit={onSubmitHandler}
        className="mt-12 bg-white shadow-lg border border-gray-100 rounded-2xl px-6 py-10 md:px-10 w-[90%] max-w-3xl mx-auto"
      >
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full">
            <label className="text-gray-700 font-medium text-sm" htmlFor="name">
              Your Name
            </label>
            <input
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 p-3 mt-2 w-full border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
              type="text"
              required
            />
          </div>
          <div className="w-full">
            <label
              className="text-gray-700 font-medium text-sm"
              htmlFor="email"
            >
              Your Email
            </label>
            <input
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 p-3 mt-2 w-full border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition"
              type="email"
              required
            />
          </div>
        </div>

        <div className="mt-6">
          <label
            className="text-gray-700 font-medium text-sm"
            htmlFor="message"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full mt-2 p-3 h-40 border border-gray-300 rounded-lg focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none resize-none transition"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="mt-8 bg-gradient-to-r from-emerald-600 to-emerald-500 text-white h-12 px-6 rounded-full font-medium hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg transition-all w-full sm:w-auto mx-auto block"
        >
          Send Message
        </button>
      </motion.form>

      <motion.section
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="mt-24 px-6 md:px-16 lg:px-28 text-gray-800"
      >
        <div className="text-center mb-12">
          <span className="px-3 py-1 text-xs border border-emerald-300 text-emerald-700 rounded-full uppercase tracking-wide">
            Reach Out To Us
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mt-4 text-gray-800">
            We'd Love to Hear from You
          </h2>
          <p className="text-gray-500 mt-3 text-sm md:text-base">
            Or contact us directly at{" "}
            <Link to="/" className="text-emerald-600 hover:underline over ">
              customerservice@freshcart.com
            </Link>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-6 max-w-6xl mx-auto text-center md:text-left">
          <div className="p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition">
            <div className="flex items-center justify-center md:justify-start">
              <MdOutlineEmail className="text-emerald-600 bg-emerald-100 p-2.5 rounded-full text-4xl" />
            </div>
            <h3 className="text-lg font-semibold mt-4">Email Support</h3>
            <p className="text-gray-500 text-sm mt-1 mb-3">
              Our support team replies within 24 hours.
            </p>
            <Link
              to="/"
              className="text-emerald-600 font-medium hover:underline text-sm tracking-tighter"
            >
              customerservice@freshcart.com
            </Link>
          </div>

          {/* Office */}
          <div className="p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition">
            <div className="flex items-center justify-center md:justify-start">
              <PiBuildingOffice className="text-emerald-600 bg-emerald-100 p-2.5 rounded-full text-4xl" />
            </div>
            <h3 className="text-lg font-semibold mt-4">Visit Our Office</h3>
            <p className="text-gray-500 text-sm mt-1 mb-3">
              Come meet us at our corporate HQ.
            </p>
            <p className="text-emerald-700 font-medium text-sm">
              22nd Main Rd, Agara Village, <br />
              Bengaluru, Karnataka 560102, India
            </p>
          </div>

          {/* Phone */}
          <div className="p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition">
            <div className="flex items-center justify-center md:justify-start">
              <FiPhone className="text-emerald-600 bg-emerald-100 p-2.5 rounded-full text-4xl" />
            </div>
            <h3 className="text-lg font-semibold mt-4">Call Us Directly</h3>
            <p className="text-gray-500 text-sm mt-1 mb-3">
              Available Mon–Sat, 9 AM – 6 PM.
            </p>
            <p className="text-emerald-700 font-medium text-sm">
              (+91) 987-3456-210
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Contact;
