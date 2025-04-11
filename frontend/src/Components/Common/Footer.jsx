import { FaFacebookF, FaInstagram, FaPinterest, FaPhone } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-800 py-10 border-t">
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          
          {/* Column 1 - Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Join Our Newsletter</h3>
            <p className="text-gray-600 text-sm">
              Be the first to discover our latest collections, exclusive offers, and timeless designs.
            </p>
            <p className="text-sm font-semibold mt-2">Sign up and get 10% off your first purchase.</p>
          </div>

          {/* Column 2 - Shop Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Shop</h3>
            <ul className="text-gray-600 space-y-2">
              <li><Link to= "/collections/necklaces" className="hover:text-black">Necklaces</Link></li>
              <li><Link to= "/collections/earrings" className="hover:text-black">Earrings</Link></li>
              <li><Link to= "/collections/rings" className="hover:text-black">Rings</Link></li>
              <li><Link to= "/collections/bracelets" className="hover:text-black">Bracelets</Link></li>
            </ul>
          </div>

          {/* Column 3 - Customer Support */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Customer Service</h3>
            <ul className="text-gray-600 space-y-2">
              <li><Link to ="/contactus" className="hover:text-black">Contact Us</Link></li>
              <li><Link to ="/faqs" className="hover:text-black">FAQs</Link></li>
              
            </ul>
          </div>

          {/* Column 4 - Follow Us */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
            <div className="flex space-x-4 text-gray-600">
              <a href="#" className="hover:text-black"><FaFacebookF size={18} /></a>
              <a href="#" className="hover:text-black"><FaInstagram size={18} /></a>
              <a href="#" className="hover:text-black"><FaPinterest size={18} /></a>
            </div>
            <p className="text-gray-600 mt-4 font-semibold">Need Assistance?</p>
            <p className="text-gray-600 flex items-center"><FaPhone className="mr-2" />72078 82334</p>
          </div>

        </div>

        {/* Bottom Copyright Line */}
        <div className="border-t mt-8 pt-6 text-center text-gray-500 text-sm">
          © 2025, LuxeJewels. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
