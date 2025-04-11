import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaCamera, FaShoppingBag, FaSearch } from "react-icons/fa";
import { useCart } from "../Cart/CartContext";
import CartDrawer from "./CartDrawer";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import axios from "axios";
import { toast } from "sonner";

const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const totalItems = user ? cart.reduce((total, item) => total + item.quantity, 0) : 0;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/collection/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleUserClick = () => {
    user ? navigate("/profile") : navigate("/login");
  };

  const handleSignOut = () => {
    dispatch(logout());
    navigate("/");
  };

  // Handle Image Upload for Searching Products
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setSelectedFile(file);

    const formData = new FormData();
    formData.append("image", file);

    try {
        const response = await axios.post("http://localhost:9000/api/products/search-by-image", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data.success) {
            toast.success("Product found!");
            navigate(`/product/${response.data.product._id}`);
        } else {
            toast.error(response.data.message || "No matching product found.");
        }
    } catch (error) {
        console.error("Error searching by image:", error);
        toast.error("Error searching product.");
    }
};
  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white text-gray-900 py-4 px-6 mt-10 z-50">
        <div className="container mx-auto flex items-center justify-between max-w-[1200px]">
          <Link to="/" className="text-3xl font-bold text-[#d4af37] tracking-wide">
            Tej Jewelleries
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative hidden md:flex flex-grow max-w-lg mx-8 bg-gray-100 rounded-full px-3 py-2 border border-gray-300 items-center"
          >
            <FaSearch className="text-gray-500" size={18} />
            <input
              type="text"
              placeholder="Search for rings, earrings, diamonds..."
              className="outline-none text-gray-900 text-sm px-2 w-full bg-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Icons */}
          <div className="flex items-center space-x-5 relative">
            {user?.role === "admin" && (
              <Link to="/admin">
                <h1 className="p-1 px-2 bg-black rounded-md text-white font-semibold">Admin</h1>
              </Link>
            )}

            {/* User Icon */}
            <FaUser className="hover:text-[#d4af37] cursor-pointer transition duration-300" size={22} onClick={handleUserClick} />

            {/* Camera Icon for Image Upload */}
            <label className="cursor-pointer">
                    <FaCamera size={22} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>

            {/* Shopping Cart */}
            <div className="relative" onClick={() => setIsCartOpen(true)}>
              <FaShoppingBag className="hover:text-[#d4af37] cursor-pointer transition duration-300" size={22} />
              {user && totalItems > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </div>

            {/* Sign Out Button */}
            {user && (
              <button onClick={handleSignOut} className="bg-red-500 text-white px-3 py-1 rounded-md font-semibold hover:bg-red-600 transition duration-300">
                Sign Out
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Navbar;
