import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  fetchAllOrders, 
  updateOrderStatus,
  deleteOrder 
} from "../../redux/slices/adminOrderSlice";

const OrderManagement = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await dispatch(updateOrderStatus({ id, status: newStatus })).unwrap();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const handleDeleteOrder = async (id) => {
    if (window.confirm("Are you sure you want to delete this order?")) {
      try {
        await dispatch(deleteOrder(id)).unwrap();
      } catch (err) {
        console.error("Error deleting order:", err);
      }
    }
  };

  if (loading) {
    return (
      <div className="w-full px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-4 max-w-full overflow-hidden">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-bold text-gray-800">Order Management</h1>
          </div>
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden max-w-full">
        <div className="px-4 py-3 border-b border-gray-100 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-xl font-bold text-gray-800 mb-2 sm:mb-0">Order Management</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => dispatch(fetchAllOrders())}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-md hover:bg-indigo-100 transition-colors text-sm"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-4 mt-3 p-3 bg-red-50 text-red-700 rounded-md border border-red-100 flex justify-between items-center sm:mx-6">
            <span className="text-sm">{error}</span>
            <button 
              onClick={() => dispatch(fetchAllOrders())}
              className="ml-3 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
            >
              Retry
            </button>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="p-8 text-center">
            <svg
              className="mx-auto h-10 w-10 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h3 className="mt-2 text-base font-medium text-gray-900">No orders</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new order.</p>
            <div className="mt-4">
              <button
                onClick={() => dispatch(fetchAllOrders())}
                className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Refresh Orders
              </button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="align-middle inline-block min-w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4 sm:py-3">
                      Order
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4 sm:py-3 hidden sm:table-cell">
                      Customer
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4 sm:py-3 hidden md:table-cell">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4 sm:py-3">
                      Total
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4 sm:py-3 hidden sm:table-cell">
                      Date
                    </th>
                    <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4 sm:py-3">
                      Status
                    </th>
                    <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider sm:px-4 sm:py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900 sm:px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                          {order._id.substring(0, 6)}..
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 sm:px-4 hidden sm:table-cell">
                        <div className="truncate max-w-[120px]">{order.user?.name || "Guest"}</div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 sm:px-4 hidden md:table-cell">
                        <div className="truncate max-w-[120px]">{order.user?.email || "N/A"}</div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 font-medium sm:px-4">
                        ₹{order.totalPrice.toFixed(2)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500 sm:px-4 hidden sm:table-cell">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap sm:px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                          className={`block w-full pl-2 pr-8 py-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${
                            order.status === 'Processing' ? 'border-yellow-300 bg-yellow-50 text-yellow-700' :
                            order.status === 'Shipped' ? 'border-blue-300 bg-blue-50 text-blue-700' :
                            order.status === 'Delivered' ? 'border-green-300 bg-green-50 text-green-700' :
                            'border-red-300 bg-red-50 text-red-700'
                          }`}
                        >
                          <option value="Processing" className="bg-white">Processing</option>
                          <option value="Shipped" className="bg-white">Shipped</option>
                          <option value="Delivered" className="bg-white">Delivered</option>
                          <option value="Cancelled" className="bg-white">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium space-x-1 sm:px-4 sm:space-x-2">
                        <button
                          onClick={() => handleStatusUpdate(order._id, "Delivered")}
                          disabled={order.status === "Delivered" || order.status === "Cancelled"}
                          className={`inline-flex items-center px-2 py-1 border rounded shadow-sm text-xs font-medium focus:outline-none sm:px-3 sm:py-1 sm:text-sm ${
                            order.status === "Delivered" || order.status === "Cancelled"
                              ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                              : "bg-green-50 border-green-300 text-green-700 hover:bg-green-100"
                          }`}
                        >
                          <span className="hidden sm:inline">Deliver</span>
                          <span className="sm:hidden">✓</span>
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="inline-flex items-center px-2 py-1 border border-transparent rounded shadow-sm text-xs font-medium text-white bg-red-600 hover:bg-red-700 sm:px-3 sm:py-1 sm:text-sm"
                        >
                          <span className="hidden sm:inline">Delete</span>
                          <span className="sm:hidden">×</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;