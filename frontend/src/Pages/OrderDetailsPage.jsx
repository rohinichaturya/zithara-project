import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Topbar from "../Components/Layout/Topbar";
import Navbar from "../Components/Layout/Navbar";
import Footer from "../Components/Common/Footer";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import { useNavigate } from 'react-router-dom';

const OrderDetailsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orderId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (!orderId) {
      navigate('/profile'); // Redirect if no orderId
      return;
    }
    dispatch(fetchOrderDetails(orderId));
  }, [dispatch, orderId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Topbar />
        <Navbar />
        <div className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Topbar />
        <Navbar />
        <div className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="text-red-500 p-4 bg-red-50 rounded-lg">
              Error loading order details: {error}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen flex flex-col">
        <Topbar />
        <Navbar />
        <div className="flex-grow bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="text-center py-10">
              <p className="text-gray-600 mb-4">Order not found</p>
              <Link
                to="/profile"
                className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
              >
                Back to My Orders
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Calculate order total
  const orderTotal = orderDetails.orderItems.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-8 mt-28">
        <div className="container mx-auto px-4">
          {/* User Info Section */}
          {user && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">User Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                {user.phone && (
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Order Details Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Order Details</h1>
                <p className="text-gray-500">Order #{orderDetails._id.substring(0, 8)}</p>
              </div>
              <div className="mt-4 md:mt-0 text-right">
                <p className="text-gray-500">Order Date</p>
                <p className="font-medium">
                  {new Date(orderDetails.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Order Status */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Order Status</h3>
              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    orderDetails.status === "Delivered"
                      ? "bg-green-100 text-green-800"
                      : orderDetails.status === "Cancelled"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {orderDetails.status}
                </span>
              </div>
            </div>

            {/* Payment and Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Payment Information</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Method:</span> {orderDetails.paymentMethod}</p>
                  <p>
                    <span className="text-gray-600">Status:</span>
                    <span className={`ml-1 ${
                      orderDetails.isPaid
                        ? "text-green-600 font-medium"
                        : "text-yellow-600 font-medium"
                    }`}>
                      {orderDetails.isPaid ? "Paid" : "Pending"}
                    </span>
                  </p>
                  {orderDetails.paidAt && (
                    <p><span className="text-gray-600">Paid On:</span> {new Date(orderDetails.paidAt).toLocaleDateString()}</p>
                  )}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-3">Shipping Information</h3>
                <div className="space-y-2">
                  <p><span className="text-gray-600">Method:</span> {orderDetails.shippingMethod || "Standard Shipping"}</p>
                  <p><span className="text-gray-600">Address:</span> {`
                    ${orderDetails.shippingAddress.address}, 
                    ${orderDetails.shippingAddress.city}, 
                    ${orderDetails.shippingAddress.postalCode}, 
                    ${orderDetails.shippingAddress.country}
                  `}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h3 className="font-semibold text-lg mb-4">Order Items</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orderDetails.orderItems.map((product) => (
                      <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {product.image && (
                              <img 
                                src={product.image} 
                                alt={product.name} 
                                className="w-10 h-10 rounded-md mr-4"
                              />
                            )}
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{product.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{product.quantity}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                          {(product.price * product.quantity).toFixed(2)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Order Summary */}
            <div className="flex justify-end">
              <div className="w-full md:w-1/3">
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-medium">{orderTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">
                    {orderDetails.shippingPrice?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Tax:</span>
                    <span className="font-medium">
                    {orderDetails.taxPrice?.toFixed(2) || "0.00"}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold mt-4 pt-2 border-t border-gray-200">
                    <span>Total:</span>
                    <span>₹ {orderDetails.totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="mt-8">
              <Link 
                to="/profile" 
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back to My Orders
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetailsPage;