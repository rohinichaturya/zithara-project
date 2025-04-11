import { Link } from "react-router-dom";
import { 
  FaUser, 
  FaBox, 
  FaShoppingCart, 
  FaStore, 
  FaSignOutAlt, 
  FaChartLine,
  FaBars,
  FaTimes
} from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  const handleLinkClick = (path) => {
    setActiveLink(path);
    setIsOpen(false);
  };

   const handleSignOut = () => {
      dispatch(logout());
      navigate("/");
    };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 md:hidden top-4 left-4 p-2 rounded-md bg-indigo-600 text-white"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 transition-transform duration-300 ease-in-out z-40 w-64 bg-gradient-to-b from-indigo-900 to-indigo-800 
        text-white flex flex-col min-h-screen max-h-screen overflow-hidden shadow-xl`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-indigo-700 flex-shrink-0">
          <h1
            className="text-2xl font-bold flex items-center"
            onClick={() => handleLinkClick("/")}
          >
            <span className="bg-white text-indigo-800 rounded-lg p-1 mr-2">
              <FaStore />
            </span>
            <span>JewelleryAdmin</span>
          </h1>
        </div>

        {/* Navigation - Scrollable area */}
        <nav className="flex-1 overflow-y-auto py-2 px-4">
          <div className="space-y-2">
            <NavItem 
              to="/admin" 
              icon={<FaChartLine />} 
              label="Dashboard" 
              isActive={activeLink === "/admin"}
              onClick={() => handleLinkClick("/admin")}
            />
            <NavItem 
              to="/admin/users" 
              icon={<FaUser />} 
              label="User Management" 
              isActive={activeLink === "/admin/users"}
              onClick={() => handleLinkClick("/admin/users")}
            />
            <NavItem 
              to="/admin/products" 
              icon={<FaBox />} 
              label="Product Catalog" 
              isActive={activeLink === "/admin/products"}
              onClick={() => handleLinkClick("/admin/products")}
            />
            <NavItem 
              to="/admin/orders" 
              icon={<FaShoppingCart />} 
              label="Order Tracking" 
              isActive={activeLink === "/admin/orders"}
              onClick={() => handleLinkClick("/admin/orders")}
            />
            <NavItem 
              to="/" 
              icon={<FaStore />} 
              label="Visit Store" 
              isActive={activeLink === "/"}
              onClick={() => handleLinkClick("/")}
            />
          </div>
        </nav>

        {/* Logout Button - Fixed at bottom */}
        <div className="p-4 border-t border-indigo-700 flex-shrink-0">
          <button 
            className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 
            text-white py-2 px-4 rounded-lg transition-colors duration-200"
            onClick={handleSignOut}
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

// NavItem Component
const NavItem = ({ to, icon, label, isActive, onClick }) => (
  <Link 
    to={to} 
    onClick={onClick}
    className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors duration-200
    ${isActive ? 'bg-indigo-600 text-white shadow-md' : 'text-indigo-100 hover:bg-indigo-700 hover:text-white'}`}
  >
    <span className={`${isActive ? 'text-white' : 'text-indigo-300'}`}>{icon}</span>
    <span className="font-medium">{label}</span>
  </Link>
);

export default AdminSidebar;