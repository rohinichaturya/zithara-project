import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchUserOrders } from "../redux/slices/orderSlice";

const MyOrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "shipped":
        return "text-blue-500";
      case "processing":
        return "text-yellow-500";
      case "delivered":
        return "text-green-500";
      case "cancelled":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading) {
    return (
      <div className="bg-white shadow-lg p-6 rounded-lg">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-lg p-6 rounded-lg">
        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
          Error loading orders: {error}
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white shadow-lg p-6 rounded-lg">
        <div className="text-center py-10">
          <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
          <Link
            to="/products"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg p-6 rounded-lg">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Image</th>
              <th className="p-3 text-left">Items</th>
              <th className="p-3 text-left">Order ID</th>
              <th className="p-3 text-left">Ordered Date</th>
              <th className="p-3 text-left">Total Amount</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => {
              const firstItem = order.orderItems[0];
              return (
                <tr key={order._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    {firstItem.image && (
                      <img 
                        src={firstItem.image} 
                        alt={firstItem.name} 
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    )}
                  </td>
                  <td className="p-3">
                    <Link
                      to={`/order/${order._id}`}
                      className="text-black-500 hover:underline"
                    >
                      {order.orderItems.length > 1 ? (
                        <>
                          {firstItem.name} + {order.orderItems.length - 1} more
                        </>
                      ) : (
                        firstItem.name
                      )}
                    </Link>
                  </td>
                  <td className="p-3">{order._id.substring(0, 8)}...</td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">{order.totalPrice.toFixed(2)}</td>
                  <td className={`p-3 font-semibold ${getStatusColor(order.status)}`}>
                    {order.status}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrdersPage;