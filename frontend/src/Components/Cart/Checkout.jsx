import { useCart } from "../Cart/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createCheckout, finalizeCheckout } from "../../redux/slices/checkoutSlice";
import Footer from "../Common/Footer";
import Navbar from "../Layout/Navbar";
import Topbar from "../Layout/Topbar";

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.checkout);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    zipCode: "",
    country: "",
    paymentMethod: "Credit Card",
  });

  const [formError, setFormError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const subTotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = 0;
  const totalPrice = subTotal + shipping;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validate form
    for (const key in formData) {
      if (!formData[key]) {
        setFormError("All fields are required.");
        return;
      }
    }
    setFormError("");
  
    // Validate cart items have product IDs
    if (cart.some(item => !item.productId)) {
      setFormError("Some products in your cart are missing IDs. Please refresh and try again.");
      return;
    }
  
    // Create checkout data with proper product IDs
    const checkoutData = {
      products: cart.map(item => ({
        productId: item.productId, 
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      shippingAddress: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        zipCode: formData.zipCode,
        country: formData.country,
      },
      paymentMethod: formData.paymentMethod,
      totalAmount: totalPrice,
    };
  
    // Reset error before submission
    setFormError("");
  
    // Dispatch checkout creation
    const createResult = await dispatch(createCheckout(checkoutData));
  
    if (createResult.meta.requestStatus === "fulfilled") {
      const finalizeResult = await dispatch(finalizeCheckout(createResult.payload._id));
  
      if (finalizeResult.meta.requestStatus === "fulfilled") {
        clearCart?.();
        console.log("Navigating to order-confirmation...");
        navigate("/order-confirmation", {
          state: { 
            cart, 
            formData, 
            totalPrice,
            order: finalizeResult.payload
          },
        });
      } else {
        setFormError("Failed to finalize checkout. Please try again.");
      }
    } else {
      setFormError("Failed to create checkout. Please try again.");
    }
  };
  

  return (
    <div>
      <Topbar />
      <Navbar />
      <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-32 m-5">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Checkout</h2>
        {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Billing Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg w-full"
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg w-full"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg w-full md:col-span-2"
                required
              />
              <input
                type="text"
                name="address"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg w-full md:col-span-2"
                required
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg w-full"
                required
              />
              <input
                type="text"
                name="zipCode"
                placeholder="Zip Code"
                value={formData.zipCode}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg w-full"
                required
              />
              <input
                type="text"
                name="country"
                placeholder="Country"
                value={formData.country}
                onChange={handleChange}
                className="p-3 border border-gray-300 rounded-lg w-full md:col-span-2"
                required
              />
            </div>

            <h3 className="text-xl font-semibold mt-6 text-gray-700">Payment Method</h3>
            <div className="flex flex-col gap-3 mt-3">
              {["Credit Card", "PayPal", "Cash on Delivery"].map((method) => (
                <label key={method} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={method}
                    checked={formData.paymentMethod === method}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span className="text-gray-600">{method}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-3 rounded-lg text-lg font-semibold mt-6 hover:bg-blue-600 transition"
              disabled={loading}
            >
              {loading ? "Processing..." : "Place Order"}
            </button>
          </form>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Order Summary</h3>
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.productId} className="flex items-center border-b pb-2">
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-16 h-16 object-cover rounded-md mr-4" 
                  />
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">{item.name}</h4>
                    <p className="text-gray-600">₹{item.price} x {item.quantity}</p>
                  </div>
                  <p className="text-lg font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-lg">
                <span>Subtotal:</span>
                <span>₹{subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg text-green-600">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between mt-4 text-lg font-bold border-t pt-2">
                <span>Total Amount:</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;