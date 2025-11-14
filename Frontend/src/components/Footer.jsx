import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa6";
import { Link } from "react-router-dom";

const footerLinks = [
  {
    title: "Quick Links",
    links: [
      { text: "Home", url: "/" },
      { text: "Best Sellers", url: "/" },
      { text: "Offers & Deals", url: "/products" },
      { text: "Contact Us", url: "/contact" },
      { text: "Become a Seller", url: "/seller" },
    ],
  },
  {
    title: "Need Help?",
    links: [
      { text: "Delivery Information", url: "/" },
      { text: "Return & Refund Policy", url: "/" },
      { text: "Payment Methods", url: "/cart" },
      { text: "Track your Order", url: "/orders" },
      { text: "Contact Us", url: "/contact" },
    ],
  },
];

const socialLinks = [
  { icon: <FaInstagram />, url: "/", name: "Instagram" },
  { icon: <FaTwitter />, url: "/", name: "Twitter" },
  { icon: <FaFacebook />, url: "/", name: "Facebook" },
  { icon: <FaYoutube />, url: "/", name: "YouTube" },
];

const Footer = () => {
  return (
    <footer className="mt-24 bg-gradient from-emerald-50 via-white to-emerald-100 border-t border-gray-200">
      <div className="px-6 md:px-16 lg:px-24 xl:px-32 py-12">
        <div className="flex flex-col md:flex-row justify-between gap-12 border-b border-gray-300/40 pb-10">
          <div className="max-w-md">
            <div className="flex items-center gap-2">
              <img className="h-8 md:h-10" src="/images/image.png" alt="logo" />
              <h1 className="text-2xl font-extrabold text-emerald-700">
                Fresh<span className="text-gray-900">Cart</span>
              </h1>
            </div>
            <p className="mt-4 text-gray-600 leading-relaxed">
              FreshCart brings farm-fresh groceries and daily essentials
              straight to your doorstep. Enjoy convenience, savings, and trust
              in every order — your neighborhood store, online.
            </p>
            <div className="flex gap-3 mt-6">
              {socialLinks.map((s, i) => (
                <Link
                  key={i}
                  to={s.url}
                  onClick={() => scrollTo(0, 0)}
                  className="w-10 h-10 flex items-center justify-center bg-white rounded-full border border-gray-200 text-emerald-600 text-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm hover:shadow-md"
                >
                  {s.icon}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap justify-between w-full md:w-[50%] gap-10 text-gray-700">
            {footerLinks.map((section, index) => (
              <div key={index} className="min-w-[140px]">
                <h3 className="font-semibold text-lg text-gray-900 mb-4 relative">
                  {section.title}
                  <span className="absolute left-0 bottom-0 w-8 h-2 bg-emerald-600 rounded-full"></span>
                </h3>
                <ul className="text-sm space-y-2">
                  {section.links.map((link, i) => (
                    <li key={i}>
                      <Link
                        to={link.url}
                        onClick={() => scrollTo(0, 0)}
                        aria-label={link.text}
                        className="hover:text-emerald-600 transition-colors"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-6 text-center text-sm text-gray-500">
          <p>
            © {new Date().getFullYear()}{" "}
            <Link
              to="/"
              className="text-emerald-600 hover:underline font-medium"
            >
              FreshCart
            </Link>
            . All Rights Reserved.
          </p>
          <p className="mt-1 text-gray-400 text-xs">
            Designed with ❤️ for a cleaner, greener shopping experience.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
