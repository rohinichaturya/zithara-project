import { FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Topbar = () => {
  return (
    <div className="fixed top-0 left-0 w-full bg-gray-900 text-white py-2 px-4 flex items-center justify-between text-sm md:text-base z-50">
      {/* Desktop View - Left Social Media Links */}
      <div className="hidden md:flex items-center space-x-4">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebookF className="hover:text-yellow-500 transition duration-300 cursor-pointer" />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="hover:text-yellow-500 transition duration-300 cursor-pointer" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
          <FaTwitter className="hover:text-yellow-500 transition duration-300 cursor-pointer" />
        </a>
      </div>

      {/* Center - Jewelry Tagline (Visible on all screens) */}
      <div className="text-center font-semibold tracking-wide w-full md:w-auto">
        ✨ Elegance in Every Sparkle ✨
      </div>

      {/* Desktop View - Right Contact Number */}
      <div className="hidden md:block font-medium">
        📞 +91 72078 82334
      </div>
    </div>
  );
};

export default Topbar;
