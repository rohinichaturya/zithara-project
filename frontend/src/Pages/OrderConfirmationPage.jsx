import { useLocation, useNavigate } from "react-router-dom";
import Topbar from "../Components/Layout/Topbar";
import Navbar from "../Components/Layout/Navbar";
import Footer from "../Components/Common/Footer";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (!location.state) {
    return <p className="text-center text-lg text-red-500">No order found.</p>;
  }

  const { cart, formData, totalPrice } = location.state;

  return (
    <div>
      <Topbar />
      <Navbar />
      <div className="max-w-4xl mx-auto mt-32 p-6 bg-white shadow-lg rounded-lg mb-10">
        <h2 className="text-3xl font-bold text-center text-green-600">
          Thank You for Your Order!
        </h2>

        {/* Order Details */}
        <div className="mt-6 border p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Order Details</h3>
          {cart.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 border-b">
              <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
              <span className="flex-1 ml-4">{item.name} ({item.quantity}x)</span>
              <span className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between mt-2 text-lg font-bold">
            <span>Total Amount:</span>
            <span>₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="mt-6 border p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Delivery Address</h3>
          <p>{formData.firstName} {formData.lastName}</p>
          <p>{formData.address}, {formData.city} - {formData.zipCode}</p>
        </div>

        {/* Payment Method */}
        <div className="mt-6 border p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold">Payment Method</h3>
          <p className="text-lg font-medium text-gray-700">{formData.paymentMethod}</p>
        </div>

        <button 
          onClick={() => navigate("/")} 
          className="w-full mt-6 bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600">
          Back to Home
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default OrderConfirmationPage;
