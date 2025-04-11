import { FaTimes } from "react-icons/fa";
import CardContents from "../Cart/CardContents";
import { useCart } from "../Cart/CartContext";
import { Link } from "react-router-dom";

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart } = useCart();

  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div
      className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out z-50 flex flex-col`}
    >
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Cart</h2>
        <FaTimes
          size={20}
          className="cursor-pointer text-gray-700 hover:text-red-500 transition"
          onClick={onClose}
        />
      </div>

      <div className="flex-grow p-4 overflow-y-auto">
        {cart.length > 0 ? (
          <CardContents />
        ) : (
          <p className="text-center text-gray-500 mt-10">Your cart is empty</p>
        )}
      </div>

      {cart.length > 0 && (
        <div className="p-4 border-t">
          <div className="flex justify-between text-lg font-semibold mb-3">
            <span>Total:</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
          <Link to="/checkout" state={{ products: cart }}>
            <button className="w-full bg-black text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-800 transition">
              Checkout
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CartDrawer;